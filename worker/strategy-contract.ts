import type { Action, Config, Memory, Pending, Snapshot } from './types';
import type { Controls } from './controls';

// Policies exchange domain values only. They never receive a socket, sink,
// database client or engine, and must return structured-cloneable data.
// Controls are the operator's live switches; a policy may ignore them.
export interface StrategyInput { snapshot: Snapshot; pending: Pending[]; memory: Memory; config: Config; controls?: Controls }
export interface Decision {
  action: Action;
  nextMemory: Memory;
  explanation: { policyVersion: string; rationale: string; [detail: string]: unknown };
}
export type Policy = (input: StrategyInput) => Decision;
