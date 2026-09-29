import { expect, test } from 'vitest';
import { balancedStations, blockPattern, defaultEconomy, Rng } from '../sim/economy';
import { createSimulation, parseFault, simOptions } from '../sim/setup';

const sum = (values: bigint[]) => values.reduce((a, b) => a + b, 0n);
const byResource = (planets: number) => {
  const totals = [0n, 0n, 0n];
  for (const s of balancedStations({ ...defaultEconomy, planets })) totals[s.specialty - 1] += sum(s.production);
  return totals;
};

test('block levels average exactly the mean', () => {
  expect(sum(blockPattern)).toBe(5000n);
});

test('nine planets: three producers per resource, production = upkeep x planets x 1.5 over 120 ticks', () => {
  const stations = balancedStations(defaultEconomy);
  expect(stations.map(s => s.specialty)).toEqual([1, 2, 3, 1, 2, 3, 1, 2, 3]);
  expect(stations.map(s => s.id)).toEqual(['P01', 'P02', 'P03', 'P04', 'P05', 'P06', 'P07', 'P08', 'P09']);
  // 9 planets x 1 unit x 120 ticks x 150% = 1620 per resource, 540 per producer.
  expect(byResource(9)).toEqual([1620n, 1620n, 1620n]);
  for (const s of stations) {
    expect(sum(s.production)).toBe(540n);
    expect(s.production).toHaveLength(120);
    expect(s.inventory).toEqual({ water: 30n, food: 30n, components: 30n });
    expect(s.upkeep).toEqual({ water: 1n, food: 1n, components: 1n });
    // The live shape: 24-tick blocks averaging 4.5, 1.5, 6, 6 and 4.5 units
    // (108, 36, 144, 144, 108 per block) in a planet-specific order. Carried
    // fractions can move a block total by at most one unit.
    const blocks = [0, 1, 2, 3, 4].map(k => Number(sum(s.production.slice(k * 24, k * 24 + 24)))).sort((a, c) => a - c);
    [36, 108, 108, 144, 144].forEach((expected, k) => expect(Math.abs(blocks[k] - expected)).toBeLessThanOrEqual(1));
  }
});

test.each([[3, 540n], [4, 720n], [7, 1260n], [12, 2160n]])('%i planets stay balanced even with uneven producer counts', (planets, target) => {
  expect(byResource(planets)).toEqual([target, target, target]);
});

test('the same seed gives the same schedules; another seed reorders the blocks', () => {
  const production = (seed: number) => balancedStations({ ...defaultEconomy, seed }).map(s => s.production);
  expect(production(7)).toEqual(production(7));
  expect(production(7)).not.toEqual(production(8));
});

test.each([2, 3.5])('%s planets cannot form a balanced economy', planets => {
  expect(() => balancedStations({ ...defaultEconomy, planets })).toThrow('at least 3 planets');
});

test('shuffle returns a permutation without changing its input', () => {
  const input = [1, 2, 3, 4, 5];
  expect(new Rng(3).shuffle(input).sort()).toEqual(input);
  expect(input).toEqual([1, 2, 3, 4, 5]);
});

test('CLI options default to a nine-planet, 120-tick classroom-shaped run', () => {
  expect(simOptions([])).toEqual({ economy: defaultEconomy, tickMs: 500, host: '127.0.0.1', port: 3100,
    credentials: '.local/sim/credentials.json', report: '.local/sim/report.json', startAfterMs: undefined, faults: {} });
});

test('CLI options override every setting', () => {
  expect(simOptions(['--planets', '6', '--seed', '0', '--duration', '30', '--surplus', '0', '--block', '6', '--stock', '0',
    '--tick-ms', '50', '--host', '0.0.0.0', '--port', '0', '--credentials', 'c.json', '--report', 'r.json', '--start-after-ms', '0', '--fault', 'garbage'])).toEqual({
    economy: { planets: 6, seed: 0, durationTicks: 30n, surplusPct: 0n, blockTicks: 6, startingStock: 0n, upkeep: 1n },
    tickMs: 50, host: '0.0.0.0', port: 0, credentials: 'c.json', report: 'r.json', startAfterMs: 0, faults: { garbage: true } });
});

test.each([['--planets', '2'], ['--stock', '1.5'], ['--tick-ms', '5'], ['--duration', 'ten'], ['--port', '1000001']])('invalid option %s %s is rejected', (flag, value) => {
  expect(() => simOptions([flag, value])).toThrow(`${flag} must be an integer`);
});

test('a simulation gets a unique run, one private token per planet, and matching rules', () => {
  const first = createSimulation({ ...defaultEconomy, planets: 3, durationTicks: 10n }, 50);
  const second = createSimulation({ ...defaultEconomy, planets: 3, durationTicks: 10n }, 50);
  expect(first.world.runId).toMatch(/^sim-1-[0-9a-f]{8}$/);
  expect(first.world.runId).not.toBe(second.world.runId);
  expect(first.players.map(p => p.station_id)).toEqual(['P01', 'P02', 'P03']);
  expect(first.players.every(p => /^[0-9a-f]{48}$/.test(p.token))).toBe(true);
  expect(Object.values(first.tokens)).toEqual(['P01', 'P02', 'P03']);
  expect(first.world.rules).toMatchObject({ duration_ticks: 10n, tick_duration_ms: 50n, max_offer_ttl_ticks: 12n });
});

test.each([
  ['http-401', { httpStatus: 401 }], ['http-503', { httpStatus: 503 }], ['subprotocol', { subprotocol: 'bazaar.json.v1' }],
  ['garbage', { garbage: true }], ['silent-after=5', { silentAfterTick: 5n }],
])('--fault %s', (value, faults) => {
  expect(parseFault(value)).toEqual(faults);
});
test.each(['http-99', 'http-600', 'silent-after=x', 'crash'])('--fault %s is rejected', value => {
  expect(() => parseFault(value)).toThrow('--fault must be');
});
