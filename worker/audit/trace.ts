// Q5: for one offer (or one request), reconstruct what our client knew, what
// it decided and why, what it sent, and what the server confirmed, using only
// journal records. Every line cites the tick and snapshot sequence it came from.
import type { Action, Bundle, Offer, Result, Snapshot, Transaction } from '../types';
import { json } from '../serialization';
import { amounts, describeAction, offerStatusName, ourTerms, resourceNames, resultName, type Entry, type Journaled } from './journal';

type State = Journaled<Snapshot>;
interface Knew { tick: string; seq: string; inventory: Journaled<Bundle>; health: string }
interface Decision { at?: string; knew?: Knew; rationale: string; action: Journaled<Action>; values?: Record<string, number> }
interface Command { requestId: string; at?: string; action: Journaled<Action>; decision?: Decision; sent?: string; uncertain?: string; cancelled?: string; result?: { at?: string; result: Journaled<Result> } }
interface Verdict { verdict: string; reason: string; value?: number; first: Knew; last: Knew; count: number; requestId?: string }
interface Timeline {
  offer: Journaled<Offer>; firstSeen: { at?: string; tick: string; seq: string };
  changes: { status: number; tick: string; seq: string; at?: string }[];
  settled?: { transaction: Journaled<Transaction>; seq: string; before?: Journaled<Bundle>; after: Journaled<Bundle> };
}
type Explained = { rationale: string; inbound?: Record<string, { verdict: string; reason: string; value?: number }>; plan?: { value?: Record<string, number> } };

export class TraceBuilder {
  private self?: string;
  private state?: State;
  private readonly commands = new Map<string, Command>();
  private readonly decisions = new Map<string, Decision>();
  private lastActionDecision?: Decision;
  private readonly offers = new Map<string, Timeline>();
  private readonly verdicts = new Map<string, Verdict[]>();

  add(entry: Entry) {
    const id = entry.requestId ?? '';
    if (entry.kind === 'manifest') this.self = (entry.payload as { station_id: string }).station_id;
    else if (entry.kind === 'state') this.observe(entry.payload as State, entry.at);
    else if (entry.kind === 'decision') this.decide(entry);
    else if (entry.kind === 'command') {
      const action = (entry.payload as { action: Journaled<Action> }).action;
      // Older journals did not tag decisions with the request ID; the decision
      // immediately before a command with the same action is the one that made it.
      const previous = this.lastActionDecision && json(this.lastActionDecision.action) === json(action) ? this.lastActionDecision : undefined;
      this.commands.set(id, { requestId: id, at: entry.at, action, decision: this.decisions.get(id) ?? previous });
    } else {
      const command = this.commands.get(id);
      if (!command) return;
      if (entry.kind === 'sent') command.sent = entry.at;
      if (entry.kind === 'uncertain') command.uncertain = entry.at;
      if (entry.kind === 'cancelled') command.cancelled = entry.at;
      if (entry.kind === 'result') command.result ??= { at: entry.at, result: entry.payload as Journaled<Result> };
    }
  }

  private knew(): Knew | undefined {
    const s = this.state;
    return s && { tick: s.tick, seq: s.snapshot_sequence, inventory: s.self.inventory, health: s.self.health };
  }

  private observe(s: State, at?: string) {
    const previous = this.state;
    this.state = s; this.self ??= s.self_station_id;
    for (const offer of s.offers.items) {
      const timeline = this.offers.get(offer.offer_id);
      if (!timeline) {
        this.offers.set(offer.offer_id, { offer, firstSeen: { at, tick: s.tick, seq: s.snapshot_sequence }, changes: [{ status: offer.status, tick: s.tick, seq: s.snapshot_sequence, at }] });
      } else if (timeline.changes.at(-1)!.status !== offer.status) {
        timeline.changes.push({ status: offer.status, tick: s.tick, seq: s.snapshot_sequence, at });
        timeline.offer = offer;
      }
    }
    for (const transaction of s.transactions.items) {
      const timeline = this.offers.get(transaction.offer_id);
      if (timeline && !timeline.settled) timeline.settled = { transaction, seq: s.snapshot_sequence, before: previous?.self.inventory, after: s.self.inventory };
    }
  }

  private decide(entry: Entry) {
    const payload = entry.payload as { action: Journaled<Action>; explanation: Explained; source?: string };
    const decision: Decision = { at: entry.at, knew: this.knew(), rationale: payload.explanation.rationale, action: payload.action, values: payload.explanation.plan?.value };
    if (entry.requestId) this.decisions.set(entry.requestId, decision);
    if (payload.action.kind !== 'wait') this.lastActionDecision = decision;
    const s = this.state;
    if (!s) return;
    // Every open offer addressed to us gets a verdict from this decision, even
    // when the policy never evaluated it (the reason then says why not).
    for (const offer of s.offers.items) {
      if (offer.recipient_id !== s.self_station_id || offer.status !== 1 || BigInt(offer.expires_tick) <= BigInt(s.tick)) continue;
      const recorded = payload.explanation.inbound?.[offer.offer_id];
      const verdict = recorded
        ?? (payload.source === 'engine' ? { verdict: 'not evaluated', reason: `the engine waited without asking the strategy: ${payload.explanation.rationale}` }
        : payload.explanation.inbound === undefined ? { verdict: 'unrecorded', reason: `this journal predates per-offer verdicts; the decision chosen was: ${payload.explanation.rationale}` }
        : { verdict: 'not evaluated', reason: `the strategy stopped before evaluating offers: ${payload.explanation.rationale}` });
      const list = this.verdicts.get(offer.offer_id) ?? [];
      const last = list.at(-1), knew = this.knew()!;
      // An accept verdict names the request it produced, if the journal records one.
      const requestId = verdict.verdict === 'accept' ? entry.requestId : undefined;
      if (last && last.verdict === verdict.verdict && last.reason === verdict.reason && last.requestId === requestId) { last.count++; last.last = knew; }
      else list.push({ ...verdict, first: knew, last: knew, count: 1, requestId });
      this.verdicts.set(offer.offer_id, list);
    }
  }

  // Resolves a request trace to the offer it created or acted on, if any.
  offerFor(requestId: string): string | undefined {
    const command = this.commands.get(requestId);
    if (!command) return undefined;
    if (command.action.kind === 'accept') return command.action.body.offer_id;
    if (command.action.kind === 'withdraw' && this.offers.has(command.action.body.object_id)) return command.action.body.object_id;
    if (command.action.kind === 'offer') return command.result?.result.object_id.value;
    return undefined;
  }

  trace(target: { offer?: string; request?: string }) {
    const offerId = target.offer ?? this.offerFor(target.request!);
    const timeline = offerId === undefined ? undefined : this.offers.get(offerId);
    const related = [...this.commands.values()].filter(c => c.requestId === target.request || (offerId !== undefined && (
      (c.action.kind === 'accept' && c.action.body.offer_id === offerId) || (c.action.kind === 'withdraw' && c.action.body.object_id === offerId)
      || (c.action.kind === 'offer' && c.result?.result.object_id.value === offerId))));
    const verdicts = (offerId === undefined ? [] : this.verdicts.get(offerId) ?? []).map(v => ({ ...v, unsent: v.requestId !== undefined && !this.commands.has(v.requestId) }));
    return { self: this.self, offerId, timeline, verdicts, commands: related, found: Boolean(timeline || related.length) };
  }
}
export type Trace = ReturnType<TraceBuilder['trace']>;

const at = (knew: Knew) => `tick ${knew.tick} (snapshot ${knew.seq})`;
const stock = (b: Journaled<Bundle>) => resourceNames.map(r => `${b[r]} ${r}`).join(', ');
const MAX_VERDICT_LINES = 12;
export function formatTrace(t: Trace, target: string): string {
  if (!t.found) return `Nothing in this journal refers to ${target}.`;
  const lines: string[] = [];
  if (t.timeline) {
    const o = t.timeline.offer, terms = ourTerms(o, t.self!);
    lines.push(`Offer ${o.offer_id}: ${o.proposer_id} -> ${o.recipient_id} (${terms.outgoing ? 'our proposal' : 'incoming'}): we pay ${amounts(terms.pay)}, get ${amounts(terms.get)}; expires tick ${o.expires_tick}`);
    lines.push(`  First seen at tick ${t.timeline.firstSeen.tick} (snapshot ${t.timeline.firstSeen.seq}) as ${offerStatusName(t.timeline.changes[0].status)}`);
  } else if (t.offerId) lines.push(`Offer ${t.offerId}: never appeared in a recorded snapshot.`);

  // Our own proposals are decided once, and that decision is shown with its command.
  if (t.verdicts.length || !t.commands.some(c => c.decision)) lines.push('', 'What we knew and decided');
  for (const v of t.verdicts.slice(0, MAX_VERDICT_LINES)) {
    const span = v.count > 1 ? `${at(v.first)} to tick ${v.last.tick}, ${v.count} decisions` : at(v.first);
    lines.push(`  ${span}: ${v.verdict.toUpperCase()}: ${v.reason}${v.value === undefined ? '' : ` (value ${v.value.toFixed(2)})`}${v.unsent ? '; superseded before sending (a new state or result arrived)' : ''}`);
    lines.push(`    knew: inventory ${stock(v.first.inventory)}; health ${v.first.health}`);
  }
  if (t.verdicts.length > MAX_VERDICT_LINES) lines.push(`  ... ${t.verdicts.length - MAX_VERDICT_LINES} more verdict changes`);
  if (!t.verdicts.length && !t.commands.some(c => c.decision)) lines.push('  No decision was made while it was open to us.');

  lines.push('', 'What we sent');
  if (!t.commands.length) lines.push('  No command referred to it.');
  for (const c of t.commands) {
    const d = c.decision;
    lines.push(`  request ${c.requestId}: ${describeAction(c.action)}`);
    if (d) {
      lines.push(`    decided ${d.knew ? `at ${at(d.knew)}` : 'before any snapshot'}: ${d.rationale}`);
      if (d.knew) lines.push(`    knew: inventory ${stock(d.knew.inventory)}; health ${d.knew.health}`);
      if (d.values) lines.push(`    plan values: ${resourceNames.map(r => `${r} ${d.values![r].toFixed(2)}`).join(', ')}`);
    }
    lines.push(`    ${c.cancelled ? `cancelled before sending at ${c.cancelled}` : c.sent ? `sent at ${c.sent}` : 'recorded but not confirmed sent'}${c.uncertain ? `; no result after 2 s, sync requested at ${c.uncertain}` : ''}`);
    if (c.result) {
      const r = c.result.result;
      const lag = d?.knew ? Number(r.processed_tick) - Number(d.knew.tick) : 0;
      lines.push(`    server result: ${r.ok ? 'OK' : `REJECTED ${resultName(r.code)}`} at tick ${r.processed_tick} (world version ${r.processed_version})${r.object_id.value ? `, object ${r.object_id.value}` : ''}${r.transaction_id.value ? `, transaction ${r.transaction_id.value}` : ''}`
        + (lag > 0 ? `; processed ${lag} tick${lag === 1 ? '' : 's'} after the decision` : ''));
    } else if (!c.cancelled) lines.push('    server result: none recorded');
  }

  if (t.timeline) {
    lines.push('', 'What the server confirmed');
    for (const change of t.timeline.changes.slice(1)) lines.push(`  tick ${change.tick} (snapshot ${change.seq}): ${offerStatusName(change.status)}`);
    const settled = t.timeline.settled;
    if (settled) {
      lines.push(`  transaction ${settled.transaction.transaction_id} settled at tick ${settled.transaction.settled_tick} (snapshot ${settled.seq})`);
      lines.push(`  inventory ${settled.before ? `${stock(settled.before)} in the previous snapshot` : '(no earlier snapshot)'} -> ${stock(settled.after)} in the confirming snapshot (includes any tick in between)`);
    }
    const final = t.timeline.changes.at(-1)!;
    lines.push(`  Final status: ${offerStatusName(final.status)}${t.timeline.offer.closed_tick.value ? ` at tick ${t.timeline.offer.closed_tick.value}` : ''}`);
  }
  return lines.join('\n');
}
