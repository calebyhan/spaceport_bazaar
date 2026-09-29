import { afterEach, expect, test, vi } from 'vitest';
import { Engine, type EngineOptions } from '../engine';
import { decodeClient, encodeServer } from '../codec';
import { StrategyTimeout, type Evaluate } from '../strategy';
import type { LifecycleChange } from '../lifecycle';
import type { RecordEntry } from '../persistence';
import { result, snapshot } from './fixtures';

const engines: Engine[] = [];
afterEach(() => { for (const e of engines) e.stop(); engines.length = 0; vi.useRealTimers(); });
// Waits keep the tests about the lifecycle, not about trading decisions.
const wait: Evaluate = async input => ({ decision: { action: { kind: 'wait' }, nextMemory: input.memory, explanation: { policyVersion: 'test', rationale: 'wait' } }, startedAt: 0, durationMs: 0 });
function harness(options: Partial<EngineOptions> = {}) {
  const records: RecordEntry[] = [], sent: ReturnType<typeof decodeClient>[] = [], changes: LifecycleChange[] = [];
  const close = vi.fn(), done = vi.fn(), fatal = vi.fn();
  const engine = new Engine({ sink: { append: async e => { records.push(e); } }, strategy: wait, done, fatal, lifecycle: c => changes.push(c), ...options });
  engines.push(engine);
  const epoch = engine.connect({ send: b => { sent.push(decodeClient(b)); }, close });
  const receive = (msg: unknown) => engine.receive(epoch, encodeServer(msg));
  const readiness = (sequence: bigint) => receive({ readiness: { protocol_version: '2.0', run_id: 'test-run', ready: true, snapshot_sequence: sequence } });
  const stages = () => changes.map(c => c.to);
  return { engine, records, sent, changes, close, done, fatal, epoch, receive, readiness, stages };
}

test('stages progress from connecting to participating and follow the phase', async () => {
  const h = harness();
  h.engine.opened(h.epoch + 1);
  h.engine.opened(h.epoch);
  h.readiness(1n); // Before any snapshot: ignored.
  h.receive({ state: snapshot({ phase: 1 }) });
  h.readiness(1n);
  h.receive({ state: snapshot({ phase: 2, snapshot_sequence: 2n, tick: 3n }) });
  await h.engine.idle();
  expect(h.stages()).toEqual(['connecting', 'connected', 'authenticated', 'synchronized', 'participating']);
  expect(h.changes[3]).toMatchObject({ reason: 'Run is READY; waiting for it to run', epoch: 1, tick: 0n, phase: 1 });
  expect(h.changes[4]).toMatchObject({ from: 'synchronized', tick: 3n, phase: 2, snapshot_age_ms: expect.any(Number) });
  expect(h.records.filter(r => r.kind === 'lifecycle').map(r => (r.payload as LifecycleChange).to)).toEqual(h.stages());
  h.engine.disconnected(h.epoch);
  h.engine.connect({ send: () => {}, close: () => {} });
  expect(h.stages().slice(-2)).toEqual(['disconnected', 'connecting']);
});

test('a silent RUNNING server becomes stale, gets one sync, then a reconnect', async () => {
  vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval', 'Date'] });
  const h = harness();
  h.receive({ state: snapshot() }); h.readiness(1n); await h.engine.idle();
  expect(h.engine.lifecycle.state).toBe('participating');
  vi.advanceTimersByTime(4000);
  expect(h.engine.lifecycle.state).toBe('participating');
  vi.advanceTimersByTime(1000);
  expect(h.engine.lifecycle.state).toBe('stale');
  expect(h.changes.at(-1)?.reason).toBe('No snapshot for 5000 ms while RUNNING (limit 5000 ms); requesting a sync');
  expect(h.sent.filter(m => m.sync)).toHaveLength(1);
  vi.advanceTimersByTime(4000);
  expect(h.close).not.toHaveBeenCalled();
  vi.advanceTimersByTime(3000);
  expect(h.close).toHaveBeenCalledOnce();
  await h.engine.idle();
  expect(h.records.find(r => r.kind === 'stale-reconnect')?.payload).toEqual({ snapshot_age_ms: 10000, window_ms: 5000 });
  expect(h.sent.filter(m => m.sync)).toHaveLength(1);
  // A fresh snapshot ends the stale period.
  h.receive({ state: snapshot({ snapshot_sequence: 2n }) }); await h.engine.idle();
  expect(h.stages().slice(-2)).toEqual(['stale', 'participating']);
});

test.each([
  ['paused', { phase: 3 }, {}],
  ['exercise', {}, { exercise: true }],
  ['not ready', {}, {}],
])('silence is not staleness when %s', async (name, state, options) => {
  vi.useFakeTimers({ toFake: ['setInterval', 'clearInterval', 'Date'] });
  const h = harness(options);
  h.receive({ state: snapshot(state) });
  if (name !== 'not ready') h.readiness(1n);
  await h.engine.idle();
  vi.advanceTimersByTime(20000);
  expect(h.stages()).not.toContain('stale');
  expect(h.close).not.toHaveBeenCalled();
});

test.each([[4, 'FINISHED'], [5, 'ABORTED']])('phase %i ends the run: finished, stopped, done once durable', async (phase, name) => {
  const h = harness();
  h.receive({ state: snapshot() }); h.readiness(1n); await h.engine.idle();
  h.receive({ state: snapshot({ phase, snapshot_sequence: 2n }) });
  await h.engine.idle();
  expect(h.engine.stopped).toBe(true);
  expect(h.stages().at(-1)).toBe('finished');
  expect(h.changes.at(-1)?.reason).toBe(`Run ${name}; no further trading is possible`);
  expect(h.done).toHaveBeenCalledOnce(); expect(h.close).toHaveBeenCalledOnce(); expect(h.fatal).not.toHaveBeenCalled();
  expect(h.records.map(r => r.kind)).not.toContain('failure');
});

test('a run that ends while its records cannot be written is not reported as done', async () => {
  const h = harness({ sink: { append: async e => { if (e.kind === 'state' && (e.payload as { phase: number }).phase === 4) throw new Error('disk full'); } } });
  h.receive({ state: snapshot({ phase: 4 }) });
  await h.engine.idle().catch(() => {});
  await new Promise(resolve => setImmediate(resolve));
  expect(h.done).not.toHaveBeenCalled();
  expect(h.fatal).toHaveBeenCalledWith(expect.objectContaining({ code: 'PERSISTENCE_FAILED' }));
});

const error = (code: number, close_session: boolean) => ({ protocol_error: { protocol_version: '2.0', run_id: { null: true }, request_id: { null: true }, code, close_session } });
test.each([
  ['undecodable frame', 'protocol', 'UNDECODABLE_FRAME', (h: ReturnType<typeof harness>) => h.engine.receive(h.epoch, Buffer.from('broken'))],
  ['text frame', 'protocol', 'TEXT_FRAME', (h: ReturnType<typeof harness>) => h.engine.receive(h.epoch, Buffer.from('text'), false)],
  ['other protocol version', 'protocol', 'UNSUPPORTED_VERSION', (h: ReturnType<typeof harness>) => h.receive({ state: snapshot({ protocol_version: '3.0', snapshot_sequence: 2n }) })],
  ['different run', 'protocol', 'RUN_CHANGED', (h: ReturnType<typeof harness>) => h.receive({ state: snapshot({ run_id: 'other', snapshot_sequence: 2n }) })],
  ['different station', 'authentication', 'STATION_CHANGED', (h: ReturnType<typeof harness>) => h.receive({ state: snapshot({ self_station_id: 'other', snapshot_sequence: 2n }) })],
  ['oversized run', 'application', 'RUN_TOO_LONG', (h: ReturnType<typeof harness>) => { const s = snapshot({ snapshot_sequence: 2n }); s.rules.duration_ticks = 20000n; h.receive({ state: s }); }],
  ['request ID conflict', 'protocol', 'REQUEST_ID_CONFLICT', (h: ReturnType<typeof harness>) => h.receive({ result: result({ code: 2 }) })],
  ['fenced session', 'authentication', 'SESSION_FENCED', (h: ReturnType<typeof harness>) => h.receive(error(6, true))],
  ['bad message control error', 'protocol', 'BAD_MESSAGE', (h: ReturnType<typeof harness>) => h.receive(error(1, false))],
])('%s stops with a %s diagnosis (%s) recorded and reported', async (_name, category, code, trigger) => {
  const h = harness();
  h.receive({ state: snapshot({ phase: 3 }) }); h.readiness(1n); await h.engine.idle();
  trigger(h);
  await h.engine.idle().catch(() => {});
  expect(h.fatal).toHaveBeenCalledWith(expect.objectContaining({ category, code }));
  expect(h.records.find(r => r.kind === 'failure')?.payload).toMatchObject({ category, code });
  expect(h.changes.at(-1)).toMatchObject({ to: 'failed', reason: expect.stringContaining(`${category} failure ${code}`) });
});

test.each([
  ['a missed decision deadline', () => Promise.reject(new StrategyTimeout('late')), 'STRATEGY_TIMEOUT'],
  ['a crashed strategy', () => Promise.reject(new RangeError('boom')), 'UNEXPECTED'],
])('%s is an application failure', async (_name, strategy, code) => {
  const h = harness({ strategy });
  h.receive({ state: snapshot() }); h.readiness(1n);
  await h.engine.idle();
  await new Promise(resolve => setImmediate(resolve));
  expect(h.fatal).toHaveBeenCalledWith(expect.objectContaining({ category: 'application', code }));
});

test('a failed journal write is diagnosed as a persistence failure', async () => {
  const h = harness({ sink: { append: async e => { if (e.kind === 'state') throw new Error('disk full'); } } });
  h.receive({ state: snapshot() });
  await h.engine.idle().catch(() => {});
  expect(h.fatal).toHaveBeenCalledWith(expect.objectContaining({ category: 'application', code: 'PERSISTENCE_FAILED' }));
});

test('fail without a diagnosis still records an unexpected application failure', () => {
  const h = harness();
  h.engine.fail();
  expect(h.fatal).toHaveBeenCalledWith(expect.objectContaining({ category: 'application', code: 'UNEXPECTED' }));
});
