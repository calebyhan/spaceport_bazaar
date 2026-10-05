import { decide } from './policy';
import { class25Config, class25Policy } from './class25';
import { survivalProfiles, type SurvivalProfile } from './cooperation';
import { survivalPolicy } from './survival';
import { defaultConfig } from './types';
import type { Policy } from './strategy-contract';

const survivalDefaults = (profile: SurvivalProfile) => ({ ...defaultConfig, ...survivalProfiles[profile],
  maxPremiumPct: 0n, maxOpenOffers: 4n, urgentTicks: 6n, adTtl: 6n, parRetryTicks: 1n, version: `${profile}-1` });
const strategies = {
  baseline: {
    name: 'baseline', defaults: defaultConfig, version: defaultConfig.version, description: 'Reserve-preserving trading policy; honours the live generous switch.',
    decide: (({ snapshot, pending, memory, config, controls }) => decide(snapshot, pending, memory, config, { generous: controls?.generous })) satisfies Policy,
  },
  class25: { name: 'class25', defaults: class25Config, version: 'class25-1', description: 'Nine-client class demonstration: one-second ticks, 25% surplus; validated market-5 behavior with generosity off.', decide: class25Policy },
  surplus50: { name: 'surplus50', defaults: survivalDefaults('surplus50'), version: 'surplus50-1', description: '50% surplus: cooperative par trades, rolling supply and fair distribution of safe excess.', decide: survivalPolicy('surplus50') },
  surplus25: { name: 'surplus25', defaults: survivalDefaults('surplus25'), version: 'surplus25-1', description: '25% surplus: larger reserves, smaller par exchanges and conservative donations.', decide: survivalPolicy('surplus25') },
  balanced: { name: 'balanced', defaults: survivalDefaults('balanced'), version: 'balanced-1', description: 'Just enough: short replenishment targets, small par exchanges and one commitment per peer; best-effort coordination.', decide: survivalPolicy('balanced') },
} as const;
export type StrategyName = keyof typeof strategies;
export function listStrategies() {
  return Object.values(strategies).map(({ name, version, description }) => ({ name, version, description }));
}
export function getStrategy(name: string = 'baseline') {
  const strategy = Object.values(strategies).find(candidate => candidate.name === name);
  if (!strategy) throw new Error('Unknown strategy. Available: ' + listStrategies().map(s => s.name).join(', '));
  return strategy;
}
