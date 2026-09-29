// Q7: a run summary from one journal, so nobody has to read thousands of
// lines: resource and health history, completed trades, rejected requests,
// disconnected periods, shortages and responsiveness. Only recorded facts.
import type { Action, Bundle, Result, Snapshot } from '../types';
import { amounts, describeAction, ourTerms, phaseName, resourceNames, resultName, type Entry, type Journaled } from './journal';

type State = Journaled<Snapshot>;
type TickSummary = { tick: string; closing_inventory: Journaled<Bundle>; health_before: string; health_after: string; unmet_upkeep: Journaled<Bundle>; production: Journaled<Bundle> };
interface Disconnection { from?: string; to?: string; fromTick?: string; toTick?: string; closeCode?: number; cause?: string; attempts: number }

const percentile = (values: number[], p: number) => {
  if (!values.length) return undefined;
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.ceil(p * sorted.length) - 1)];
};

export class ReportBuilder {
  private manifest?: { server_run_id: string; station_id: string; strategy?: string; git_commit?: string; config?: { version?: string } };
  private state?: State;
  private summary?: Record<string, unknown>;
  private readonly ticks: TickSummary[] = [];
  private readonly actions = new Map<string, Journaled<Action>>();
  private readonly results = new Map<string, Journaled<Result>>();
  private readonly controlErrors: { at?: string; code: number; requestId?: string }[] = [];
  private readonly failures: unknown[] = [];
  private readonly disconnections: Disconnection[] = [];
  private readonly stale: { at?: string; tick?: string; reason: string }[] = [];
  private readonly responses: number[] = [];
  private readonly decisionTimes: number[] = [];
  private readonly missed = { decision: 0, response: 0 };
  private readonly counts = { decisions: 0, waits: 0, commands: 0, sent: 0, cancelled: 0, uncertain: 0 };

  add(entry: Entry) {
    const p = entry.payload as Record<string, unknown>;
    switch (entry.kind) {
      case 'manifest': this.manifest = p as ReportBuilder['manifest']; break;
      case 'state': {
        this.state = p as unknown as State;
        const open = this.disconnections.at(-1);
        // The first snapshot after a close ends the disconnected period.
        if (open && open.to === undefined) { open.to = entry.at; open.toTick = this.state.tick; }
        break;
      }
      case 'tick-summary': this.ticks.push(p as unknown as TickSummary); break;
      case 'run-summary': this.summary = p; break;
      case 'decision': this.counts.decisions++; if ((p.action as { kind: string }).kind === 'wait') this.counts.waits++; break;
      case 'command': this.counts.commands++; this.actions.set(entry.requestId!, (p as { action: Journaled<Action> }).action); break;
      case 'sent': this.counts.sent++; break;
      case 'cancelled': this.counts.cancelled++; break;
      case 'uncertain': this.counts.uncertain++; break;
      case 'result': this.results.set(entry.requestId!, p as unknown as Journaled<Result>); break;
      case 'protocol_error': this.controlErrors.push({ at: entry.at, code: p.code as number, requestId: entry.requestId }); break;
      case 'failure': this.failures.push(p); break;
      case 'ws-close': {
        const open = this.disconnections.at(-1);
        if (!open || open.to !== undefined) this.disconnections.push({ from: entry.at, fromTick: this.state?.tick, closeCode: p.code as number, attempts: 0 });
        break;
      }
      case 'ws-reconnect-scheduled': {
        const open = this.disconnections.at(-1)!;
        open.attempts++;
        open.cause ??= p.code as string | undefined;
        break;
      }
      case 'lifecycle': if (p.to === 'stale') this.stale.push({ at: entry.at, tick: p.tick as string | undefined, reason: p.reason as string }); break;
      case 'responsiveness':
        if (p.metric === 'response') this.responses.push(p.duration_ms as number);
        if (p.metric === 'decision' && p.source === 'policy') this.decisionTimes.push(p.duration_ms as number);
        if (p.metric === 'deadline') this.missed[p.deadline_kind as 'decision' | 'response']++;
        break;
    }
  }

  report() {
    const s = this.state, self = s?.self_station_id ?? this.manifest?.station_id ?? '';
    const history = this.ticks.map(t => ({ tick: Number(t.tick), health: Number(t.health_after), ...Object.fromEntries(resourceNames.map(r => [r, Number(t.closing_inventory[r])])) as Record<(typeof resourceNames)[number], number>,
      unmet: Object.fromEntries(resourceNames.map(r => [r, Number(t.unmet_upkeep[r])])) as Record<(typeof resourceNames)[number], number> }));
    const shortages = resourceNames.map(r => {
      const short = history.filter(h => h.unmet[r] > 0);
      let longest = 0, streak = 0;
      for (const h of history) { streak = h.unmet[r] > 0 ? streak + 1 : 0; longest = Math.max(longest, streak); }
      const lowest = history.reduce<(typeof history)[number] | undefined>((low, h) => !low || h[r] < low[r] ? h : low, undefined);
      return { resource: r, ticksShort: short.length, unitsMissing: short.reduce((n, h) => n + h.unmet[r], 0), firstShortTick: short[0]?.tick, longestStreak: longest,
        lowestStock: lowest?.[r], lowestAtTick: lowest?.tick };
    });
    const healthLost = this.ticks.reduce((n, t) => n + Math.max(0, Number(t.health_before) - Number(t.health_after)), 0);
    const trades = (s?.transactions.items ?? []).map(t => ({ tick: t.settled_tick, transaction: t.transaction_id, offer: t.offer_id, ...ourTerms(t, self) }));
    const partners = new Map<string, { trades: number; paid: Record<string, number>; got: Record<string, number> }>();
    for (const t of trades) {
      const row = partners.get(t.counterparty) ?? { trades: 0, paid: { water: 0, food: 0, components: 0 }, got: { water: 0, food: 0, components: 0 } };
      row.trades++;
      for (const r of resourceNames) { row.paid[r] += Number(t.pay[r]); row.got[r] += Number(t.get[r]); }
      partners.set(t.counterparty, row);
    }
    const rejected = new Map<string, { count: number; examples: string[] }>();
    for (const [id, r] of this.results) {
      if (r.ok) continue;
      const row = rejected.get(resultName(r.code)) ?? { count: 0, examples: [] };
      row.count++;
      const action = this.actions.get(id);
      if (row.examples.length < 3) row.examples.push(`tick ${r.processed_tick}: ${action ? describeAction(action) : `request ${id}`}`);
      rejected.set(resultName(r.code), row);
    }
    const outcome = s?.outcome.value;
    return {
      run: s?.run_id ?? this.manifest?.server_run_id, station: self, strategy: this.manifest?.strategy, policy: this.manifest?.config?.version, commit: this.manifest?.git_commit,
      outcome: s && {
        phase: phaseName(s.phase), lastTick: s.tick, duration: s.rules.duration_ticks, finalHealth: s.self.health, failed: s.self.failed_once,
        firstFailureTick: s.self.first_failure_tick.value, finalInventory: s.self.inventory, healthLost,
        collectiveSuccess: outcome?.collective_success.value, runSummaryWritten: this.summary !== undefined,
      },
      history, shortages, trades, partners: Object.fromEntries(partners),
      commands: { ...this.counts, results: this.results.size, ok: [...this.results.values()].filter(r => r.ok).length },
      rejected: Object.fromEntries(rejected),
      controlErrors: this.controlErrors,
      disconnections: this.disconnections.map(d => ({ ...d, durationMs: d.from && d.to ? Date.parse(d.to) - Date.parse(d.from) : undefined,
        ticksMissed: d.fromTick !== undefined && d.toTick !== undefined ? Number(d.toTick) - Number(d.fromTick) : undefined })),
      stale: this.stale, failures: this.failures,
      responsiveness: { responses: this.responses.length, responseMedianMs: percentile(this.responses, 0.5), responseP95Ms: percentile(this.responses, 0.95),
        decisionMedianMs: percentile(this.decisionTimes, 0.5), decisionP95Ms: percentile(this.decisionTimes, 0.95), missedDeadlines: this.missed },
    };
  }
}
export type RunReport = ReturnType<ReportBuilder['report']>;

const ms = (value?: number) => value === undefined ? 'n/a' : `${Math.round(value)} ms`;
const table = (header: string[], rows: (string | number | undefined)[][]) =>
  [`| ${header.join(' | ')} |`, `| ${header.map(() => '---').join(' | ')} |`, ...rows.map(row => `| ${row.map(cell => cell ?? '').join(' | ')} |`)];

export function formatReport(r: RunReport): string {
  const lines = [`# Run report: ${r.run ?? 'unknown run'} (${r.station})`, ''];
  lines.push(`Strategy ${r.strategy ?? 'unknown'}${r.policy ? ` (${r.policy})` : ''}${r.commit ? `, commit ${r.commit.slice(0, 7)}` : ''}.`, '');
  const o = r.outcome;
  if (!o) return [...lines, 'No snapshot was recorded, so there is nothing to summarise.'].join('\n');
  lines.push('## Outcome', '', ...table(['Measure', 'Value'], [
    ['Result', o.failed ? `**failed at tick ${o.firstFailureTick}**` : 'survived'],
    ['Last tick / duration', `${o.lastTick} / ${o.duration} (${o.phase})`],
    ['Final health', o.finalHealth], ['Health lost', o.healthLost],
    ['Final inventory', amounts(o.finalInventory)],
    ['Collective success', o.collectiveSuccess === undefined ? 'not reported' : String(o.collectiveSuccess)],
    ['Completed trades', r.trades.length],
    ['Commands sent / results / rejected', `${r.commands.sent} / ${r.commands.results} / ${r.commands.results - r.commands.ok}`],
    ['Run summary record', o.runSummaryWritten ? 'written' : 'missing (worker did not shut down cleanly)'],
  ]), '');

  lines.push('## Resources and health', '');
  if (!r.history.length) lines.push('No tick summaries were recorded.', '');
  else {
    // One row every `step` ticks keeps a 120-tick run readable; JSON output has every tick.
    const step = Math.max(1, Math.ceil(r.history.length / 24));
    const rows = r.history.filter((h, i) => i % step === 0 || i === r.history.length - 1 || resourceNames.some(res => h.unmet[res] > 0));
    lines.push(`Closing stock ${step === 1 ? 'after each tick' : `every ${step} ticks`}, plus every shortage tick.`, '');
    lines.push(...table(['Tick', 'Water', 'Food', 'Components', 'Health', 'Missing'], rows.map(h => [h.tick, h.water, h.food, h.components, h.health,
      resourceNames.filter(res => h.unmet[res] > 0).map(res => `${h.unmet[res]} ${res}`).join(', ')])), '');
  }

  lines.push('## Shortages', '', ...table(['Resource', 'Ticks short', 'Units missing', 'First short', 'Longest streak', 'Lowest stock (tick)'],
    r.shortages.map(x => [x.resource, x.ticksShort, x.unitsMissing, x.firstShortTick, x.longestStreak, x.lowestStock === undefined ? undefined : `${x.lowestStock} (${x.lowestAtTick})`])), '');

  lines.push('## Completed trades', '');
  if (!r.trades.length) lines.push('None.', '');
  else {
    lines.push(...table(['Counterparty', 'Trades', 'We paid', 'We got'], Object.entries(r.partners).map(([id, p]) => [id, p.trades, amounts(p.paid as Record<keyof Bundle, number>), amounts(p.got as Record<keyof Bundle, number>)])), '');
    lines.push(...table(['Tick', 'Counterparty', 'Direction', 'We paid', 'We got', 'Transaction'], r.trades.map(t => [t.tick, t.counterparty, t.outgoing ? 'our offer' : 'we accepted', amounts(t.pay), amounts(t.get), t.transaction])), '');
  }

  lines.push('## Rejected requests', '');
  const rejected = Object.entries(r.rejected);
  if (!rejected.length && !r.controlErrors.length) lines.push('None.', '');
  if (rejected.length) lines.push(...table(['Result', 'Count', 'Examples'], rejected.map(([code, x]) => [code, x.count, x.examples.join('; ')])), '');
  if (r.controlErrors.length) lines.push(`Control errors: ${r.controlErrors.map(e => `code ${e.code}${e.requestId ? ` (request ${e.requestId})` : ''}`).join(', ')}.`, '');

  lines.push('## Disconnected periods', '');
  if (!r.disconnections.length) lines.push('None.', '');
  else lines.push(...table(['From', 'To', 'Duration', 'Ticks missed', 'Close code', 'Cause', 'Reconnect attempts'], r.disconnections.map(d => [
    d.from, d.to ?? 'end of journal', ms(d.durationMs), d.ticksMissed ?? 'unknown', d.closeCode, d.cause ?? '', d.attempts])), '');
  if (r.stale.length) lines.push(`Stale periods: ${r.stale.map(x => `tick ${x.tick} (${x.reason})`).join('; ')}.`, '');

  lines.push('## Responsiveness', '', ...table(['Measure', 'Value'], [
    ['Decisions (of which waits)', `${r.commands.decisions} (${r.commands.waits})`],
    ['Server response median / p95', `${ms(r.responsiveness.responseMedianMs)} / ${ms(r.responsiveness.responseP95Ms)} over ${r.responsiveness.responses} responses`],
    ['Decision time median / p95', `${ms(r.responsiveness.decisionMedianMs)} / ${ms(r.responsiveness.decisionP95Ms)}`],
    ['Missed deadlines (decision / response)', `${r.responsiveness.missedDeadlines.decision} / ${r.responsiveness.missedDeadlines.response}`],
    ['Commands cancelled before sending / uncertain', `${r.commands.cancelled} / ${r.commands.uncertain}`],
  ]), '');

  if (r.failures.length) lines.push('## Failures', '', ...r.failures.map(f => `- ${(f as { category: string }).category} ${(f as { code: string }).code}: ${(f as { message: string }).message}`), '');
  return lines.join('\n');
}
