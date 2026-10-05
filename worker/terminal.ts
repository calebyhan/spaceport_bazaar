// Terminal summaries are a projection only; the journal keeps every record.
import type { RecordEntry, Sink } from './persistence';
import type { LifecycleChange } from './lifecycle';
import { resources, type Action, type Bundle, type Result, type Snapshot } from './types';

const clean = (value: unknown) => String(value).replace(/\p{Cc}/gu, ' ').slice(0, 500);
const bundle = (value: Bundle, omitZero = false) => resources.filter(r => !omitZero || value[r] !== 0n).map(r => `${value[r]} ${r}`).join(' · ') || 'nothing';
const zero = (): Bundle => ({ water: 0n, food: 0n, components: 0n });

export class TerminalActivity {
  private snapshot?: Snapshot;
  private strategy = 'worker';
  private start = 0n;
  private next = 10n;
  private startHealth = 0n;
  private transactions = new Set<string>();
  private expired = new Set<string>();
  private requests = new Set<string>();
  private peers = new Map<string, { count: number; gave: Bundle; received: Bundle }>();
  private rejected = 0;
  private expirations = 0;
  constructor(private readonly emit: (block: string) => void) {}

  private result(r: Result) {
    if (this.requests.delete(r.request_id) && !r.ok) this.rejected++;
  }
  private flush() {
    const s = this.snapshot;
    if (!s || (s.tick === this.start && !this.peers.size && !this.rejected && !this.expirations)) return;
    const pending = s.offers.items.filter(o => (o.proposer_id === s.self_station_id || o.recipient_id === s.self_station_id) && o.status === 1 && o.expires_tick > s.tick).length;
    const count = [...this.peers.values()].reduce((n, p) => n + p.count, 0);
    const lines = [
      `${s.self_station_id} · ${this.strategy} · Ticks ${this.start}–${s.tick} / ${s.rules.duration_ticks}`,
      `Health: start ${this.startHealth} → end ${s.self.health}`,
      `Inventory at end: ${bundle(s.self.inventory)}`,
      `Trades completed: ${count}`,
      ...[...this.peers].sort(([a], [b]) => a.localeCompare(b)).map(([peer, p]) => `  ${peer}: ${p.count} trades — gave ${bundle(p.gave, true)} → received ${bundle(p.received, true)}`),
      `Offers pending now: ${pending} | Expired this interval: ${this.expirations} | Trade requests rejected this interval: ${this.rejected}`,
    ];
    this.emit('\n' + lines.map(clean).join('\n') + '\n');
    this.start = s.tick; this.startHealth = s.self.health;
    this.peers.clear(); this.rejected = 0; this.expirations = 0;
  }
  append(entry: RecordEntry) {
    if (entry.strategy) this.strategy = entry.strategy;
    if (entry.kind === 'state') {
      const s = entry.payload as Snapshot;
      const previous = this.snapshot;
      if (!previous) {
        this.start = s.tick; this.next = (s.tick / 10n + 1n) * 10n; this.startHealth = s.self.health;
        // A late start/reconnect must not report historical trades as new ones.
        this.transactions = new Set(s.transactions.items.map(t => t.transaction_id));
        this.expired = new Set(s.offers.items.filter(o => o.status === 4).map(o => o.offer_id));
      } else if (s.self.health < previous.self.health) {
        this.emit(`[${clean(s.self_station_id)} | tick ${s.tick}] ALERT health ${previous.self.health} → ${s.self.health}`);
      }
      this.snapshot = s;
      for (const t of s.transactions.items) {
        if (this.transactions.has(t.transaction_id)) continue;
        this.transactions.add(t.transaction_id);
        if (t.proposer_id !== s.self_station_id && t.recipient_id !== s.self_station_id) continue;
        const proposer = t.proposer_id === s.self_station_id, peer = proposer ? t.recipient_id : t.proposer_id;
        const total = this.peers.get(peer) ?? { count: 0, gave: zero(), received: zero() };
        total.count++;
        for (const r of resources) { total.gave[r] += proposer ? t.give[r] : t.receive[r]; total.received[r] += proposer ? t.receive[r] : t.give[r]; }
        this.peers.set(peer, total);
      }
      for (const o of s.offers.items) if (o.status === 4 && !this.expired.has(o.offer_id)) {
        this.expired.add(o.offer_id);
        if (o.proposer_id === s.self_station_id || o.recipient_id === s.self_station_id) this.expirations++;
      }
      for (const r of s.request_results.items) this.result(r);
      if (s.tick >= this.next || s.phase === 4 || s.phase === 5) {
        this.flush(); this.next = (s.tick / 10n + 1n) * 10n;
      }
    } else if (entry.kind === 'decision') {
      const p = entry.payload as { action: Action };
      if (entry.requestId && p.action.kind !== 'wait' && p.action.kind !== 'advertise') this.requests.add(entry.requestId);
    } else if (entry.kind === 'result') this.result(entry.payload as Result);
    else if (entry.kind === 'cancelled' && entry.requestId) this.requests.delete(entry.requestId);
    else if (entry.kind === 'lifecycle') {
      const p = entry.payload as LifecycleChange;
      if (['stale', 'disconnected', 'failed'].includes(p.to)) this.emit(`[${clean(this.snapshot?.self_station_id ?? '?')}] ALERT ${clean(p.to)}: ${clean(p.reason)}`);
      if (['finished', 'failed', 'stopped'].includes(p.to)) this.flush();
    } else if (entry.kind === 'run-summary') this.flush();
  }
}

// Bounded, deferred output: a backed-up terminal must not hold up a command.
// Journal records remain complete even if the terminal drops display lines.
export function bufferedTerminal(write: (text: string) => boolean, ready: () => boolean) {
  let pending: string[] = [], dropped = 0, scheduled = false;
  return (line: string) => {
    if (pending.length < 256) pending.push(line); else dropped++;
    if (scheduled) return;
    scheduled = true;
    setImmediate(() => {
      scheduled = false;
      if (!ready()) { dropped += pending.length; pending = []; return; }
      const notice = dropped ? `[terminal] ${dropped} display lines skipped; see the journal for full details.\n` : '';
      const text = notice + pending.join('\n') + '\n';
      pending = []; dropped = 0;
      try { write(text); } catch { /* Display failures must not stop trading. */ }
    });
  };
}
const output = bufferedTerminal(text => process.stdout.write(text), () => !process.stdout.destroyed && !process.stdout.writableNeedDrain);
export function terminalStationMatches(station: string | undefined): boolean {
  return station === (process.env.BAZAAR_TERMINAL_STATION ?? 'P09');
}
export function terminalSink(sink: Sink): Sink {
  if (process.env.BAZAAR_TERMINAL_LOG === '0') return sink;
  const activity = new TerminalActivity(output);
  let station: string | undefined;
  return {
    resolve: (run, id) => { station = id; sink.resolve?.(run, id); },
    append: async entry => {
      await sink.append(entry);
      try {
        if (entry.kind === 'state') station = (entry.payload as Snapshot).self_station_id;
        if (terminalStationMatches(station)) activity.append(entry);
      } catch { /* A display error must not become a persistence failure. */ }
    },
  };
}
