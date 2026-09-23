// Derived, human-analysis-friendly views of the raw journal. These are pure
// functions over two consecutive snapshots; they never replace the raw
// journal (docs/real-run-logging-note.md's "Market-observation timeline" and
// "Tick summary" sections) and contribute no facts of their own.
import { resources, type Config, type Snapshot } from './types';
import { active, deficit, liabilityTotal, liabilities, reserve, total } from './domain';
import { capacity } from './policy';

export interface MarketEvent { type: string; [key: string]: unknown }

export function deriveMarketEvents(previous: Snapshot | undefined, current: Snapshot, config: Config): MarketEvent[] {
  const events: MarketEvent[] = [];
  if (!previous) return events;

  const prevAds = new Map(previous.advertisements.items.map(a => [a.advertisement_id, a]));
  const curAds = new Map(current.advertisements.items.map(a => [a.advertisement_id, a]));
  for (const [id, ad] of curAds) {
    const before = prevAds.get(id);
    if (!before) events.push({ type: 'advertisement-appeared', advertisement_id: id, station_id: ad.station_id, selling: ad.selling.items, seeking: ad.seeking.items });
    else if (before.selling.items.join(',') !== ad.selling.items.join(',') || before.seeking.items.join(',') !== ad.seeking.items.join(',')) {
      events.push({ type: 'advertisement-changed', advertisement_id: id, station_id: ad.station_id, selling: ad.selling.items, seeking: ad.seeking.items });
    }
  }
  for (const [id, ad] of prevAds) {
    if (curAds.has(id)) continue;
    events.push({ type: active(ad.status, ad.expires_tick, current.tick) ? 'advertisement-disappeared' : 'advertisement-expired', advertisement_id: id, station_id: ad.station_id });
  }

  const prevOffers = new Map(previous.offers.items.map(o => [o.offer_id, o]));
  const curOffers = new Map(current.offers.items.map(o => [o.offer_id, o]));
  for (const [id, offer] of curOffers) {
    const before = prevOffers.get(id);
    if (!before) events.push({ type: 'offer-created', offer_id: id, proposer_id: offer.proposer_id, recipient_id: offer.recipient_id, involves_us: offer.proposer_id === current.self_station_id || offer.recipient_id === current.self_station_id });
    else if (before.status !== offer.status) events.push({ type: 'offer-status-changed', offer_id: id, from_status: before.status, to_status: offer.status });
  }
  for (const [id, offer] of prevOffers) {
    if (!curOffers.has(id)) events.push({ type: 'offer-ended-with-run', offer_id: id, last_status: offer.status });
  }

  const prevResults = new Set(previous.request_results.items.map(r => r.request_id));
  for (const result of current.request_results.items) {
    if (!prevResults.has(result.request_id) && !result.ok) events.push({ type: 'command-rejected', request_id: result.request_id, code: result.code });
  }

  const before = reserve(previous, config), target = reserve(current, config);
  for (const r of resources) {
    const wasShort = previous.self.inventory[r] < before[r], isShort = current.self.inventory[r] < target[r];
    if (isShort && !wasShort) events.push({ type: 'resource-entered-risk', resource: r, stock: current.self.inventory[r], target: target[r] });
    if (!isShort && wasShort) events.push({ type: 'resource-left-risk', resource: r, stock: current.self.inventory[r], target: target[r] });
  }

  const specialty = resources[current.self.specialty - 1];
  if (specialty && previous.self.last_production[specialty] > 0n && current.self.last_production[specialty] === 0n) {
    events.push({ type: 'production-surprise', resource: specialty, previous: previous.self.last_production[specialty], current: 0n });
  }

  return events;
}

export interface TickSummary { [key: string]: unknown }

// Emitted once when `current.tick` has advanced past `previous.tick`;
// `previous`/`current` bracket the same discrete tick that just elapsed.
export function summarizeTick(previous: Snapshot, current: Snapshot, config: Config): TickSummary {
  const openCommitment = liabilityTotal(liabilities(current, []));
  const rejectedThisTick = current.request_results.items.filter(r => !r.ok && r.processed_tick === previous.tick).length;
  const usedCommands = current.request_results.items.filter(r => r.processed_tick === previous.tick).length;
  return {
    tick: previous.tick,
    opening_inventory: previous.self.inventory,
    closing_inventory: current.self.inventory,
    production: current.self.last_production,
    unmet_upkeep: current.self.last_unmet_upkeep,
    health_before: previous.self.health,
    health_after: current.self.health,
    open_commitment: openCommitment,
    open_commitment_total: total(openCommitment),
    reserve_deficit: deficit(current.self.inventory, reserve(current, config)),
    commands_used: usedCommands,
    commands_limit: Number(current.rules.new_commands_per_station_per_tick),
    has_command_capacity: capacity(current, [], false),
    rejections_this_tick: rejectedThisTick,
    fully_supplied_ticks: current.self.fully_supplied_ticks,
    shortage_ticks: current.self.shortage_ticks,
    current_shortage_streak: current.self.current_shortage_streak,
  };
}
