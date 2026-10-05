import { decide } from './policy';
import { type SurvivalProfile } from './cooperation';
import type { Policy } from './strategy-contract';

export function survivalPolicy(profile: SurvivalProfile): Policy {
  return ({ snapshot, pending, memory, config }) => decide(snapshot, pending, memory,
    { ...config, maxPremiumPct: 0n, version: `${profile}-1` },
    { generous: true, cooperative: profile });
}
