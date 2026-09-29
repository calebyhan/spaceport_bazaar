import { parentPort } from 'node:worker_threads';
import { require as requireTypeScript } from 'tsx/cjs/api';
const { decide } = requireTypeScript('./policy.ts', import.meta.url);
parentPort.on('message', input => {
  const startedAt = performance.timeOrigin + performance.now();
  parentPort.postMessage({ startedAt });
  const decision = decide(input.snapshot, input.pending, input.memory, input.config);
  parentPort.postMessage({ decision, startedAt, durationMs: performance.timeOrigin + performance.now() - startedAt });
});
