import { afterEach, expect, test, vi } from 'vitest';
import { Engine, type EngineOptions } from '../engine';
import { StrategyExecutor, StrategyTimeout, type Evaluate } from '../strategy';
import { decide } from '../policy';
import { encodeServer, decodeClient } from '../codec';
import type { RecordEntry, ResponsivenessSample } from '../persistence';
import { snapshot, result, offer, defaultConfig } from './fixtures';
const engines: Engine[] = [];
const now = () => performance.timeOrigin + performance.now();
const immediate: Evaluate = async (input, _timeout, started) => {
  const startedAt = now(); started(startedAt);
  return { decision: decide(input.snapshot, input.pending, input.memory, input.config), startedAt, durationMs: 3 };
};
function harness(options: Partial<EngineOptions> = {}) {
  const records: RecordEntry[] = [], sent: ReturnType<typeof decodeClient>[] = [];
  const engine = new Engine({ strategy: immediate, sink: { append: async entry => { records.push(entry); } }, ...options });
  engines.push(engine);
  const transport = { send: (bytes: Uint8Array) => { sent.push(decodeClient(bytes)); }, close() {} };
  let epoch = engine.connect(transport);
  const receive = (message: unknown) => engine.receive(epoch, encodeServer(message));
  const ready = async (s = snapshot()) => {
    receive({ state: s });
    receive({ readiness: { protocol_version: '2.0', run_id: s.run_id, ready: true, snapshot_sequence: s.snapshot_sequence } });
    await engine.idle();
  };
  const samples = (metric: ResponsivenessSample['metric']) => records.filter(e => e.kind === 'responsiveness' && (e.payload as ResponsivenessSample).metric === metric).map(e => e.payload as ResponsivenessSample);
  return { engine, records, sent, receive, ready, samples, reconnect() { engine.disconnected(epoch); epoch = engine.connect(transport); } };
}
afterEach(async () => {
  for (const engine of engines) { engine.disconnected(engine.state.epoch); engine.fail(); await engine.idle().catch(() => {}); }
  engines.length = 0; vi.useRealTimers(); vi.restoreAllMocks();
});

test('queue delay, computation and response are independent measurements; response cancels deadline without a snapshot', async () => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  let release!: () => void, entered!: () => void;
  const gate = new Promise<void>(r => { release = r; });
  const reached = new Promise<void>(r => { entered = r; });
  const h = harness({ sink: { append: async entry => { h.records.push(entry); if (entry.kind === 'state') { entered(); await gate; } } } });
  const waiting = h.ready(); await reached;
  await new Promise(resolve => setImmediate(resolve));
  release(); await waiting;
  expect(h.samples('queue')[0].duration_ms).toBeGreaterThan(0);
  expect(h.samples('decision').find(s => s.source === 'policy')?.duration_ms).toBe(3);
  const id = h.engine.state.pending[0].requestId;
  h.receive({ result: result({ request_id: id }) }); await h.engine.idle();
  await vi.advanceTimersByTimeAsync(2500); await h.engine.idle();
  expect(h.samples('response')).toHaveLength(1);
  expect(h.samples('deadline')).toHaveLength(0);
  expect(h.engine.state.pending).toHaveLength(1); // reconciliation remains separate
  expect(h.sent.filter(m => m.sync)).toHaveLength(0);
});

test.each(['snapshot', 'rejection'])('%s resolves response once, even when repeated', async kind => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  const h = harness(); await h.ready(); const id = h.engine.state.pending[0].requestId;
  if (kind === 'snapshot') {
    const r = result({ request_id: id });
    h.receive({ state: snapshot({ phase: 3, snapshot_sequence: 2n, world_version: 2n, request_results: { items: [r] } }) });
    h.receive({ result: r });
  } else {
    h.receive({ protocol_error: { protocol_version: '2.0', run_id: { value: 'test-run' }, request_id: { value: id }, code: 2, close_session: false } });
  }
  await h.engine.idle(); await vi.advanceTimersByTimeAsync(2500); await h.engine.idle();
  expect(h.samples('response')).toHaveLength(1); expect(h.samples('deadline')).toHaveLength(0);
});

test('missing responses count once across reconnect and late duplicate results', async () => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  const h = harness(); await h.ready(); const id = h.engine.state.pending[0].requestId;
  h.reconnect(); await h.ready();
  await vi.advanceTimersByTimeAsync(5000); await h.engine.idle();
  expect(h.samples('deadline')).toEqual([expect.objectContaining({ deadline_kind: 'response', request_id: id })]);
  expect(h.sent.filter(m => m.sync)).toHaveLength(1);
  const r = result({ request_id: id }); h.receive({ result: r }); h.receive({ result: r }); await h.engine.idle();
  expect(h.samples('response')).toHaveLength(1); expect(h.samples('deadline')).toHaveLength(1);
});

test('late response counts a deadline even when its timer callback has not run', async () => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  const clock = vi.spyOn(performance, 'now').mockReturnValue(0);
  const h = harness(); await h.ready();
  clock.mockReturnValue(2100);
  const id = h.engine.state.pending[0].requestId;
  h.receive({ result: result({ request_id: id }) }); await h.engine.idle();
  expect(h.samples('deadline')).toHaveLength(1);
});

test('policy waits, engine skips and sent actions have auditable decisions', async () => {
  const h = harness(); await h.ready(snapshot({ phase: 3 }));
  expect(h.samples('decision')).toContainEqual(expect.objectContaining({ source: 'engine', intentional_wait: true, reason: 'Run is not trading' }));
  const s = snapshot({ snapshot_sequence: 2n }); s.rules.new_commands_per_station_per_tick = 0n;
  h.receive({ state: s }); await h.engine.idle();
  expect(h.samples('decision')).toContainEqual(expect.objectContaining({ source: 'policy', action: 'wait', intentional_wait: true }));
  h.receive({ state: snapshot({ snapshot_sequence: 3n }) }); await h.engine.idle();
  expect(h.records.some(e => e.kind === 'sent')).toBe(true);
  expect(h.samples('decision')).toContainEqual(expect.objectContaining({ source: 'policy', action: 'advertise', intentional_wait: false }));
});

test('heartbeat identifies a live intentional wait without additional server messages', async () => {
  vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval', 'Date'] });
  const h = harness(); await h.ready(snapshot({ phase: 3 }));
  await vi.advanceTimersByTimeAsync(1000); await h.engine.idle();
  const first = h.samples('activity').at(-1)!;
  expect(first).toMatchObject({ activity: 'waiting', reason: 'Run is not trading' });
  await vi.advanceTimersByTimeAsync(1000); await h.engine.idle();
  expect(h.samples('activity').at(-1)!.observed_at).toBe(first.observed_at! + 1000);
});

test('CPU-bound strategy runs off-thread while newer socket updates replace its input', async () => {
  const executor = new StrategyExecutor();
  // Isolate CPU concurrency from thread/module startup under parallel test load.
  await executor.evaluate({ snapshot: snapshot(), pending: [], memory: { attempted: {} }, config: defaultConfig }, 10000, () => {});
  let started!: () => void;
  const reached = new Promise<void>(resolve => { started = resolve; });
  const h = harness({ strategy: (input, timeout, onStarted) => executor.evaluate(input, timeout, at => { onStarted(at); started(); }), decisionTimeoutMs: 1000 });
  const s = snapshot(); s.rules.duration_ticks = 10000n; s.rules.max_offer_ttl_ticks = 10000n;
  // Many valid offers require enough forecasting work to hold the worker busy.
  s.offers.items = Array.from({ length: 500 }, (_, i) => offer({ offer_id: `cpu-${i}` }));
  const running = h.ready(s);
  await Promise.race([reached, running.then(() => { throw new Error('Strategy finished before CPU work began'); })]);
  h.receive({ state: snapshot({ snapshot_sequence: 2n, phase: 3 }) });
  expect(h.engine.state.snapshot?.snapshot_sequence).toBe(2n);
  await running;
  expect(h.samples('event').some(sample => sample.busy === true)).toBe(true);
  expect(h.sent.some(m => m.accept || m.advertise)).toBe(false);
  executor.close();
}, 15000);

test.each([new StrategyTimeout('expired'), new Error('worker failed')])('strategy failure cannot send; deadline classification is accurate: %s', async error => {
  const h = harness({ strategy: async () => { throw error; } }); await h.ready();
  expect(h.engine.stopped).toBe(true);
  expect(h.sent.some(m => m.advertise)).toBe(false);
  expect(h.samples('deadline')).toHaveLength(error instanceof StrategyTimeout ? 1 : 0);
});

test('real strategy timeout terminates work; executor can subsequently evaluate again', async () => {
  const executor = new StrategyExecutor();
  const input = { snapshot: snapshot(), pending: [], memory: { attempted: {} }, config: defaultConfig };
  await expect(executor.evaluate(input, 0, () => {})).rejects.toBeInstanceOf(StrategyTimeout);
  const value = await executor.evaluate(input, 2000, () => {});
  expect(value.decision.action.kind).toBe('advertise'); expect(value.durationMs).toBeGreaterThanOrEqual(0);
  executor.close(); executor.close();
});

test('shutdown during persistence never starts strategy evaluation', async () => {
  const strategy = vi.fn(immediate);
  const h = harness({ strategy, sink: { append: async entry => { h.records.push(entry); if (entry.kind === 'state') h.engine.stop(); } } });
  await h.ready(); expect(strategy).not.toHaveBeenCalled(); expect(h.engine.stopped).toBe(true);
});
test('no state, permanent failure and disconnected strategies record no-action reasons', async () => {
  const h = harness(); h.engine.schedule(); await h.engine.idle();
  expect(h.samples('decision')).toContainEqual(expect.objectContaining({ reason: 'No state received' }));
  const s = snapshot(); s.self.failed_once = true;
  await h.ready(s);
  expect(h.samples('decision')).toContainEqual(expect.objectContaining({ reason: 'Station has permanently failed' }));
  let release!: () => void, entered!: () => void;
  const gate = new Promise<void>(r => { release = r; });
  const reached = new Promise<void>(r => { entered = r; });
  const busy = harness({ strategy: async (...args) => { entered(); await gate; return immediate(...args); } });
  const pending = busy.ready(); await reached;
  busy.engine.disconnected(busy.engine.state.epoch); release(); await pending;
  expect(busy.samples('decision')).toContainEqual(expect.objectContaining({ reason: 'Disconnected' }));
  expect(busy.sent.some(m => m.advertise)).toBe(false);
});
test('validator waiting step is recorded without a policy result', async () => {
  const h = harness({ exercise: true });
  await h.ready(snapshot({ request_results: { items: Array.from({ length: 3 }, (_, i) => result({ request_id: `r-${i}` })) } }));
  expect(h.engine.stopped).toBe(false);
  expect(h.samples('decision')).toContainEqual(expect.objectContaining({ source: 'exercise', action: 'wait', intentional_wait: true }));
});
test('late response after a fired timer does not count a second deadline', async () => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  const clock = vi.spyOn(performance, 'now').mockReturnValue(0);
  const h = harness(); await h.ready();
  clock.mockReturnValue(2100);
  await vi.advanceTimersByTimeAsync(2100); await h.engine.idle();
  h.receive({ result: result({ request_id: h.engine.state.pending[0].requestId }) }); await h.engine.idle();
  expect(h.samples('deadline')).toHaveLength(1);
});
test('a queued timer callback cannot mark an already received response as late', async () => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  const timers = vi.spyOn(globalThis, 'setTimeout');
  const h = harness(); await h.ready();
  const callback = timers.mock.calls.find(call => call[1] === 2000)![0] as () => void;
  h.receive({ result: result({ request_id: h.engine.state.pending[0].requestId }) });
  callback(); await h.engine.idle();
  expect(h.samples('deadline')).toHaveLength(0);
  timers.mockRestore();
});
test('capacity errors without a request ID do not fabricate a response duration', async () => {
  const h = harness(); await h.ready(snapshot({ phase: 3 }));
  h.receive({ protocol_error: { protocol_version: '2.0', run_id: { value: 'test-run' }, request_id: { null: true }, code: 2, close_session: false } });
  await h.engine.idle(); expect(h.samples('response')).toHaveLength(0);
});
