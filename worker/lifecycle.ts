// Connection lifecycle, from the operator's point of view. Each stage implies
// the ones before it on the current connection:
//   connecting     socket opening
//   connected      WebSocket open with the negotiated subprotocol
//   authenticated  the server sent a valid snapshot for our station
//   synchronized   readiness confirmed for that snapshot; the run is not
//                  trading for us (READY, PAUSED, or our station failed)
//   participating  synchronized while RUNNING: decisions and commands flow
//   stale          synchronized, but no snapshot within the staleness window
// plus disconnected (reconnecting), and the terminal finished, failed, stopped.
import type { Snapshot } from './types';

export type LifecycleState = 'starting' | 'connecting' | 'connected' | 'authenticated' | 'synchronized' | 'participating'
  | 'stale' | 'disconnected' | 'finished' | 'failed' | 'stopped';
export interface LifecycleChange {
  from: LifecycleState; to: LifecycleState; reason: string; epoch: number;
  tick?: bigint; phase?: number; snapshot_age_ms?: number;
}
const terminal: LifecycleState[] = ['finished', 'failed', 'stopped'];
export const phaseNames = ['UNKNOWN', 'READY', 'RUNNING', 'PAUSED', 'FINISHED', 'ABORTED'];

// The server pushes a snapshot at least every tick while RUNNING. Advertised
// tick lengths were unreliable in live runs, so allow three ticks and never
// less than five seconds before calling the view stale.
export const staleAfterMs = (s: Snapshot) => Math.max(5000, 3 * Number(s.rules.tick_duration_ms));

export function steadyState(ready: boolean, s: Snapshot): [LifecycleState, string] {
  if (!ready) return ['authenticated', `Snapshot received as ${s.self_station_id}; waiting for readiness confirmation`];
  if (s.self.failed_once) return ['synchronized', 'Our station has permanently failed; observing only'];
  if (s.phase === 2) return ['participating', 'Run is RUNNING; trading'];
  return ['synchronized', `Run is ${phaseNames[s.phase] ?? 'UNKNOWN'}; waiting for it to run`];
}

export class Lifecycle {
  state: LifecycleState = 'starting';
  reason = 'Process started';
  constructor(private readonly changed: (change: LifecycleChange) => void) {}
  get terminal() { return terminal.includes(this.state); }
  // Records only real stage changes; a terminal stage is never left.
  set(to: LifecycleState, reason: string, detail: Omit<LifecycleChange, 'from' | 'to' | 'reason'>) {
    if (to === this.state || this.terminal) return;
    const change = { from: this.state, to, reason, ...detail };
    this.state = to; this.reason = reason;
    this.changed(change);
  }
}

export function formatLifecycle(change: LifecycleChange) {
  const where = change.tick === undefined ? '' : ` (tick ${change.tick}, ${phaseNames[change.phase!] ?? 'UNKNOWN'})`;
  return `[lifecycle] ${change.from} -> ${change.to}${where}: ${change.reason}`;
}
