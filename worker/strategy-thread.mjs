import { parentPort, workerData } from 'node:worker_threads';
import { require as requireTypeScript } from 'tsx/cjs/api';
const { getStrategy } = requireTypeScript('./strategies.ts', import.meta.url);
const strategy = getStrategy(workerData.strategy);
parentPort.on('message', input => {
  const startedAt = performance.timeOrigin + performance.now();
  parentPort.postMessage({ startedAt });
  const decision = strategy.decide(input);
  parentPort.postMessage({ decision, startedAt, durationMs: performance.timeOrigin + performance.now() - startedAt });
});
