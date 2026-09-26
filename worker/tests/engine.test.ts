import { afterEach, test } from 'vitest';
import assert from 'node:assert/strict';
import { Engine } from '../engine';
import { encodeServer, decodeClient } from '../codec';
import type { RecordEntry } from '../persistence';
import { snapshot, offer, result } from './fixtures';
import type { Snapshot } from '../types';
const engines: Engine[] = [];
afterEach(() => { for (const engine of engines) engine.disconnected(engine.state.epoch); engines.length = 0; });
function harness(append?: (entry: RecordEntry) => Promise<void>) {
  const sent: ReturnType<typeof decodeClient>[] = [], records: RecordEntry[] = [];
  let fatal = false;
  const e = new Engine({ sink: { append: async entry => { records.push(entry); await append?.(entry); } }, fatal: () => { fatal = true; } });
  engines.push(e);
  const transport = { send: (bytes: Uint8Array) => sent.push(decodeClient(bytes)), close: () => {} };
  let epoch = e.connect(transport);
  const receive = (msg: unknown) => e.receive(epoch, encodeServer(msg));
  const ready = async (s: Snapshot) => {
    receive({ state: s });
    receive({ readiness: { type: 1, protocol_version: '2.0', run_id: s.run_id, ready: true, snapshot_sequence: s.snapshot_sequence } });
    await e.idle();
  };
  return { e, sent, records, receive, ready, fatal: () => fatal, reconnect: () => { e.disconnected(epoch); epoch = e.connect(transport); } };
}
const commands = (sent: ReturnType<typeof decodeClient>[]) => sent.filter(m => m.accept || m.offer || m.advertise || m.withdraw);
test('new state arriving during durable decision invalidates the old action', async () => {
  let release!: () => void, entered!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  const reached = new Promise<void>(resolve => { entered = resolve; });
  let paused = false;
  const h = harness(async entry => { if (entry.kind === 'decision' && !paused) { paused = true; entered(); await gate; } });
  const initial = snapshot(); initial.offers.items = [offer()];
  const running = h.ready(initial); await reached;
  h.receive({ state: snapshot({ snapshot_sequence: 2n, phase: 3 }) });
  release(); await running;
  assert.equal(commands(h.sent).length, 0);
  assert.equal(h.e.state.snapshot?.phase, 3);
});
test('new observation during command preparation cancels the unsent command', async () => {
  let h: ReturnType<typeof harness>;
  h = harness(async entry => { if (entry.kind === 'command') h.receive({ state: snapshot({ snapshot_sequence: 2n, phase: 3 }) }); });
  await h.ready(snapshot());
  assert.equal(commands(h.sent).length, 0);
  assert.ok(h.records.some(r => r.kind === 'cancelled'));
});
test('failed settlement keeps snapshot inventory, blocks repeat accept with cooldown', async () => {
  const h = harness(); const s = snapshot(); s.offers.items = [offer()]; await h.ready(s);
  const request = String(commands(h.sent)[0].accept.request_id);
  const rejection = result({ request_id: request, ok: false, code: 10 });
  h.receive({ result: rejection });
  assert.equal(h.e.state.pending.length, 1);
  const next = snapshot({ snapshot_sequence: 2n, world_version: 2n, offers: s.offers, request_results: { items: [rejection] } });
  h.receive({ state: next }); await h.e.idle();
  assert.deepEqual(h.e.state.snapshot?.self.inventory, s.self.inventory);
  assert.equal(commands(h.sent).filter(m => m.accept).length, 1);
});
test('rate limits honor retry_after_tick and request results consume records', async () => {
  const h = harness(); await h.ready(snapshot());
  const request = String(commands(h.sent)[0].advertise.request_id);
  const rejection = result({ request_id: request, ok: false, code: 4, retry_after_tick: { value: 4n } });
  h.receive({ result: rejection });
  h.receive({ state: snapshot({ snapshot_sequence: 2n, world_version: 2n, tick: 1n, request_results: { items: [rejection] } }) });
  await h.e.idle(); assert.equal(commands(h.sent).length, 1); assert.equal(h.e.state.blockedUntil, 4n);
});
test('ambiguous outcome survives reconnect; snapshot results reconcile original identity', async () => {
  const h = harness(); await h.ready(snapshot());
  const p = h.e.state.pending[0]; h.reconnect(); await h.ready(snapshot());
  assert.equal(commands(h.sent).length, 1); assert.equal(h.e.state.pending[0].requestId, p.requestId);
  const r = result({ request_id: p.requestId, ok: false, code: 9 });
  h.receive({ state: snapshot({ snapshot_sequence: 2n, world_version: 2n, request_results: { items: [r] }, phase: 3 }) });
  await h.e.idle(); assert.equal(h.e.state.pending.length, 0);
});
test('exact retries only recover recorded results and preserve request identity', async () => {
  const h = harness(); await h.ready(snapshot()); const p = h.e.state.pending[0];
  assert.equal(h.e.retryRecorded(p.requestId), false);
  h.receive({ result: result({ request_id: p.requestId }) });
  assert.equal(h.e.retryRecorded(p.requestId), true);
  assert.deepEqual(commands(h.sent)[0], commands(h.sent)[1]);
});
test('persistence failure prevents sending and leaves a fatal stop', async () => {
  const h = harness(async entry => { if (entry.kind === 'command') throw new Error('disk full'); });
  await assert.rejects(h.ready(snapshot()));
  assert.equal(commands(h.sent).length, 0); assert.equal(h.fatal(), true);
});
test('matching readiness and live phase are mandatory; fenced and text frames stop', async () => {
  const h = harness(); h.receive({ state: snapshot() }); await h.e.idle();
  assert.equal(commands(h.sent).length, 0);
  h.receive({ readiness: { protocol_version: '2.0', run_id: 'test-run', ready: true, snapshot_sequence: 99n } }); await h.e.idle();
  assert.equal(commands(h.sent).length, 0);
  h.receive({ protocol_error: { protocol_version: '2.0', run_id: { value: 'test-run' }, request_id: { null: true }, code: 6, close_session: true } });
  assert.equal(h.fatal(), true);
});
test('withdrawal losing a race never restores spent inventory', async () => {
  const h = harness(); const s = snapshot(); s.self.inventory.water = 3n;
  s.offers.items = [offer({ offer_id: 'out', proposer_id: 'ours', recipient_id: 'supplier-z', give: { water: 2n, food: 0n, components: 0n }, receive: { water: 0n, food: 1n, components: 0n } })];
  await h.ready(s); const command = commands(h.sent)[0].withdraw; assert.ok(command);
  const rejection = result({ request_id: String(command.request_id), code: 8, ok: false });
  h.receive({ result: rejection });
  s.snapshot_sequence = 2n; s.world_version = 2n; s.self.inventory.water = 1n; s.self.inventory.food = 2n; s.offers.items[0].status = 2; s.request_results.items.push(rejection); s.phase = 3;
  h.receive({ state: s }); await h.e.idle();
  assert.equal(h.e.state.snapshot?.self.inventory.water, 1n); assert.equal(h.e.state.pending.length, 0);
});
test('capacity control rejection syncs once and prevents new command IDs', async () => {
  const h = harness(); await h.ready(snapshot()); const p = h.e.state.pending[0];
  h.receive({ protocol_error: { protocol_version: '2.0', run_id: { value: 'test-run' }, request_id: { value: p.requestId }, code: 2, close_session: false } });
  h.receive({ state: snapshot({ snapshot_sequence: 2n, tick: 2n }) }); await h.e.idle();
  assert.equal(commands(h.sent).length, 1); assert.equal(h.sent.filter(m => m.sync).length, 1);
  assert.equal(h.e.state.pending.length, 0);
});
test('text application frames and run mismatches fail closed', async () => {
  const h = harness(); h.e.receive(h.e.state.epoch, Buffer.from('text'), false); assert.equal(h.fatal(), true);
  const other = harness(); await other.ready(snapshot({ phase: 3 }));
  other.receive({ state: snapshot({ run_id: 'different', snapshot_sequence: 2n }) }); assert.equal(other.fatal(), true);
});
test('queued socket observations run before send even with immediately resolved persistence', async () => {
  let h: ReturnType<typeof harness>;
  h = harness(async entry => {
    if (entry.kind === 'decision') setImmediate(() => h.receive({ state: snapshot({ snapshot_sequence: 2n, phase: 3 }) }));
  });
  await h.ready(snapshot());
  assert.equal(commands(h.sent).length, 0);
  assert.equal(h.e.state.snapshot?.phase, 3);
});
