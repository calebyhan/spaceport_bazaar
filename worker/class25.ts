// Dedicated nine-client, 120-tick, one-second, 25%-surplus demonstration policy.
// Start from the market-5 behavior that passed the local class acceptance runs.
// Keep its settings separate so future baseline tuning does not change this preset.
import { decide } from './policy';
import type { Config } from './types';
import type { Policy } from './strategy-contract';

export const class25Config: Config = {
  reserveTicks: 2n, planTicks: 40n, urgentTicks: 10n, stockpileTicks: 10n,
  lot: 6n, ttl: 3n, cooldownTicks: 1n, maxOpenOffers: 8n,
  maxPremiumPct: 50n, premiumStepPct: 25n,
  maxParMisses: 2n, ladderWindowTicks: 30n, parRetryTicks: 3n,
  adTtl: 12n, maxInFlight: 3n, version: 'class25-1',
};
// The validated class runs used generosity off. Dashboard generosity remains a
// baseline-only control; class25 always keeps this tested behavior.
export const class25Policy: Policy = ({ snapshot, pending, memory, config }) =>
  decide(snapshot, pending, memory, { ...config, version: 'class25-1' }, { generous: false });
