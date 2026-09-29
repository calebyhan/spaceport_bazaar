import { afterEach, expect, test } from 'vitest';
import WebSocket from 'ws';
import { decode, encode, type ServerMessage } from '../codec';
import { Engine } from '../engine';
import type { Bundle } from '../types';
import { startSimServer, SUBPROTOCOL, type SimServer } from '../sim/server';
import { classroomRules, World } from '../sim/world';
import { createSimulation } from '../sim/setup';
import { defaultEconomy } from '../sim/economy';

const b = (water: number, food: number, components: number): Bundle => ({ water: BigInt(water), food: BigInt(food), components: BigInt(components) });
const tokens = { 'token-1': 'P01', 'token-2': 'P02' };
let server: SimServer | undefined;
afterEach(async () => { await server?.close(); server = undefined; });

function world(duration = 3n) {
  return new World({ runId: 'run', rules: classroomRules({ duration_ticks: duration, max_request_records_per_station: 4n }), stations: ['P01', 'P02'].map((id, i) => ({
    id, specialty: i + 1, inventory: b(10, 10, 10), upkeep: b(1, 1, 1), production: [] })) });
}

// A raw protocol client: every inbound frame is decoded and queued in order.
async function connect(url: string, token: string) {
  const socket = new WebSocket(url, SUBPROTOCOL, { headers: { Authorization: `Bearer ${token}` } });
  const inbox: ServerMessage[] = [], waiting: ((m: ServerMessage) => void)[] = [];
  socket.on('message', data => { const m = decode(data as Buffer); const w = waiting.shift(); if (w) w(m); else inbox.push(m); });
  const closed = new Promise<void>(resolve => socket.once('close', () => resolve()));
  await new Promise(resolve => socket.once('open', resolve));
  const next = () => inbox.length ? Promise.resolve(inbox.shift()!) : new Promise<ServerMessage>(resolve => waiting.push(resolve));
  const send = (message: unknown) => socket.send(encode(message));
  const header = (run = 'run') => ({ type: 1, protocol_version: '2.0', run_id: run });
  const command = (kind: string, request_id: string, body: unknown) => send({ [kind]: { ...header(), request_id, body } });
  return { socket, next, send, header, command, closed, inbox };
}
async function refused(url: string, headers: Record<string, string>, protocols: string[]) {
  const socket = new WebSocket(url, protocols, { headers });
  return new Promise<number>(resolve => { socket.on('unexpected-response', (_req, res) => resolve(res.statusCode!)); socket.on('error', () => {}); });
}

test('handshake: bad or missing credentials are HTTP 401, a missing subprotocol is HTTP 400', async () => {
  server = await startSimServer({ world: world(), tokens, tickMs: 20 });
  expect(await refused(server.url, { Authorization: 'Bearer wrong' }, [SUBPROTOCOL])).toBe(401);
  expect(await refused(server.url, {}, [SUBPROTOCOL])).toBe(401);
  expect(await refused(server.url, { Authorization: 'Basic token-1' }, [SUBPROTOCOL])).toBe(401);
  expect(await refused(server.url, { Authorization: 'Bearer token-1' }, [])).toBe(400);
  expect(await refused(server.url, { Authorization: 'Bearer token-1' }, ['other'])).toBe(400);
  const ok = await connect(server.url, 'token-1');
  expect(ok.socket.protocol).toBe(SUBPROTOCOL);
});

test('protocol flow: snapshot, message checks, readiness, auto-start, exchange, retries and capacity', async () => {
  const w = world();
  server = await startSimServer({ world: w, tokens, tickMs: 60000, autoStart: true });
  const p1 = await connect(server.url, 'token-1');
  expect((await p1.next()).state).toMatchObject({ snapshot_sequence: 1n, phase: 1, self_station_id: 'P01', world_version: 1n });

  // Malformed input is BAD_MESSAGE and keeps the session.
  p1.socket.send('text');
  expect((await p1.next()).protocol_error).toMatchObject({ code: 1, close_session: false, request_id: { null: true } });
  p1.socket.send(Buffer.from([0xff, 0xff]));
  expect((await p1.next()).protocol_error?.code).toBe(1);
  p1.send({});
  expect((await p1.next()).protocol_error?.code).toBe(1);
  p1.command('advertise', 'early', { selling: { items: [1] }, seeking: { items: [] }, expires_tick: 2 });
  expect((await p1.next()).protocol_error).toMatchObject({ code: 1, close_session: false, request_id: { value: 'early' } });

  p1.send({ sync: p1.header() });
  expect((await p1.next()).state?.snapshot_sequence).toBe(2n);
  p1.send({ ready: { ...p1.header(), ready: true, snapshot_sequence: 2 } });
  expect((await p1.next()).readiness).toMatchObject({ run_id: 'run', ready: true, snapshot_sequence: 2n });
  p1.command('advertise', 'bad id!', { selling: { items: [1] }, seeking: { items: [] }, expires_tick: 2 });
  expect((await p1.next()).protocol_error).toMatchObject({ code: 1, request_id: { value: 'bad id!' } });
  // Not every station is ready, so the run has not started.
  p1.command('offer', 'offer-early', { recipient_id: 'P02', give: b(1, 0, 0), receive: b(0, 1, 0), expires_tick: 2 });
  expect((await p1.next()).result).toMatchObject({ request_id: 'offer-early', code: 3 });
  expect((await p1.next()).state?.snapshot_sequence).toBe(3n);

  const p2 = await connect(server.url, 'token-2');
  await p2.next();
  p2.send({ ready: { ...p2.header(), ready: false, snapshot_sequence: 1 } });
  expect((await p2.next()).readiness?.ready).toBe(false);
  p2.send({ ready: { ...p2.header(), ready: true, snapshot_sequence: 1 } });
  await p2.next();
  expect((await p1.next()).state).toMatchObject({ phase: 2, tick: 0n });
  expect((await p2.next()).state?.phase).toBe(2);

  // An offer notifies both parties; acceptance settles for both.
  p1.command('offer', 'offer-1', { recipient_id: 'P02', give: b(2, 0, 0), receive: b(0, 1, 0), expires_tick: 2 });
  const posted = (await p1.next()).result!;
  expect(posted).toMatchObject({ ok: true, request_id: 'offer-1' });
  expect((await p1.next()).state?.offers.items).toHaveLength(1);
  const seen = (await p2.next()).state!;
  expect(seen.offers.items[0]).toMatchObject({ offer_id: posted.object_id.value, proposer_id: 'P01', status: 1 });
  p2.command('accept', 'accept-1', { offer_id: posted.object_id.value });
  expect((await p2.next()).result).toMatchObject({ ok: true, transaction_id: { value: 'tx-2' } });
  expect((await p2.next()).state?.self.inventory).toEqual(b(12, 9, 10));
  expect((await p1.next()).state?.self.inventory).toEqual(b(8, 11, 10));

  // An exact retry returns the stored result and a fresh state to the sender only.
  p1.command('offer', 'offer-1', { recipient_id: 'P02', give: b(2, 0, 0), receive: b(0, 1, 0), expires_tick: 2 });
  expect((await p1.next()).result).toEqual(posted);
  expect((await p1.next()).state?.world_version).toBe(w.worldVersion);

  // An advertisement is public, so every connected station gets a new state.
  p1.command('advertise', 'ad-1', { selling: { items: [1] }, seeking: { items: [2] }, expires_tick: 2 });
  expect((await p1.next()).result?.ok).toBe(true);
  expect((await p1.next()).state?.advertisements.items).toHaveLength(1);
  expect((await p2.next()).state?.advertisements.items).toHaveLength(1);

  // Records: offer-early, offer-1 and ad-1 so far; a fourth fits, a fifth is refused.
  p1.command('withdraw', 'withdraw-1', { object_id: 'missing' });
  expect((await p1.next()).result?.code).toBe(6);
  await p1.next();
  p1.command('withdraw', 'withdraw-2', { object_id: 'missing' });
  expect((await p1.next()).protocol_error).toMatchObject({ code: 2, close_session: false, request_id: { value: 'withdraw-2' } });
  p1.send({ sync: p1.header() });
  expect((await p1.next()).state?.request_results.items).toHaveLength(4);
});

test('wrong protocol version or run closes the session', async () => {
  server = await startSimServer({ world: world(), tokens, tickMs: 20 });
  const a = await connect(server.url, 'token-1');
  await a.next();
  a.send({ sync: { ...a.header(), protocol_version: '1.0' } });
  expect((await a.next()).protocol_error).toMatchObject({ code: 3, close_session: true });
  await a.closed;
  const c = await connect(server.url, 'token-1');
  await c.next();
  c.send({ sync: c.header('other-run') });
  expect((await c.next()).protocol_error).toMatchObject({ code: 4, close_session: true, run_id: { value: 'run' } });
  await c.closed;
});

test('a new connection fences the old one, which can no longer act for the station', async () => {
  server = await startSimServer({ world: world(), tokens, tickMs: 60000, host: '127.0.0.1', port: 0 });
  const old = await connect(server.url, 'token-1');
  await old.next();
  const replacement = await connect(server.url, 'token-1');
  expect((await replacement.next()).state?.snapshot_sequence).toBe(1n);
  expect((await old.next()).protocol_error).toMatchObject({ code: 6, close_session: true });
  await old.closed;
  replacement.send({ ready: { ...replacement.header(), ready: true, snapshot_sequence: 1 } });
  await replacement.next();
  server.start();
  expect((await replacement.next()).state).toMatchObject({ snapshot_sequence: 2n, phase: 2 });
  // P02 is not connected; it will see the offer in its first snapshot.
  replacement.command('offer', 'offer-1', { recipient_id: 'P02', give: b(1, 0, 0), receive: b(0, 1, 0), expires_tick: 2 });
  expect((await replacement.next()).result?.ok).toBe(true);
  expect((await replacement.next()).state?.snapshot_sequence).toBe(3n);
  expect(old.inbox).toEqual([]);
});

test('the tick clock advances every station to the finish; start is idempotent', async () => {
  const w = world(2n);
  server = await startSimServer({ world: w, tokens, tickMs: 20 });
  const p1 = await connect(server.url, 'token-1');
  await p1.next();
  server.start(); server.start();
  const ticks: bigint[] = [];
  for (let m = await p1.next(); ; m = await p1.next()) {
    ticks.push(m.state!.tick);
    if (m.state!.phase === 4) { expect(m.state!.outcome.value?.collective_success).toEqual({ value: true }); break; }
  }
  expect(ticks).toEqual([0n, 1n, 2n]);
  await server.finished;
  server.start();
  expect(w.tick).toBe(2n);
  p1.socket.close();
  await p1.closed;
});

test('our real client plays a whole balanced run against the simulator', async () => {
  const { world: w, players, tokens: simTokens } = createSimulation({ ...defaultEconomy, planets: 3, durationTicks: 12n, startingStock: 8n }, 40);
  server = await startSimServer({ world: w, tokens: simTokens, tickMs: 40, autoStart: true });
  const kinds: string[] = [], fatal: string[] = [];
  const engines = players.map(p => {
    const engine = new Engine({ strategyName: 'baseline', sink: { append: async entry => { kinds.push(entry.kind); } }, fatal: () => fatal.push(p.station_id) });
    const socket = new WebSocket(server!.url, SUBPROTOCOL, { headers: { Authorization: `Bearer ${p.token}` } });
    const epoch = engine.connect({ send: bytes => socket.send(bytes), close: () => socket.close() });
    socket.on('message', (data, binary) => engine.receive(epoch, data as Buffer, binary));
    return engine;
  });
  await server.finished;
  await new Promise(resolve => setTimeout(resolve, 100));
  await Promise.all(engines.map(e => e.idle()));
  const report = w.report();
  expect(fatal).toEqual([]);
  expect(kinds).not.toContain('protocol_error');
  expect(kinds).not.toContain('message-error');
  expect(report.transactions).toBeGreaterThan(0);
  // Each client's final view agrees with the server's authoritative ledger.
  engines.forEach((e, i) => {
    expect(e.state.snapshot?.phase).toBe(4);
    expect(e.state.snapshot?.self.inventory).toEqual(report.stations[i].final_inventory);
    e.stop();
  });
}, 20000);
