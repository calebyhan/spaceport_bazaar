// Seeded, balanced planet rosters for local simulations. Specialties rotate so
// each resource has as many producers as possible, and each producer's average
// output is sized so total production is upkeep × planets × (1 + surplus).
import type { Bundle } from '../types';
import type { StationSetup } from './world';

export class Rng {
  private state: number;
  constructor(seed: number) { this.state = seed >>> 0; }
  next() {
    this.state = (this.state + 0x6d2b79f5) >>> 0;
    let value = this.state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  }
  shuffle<T>(items: T[]) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(this.next() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
}

// Relative block levels in thousandths of the mean. Live runs 39 and 40 used
// five 24-tick blocks averaging 4.5, 1.5, 6, 6 and 4.5 units per tick in a
// planet-specific order; this keeps that shape and its exact mean of 1.
export const blockPattern = [1000n, 333n, 1334n, 1333n, 1000n];

export interface EconomyOptions {
  planets: number; seed: number; durationTicks: bigint; surplusPct: bigint;
  blockTicks: number; startingStock: bigint; upkeep: bigint;
}
export const defaultEconomy: EconomyOptions = { planets: 9, seed: 1, durationTicks: 120n, surplusPct: 50n, blockTicks: 24, startingStock: 30n, upkeep: 1n };

export function balancedStations(options: EconomyOptions): StationSetup[] {
  if (!Number.isInteger(options.planets) || options.planets < 3) throw new Error('A balanced economy needs at least 3 planets');
  const rng = new Rng(options.seed);
  const specialties = Array.from({ length: options.planets }, (_, i) => (i % 3) + 1);
  const bundle = (n: bigint): Bundle => ({ water: n, food: n, components: n });
  return specialties.map((specialty, i) => {
    const producers = BigInt(specialties.filter(s => s === specialty).length);
    // Mean output in thousandths of a unit per tick.
    const mean = BigInt(options.planets) * options.upkeep * (100n + options.surplusPct) * 1000n / (100n * producers);
    const blocks = rng.shuffle(blockPattern);
    const production: bigint[] = [];
    let carried = 0n;
    for (let tick = 0; tick < Number(options.durationTicks); tick++) {
      // Millionths: thousandths of the mean times thousandths of the level.
      carried += mean * blocks[Math.floor(tick / options.blockTicks) % blocks.length];
      production.push(carried / 1000000n);
      carried %= 1000000n;
    }
    return { id: `P${String(i + 1).padStart(2, '0')}`, specialty, inventory: bundle(options.startingStock), upkeep: bundle(options.upkeep), production };
  });
}
