import { type Action, type Command, type Snapshot, type Pending, type Memory, type Config, resources } from './types';
import { active, add, deficit, forecast, liabilityTotal, liabilities, mapBundle, max, min, reserve, spendable, subtract, total, tradeSafety, zero } from './domain';
export const json = (value: unknown) => JSON.stringify(value, (_, v) => typeof v === 'bigint' ? v.toString() : v);
export function fingerprint(action: Action): string {
  if (action.kind === 'offer' || action.kind === 'advertise') {
    const { expires_tick: expiry, ...terms } = action.body;
    void expiry;
    return json({ kind: action.kind, body: terms });
  }
  return json(action);
}
export function capacity(s: Snapshot, pending: Pending[], urgent: boolean): boolean {
  const used = s.request_results.items.filter(r => r.processed_tick === s.tick).length;
  const unrecorded = pending.filter(p => !s.request_results.items.some(r => r.request_id === p.requestId));
  const slots = s.rules.new_commands_per_station_per_tick - BigInt(used + unrecorded.filter(p => p.tick === s.tick).length);
  const records = s.rules.max_request_records_per_station - BigInt(s.request_results.items.length + unrecorded.length);
  const keep = urgent ? 0n : 1n;
  return slots > keep && records > keep;
}
export function decide(s: Snapshot, pending: Pending[], memory: Memory, config: Config) {
  const stock = spendable(s, pending), target = reserve(s, config);
  const base = forecast(s, stock);
  const commitments = liabilities(s, pending);
  const explanation = { policyVersion: config.version, config, input: { run: s.run_id, sequence: s.snapshot_sequence, version: s.world_version, tick: s.tick }, commitments, reserve: target, forecast: base, rationale: '' };
  const wait = (reason: string) => ({ action: { kind: 'wait' } as Action, nextMemory: memory, explanation: { ...explanation, rationale: reason } });
  if (s.phase !== 2 || s.self.failed_once || s.self.health === 0n || s.tick >= s.rules.duration_ticks) return wait('Phase or permanent failure prohibits trading.');
  if (pending.length) return wait('Reconcile the outstanding command before replacing it.');
  const candidates: { action: Command; rank: bigint[]; rationale: string }[] = [];
  const addCandidate = (action: Command, after: ReturnType<typeof forecast>, remainingDeficit: bigint, urgency: bigint, rationale: string) => {
    const urgent = action.kind === 'accept' || action.kind === 'withdraw';
    if (!capacity(s, pending, urgent)) return;
    const last = memory.attempted[fingerprint(action)];
    if (last !== undefined && s.tick < last) return;
    // Ordered constraints, never a weighted sum. Survival dominates health,
    // then reserve shortage, urgency, and finally canonical action text.
    candidates.push({ action, rank: [after.failureTick ?? s.rules.duration_ticks + 1n,
      after.points.reduce((v, p) => min(v, p.health), s.self.health), -after.damage,
      -remainingDeficit, urgency], rationale });
  };
  for (const o of s.offers.items) {
    if (!active(o.status, o.expires_tick, s.tick)) continue;
    if (o.proposer_id === s.self_station_id) {
      // Live production/upkeep can make yesterday's promise unsafe. Withdrawal
      // only changes the forecast if it wins; keep accounting for a losing race.
      const withoutThis = { ...s, offers: { items: s.offers.items.filter(other => other.offer_id !== o.offer_id) } };
      if (!outgoingSafe(withoutThis, pending, o.give, o.receive, o.expires_tick, config)) {
        const released = add(stock, o.give);
        addCandidate({ kind: 'withdraw', body: { object_id: o.offer_id } }, forecast(s, released), deficit(released, target), 3n, 'Withdraw a liability that breaches the current reserve; retain it until confirmed.');
      }
    } else if (o.recipient_id === s.self_station_id) {
      const check = tradeSafety(s, pending, o.receive, o.give, config);
      const next = add(subtract(stock, o.receive), o.give);
      const useful = deficit(next, target) < deficit(stock, target) || check.after.damage < base.damage;
      if (check.safe && useful) addCandidate({ kind: 'accept', body: { offer_id: o.offer_id } }, check.after, deficit(next, target), total(o.receive) === 0n ? 2n : 1n, total(o.receive) === 0n ? 'Accept a useful inbound gift.' : check.belowReserve ? 'Emergency exchange improves every affected health forecast without earlier failure.' : 'Affordable exchange improves a shortage and preserves reserve.');
    }
  }
  const needs = resources.filter(r => stock[r] < target[r]).sort((a, b) => {
    const aTick = s.self.upkeep_per_tick[a] ? max(0n, stock[a]) / s.self.upkeep_per_tick[a] : s.rules.duration_ticks;
    const bTick = s.self.upkeep_per_tick[b] ? max(0n, stock[b]) / s.self.upkeep_per_tick[b] : s.rules.duration_ticks;
    return aTick < bTick ? -1 : aTick > bTick ? 1 : resources.indexOf(a) - resources.indexOf(b);
  });
  const expiry = min(s.rules.duration_ticks, s.tick + min(config.ttl, s.rules.max_offer_ttl_ticks));
  const openOfferRoom = BigInt(commitments.length) < min(config.maxOpenOffers, s.rules.max_open_outgoing_offers);
  if (needs.length && openOfferRoom && s.rules.max_open_outgoing_offers > 0n && expiry > s.tick) {
    const need = needs[0];
    for (const ad of s.advertisements.items) {
      if (ad.station_id === s.self_station_id || !active(ad.status, ad.expires_tick, s.tick) || !ad.selling.items.includes(resources.indexOf(need) + 1)) continue;
      for (const sell of resources) {
        if (sell === need || !ad.seeking.items.includes(resources.indexOf(sell) + 1)) continue;
        const pay = { ...zero(), [sell]: config.quantity * config.giveUnits };
        const gain = { ...zero(), [need]: config.quantity * config.receiveUnits };
        // Reserve the selling resource through the last possible acceptance,
        // including the next reserve window. Incoming stock is never committed.
        if (!outgoingSafe(s, pending, pay, gain, expiry, config)) continue;
        const action: Command = { kind: 'offer', body: { recipient_id: ad.station_id, give: pay, receive: gain, expires_tick: expiry } };
        // Rank an unaccepted proposal by WAIT, never by hoped-for incoming stock.
        addCandidate(action, base, deficit(stock, target), 0n, `Offer verified ${sell} surplus to an advertised ${need} supplier; safe at every possible settlement tick, receipt unguaranteed.`);
      }
    }
  }
  const selling = resources.filter(r => stock[r] - target[r] >= config.quantity * config.giveUnits).map(r => resources.indexOf(r) + 1);
  const seeking = needs.map(r => resources.indexOf(r) + 1).sort();
  const ownAd = s.advertisements.items.find(a => a.station_id === s.self_station_id && active(a.status, a.expires_tick, s.tick));
  const adExpiry = min(s.rules.duration_ticks, s.tick + min(config.ttl, s.rules.max_publication_ttl_ticks));
  if (!selling.length && !seeking.length && ownAd) {
    addCandidate({ kind: 'withdraw', body: { object_id: ownAd.advertisement_id } }, base, deficit(stock, target), -1n, 'Remove a stale market signal.');
  } else if (adExpiry > s.tick && (selling.length || seeking.length) && (!ownAd || json(ownAd.selling.items) !== json(selling) || json(ownAd.seeking.items) !== json(seeking))) {
    addCandidate({ kind: 'advertise', body: { selling: { items: selling }, seeking: { items: seeking }, expires_tick: adExpiry } }, base, deficit(stock, target), -1n, 'Update the single advertisement to current needs and safe supply.');
  }
  candidates.sort((a, b) => {
    for (let i = 0; i < a.rank.length; i++) if (a.rank[i] !== b.rank[i]) return a.rank[i] > b.rank[i] ? -1 : 1;
    return fingerprint(a.action) < fingerprint(b.action) ? -1 : 1;
  });
  const waitRank = [base.failureTick ?? s.rules.duration_ticks + 1n, base.points.reduce((v, p) => min(v, p.health), s.self.health), -base.damage, -deficit(stock, target), -2n];
  const best = candidates.find(candidate => {
    for (let i = 0; i < waitRank.length; i++) if (candidate.rank[i] !== waitRank[i]) return candidate.rank[i] > waitRank[i];
    return false;
  });
  if (!best) return wait('Wait: no safe useful action within capacity and cooldown limits.');
  const until = (best.action.kind === 'offer' ? best.action.body.expires_tick : s.tick) + config.cooldownTicks;
  return { action: best.action as Action, nextMemory: { attempted: { ...memory.attempted, [fingerprint(best.action)]: until } }, explanation: { ...explanation, rationale: best.rationale } };
}
// Exported for audit tools without duplicating commitment arithmetic.
export const commitmentBundle = (s: Snapshot, p: Pending[]) => liabilityTotal(liabilities(s, p));
export const missingBundle = (s: Snapshot, p: Pending[], c: Config) => mapBundle(r => max(0n, reserve(s, c)[r] - spendable(s, p)[r]));

function outgoingSafe(s: Snapshot, pending: Pending[], pay: import('./types').Bundle, gain: import('./types').Bundle, expiry: bigint, config: Config) {
  const stock = spendable(s, pending);
  const protectedTicks = min(s.rules.duration_ticks - s.tick, config.reserveTicks + expiry - s.tick - 1n);
  if (resources.some(r => pay[r] > 0n && stock[r] - pay[r] < s.self.upkeep_per_tick[r] * protectedTicks)) return false;
  for (let t = s.tick; t < expiry; t++) if (!tradeSafety(s, pending, pay, gain, config, t).safe) return false;
  return true;
}
