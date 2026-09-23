import { resources, type Bundle, type Snapshot, type Pending, type Offer, type Config } from './types';
export const zero = (): Bundle => ({ water: 0n, food: 0n, components: 0n });
export const min = (a: bigint, b: bigint) => a < b ? a : b;
export const max = (a: bigint, b: bigint) => a > b ? a : b;
export function mapBundle(fn: (r: typeof resources[number]) => bigint): Bundle {
  return Object.fromEntries(resources.map(r => [r, fn(r)])) as Bundle;
}
export const add = (a: Bundle, b: Bundle) => mapBundle(r => a[r] + b[r]);
export const subtract = (a: Bundle, b: Bundle) => mapBundle(r => a[r] - b[r]);
export const scale = (a: Bundle, n: bigint) => mapBundle(r => a[r] * n);
export const affordable = (stock: Bundle, cost: Bundle) => resources.every(r => stock[r] >= cost[r]);
export const total = (a: Bundle) => resources.reduce((n, r) => n + a[r], 0n);
export const active = (status: number, expiry: bigint, tick: bigint) => status === 1 && tick < expiry;
export function perspective(offer: Offer, self: string) {
  if (offer.recipient_id === self) return { pay: offer.receive, gain: offer.give };
  if (offer.proposer_id === self) return { pay: offer.give, gain: offer.receive };
  throw new Error('Offer is unrelated to this station');
}
export interface Liability { id: string; give: Bundle; expires: bigint }
export function liabilities(s: Snapshot, pending: Pending[]): Liability[] {
  const result = s.offers.items.filter(o => o.proposer_id === s.self_station_id && active(o.status, o.expires_tick, s.tick))
    .map(o => ({ id: o.offer_id, give: o.give, expires: o.expires_tick }));
  for (const p of pending) {
    if (p.action.kind !== 'offer') continue;
    const recorded = s.request_results.items.find(r => r.request_id === p.requestId);
    const outcome = recorded ?? p.result;
    if (outcome && !outcome.ok) continue;
    // A result alone is not a balance update. Retain the debit until a snapshot
    // at/after its revision arrives; that snapshot owns open/settled/expired facts.
    if (outcome && s.world_version >= outcome.processed_version) continue;
    if (s.offers.items.some(o => o.offer_id === outcome?.object_id.value)) continue;
    result.push({ id: p.requestId, give: p.action.body.give, expires: p.action.body.expires_tick });
  }
  return result;
}
export const liabilityTotal = (items: Liability[]) => items.reduce((b, l) => add(b, l.give), zero());
// A sent acceptance may settle at any moment. Until a snapshot shows the offer
// closed (and its settlement already in inventory), reserve what it takes from us.
export function acceptDebits(s: Snapshot, pending: Pending[]): Bundle {
  let debit = zero();
  for (const p of pending) {
    if (p.action.kind !== 'accept') continue;
    const outcome = s.request_results.items.find(r => r.request_id === p.requestId) ?? p.result;
    if (outcome && !outcome.ok) continue;
    const { offer_id } = p.action.body;
    const o = s.offers.items.find(o => o.offer_id === offer_id);
    if (o && o.status === 1) debit = add(debit, o.receive);
  }
  return debit;
}
export const spendable = (s: Snapshot, pending: Pending[]) => subtract(subtract(s.self.inventory, liabilityTotal(liabilities(s, pending))), acceptDebits(s, pending));
export const reserve = (s: Snapshot, config: Config) => scale(s.self.upkeep_per_tick, min(config.reserveTicks, max(0n, s.rules.duration_ticks - s.tick)));
export interface ForecastPoint { tick: bigint; inventory: Bundle; unmet: Bundle; health: bigint; failed: boolean }
export interface Forecast { points: ForecastPoint[]; failureTick?: bigint; damage: bigint; finalHealth: bigint }
// Conservative production: the smaller of the latest and the average observed
// rate per resource. Nothing is observed before the first tick, so assume none.
export function productionEstimate(s: Snapshot): Bundle {
  if (s.tick <= 0n) return zero();
  return mapBundle(r => min(s.self.last_production[r], s.self.produced_total[r] / s.tick));
}
export function forecast(s: Snapshot, inventory: Bundle, through = s.rules.duration_ticks,
  trade?: { tick: bigint; pay: Bundle; gain: Bundle }): Forecast {
  // Simulation ticks expire objects, produce (conservative estimate), consume, then update health.
  // Existing liabilities are debited up front: they may settle before the next expiry.
  const production = productionEstimate(s);
  let stock = mapBundle(r => max(0n, inventory[r]));
  let health = s.self.health;
  let failureTick = s.self.failed_once || health === 0n ? s.self.first_failure_tick.value ?? s.tick : undefined;
  let damage = 0n;
  const points: ForecastPoint[] = [];
  for (let t = s.tick; t < min(through, s.rules.duration_ticks); t++) {
    if (trade?.tick === t) stock = add(subtract(stock, trade.pay), trade.gain);
    stock = add(stock, production);
    const unmet = mapBundle(r => max(0n, s.self.upkeep_per_tick[r] - stock[r]));
    stock = mapBundle(r => max(0n, stock[r] - s.self.upkeep_per_tick[r]));
    const missing = total(unmet);
    const loss = missing * s.rules.shortage_damage_per_unit;
    damage += loss;
    health = missing > 0n ? max(0n, health - loss) : min(s.rules.max_health, health + s.rules.recovery_per_fully_supplied_tick);
    if (health === 0n && failureTick === undefined) failureTick = t + 1n;
    points.push({ tick: t + 1n, inventory: stock, unmet, health, failed: failureTick !== undefined });
  }
  return { points, failureTick, damage, finalHealth: health };
}
export function noEarlierFailure(after: Forecast, before: Forecast): boolean {
  return after.failureTick === undefined || (before.failureTick !== undefined && after.failureTick >= before.failureTick);
}
export function neverWorse(after: Forecast, before: Forecast): boolean {
  return noEarlierFailure(after, before) && after.points.every((p, i) => p.health >= before.points[i].health);
}
export function deficit(stock: Bundle, target: Bundle) { return total(mapBundle(r => max(0n, target[r] - stock[r]))); }
export function tradeSafety(s: Snapshot, pending: Pending[], pay: Bundle, gain: Bundle, config: Config, settleTick = s.tick) {
  const stock = spendable(s, pending);
  const before = forecast(s, stock);
  const after = forecast(s, stock, s.rules.duration_ticks, { tick: settleTick, pay, gain });
  const production = productionEstimate(s), elapsed = settleTick - s.tick;
  const availableThen = mapBundle(r => max(0n, stock[r] + (production[r] - s.self.upkeep_per_tick[r]) * elapsed));
  const afterStock = add(subtract(availableThen, pay), gain);
  const target = reserve({ ...s, tick: settleTick }, config);
  const belowReserve = !affordable(availableThen, target);
  const retainsReserve = affordable(afterStock, target);
  // Survival is a filter, not the reason to trade: below reserve, a trade may
  // not lower forecast health at any point; otherwise it must keep the reserve.
  const safe = affordable(availableThen, pay) && noEarlierFailure(after, before)
    && (total(pay) === 0n || (belowReserve ? neverWorse(after, before) : retainsReserve));
  return { safe, before, after, belowReserve, retainsReserve };
}
