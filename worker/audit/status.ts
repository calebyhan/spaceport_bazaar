// Q4: the current operating picture from a journal: lifecycle, epoch, tick,
// reserves, pending commands, open offers and recent trades. It reads only
// what the worker already recorded; nothing is inferred from other stations.
import type { Action, Config, Snapshot } from '../types';
import type { LifecycleChange } from '../lifecycle';
import { amounts, describeAction, ourTerms, phaseName, resourceNames, type Entry, type Journaled } from './journal';

type State = Journaled<Snapshot>;
interface Command { requestId: string; action: Journaled<Action>; at?: string; uncertain: boolean }

// A live worker records at least one activity sample per second.
export const SILENT_AFTER_MS = 5000;

export class StatusBuilder {
  private state?: State;
  private stateAt?: string;
  private manifest?: { station_id: string; server_run_id: string; strategy?: string; config?: Journaled<Config> };
  private lifecycle?: { change: Journaled<LifecycleChange>; at?: string };
  private readonly commands = new Map<string, Command>();
  private lastAt?: string;
  private summary = false;

  add(entry: Entry) {
    this.lastAt = entry.at ?? this.lastAt;
    const id = entry.requestId ?? '';
    switch (entry.kind) {
      case 'manifest': this.manifest = entry.payload as StatusBuilder['manifest']; break;
      case 'state': this.state = entry.payload as State; this.stateAt = entry.at; break;
      case 'lifecycle': this.lifecycle = { change: entry.payload as Journaled<LifecycleChange>, at: entry.at }; break;
      case 'command': this.commands.set(id, { requestId: id, action: (entry.payload as { action: Journaled<Action> }).action, at: entry.at, uncertain: false }); break;
      case 'uncertain': { const c = this.commands.get(id); if (c) c.uncertain = true; break; }
      case 'result': case 'cancelled': case 'control-rejected': this.commands.delete(id); break;
      case 'run-summary': this.summary = true; break;
    }
  }

  view(now: Date) {
    const age = (at?: string) => at === undefined ? undefined : now.getTime() - Date.parse(at);
    const s = this.state, self = s?.self_station_id ?? this.manifest?.station_id;
    const lastRecordMs = age(this.lastAt);
    const stage = this.lifecycle?.change.to;
    const worker = this.summary ? 'exited (run summary written)'
      : stage === 'finished' || stage === 'failed' || stage === 'stopped' ? `exited (lifecycle ${stage})`
      : lastRecordMs === undefined || lastRecordMs > SILENT_AFTER_MS ? `not writing for ${Math.round((lastRecordMs ?? 0) / 1000)} s: crashed, killed or hung`
      : 'running';
    const snapshotMs = age(this.stateAt);
    const staleMs = s ? Math.max(5000, 3 * Number(s.rules.tick_duration_ms)) : 0;
    const reserveTicks = BigInt(this.manifest?.config?.reserveTicks ?? '2');
    const remaining = s ? BigInt(s.rules.duration_ticks) - BigInt(s.tick) : 0n;
    const offers = s?.offers.items.filter(o => o.status === 1 && BigInt(o.expires_tick) > BigInt(s.tick)) ?? [];
    return {
      run: s?.run_id ?? this.manifest?.server_run_id, station: self, strategy: this.manifest?.strategy,
      worker, lastRecordMs,
      lifecycle: this.lifecycle && { stage: this.lifecycle.change.to, reason: this.lifecycle.change.reason, sinceMs: age(this.lifecycle.at) },
      connection: s && { epoch: this.lifecycle?.change.epoch, tick: s.tick, duration: s.rules.duration_ticks, phase: phaseName(s.phase), snapshotMs,
        stale: s.phase === 2 && snapshotMs !== undefined && snapshotMs > staleMs },
      reserves: s && {
        health: s.self.health, failed: s.self.failed_once,
        resources: resourceNames.map(r => {
          // Same rule as the policy's hard floor: reserveTicks of upkeep, capped at the run's end.
          const target = BigInt(s.self.upkeep_per_tick[r]) * (reserveTicks < remaining ? reserveTicks : remaining);
          return { resource: r, stock: s.self.inventory[r], target: target.toString(), short: BigInt(s.self.inventory[r]) < target };
        }),
      },
      pending: [...this.commands.values()].map(c => ({ requestId: c.requestId, action: describeAction(c.action), ageMs: age(c.at), uncertain: c.uncertain })),
      offers: offers.map(o => ({ id: o.offer_id, ...ourTerms(o, self!), expires: o.expires_tick, ticksLeft: (BigInt(o.expires_tick) - BigInt(s!.tick)).toString() })),
      trades: (s?.transactions.items ?? []).slice(-10).reverse().map(t => ({ id: t.transaction_id, tick: t.settled_tick, offer: t.offer_id, ...ourTerms(t, self!) })),
    };
  }
}
export type StatusView = ReturnType<StatusBuilder['view']>;

const seconds = (ms?: number) => ms === undefined ? '?' : `${(ms / 1000).toFixed(1)} s`;
export function formatStatus(v: StatusView): string {
  const lines = [`Run ${v.run ?? '(unknown)'} as ${v.station ?? '(unknown)'}${v.strategy ? `, strategy ${v.strategy}` : ''}`];
  lines.push(`Worker:     ${v.worker}; last record ${seconds(v.lastRecordMs)} ago`);
  if (v.lifecycle) lines.push(`Lifecycle:  ${v.lifecycle.stage} for ${seconds(v.lifecycle.sinceMs)}: ${v.lifecycle.reason}`);
  if (!v.connection || !v.reserves) return [...lines, 'No snapshot recorded yet.'].join('\n');
  const c = v.connection;
  lines.push(`Clock:      tick ${c.tick}/${c.duration}, ${c.phase}, connection epoch ${c.epoch ?? '?'}, latest snapshot ${seconds(c.snapshotMs)} ago${c.stale ? '  << STALE' : ''}`);
  lines.push(`Health:     ${v.reserves.health}${v.reserves.failed ? ' (permanently failed)' : ''}`);
  lines.push('Reserves:   ' + v.reserves.resources.map(r => `${r.resource} ${r.stock}/${r.target}${r.short ? ' SHORT' : ''}`).join(', '));
  lines.push(`Pending:    ${v.pending.length ? '' : 'none'}`);
  for (const p of v.pending) lines.push(`  ${p.requestId.slice(0, 8)}  ${p.action}, waiting ${seconds(p.ageMs)}${p.uncertain ? ' (uncertain: sync requested)' : ''}`);
  lines.push(`Open offers: ${v.offers.length ? '' : 'none'}`);
  for (const o of v.offers) lines.push(`  ${o.id}  ${o.outgoing ? 'to' : 'from'} ${o.counterparty}: we pay ${amounts(o.pay)}, get ${amounts(o.get)}; expires tick ${o.expires} (${o.ticksLeft} left)`);
  lines.push(`Recent trades: ${v.trades.length ? '' : 'none'}`);
  for (const t of v.trades) lines.push(`  tick ${t.tick}  ${t.outgoing ? 'our offer to' : 'accepted from'} ${t.counterparty}: paid ${amounts(t.pay)}, got ${amounts(t.get)} (${t.id})`);
  return lines.join('\n');
}
