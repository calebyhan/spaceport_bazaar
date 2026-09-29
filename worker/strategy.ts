import { Worker } from 'node:worker_threads';
import { getStrategy, type StrategyName } from './strategies';
import type { Decision, StrategyInput } from './strategy-contract';
export type { StrategyInput } from './strategy-contract';

export interface StrategyResult { decision: Decision; startedAt: number; durationMs: number }
export type Evaluate = (input: StrategyInput, timeoutMs: number, onStarted: (at: number) => void) => Promise<StrategyResult>;
export class StrategyTimeout extends Error {}

// The engine submits one job at a time. Idle threads do not keep the process
// alive; disconnect/shutdown releases them. Timeouts also terminate CPU work.
export class StrategyExecutor {
  readonly strategyName: StrategyName;
  constructor(name?: string) { this.strategyName = getStrategy(name).name; }
  private worker?: Worker;
  private cancel?: () => void;
  evaluate: Evaluate = (input, timeoutMs, onStarted) => {
    if (this.cancel) return Promise.reject(new Error('Strategy is already busy'));
    return new Promise((resolve, reject) => {
      const worker = this.worker ??= new Worker(new URL('./strategy-thread.mjs', import.meta.url), { workerData: { strategy: this.strategyName } });
      worker.ref();
      const deadlineAt = performance.timeOrigin + performance.now() + timeoutMs;
      const finish = (error: Error | null, value?: StrategyResult) => {
        clearTimeout(timer);
        worker.off('message', onMessage);
        worker.off('error', onError);
        worker.off('exit', onExit);
        this.cancel = undefined;
        if (error) { this.worker = undefined; void worker.terminate(); reject(error); }
        else { worker.unref(); resolve(value!); }
      };
      const timer = setTimeout(() => finish(new StrategyTimeout('Strategy deadline exceeded')), timeoutMs);
      this.cancel = () => finish(new Error('Strategy cancelled'));
      const onMessage = (value: StrategyResult | { startedAt: number }) => {
        if ('decision' in value) finish(performance.timeOrigin + performance.now() > deadlineAt ? new StrategyTimeout('Strategy deadline exceeded') : null, value);
        else onStarted(value.startedAt);
      };
      const onError = (error: Error) => finish(error);
      const onExit = () => finish(new Error('Strategy exited without a decision'));
      worker.on('message', onMessage);
      worker.once('error', onError);
      worker.once('exit', onExit);
      worker.postMessage(input);
    });
  };
  close() {
    this.cancel?.();
    void this.worker?.terminate();
    this.worker = undefined;
  }
}
