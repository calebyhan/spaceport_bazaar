import { cooperativePlan, deliveries, donationSpare, type SurvivalProfile } from './cooperation';
import { type Action, type Bundle, type Command, type Snapshot, type Pending, type Memory, type Config, type Resource, resources } from './types';
import { active, add, type Forecast, forecast, liabilityTotal, liabilities, mapBundle, max, min, productionEstimate, reserve, spendable, subtract, total, tradeSafety, zero } from './domain';
import { askTerms, canPay, observeMarket, plan, resourceNumber, worth } from './market';
import { json } from './serialization';
export { json } from './serialization';
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
// Value differences smaller than this are rounding noise, not a reason to trade.
const EPSILON = 0.01;
const milli = (v: number) => BigInt(Math.round(v * 1000));
// Tie-break order among otherwise equal outcomes. A helping accept ties with
// an offer, so any offer of real value to us still ranks first; a giveaway
// ranks below everything but waiting, so it only uses spare commands.
const Kind = { withdraw: 6n, gift: 4n, exchange: 2n, offer: 0n, help: 0n, advertise: -2n, giveaway: -3n, wait: -4n } as const;
// Generous mode at most keeps this many giveaways open, one per station.
const MAX_OPEN_GIFTS = 2;
// Generous trading asks only at par; accepts safe par offers paid from
// whole-run spare that do not raise our plan value; and gives true surplus
// away free to stations that seek it. Every trade stays at or above par.
export interface Leniency { generous?: boolean; cooperative?: SurvivalProfile }
export function decide(s: Snapshot, pending: Pending[], memory: Memory, config: Config, { generous = false, cooperative }: Leniency = {}) {
  if (generous) config = { ...config, maxPremiumPct: 0n };
  const stock = spendable(s, pending), safety = reserve(s, config);
  const base = forecast(s, stock);
  const commitments = liabilities(s, pending);
  const market = observeMarket(s, config, memory.failed);
  const originalPlan = plan(s, stock, market, config);
  const p = cooperative ? cooperativePlan(s, stock, originalPlan, config) : originalPlan;
  const served = cooperative ? deliveries(s, config.planTicks) : new Map<string, bigint>();
  const giftSpare = cooperative ? donationSpare(s, stock, config) : mapBundle(r => p.sellable[r] - max(1n, s.self.upkeep_per_tick[r]) * config.stockpileTicks);
  const committedPeers = new Set([
    ...s.offers.items.filter(o => o.proposer_id === s.self_station_id && active(o.status, o.expires_tick, s.tick)).map(o => o.recipient_id),
    ...pending.flatMap(q => q.action.kind === 'offer' ? [q.action.body.recipient_id] : []),
  ]);
  // Why each open inbound offer was or was not taken, for per-offer audits.
  const inbound: Record<string, { verdict: 'accept' | 'pass'; reason: string; value?: number }> = {};
  const explanation = { cooperative, policyVersion: config.version, config, generous, input: { run: s.run_id, sequence: s.snapshot_sequence, version: s.world_version, tick: s.tick }, commitments, reserve: safety, forecast: base, plan: p, market, inbound, rationale: '' };
  const wait = (reason: string) => ({ action: { kind: 'wait' } as Action, nextMemory: memory, explanation: { ...explanation, rationale: reason } });
  if (s.phase !== 2 || s.self.failed_once || s.self.health === 0n || s.tick >= s.rules.duration_ticks) return wait('Phase or permanent failure prohibits trading.');
  if (BigInt(pending.length) >= config.maxInFlight) return wait('Every in-flight slot awaits an authoritative result.');
  // Never send an action again while an identical one awaits its result.
  const inFlight = new Set(pending.map(p => fingerprint(p.action)));
  const advertising = pending.some(p => p.action.kind === 'advertise');
  const survival = (f: Forecast) => [f.failureTick ?? s.rules.duration_ticks + 1n, f.points.reduce((v, pt) => min(v, pt.health), s.self.health), -f.damage];
  const candidates: { action: Command; rank: bigint[]; rationale: string }[] = [];
  // Ordered constraints, never a weighted sum: survival (failure tick, minimum
  // health, damage) dominates, then value realized now, action kind, value we
  // only hope to realize, and finally the evidence behind that hope.
  // Returns why an action was filtered out, or nothing when it is ranked.
  const addCandidate = (action: Command, after: Forecast, realized: number, kind: bigint, evidence: bigint, expected: number, rationale: string) => {
    const urgent = action.kind === 'accept' || action.kind === 'withdraw';
    if (!capacity(s, pending, urgent)) return 'no command capacity left this tick';
    const key = fingerprint(action);
    if (inFlight.has(key)) return 'an identical command is already awaiting its result';
    const last = memory.attempted[key];
    if (last !== undefined && s.tick < last && !lastAccepted(s, action)) return 'cooling down after an identical attempt';
    const fairness = action.kind === 'offer' ? -(served.get(action.body.recipient_id) ?? 0n) : 0n;
    candidates.push({ action, rank: [...survival(after), milli(realized), kind, fairness, milli(expected), evidence], rationale });
  };

  // Withdraw our offers that live production and upkeep have made unsafe.
  for (const o of s.offers.items) {
    if (o.proposer_id !== s.self_station_id || !active(o.status, o.expires_tick, s.tick)) continue;
    // Withdrawal only changes the forecast if it wins; keep accounting for a losing race.
    const withoutThis = { ...s, offers: { items: s.offers.items.filter(other => other.offer_id !== o.offer_id) } };
    if (!outgoingSafe(withoutThis, pending, o.give, o.receive, o.expires_tick, config)) {
      addCandidate({ kind: 'withdraw', body: { object_id: o.offer_id } }, forecast(s, add(stock, o.give)), 0, Kind.withdraw, 0n, 0, 'Withdraw a liability that breaches the current reserve; retain it until confirmed.');
    }
  }

  // Accept any safe inbound offer at or above par that raises what our
  // inventory is worth. Survival is the filter, value is the reason.
  for (const o of s.offers.items) {
    if (o.recipient_id !== s.self_station_id || !active(o.status, o.expires_tick, s.tick)) continue;
    const pay = o.receive, gain = o.give;
    const pass = (reason: string, value?: number) => { inbound[o.offer_id] = { verdict: 'pass', reason, value }; };
    if (total(gain) < total(pay)) { pass('below par: we would receive fewer units than we give'); continue; }
    const gift = total(pay) === 0n;
    // Free units we have no room for only tie up a command slot. Stock under
    // urgentTicks of upkeep is always worth topping up: the plan counts on
    // production that may not come.
    const needed = (r: Resource) => p.room[r] > 0n || stock[r] < s.self.upkeep_per_tick[r] * config.urgentTicks;
    if (gift && !resources.some(r => gain[r] > 0n && needed(r))) { pass('a gift of nothing our plan still needs'); continue; }
    const gained = worth(gain, p) - worth(pay, p);
    const helping = gained <= EPSILON;
    if (helping && !generous) { pass('no value gain at current plan values', gained); continue; }
    const check = tradeSafety(s, pending, pay, gain, config);
    if (!check.safe) { pass(check.belowReserve ? 'unsafe: we are below reserve and it would lower forecast health' : 'unsafe: it would breach the reserve or bring failure earlier', gained); continue; }
    if (!canPay(p, stock, pay, gain)) { pass('pays with resources the plan cannot spare', gained); continue; }
    // A helping accept realizes nothing for us, so it never outranks value.
    pass(addCandidate({ kind: 'accept', body: { offer_id: o.offer_id } }, check.after, helping ? 0 : gained, gift ? Kind.gift : helping ? Kind.help : Kind.exchange, 0n, 0,
      gift ? 'Accept a safe inbound gift.' : helping ? `Accept a safe par exchange paid from spare stock; it helps the proposer (worth ${gained.toFixed(2)} to us).`
        : `Accept an at-or-above-par exchange worth ${gained.toFixed(2)} to us.`) ?? (helping ? 'safe and helpful, but ranked below the chosen action' : 'safe and valuable, but ranked below the chosen action'), gained);
  }

  // Propose to every station with evidence it supplies what we want, paying
  // with something it wants (or anything, if its wants are unknown).
  // Offers must still be alive once the lagging server processes them.
  const expiry = min(s.rules.duration_ticks, s.tick + min(config.ttl + (memory.lag ?? 0n), s.rules.max_offer_ttl_ticks));
  const openLimit = min(config.maxOpenOffers, s.rules.max_open_outgoing_offers);
  if (BigInt(commitments.length) < openLimit && expiry > s.tick) {
    // One open ask per station and resource: let the ladder, not duplicates, find the price.
    const asked = new Set([
      ...s.offers.items.filter(o => o.proposer_id === s.self_station_id && active(o.status, o.expires_tick, s.tick)),
      ...pending.flatMap(q => q.action.kind === 'offer' ? [q.action.body] : []),
    ].flatMap(o => resources.filter(r => o.receive[r] > 0n).map(r => `${o.recipient_id}:${r}`)));
    for (const station of market.stations) {
      if (cooperative && committedPeers.has(station.id)) continue;
      for (const gain of resources) {
        if (!station.gives[gain] || asked.has(`${station.id}:${gain}`)) continue;
        for (const pay of resources) {
          if (pay === gain || (station.wants.length && !station.wants.includes(pay))) continue;
          const terms = askTerms(s, p, market, station, pay, gain, config);
          if (!terms || terms.value <= EPSILON || !canPay(p, stock, terms.give, terms.receive)) continue;
          if (!outgoingSafe(s, pending, terms.give, terms.receive, expiry, config)) continue;
          const action: Command = { kind: 'offer', body: { recipient_id: station.id, give: terms.give, receive: terms.receive, expires_tick: expiry } };
          // Rank an unaccepted proposal by WAIT, never by hoped-for incoming stock.
          addCandidate(action, base, 0, Kind.offer, BigInt(station.gives[gain]), terms.value,
            `Offer ${terms.give[pay]} ${pay} for ${terms.receive[gain]} ${gain} to ${station.id} at ${terms.premium}% premium (${terms.misses} unanswered); safe at every settlement tick, receipt unguaranteed.`);
        }
      }
    }
  }

  // Giveaways: only once the plan is fully covered, with nothing left to
  // acquire. Before that our surplus is the currency we buy needs with: in
  // simulation, free water to stations that sold us components starved us of
  // components. Then whole-run spare beyond a stockpile buffer goes, in small
  // lots, to stations that seek it and that we are not already gifting; a
  // station whose wants are unknown gets nothing. Ranked by the worst case,
  // that it is accepted, and weakest-looking (most needs) first.
  if (generous && resources.every(r => p.room[r] === 0n) && BigInt(commitments.length) < openLimit && expiry > s.tick) {
    const gifting = new Set([
      ...s.offers.items.filter(o => o.proposer_id === s.self_station_id && active(o.status, o.expires_tick, s.tick)),
      ...pending.flatMap(q => q.action.kind === 'offer' ? [q.action.body] : []),
    ].filter(o => total(o.receive) === 0n).map(o => o.recipient_id));
    for (const station of gifting.size < MAX_OPEN_GIFTS ? market.stations : []) {
      if (gifting.has(station.id) || (cooperative && committedPeers.has(station.id))) continue;
      for (const r of station.wants) {
        const amount = min(config.lot, giftSpare[r]);
        if (amount <= 0n) continue;
        const give = mapBundle(x => x === r ? amount : 0n);
        if (!outgoingSafe(s, pending, give, zero(), expiry, config)) continue;
        addCandidate({ kind: 'offer', body: { recipient_id: station.id, give, receive: zero(), expires_tick: expiry } }, forecast(s, subtract(stock, give)), 0, Kind.giveaway, BigInt(station.wants.length), 0,
          `Give ${amount} ${r} free to ${station.id}, which seeks it: surplus beyond our whole-run needs and buffer.`);
      }
    }
  }

  // The advertisement states what the plan will actually trade: resources
  // beyond our own and relay needs, and needs we have not covered.
  const selling = resources.filter(r => p.sellable[r] > 0n).map(resourceNumber);
  const seeking = p.seeking.map(resourceNumber);
  const ownAd = s.advertisements.items.find(a => a.station_id === s.self_station_id && active(a.status, a.expires_tick, s.tick));
  const adExpiry = min(s.rules.duration_ticks, s.tick + min(config.adTtl, s.rules.max_publication_ttl_ticks));
  if (advertising) {
    // The pending advertisement already replaces ours; wait for its result.
  } else if (!selling.length && !seeking.length && ownAd) {
    addCandidate({ kind: 'withdraw', body: { object_id: ownAd.advertisement_id } }, base, 0, Kind.advertise, 0n, 0, 'Remove a stale market signal.');
  } else if (adExpiry > s.tick && (selling.length || seeking.length) && (!ownAd || json(ownAd.selling.items) !== json(selling) || json(ownAd.seeking.items) !== json(seeking))) {
    addCandidate({ kind: 'advertise', body: { selling: { items: selling }, seeking: { items: seeking }, expires_tick: adExpiry } }, base, 0, Kind.advertise, 0n, 0, 'Update the single advertisement to the current plan.');
  }

  candidates.sort((a, b) => {
    for (let i = 0; i < a.rank.length; i++) if (a.rank[i] !== b.rank[i]) return a.rank[i] > b.rank[i] ? -1 : 1;
    return fingerprint(a.action) < fingerprint(b.action) ? -1 : 1;
  });
  const waitRank = [...survival(base), 0n, Kind.wait, 0n, 0n, 0n];
  // No candidate carries the wait kind, so every rank differs from waitRank somewhere.
  const best = candidates.find(candidate => {
    const i = candidate.rank.findIndex((value, j) => value !== waitRank[j]);
    return candidate.rank[i] > waitRank[i];
  });
  if (!best) return wait('Wait: no safe, valuable action within capacity and cooldown limits.');
  if (best.action.kind === 'accept') inbound[best.action.body.offer_id] = { ...inbound[best.action.body.offer_id], verdict: 'accept', reason: best.rationale };
  const until = (best.action.kind === 'offer' ? best.action.body.expires_tick : s.tick) + config.cooldownTicks;
  return { action: best.action as Action, nextMemory: { ...memory, attempted: { ...memory.attempted, [fingerprint(best.action)]: until } }, explanation: { ...explanation, rationale: best.rationale } };
}
// Exported for audit tools without duplicating commitment arithmetic.
export const commitmentBundle = (s: Snapshot, p: Pending[]) => liabilityTotal(liabilities(s, p));
export const missingBundle = (s: Snapshot, p: Pending[], c: Config) => mapBundle(r => max(0n, reserve(s, c)[r] - spendable(s, p)[r]));

// Cooldowns stop us repeating terms nobody took. Terms that were just
// accepted are the price that clears, so repeating them is the point.
function lastAccepted(s: Snapshot, action: Command) {
  if (action.kind !== 'offer') return false;
  const same = s.offers.items.filter(o => o.proposer_id === s.self_station_id && o.recipient_id === action.body.recipient_id
    && resources.every(r => o.give[r] === action.body.give[r] && o.receive[r] === action.body.receive[r]));
  const latest = same.reduce<typeof same[number] | undefined>((a, o) => !a || o.created_tick > a.created_tick ? o : a, undefined);
  return latest?.status === 2;
}
function outgoingSafe(s: Snapshot, pending: Pending[], pay: Bundle, gain: Bundle, expiry: bigint, config: Config) {
  const stock = spendable(s, pending), production = productionEstimate(s);
  const protectedTicks = min(s.rules.duration_ticks - s.tick, config.reserveTicks + expiry - s.tick - 1n);
  if (resources.some(r => pay[r] > 0n && stock[r] - pay[r] + production[r] * protectedTicks < s.self.upkeep_per_tick[r] * protectedTicks)) return false;
  for (let t = s.tick; t < expiry; t++) if (!tradeSafety(s, pending, pay, gain, config, t).safe) return false;
  return true;
}
