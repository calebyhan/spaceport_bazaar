import { decide } from './policy';
import type { Policy } from './strategy-contract';

const strategies = {
  baseline: {
    name: 'baseline', version: 'baseline-1', description: 'Reserve-preserving trading policy.',
    decide: (({ snapshot, pending, memory, config }) => decide(snapshot, pending, memory, config)) satisfies Policy,
  },
  observe: {
    name: 'observe', version: 'observe-1', description: 'Observe updates and intentionally make no trades.',
    decide: (({ memory }) => ({ action: { kind: 'wait' }, nextMemory: memory,
      explanation: { policyVersion: 'observe-1', rationale: 'Observe strategy: intentionally take no trading action.' } })) satisfies Policy,
  },
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
