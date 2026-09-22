import type { Snapshot, Pending, Result } from './types';
export class StateStore {
  epoch = 0;
  snapshot?: Snapshot;
  pending: Pending[] = [];
  blockedUntil = 0n;
  newConnection() { this.epoch++; this.snapshot = undefined; return this.epoch; }
  observe(epoch: number, state: Snapshot): boolean {
    if (epoch !== this.epoch || (this.snapshot && state.snapshot_sequence <= this.snapshot.snapshot_sequence)) return false;
    this.snapshot = state;
    for (const result of state.request_results.items) this.result(result);
    this.pending = this.pending.filter(p => !p.result || state.world_version < p.result.processed_version);
    return true;
  }
  result(result: Result) {
    const pending = this.pending.find(p => p.requestId === result.request_id);
    if (pending) pending.result = result;
    if (result.code === 4) {
      const until = result.retry_after_tick.value ?? result.processed_tick + 1n;
      if (until > this.blockedUntil) this.blockedUntil = until;
    }
  }
}
