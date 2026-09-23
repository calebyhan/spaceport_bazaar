import type { Snapshot, Pending, Result } from './types';
export class StateStore {
  epoch = 0;
  snapshot?: Snapshot;
  pending: Pending[] = [];
  blockedUntil = 0n;
  // Learned from results for our own commands; no snapshot records these.
  failed = new Set<string>();
  lags: bigint[] = [];
  // Bumps whenever a result changes what a decision would see, so a command
  // prepared against the old view is cancelled rather than sent.
  revision = 0;
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
    if (pending && !pending.result) {
      this.revision++;
      const lag = result.processed_tick - pending.tick;
      this.lags = [...this.lags, lag > 0n ? lag : 0n].slice(-8);
      // STATION_FAILED on our offer means its recipient failed, permanently.
      if (result.code === 11 && pending.action.kind === 'offer') this.failed.add(pending.action.body.recipient_id);
    }
    if (pending) pending.result = result;
    if (result.code === 4) {
      const until = result.retry_after_tick.value ?? result.processed_tick + 1n;
      if (until > this.blockedUntil) this.blockedUntil = until;
    }
  }
}
