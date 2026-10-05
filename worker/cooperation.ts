import { mapBundle, max, min, productionEstimate } from './domain';
import { resources, type Bundle, type Config, type Snapshot } from './types';
import type { Plan } from './market';

// These are operator-selected conditions, not inferred claims about the galaxy.
export const survivalProfiles = {
  surplus50: { reserveTicks: 2n, planTicks: 16n, stockpileTicks: 4n, lot: 6n, ttl: 2n },
  surplus25: { reserveTicks: 4n, planTicks: 20n, stockpileTicks: 6n, lot: 3n, ttl: 2n },
  balanced: { reserveTicks: 2n, planTicks: 8n, stockpileTicks: 0n, lot: 2n, ttl: 2n },
} as const;
export type SurvivalProfile = keyof typeof survivalProfiles;

// Buy a rolling supply instead of competing to acquire a whole run immediately.
// All stock already excludes outstanding liabilities. Never count an unaccepted
// offer as incoming stock. Outgoing proposals still use baseline's full forecast.
export function cooperativePlan(s: Snapshot, stock: Bundle, original: Plan, config: Config): Plan {
  const horizon = mapBundle(() => min(max(0n, s.rules.duration_ticks - s.tick), config.planTicks));
  const own = mapBundle(r => s.self.upkeep_per_tick[r] * horizon[r]);
  const supply = mapBundle(r => max(0n, stock[r]) + original.production[r] * horizon[r]);
  const stockpile = mapBundle(r => s.self.upkeep_per_tick[r] * config.stockpileTicks);
  const target = mapBundle(r => own[r] + original.relay[r] + stockpile[r]);
  const room = mapBundle(r => max(0n, target[r] - supply[r]));
  // Exchanges may circulate stock above the rolling target. Safety still forbids
  // bringing our forecast failure forward or breaching the settlement reserve.
  const sellable = mapBundle(r => max(original.sellable[r], max(0n, stock[r] - target[r])));
  const seeking = resources.filter(r => room[r] > 0n);
  const value = Object.fromEntries(resources.map(r => [r, 1 + Number(room[r]) / Number(max(1n, target[r]))])) as Plan['value'];
  return { ...original, horizon, own, supply, stockpile, target, room, sellable, seeking, value };
}

// Fairness is based only on deliveries we can see, not invented peer health.
// Lower delivered quantities rank first among otherwise useful proposals.
export function deliveries(s: Snapshot, window: bigint): Map<string, bigint> {
  const amounts = new Map<string, bigint>();
  for (const t of s.transactions.items) {
    if (t.settled_tick < s.tick - window) continue;
    const ours = t.proposer_id === s.self_station_id;
    if (!ours && t.recipient_id !== s.self_station_id) continue;
    const peer = ours ? t.recipient_id : t.proposer_id;
    const paid = ours ? t.give : t.receive;
    amounts.set(peer, (amounts.get(peer) ?? 0n) + resources.reduce((n, r) => n + paid[r], 0n));
  }
  return amounts;
}

// Rolling targets must not turn needed future supply into a donation. Gifts
// require whole-run coverage and verified whole-run spare beyond the buffer.
export function donationSpare(s: Snapshot, stock: Bundle, config: Config): Bundle {
  const remaining = max(0n, s.rules.duration_ticks - s.tick), production = productionEstimate(s);
  const surplus = mapBundle(r => stock[r] + (production[r] - s.self.upkeep_per_tick[r]) * remaining);
  if (resources.some(r => surplus[r] < 0n)) return mapBundle(() => 0n);
  return mapBundle(r => max(0n, surplus[r] - max(1n, s.self.upkeep_per_tick[r]) * config.stockpileTicks));
}
