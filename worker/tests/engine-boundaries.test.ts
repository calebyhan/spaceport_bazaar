import { afterEach, expect, test, vi } from 'vitest';
import { Engine, type EngineOptions } from '../engine';
import { decodeClient, encodeServer } from '../codec';
import { snapshot, result, bundle } from './fixtures';
import type { Snapshot } from '../types';
import type { RecordEntry } from '../persistence';
const engines: Engine[] = [];
afterEach(() => { for (const engine of engines) engine.disconnected(engine.state.epoch); engines.length = 0; });
function harness(options: Partial<EngineOptions> = {}) {
  const records: RecordEntry[] = [], sent: ReturnType<typeof decodeClient>[] = [];
  const close = vi.fn(), done = vi.fn(), fatal = vi.fn();
  const engine = new Engine({ sink: { append: async e => { records.push(e); } }, done, fatal, ...options });
  engines.push(engine);
  const transport = { send: (b: Uint8Array) => { sent.push(decodeClient(b)); }, close };
  const epoch = engine.connect(transport);
  const receive = (msg: unknown) => engine.receive(epoch, encodeServer(msg));
  const ready = async (s = snapshot()) => {
    receive({ state: s }); receive({ readiness: { protocol_version: '2.0', run_id: s.run_id, ready: true, snapshot_sequence: s.snapshot_sequence } }); await engine.idle();
  };
  return { engine, records, sent, close, done, fatal, epoch, transport, receive, ready };
}
afterEach(() => vi.useRealTimers());
test('stale connections and duplicate observations are ignored; disconnect preserves newer connection', async () => {
  const h = harness(); await h.ready(snapshot({ phase: 3 }));
  h.receive({ state: snapshot({ phase: 3 }) }); await h.engine.idle();
  expect(h.records.filter(e => e.kind === 'state')).toHaveLength(1);
  const epoch = h.engine.connect(h.transport); h.engine.disconnected(h.epoch);
  h.engine.receive(h.epoch, Buffer.from('broken')); expect(h.engine.stopped).toBe(false);
  h.engine.receive(epoch, encodeServer({ state: snapshot({ phase: 3 }) })); await h.engine.idle();
  expect(h.sent.filter(m => m.ready)).toHaveLength(2);
  h.engine.fail(); h.engine.fail(); expect(h.fatal).toHaveBeenCalledOnce();
  h.engine.receive(epoch, Buffer.from('broken')); expect(h.fatal).toHaveBeenCalledOnce();
});
test.each(['protocol', 'station', 'duration', 'ttl', 'conflict', 'error'])('%s boundary fails closed', async kind => {
  const h = harness(); await h.ready(snapshot({ phase: 3 }));
  const s = snapshot({ snapshot_sequence: 2n, phase: 3 });
  if (kind === 'protocol') s.protocol_version = '3';
  if (kind === 'station') s.self_station_id = 'other';
  if (kind === 'duration') s.rules.duration_ticks = 10001n;
  if (kind === 'ttl') s.rules.max_offer_ttl_ticks = 10001n;
  if (kind === 'conflict') h.receive({ result: result({ code: 2 }) });
  else if (kind === 'error') h.receive({ protocol_error: { protocol_version: '2.0', run_id: { null: true }, request_id: { null: true }, code: 3, close_session: false } });
  else h.receive({ state: s });
  await h.engine.idle(); expect(h.engine.stopped).toBe(true); expect(h.close).toHaveBeenCalledOnce();
});
test('restoration converts all command quantities, respects run identity and cancels prepared records', async () => {
  const previous: RecordEntry[] = [
    { kind: 'command', payload: { run: 'test-run', requestId: 'offer', tick: '0', action: { kind: 'offer', body: { recipient_id: 'peer', give: { water: '9007199254740993', food: '0', components: '0' }, receive: { water: '0', food: '1', components: '0' }, expires_tick: '3' } } } },
    { kind: 'command', payload: { run: 'other', requestId: 'other', tick: '0', action: { kind: 'accept', body: { offer_id: 'gift' } } } },
    { kind: 'command', payload: { run: 'test-run', requestId: 'cancel', tick: '0', action: { kind: 'accept', body: { offer_id: 'gift' } } } },
    { kind: 'cancelled', requestId: 'cancel', payload: {} },
    { kind: 'control-rejected', payload: {} },
    { kind: 'decision', payload: { run: 'other', nextMemory: { attempted: {} } } },
    { kind: 'decision', payload: { run: 'test-run', nextMemory: { attempted: { terms: '5' } } } },
  ];
  const h = harness({ previous }); await h.ready(snapshot({ phase: 3 }));
  expect(h.engine.state.pending).toHaveLength(1);
  expect(h.engine.state.pending[0]).toMatchObject({ tick: 0n, action: { body: { give: { water: 9007199254740993n }, expires_tick: 3n } } });
  expect(h.engine.memory.attempted).toEqual({ terms: 5n });
});
test('missing outcome requests exactly one sync and blocks replacement commands', async () => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  const h = harness(); await h.ready(); const id = h.engine.state.pending[0].requestId;
  await vi.advanceTimersByTimeAsync(2000); await h.engine.idle();
  expect(h.sent.filter(m => m.sync)).toHaveLength(1); expect(h.records.find(e => e.kind === 'uncertain')?.requestId).toBe(id);
  await vi.advanceTimersByTimeAsync(10000); expect(h.sent.filter(m => m.sync)).toHaveLength(1);
  expect(h.engine.state.pending[0].requestId).toBe(id);
  h.engine.disconnected(h.epoch);
});
test('command byte limit prevents transmission and stops engine', async () => {
  const h = harness(); const s = snapshot(); s.rules.max_command_bytes = 1n; await h.ready(s);
  expect(h.engine.stopped).toBe(true); expect(h.sent.some(m => m.advertise)).toBe(false);
});
function completeState(): Snapshot {
  const s = snapshot(); s.self.inventory = bundle(28n,31n,31n); s.transactions.items = [1,2].map(i => ({ transaction_id: `t${i}`, offer_id: `o${i}`, proposer_id: 'ours', recipient_id: 'P02', give: bundle(1n,0n,0n), receive: bundle(0n,1n,0n), settled_tick: 0n, settled_version: 1n }));
  s.request_results.items = Array.from({ length: 5 }, (_, i) => result({ request_id: `r${i}` })); return s;
}
async function exhaust(h: ReturnType<typeof harness>) {
  await h.ready(completeState());
  const id = h.engine.state.pending[0].requestId;
  h.receive({ protocol_error: { protocol_version: '2.0', run_id: { value: 'test-run' }, request_id: { value: id }, code: 2, close_session: false } });
  await h.engine.idle();
}
test('exercise sends prescribed actions and completes only after capacity rejection and verified final snapshot', async () => {
  const start = harness({ exercise: true }); await start.ready();
  expect(start.sent.at(-1)?.advertise.body).toMatchObject({ selling: { items: [1] } }); start.engine.disconnected(start.epoch);
  const h = harness({ exercise: true }); await exhaust(h);
  expect(h.sent.at(-1)).toHaveProperty('sync');
  h.receive({ state: { ...completeState(), snapshot_sequence: 2n } }); await h.engine.idle();
  expect(h.engine.stopped).toBe(true); expect(h.done).toHaveBeenCalledOnce(); expect(h.close).toHaveBeenCalledOnce();
});
test.each(['water', 'food', 'components', 'transactions', 'results'])('exercise refuses incorrect final %s', async field => {
  const h = harness({ exercise: true }); await exhaust(h); const s = completeState(); s.snapshot_sequence = 2n;
  if (field === 'transactions') s.transactions.items = [];
  else if (field === 'results') s.request_results.items = [];
  else s.self.inventory[field as 'water' | 'food' | 'components'] = 0n;
  h.receive({ state: s }); await h.engine.idle(); expect(h.fatal).toHaveBeenCalledOnce(); expect(h.done).not.toHaveBeenCalled();
});
test('exercise final persistence failure never reports successful completion', async () => {
  const h = harness({ exercise: true, sink: { append: async e => { if (e.kind === 'state' && (e.payload as Snapshot).snapshot_sequence === 2n) throw new Error('disk full'); } } });
  await exhaust(h); h.receive({ state: { ...completeState(), snapshot_sequence: 2n } });
  await expect(h.engine.idle()).rejects.toThrow('disk full'); expect(h.done).not.toHaveBeenCalled(); expect(h.fatal).toHaveBeenCalled();
});
test('late state after disconnect cannot send readiness on a missing transport', async () => {
  const h = harness(); h.engine.disconnected(h.epoch); h.receive({ state: snapshot() });
  await h.engine.idle(); expect(h.sent).toEqual([]); expect(h.engine.stopped).toBe(false);
});
test('exercise capacity probe is sent at most once even if a result reconciles it', async () => {
  const h = harness({ exercise: true }); await h.ready(completeState());
  const pending = h.engine.state.pending[0]; h.receive({ result: result({ request_id: pending.requestId, processed_version: 1n }) });
  h.receive({ state: { ...completeState(), snapshot_sequence: 2n } }); await h.engine.idle();
  expect(h.sent.filter(m => m.advertise)).toHaveLength(1); expect(h.engine.state.pending).toHaveLength(0);
  h.engine.disconnected(h.epoch);
});
test('policy memory changing during command persistence fails revalidation before send', async () => {
  const { fingerprint } = await import('../policy');
  const h = harness({ sink: { append: async entry => {
    if (entry.kind === 'command') {
      const p = entry.payload as { action: Parameters<typeof fingerprint>[0] };
      h.engine.memory.attempted[fingerprint(p.action)] = 100n;
    }
  } } });
  await h.ready(); expect(h.engine.stopped).toBe(true); expect(h.sent.some(m => m.advertise)).toBe(false);
});
