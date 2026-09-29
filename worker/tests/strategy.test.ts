import { EventEmitter } from 'node:events';
import { afterEach, expect, test, vi } from 'vitest';
import { snapshot, defaultConfig } from './fixtures';
const workers = vi.hoisted(() => [] as (EventEmitter & { terminate: ReturnType<typeof vi.fn> })[]);
vi.mock('node:worker_threads', () => ({ Worker: class extends EventEmitter {
  ref() {} unref() {} postMessage() {}
  terminate = vi.fn(async () => 0);
  constructor() { super(); workers.push(this); }
} }));
import { StrategyExecutor } from '../strategy';
afterEach(() => { workers.length = 0; vi.restoreAllMocks(); });
const input = () => ({ snapshot: snapshot(), pending: [], memory: { attempted: {} }, config: defaultConfig });
test('concurrent submissions are rejected and cancellation terminates active work', async () => {
  const executor = new StrategyExecutor();
  const pending = executor.evaluate(input(), 2000, () => {});
  await expect(executor.evaluate(input(), 2000, () => {})).rejects.toThrow('already busy');
  executor.close(); await expect(pending).rejects.toThrow('cancelled');
  expect(workers[0].terminate).toHaveBeenCalledOnce(); executor.close();
});
test.each(['error', 'exit'])('unexpected worker %s rejects the evaluation and terminates resources', async event => {
  const executor = new StrategyExecutor();
  const pending = executor.evaluate(input(), 2000, () => {});
  workers[0].emit(event, event === 'error' ? new Error('broken worker') : 1);
  await expect(pending).rejects.toThrow(event === 'error' ? 'broken worker' : 'without a decision');
  expect(workers[0].terminate).toHaveBeenCalledOnce(); executor.close();
});

test('a result delivered after its deadline is rejected even before the timer runs', async () => {
  const clock = vi.spyOn(performance, 'now').mockReturnValue(0);
  const executor = new StrategyExecutor();
  const pending = executor.evaluate(input(), 2000, () => {});
  clock.mockReturnValue(2100);
  workers[0].emit('message', { decision: {}, startedAt: 0, durationMs: 2100 });
  await expect(pending).rejects.toThrow('deadline exceeded');
  expect(workers[0].terminate).toHaveBeenCalledOnce();
});
