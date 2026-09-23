import { type Action, type Bundle, type Command, type Snapshot, type Pending, type Memory, type Config, resources } from './types';
import { active, add, type Forecast, forecast, liabilityTotal, liabilities, mapBundle, max, min, productionEstimate, reserve, spendable, total, tradeSafety } from './domain';
import { askTerms, canPay, observeMarket, plan, resourceNumber, worth } from './market';
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
// Value differences smaller than this are rounding noise, not a reason to trade.
const EPSILON = 0.01;
const milli = (v: number) => BigInt(Math.round(v * 1000));
// Tie-break order among otherwise equal outcomes.
const Kind = { withdraw: 3n, gift: 2n, exchange: 1n, offer: 0n, advertise: -1n, wait: -2n } as const;
export function decide(s: Snapshot, pending: Pending[], memory: Memory, config: Config) {
  const stock = spendable(s, pending), safety = reserve(s, config);
  const base = forecast(s, stock);
  const commitments = liabilities(s, pending);
  const market = observeMarket(s, config, memory.failed);
  const p = plan(s, stock, market, config);
  const explanation = { policyVersion: config.version, config, input: { run: s.run_id, sequence: s.snapshot_sequence, version: s.world_version, tick: s.tick }, commitments, reserve: safety, forecast: base, plan: p, market, rationale: '' };
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
  const addCandidate = (action: Command, after: Forecast, realized: number, kind: bigint, evidence: bigint, expected: number, rationale: string) => {
    const urgent = action.kind === 'accept' || action.kind === 'withdraw';
    if (!capacity(s, pending, urgent)) return;
    const key = fingerprint(action);
    if (inFlight.has(key)) return;
    const last = memory.attempted[key];
    if (last !== undefined && s.tick < last && !lastAccepted(s, action)) return;
    candidates.push({ action, rank: [...survival(after), milli(realized), kind, milli(expected), evidence], rationale });
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
    if (total(gain) < total(pay)) continue;
    const gained = worth(gain, p) - worth(pay, p);
    if (gained <= EPSILON) continue;
    const check = tradeSafety(s, pending, pay, gain, config);
    if (!check.safe) continue;
    if (!canPay(p, stock, pay, gain)) continue;
    const gift = total(pay) === 0n;
    addCandidate({ kind: 'accept', body: { offer_id: o.offer_id } }, check.after, gained, gift ? Kind.gift : Kind.exchange, 0n, 0,
      gift ? 'Accept a safe inbound gift.' : `Accept an at-or-above-par exchange worth ${gained.toFixed(2)} to us.`);
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
  const waitRank = [...survival(base), 0n, Kind.wait, 0n, 0n];
  const best = candidates.find(candidate => {
    for (let i = 0; i < waitRank.length; i++) if (candidate.rank[i] !== waitRank[i]) return candidate.rank[i] > waitRank[i];
    return false;
  });
  if (!best) return wait('Wait: no safe, valuable action within capacity and cooldown limits.');
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
