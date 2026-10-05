import { decide } from './policy';
import { defaultConfig } from './types';
import type { Policy } from './strategy-contract';
import { archetype, archetypes } from './archetypes';

const strategies = {
  baseline: {
    name: 'baseline', version: defaultConfig.version, description: 'Reserve-preserving trading policy; honours the live generous switch.',
    decide: (({ snapshot, pending, memory, config, controls }) => decide(snapshot, pending, memory, config, { generous: controls?.generous })) satisfies Policy,
  },
  observe: {
    name: 'observe', version: 'observe-1', description: 'Observe updates and intentionally make no trades.',
    decide: (({ memory }) => ({ action: { kind: 'wait' }, nextMemory: memory,
      explanation: { policyVersion: 'observe-1', rationale: 'Observe strategy: intentionally take no trading action.' } })) satisfies Policy,
  },
  // Simulation opponents; see worker/archetypes.ts.
  par: { name: 'par', version: archetypes.par.name, description: 'Opponent: trades 1:1 lots with advertised sellers of its needs.', decide: archetype(archetypes.par) },
  greedy: { name: 'greedy', version: archetypes.greedy.name, description: 'Opponent: asks and accepts only 2:1 in its favour.', decide: archetype(archetypes.greedy) },
  passive: { name: 'passive', version: archetypes.passive.name, description: 'Opponent: never proposes; accepts 1:1 offers above a larger reserve.', decide: archetype(archetypes.passive) },
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
