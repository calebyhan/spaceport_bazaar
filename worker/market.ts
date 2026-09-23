// Market model: what we believe about each station, what we plan to hold, what
// each resource is worth to us, and the terms we ask. Everything is a pure
// function of one authoritative snapshot (which retains every offer and
// transaction involving us), so decisions stay deterministic and replayable.
import { resources, type Bundle, type Config, type Offer, type Resource, type Snapshot } from './types';
import { active, mapBundle, max, min, productionEstimate, total } from './domain';

export const resourceNumber = (r: Resource) => resources.indexOf(r) + 1;
const resourceOf = (n: number): Resource | undefined => resources[n - 1];
const only = (b: Bundle): Resource | undefined => {
  const present = resources.filter(r => b[r] > 0n);
  return present.length === 1 ? present[0] : undefined;
};

// How strongly we believe a station can supply a resource.
export const Evidence = { none: 0, advertised: 1, offered: 2, settled: 3 } as const;
export type EvidenceLevel = typeof Evidence[keyof typeof Evidence];

export interface StationBelief {
  id: string;
  gives: Record<Resource, EvidenceLevel>;
  // Resources the station has recently sought: advertised, asked of us, or
  // accepted from us. Empty means unknown, not "wants nothing".
  wants: Resource[];
  // The resource it has supplied most, if one clearly leads.
  specialty?: Resource;
  proposedToUs: number; ourOffers: number; ourAccepted: number; ourExpired: number;
}
export interface MarketView {
  stations: StationBelief[];
  seekers: Record<Resource, number>;
  // Stations with supply evidence beyond an advertisement, or advertisers that
  // have actually traded with us. Unverified advertisements do not count.
  sellers: Record<Resource, number>;
  // Highest recent ratio of units a peer offered us per unit it asked for
  // (1 when no one bid above par): a live price signal for each resource.
  bids: Record<Resource, number>;
}

const byResource = <T>(fn: (r: Resource) => T) => Object.fromEntries(resources.map(r => [r, fn(r)])) as Record<Resource, T>;

export function observeMarket(s: Snapshot, config: Config, failed: readonly string[] = []): MarketView {
  const self = s.self_station_id;
  const ids = new Set<string>();
  for (const entry of s.directory?.items ?? []) ids.add(entry.station_id);
  for (const ad of s.advertisements.items) ids.add(ad.station_id);
  for (const o of s.offers.items) { ids.add(o.proposer_id); ids.add(o.recipient_id); }
  ids.delete(self);
  // A failed station can never trade again.
  for (const id of failed) ids.delete(id);
  const recent = s.tick - config.ladderWindowTicks;
  const stations = [...ids].sort().map(id => {
    const gives = byResource<EvidenceLevel>(() => Evidence.none);
    const supplied = byResource(() => 0n);
    const wants = new Set<Resource>();
    const raise = (r: Resource, level: EvidenceLevel) => { if (gives[r] < level) gives[r] = level; };
    const ad = s.advertisements.items.find(a => a.station_id === id && active(a.status, a.expires_tick, s.tick));
    for (const n of ad?.selling.items ?? []) { const r = resourceOf(n); if (r) raise(r, Evidence.advertised); }
    for (const n of ad?.seeking.items ?? []) { const r = resourceOf(n); if (r) wants.add(r); }
    let proposedToUs = 0, ourOffers = 0, ourAccepted = 0, ourExpired = 0;
    for (const o of s.offers.items) {
      if (o.proposer_id === id && o.recipient_id === self) {
        proposedToUs++;
        for (const r of resources) {
          if (o.give[r] > 0n) { raise(r, Evidence.offered); supplied[r] += o.give[r]; }
          if (o.receive[r] > 0n && o.created_tick >= recent) wants.add(r);
        }
      } else if (o.proposer_id === self && o.recipient_id === id) {
        ourOffers++;
        if (o.status === 2) {
          ourAccepted++;
          for (const r of resources) {
            if (o.receive[r] > 0n) raise(r, Evidence.settled);
            if (o.give[r] > 0n && o.created_tick >= recent) wants.add(r);
          }
        }
        if (o.status === 4) ourExpired++;
      }
    }
    for (const t of s.transactions.items) {
      const gave = t.proposer_id === id ? t.give : t.recipient_id === id ? t.receive : undefined;
      if (!gave) continue;
      for (const r of resources) if (gave[r] > 0n) { raise(r, Evidence.settled); supplied[r] += gave[r]; }
    }
    const ranked = [...resources].sort((a, b) => supplied[b] > supplied[a] ? 1 : supplied[b] < supplied[a] ? -1 : 0);
    const specialty = supplied[ranked[0]] > supplied[ranked[1]] ? ranked[0] : undefined;
    return { id, gives, wants: resources.filter(r => wants.has(r)), specialty, proposedToUs, ourOffers, ourAccepted, ourExpired };
  });
  const traded = (b: StationBelief) => b.proposedToUs > 0 || b.ourAccepted > 0;
  const bids = byResource(() => 1);
  for (const o of s.offers.items) {
    if (o.recipient_id !== self || !ids.has(o.proposer_id) || o.created_tick < recent) continue;
    const give = only(o.give), ask = only(o.receive);
    if (give && ask) bids[ask] = Math.max(bids[ask], Number(o.give[give]) / Number(o.receive[ask]));
  }
  return {
    stations,
    seekers: byResource(r => stations.filter(b => b.wants.includes(r)).length),
    sellers: byResource(r => stations.filter(b => b.gives[r] > Evidence.advertised || (b.gives[r] === Evidence.advertised && traded(b))).length),
    bids,
  };
}

export interface Plan {
  // Ticks each resource is planned over: the whole remaining run for anything
  // we cannot produce enough of (no one may sell it later), else planTicks.
  horizon: Record<Resource, bigint>;
  // Planning production: the conservative estimate, except that our specialty
  // is assumed to cover its own upkeep before any production is observed.
  production: Bundle;
  supply: Bundle;      // spendable stock plus planned production over its horizon
  own: Bundle;         // upkeep over its horizon
  relay: Bundle;       // units bought only to pay a supplier who wants them
  stockpile: Bundle;   // extra units held because the market is short of them
  target: Bundle;      // own + relay + stockpile
  room: Bundle;        // units still worth acquiring (target - supply, floored at 0)
  // Units we can give away for profit: stock plus production beyond upkeep for
  // the whole remaining run, not just the horizon. A resource we do not
  // produce is only spare if stock alone covers the rest of the run.
  sellable: Bundle;
  seeking: Resource[]; // own or relay needs still unmet
  value: Record<Resource, number>;
  urgent: Resource[];
}

export function plan(s: Snapshot, stock: Bundle, market: MarketView, config: Config): Plan {
  const remaining = max(0n, s.rules.duration_ticks - s.tick);
  const planned = min(config.planTicks, remaining);
  const upkeep = s.self.upkeep_per_tick;
  const estimate = productionEstimate(s);
  const specialty = resourceOf(s.self.specialty);
  const production = mapBundle(r => r === specialty && s.self.produced_total[r] === 0n && s.tick === 0n ? upkeep[r] : estimate[r]);
  // Run-40: holding 40 ticks of water, we bought only upkeep while the one
  // supplier still sold, and nobody sold water later. Buy the whole run early.
  const horizon = byResource(r => production[r] < upkeep[r] ? remaining : planned);
  const supply = mapBundle(r => max(0n, stock[r]) + production[r] * horizon[r]);
  const spare = mapBundle(r => max(0n, max(0n, stock[r]) + (production[r] - upkeep[r]) * remaining));
  const own = mapBundle(r => upkeep[r] * horizon[r]);
  const position = mapBundle(r => supply[r] - own[r]);

  const value = byResource(r => {
    const needed = Number(own[r]);
    const coverage = needed === 0 ? Infinity : Number(supply[r]) / needed;
    const mine = coverage < 1 ? 2 - coverage : Math.max(0.5, 1 - (coverage - 1) / 4);
    const pressure = Math.max(-3, Math.min(3, market.seekers[r] - market.sellers[r]));
    // A peer paying 3:1 for a resource is worth +1; the premium is capped there.
    const bid = Math.min(1, (market.bids[r] - 1) / 2);
    return Math.max(0.1, mine + pressure / 10 + bid);
  });

  // Multi-hop sourcing: if every known supplier of something we need only
  // wants things we cannot spare, acquire one of those to pay them with.
  const relay = mapBundle(() => 0n);
  for (const need of resources) {
    if (position[need] >= 0n) continue;
    const suppliers = market.stations.filter(b => b.gives[need] > Evidence.none);
    if (!suppliers.length) continue;
    const direct = suppliers.some(b => !b.wants.length || b.wants.some(x => x !== need && spare[x] > 0n));
    if (direct) continue;
    const currency = resources.find(z => z !== need && suppliers.some(b => b.wants.includes(z))
      && market.stations.some(b => b.gives[z] > Evidence.none && !suppliers.includes(b)));
    if (!currency) continue;
    relay[currency] += min(config.lot, -position[need]);
    value[currency] = Math.max(value[currency], value[need] * 0.9);
  }

  const scarce = (r: Resource) => market.seekers[r] > market.sellers[r] || market.bids[r] > 1;
  const stockpile = mapBundle(r => scarce(r) ? max(1n, upkeep[r]) * config.stockpileTicks : 0n);
  const target = mapBundle(r => own[r] + relay[r] + stockpile[r]);
  const room = mapBundle(r => max(0n, target[r] - supply[r]));
  const sellable = spare;
  const seeking = resources.filter(r => room[r] > 0n && (position[r] < 0n || relay[r] > 0n));
  const urgent = resources.filter(r => upkeep[r] > estimate[r] && stock[r] / (upkeep[r] - estimate[r]) < config.urgentTicks);
  return { horizon, production, supply, own, relay, stockpile, target, room, sellable, seeking, value, urgent };
}

// Units of a resource we may pay: whole-run spare, plus stock held as relay
// currency. An urgent need may also be paid for with anything the safety
// checks allow, since running out now costs more than running short later.
export function canPay(p: Plan, stock: Bundle, pay: Bundle, gain: Bundle) {
  const urgent = resources.some(r => gain[r] > 0n && p.urgent.includes(r));
  return resources.every(r => pay[r] === 0n || pay[r] <= (urgent ? max(0n, stock[r]) : p.sellable[r] + min(p.relay[r], max(0n, stock[r]))));
}

export const worth = (b: Bundle, p: Plan) => resources.reduce((v, r) => v + Number(b[r]) * p.value[r], 0);

export function premiumLadder(config: Config): bigint[] {
  const levels: bigint[] = [];
  for (let p = config.maxPremiumPct; p > 0n && config.premiumStepPct > 0n; p -= config.premiumStepPct) levels.push(p);
  return [...levels, 0n];
}

// Our single-resource offers to a station for this pair within the window:
// the latest one it accepted (the price that last cleared), and how many have
// expired unanswered since then. Each miss steps the ask down one rung.
export function pairHistory(s: Snapshot, station: string, pay: Resource, gain: Resource, config: Config) {
  const ours = s.offers.items.filter(o => o.proposer_id === s.self_station_id && o.recipient_id === station
    && only(o.give) === pay && only(o.receive) === gain && o.created_tick >= s.tick - config.ladderWindowTicks);
  const cleared = ours.filter(o => o.status === 2).reduce<Offer | undefined>((a, o) => !a || o.created_tick > a.created_tick ? o : a, undefined);
  const since = cleared?.created_tick ?? -1n;
  const missed = ours.filter(o => o.status === 4 && o.created_tick > since);
  return { cleared, misses: missed.length, lastExpiry: missed.reduce((t, o) => max(t, o.expires_tick), -1n) };
}
export const misses = (s: Snapshot, station: string, pay: Resource, gain: Resource, config: Config) =>
  pairHistory(s, station, pay, gain, config).misses;

// premium is the actual whole-percent gain in units received over units given.
export interface Terms { give: Bundle; receive: Bundle; premium: bigint; misses: number; value: number }

// Terms for paying `pay` to receive `gain` from a station. We never receive
// fewer units than we give. The ask opens at par when we urgently need what we
// receive, else at the price that last cleared with this station, else at a
// premium when the station or the market wants what we pay. It steps down one
// rung per unanswered offer. After maxParMisses unanswered par offers it only
// retries at par, every parRetryTicks, and only while we still need the resource.
export function askTerms(s: Snapshot, p: Plan, market: MarketView, station: StationBelief,
  pay: Resource, gain: Resource, config: Config): Terms | undefined {
  const received = p.room[gain] > 0n ? min(config.lot, p.room[gain]) : config.lot;
  // Rungs are the distinct whole-unit payments the premium ladder yields for
  // this lot, cheapest first; small lots collapse neighbouring premiums.
  const rungs = [...new Set(premiumLadder(config).map(pct => max(1n, (received * 100n + 99n + pct) / (100n + pct))))];
  const par = rungs.length - 1;
  const wanted = station.wants.includes(pay) || market.seekers[pay] > market.sellers[pay];
  const { cleared, misses: missed, lastExpiry } = pairHistory(s, station.id, pay, gain, config);
  // The cheapest rung paying at least the cleared ratio of given to received units.
  const clearedRung = cleared ? rungs.findIndex(r => r * cleared.receive[gain] >= received * cleared.give[pay]) : -1;
  const start = p.urgent.includes(gain) ? par : cleared ? (clearedRung < 0 ? par : clearedRung) : wanted ? 0 : Math.min(1, par);
  if (start + missed >= par + Number(config.maxParMisses)) {
    // Run-40: resting 26 ticks on our only water supplier outlasted its stock.
    if (p.room[gain] === 0n || s.tick < lastExpiry + config.parRetryTicks) return undefined;
  }
  const paid = rungs[Math.min(start + missed, par)];
  // Without a need for it, take a resource only at a real premium (brokerage).
  if (p.room[gain] === 0n && paid >= received) return undefined;
  const give = mapBundle(r => r === pay ? paid : 0n), receive = mapBundle(r => r === gain ? received : 0n);
  if (total(receive) < total(give)) return undefined;
  const premium = (received - paid) * 100n / paid;
  return { give, receive, premium, misses: missed, value: worth(receive, p) - worth(give, p) };
}
