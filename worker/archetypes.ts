// Simple, explainable opponents that give simulations a mixed field. They are
// modelled on the archetypes in scripts/explore-market.mjs and are not our
// trading strategy. Each keeps one command in flight, advertises its
// specialty and needs, accepts offers at its price that keep its reserve, and
// (unless passive) proposes fixed lots to advertised sellers of its top need.
import type { Decision, Policy } from './strategy-contract';
import { resources, type Resource } from './types';
import { active, spendable, total } from './domain';

export interface Archetype {
  name: string;
  reserveTicks: bigint;  // stock floor, in ticks of upkeep, that it never pays below
  needTicks: bigint;     // a non-specialty below this many ticks of upkeep is a need
  acceptRatio: bigint;   // accepts only when units received >= ratio x units paid
  askRatio: bigint;      // proposes `lot` of its specialty for lot x ratio of a need
  lot: bigint;
  proposes: boolean;
  ttl: bigint;
}
const MAX_OPEN_OFFERS = 3;

export function archetype(p: Archetype): Policy {
  return ({ snapshot: s, pending, memory }) => {
    const inbound: Record<string, { verdict: 'accept' | 'pass'; reason: string }> = {};
    const decision = (action: Decision['action'], rationale: string): Decision => ({ action, nextMemory: memory, explanation: { policyVersion: p.name, rationale, inbound } });
    if (s.phase !== 2 || s.self.failed_once) return decision({ kind: 'wait' }, 'The run is not trading for us.');
    if (pending.length) return decision({ kind: 'wait' }, 'One command at a time: waiting for its result.');
    const stock = spendable(s, pending), upkeep = s.self.upkeep_per_tick, self = s.self_station_id;
    const specialty = resources[s.self.specialty - 1];
    const floor = (r: Resource) => upkeep[r] * p.reserveTicks;
    // Most urgent first: lowest stock; ties keep resource order.
    const needs = resources.filter(r => r !== specialty && stock[r] < upkeep[r] * p.needTicks).sort((a, b) => Number(stock[a] - stock[b]));

    let accept: string | undefined;
    for (const o of s.offers.items) {
      if (o.recipient_id !== self || !active(o.status, o.expires_tick, s.tick)) continue;
      const pay = o.receive, gain = o.give;
      const reason = total(gain) < total(pay) * p.acceptRatio ? `below our price of ${p.acceptRatio}:1`
        : resources.some(r => pay[r] > 0n && stock[r] - pay[r] < floor(r)) ? 'would breach our reserve'
        : total(pay) > 0n && !needs.some(r => gain[r] > 0n) ? 'brings nothing we need' : undefined;
      inbound[o.offer_id] = reason ? { verdict: 'pass', reason } : { verdict: 'accept', reason: 'meets our price and reserve' };
      accept ??= reason ? undefined : o.offer_id;
    }
    if (accept) return decision({ kind: 'accept', body: { offer_id: accept } }, `Accept ${accept}: it meets our price and keeps our reserve.`);

    const selling = stock[specialty] > floor(specialty) ? [s.self.specialty] : [];
    const seeking = needs.map(r => resources.indexOf(r) + 1);
    const own = s.advertisements.items.find(a => a.station_id === self && active(a.status, a.expires_tick, s.tick));
    const adExpiry = s.tick + (p.ttl * 4n < s.rules.max_publication_ttl_ticks ? p.ttl * 4n : s.rules.max_publication_ttl_ticks);
    const same = own && own.selling.items.join() === selling.join() && own.seeking.items.join() === seeking.join();
    if (!same && (selling.length || seeking.length) && adExpiry <= s.rules.duration_ticks) {
      return decision({ kind: 'advertise', body: { selling: { items: selling }, seeking: { items: seeking }, expires_tick: adExpiry } }, 'Advertise our specialty and current needs.');
    }

    const open = s.offers.items.filter(o => o.proposer_id === self && active(o.status, o.expires_tick, s.tick));
    const expiry = s.tick + (p.ttl < s.rules.max_offer_ttl_ticks ? p.ttl : s.rules.max_offer_ttl_ticks);
    const need = needs[0];
    if (p.proposes && need && open.length < MAX_OPEN_OFFERS && expiry <= s.rules.duration_ticks && stock[specialty] - p.lot >= floor(specialty)) {
      const seller = s.advertisements.items.map(a => a.station_id).sort()
        .find(id => id !== self && !open.some(o => o.recipient_id === id) && s.advertisements.items.some(a => a.station_id === id && active(a.status, a.expires_tick, s.tick) && a.selling.items.includes(resources.indexOf(need) + 1)));
      if (seller) {
        const give = { water: 0n, food: 0n, components: 0n }, receive = { water: 0n, food: 0n, components: 0n };
        give[specialty] = p.lot; receive[need] = p.lot * p.askRatio;
        return decision({ kind: 'offer', body: { recipient_id: seller, give, receive, expires_tick: expiry } }, `Offer ${p.lot} ${specialty} for ${p.lot * p.askRatio} ${need} to ${seller}.`);
      }
    }
    return decision({ kind: 'wait' }, 'Nothing useful to do.');
  };
}

export const archetypes = {
  par: { name: 'par-1', reserveTicks: 3n, needTicks: 15n, acceptRatio: 1n, askRatio: 1n, lot: 3n, proposes: true, ttl: 3n },
  greedy: { name: 'greedy-1', reserveTicks: 3n, needTicks: 15n, acceptRatio: 2n, askRatio: 2n, lot: 3n, proposes: true, ttl: 3n },
  passive: { name: 'passive-1', reserveTicks: 5n, needTicks: 15n, acceptRatio: 1n, askRatio: 1n, lot: 3n, proposes: false, ttl: 3n },
} satisfies Record<string, Archetype>;
