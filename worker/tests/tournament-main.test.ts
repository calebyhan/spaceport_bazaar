import { afterEach, beforeEach, expect, test, vi } from 'vitest';
const f = vi.hoisted(() => ({ write: vi.fn(), mkdir: vi.fn(), runTrial: vi.fn() }));
vi.mock('node:fs', () => ({ writeFileSync: f.write, mkdirSync: f.mkdir }));
vi.mock('../sim/tournament', async original => ({ ...(await original<typeof import('../sim/tournament')>()), runTrial: f.runTrial }));
import { tournamentOptions } from '../sim/tournament-main';

const report = (survived: boolean[]) => ({ collective_success: survived.every(Boolean), transactions: 4, stations: survived.map(s => ({ survived: s, health_lost: s ? 0n : 100n, final_resources: 50n })) });
const argv = process.argv;
beforeEach(() => {
  vi.resetModules(); vi.clearAllMocks(); process.exitCode = 0;
  vi.spyOn(console, 'log').mockImplementation(() => {}); vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => { process.argv = argv; process.exitCode = 0; vi.restoreAllMocks(); });

test('defaults: four candidates, both modes, 3/6/9 planets, two seeds, classroom-length runs', () => {
  expect(tournamentOptions([])).toMatchObject({ candidates: ['baseline', 'par', 'greedy', 'passive'], field: ['par', 'greedy', 'passive', 'baseline'],
    modes: ['everyone', 'field'], planets: [3, 6, 9], seeds: [1, 2], durationTicks: 120n, tickMs: 100, stock: 30n, surplus: 50n, journals: false, out: expect.stringMatching(/^\.local\/tournament\//) });
});

test('options override everything; seeds may be a count or a list', () => {
  expect(tournamentOptions(['--candidates', 'observe', '--field', 'par, greedy', '--mode', 'field', '--planets', '4', '--seeds', '3', '--duration', '30',
    '--tick-ms', '20', '--stock', '0', '--surplus', '0', '--out', 'x', '--journals'])).toEqual({
    candidates: ['observe'], field: ['par', 'greedy'], modes: ['field'], planets: [4], seeds: [1, 2, 3], durationTicks: 30n, tickMs: 20, stock: 0n, surplus: 0n, out: 'x', journals: true });
  expect(tournamentOptions(['--seeds', '4,7', '--mode', 'everyone']).seeds).toEqual([4, 7]);
});

test.each([
  [['--candidates', 'nope'], 'Unknown strategy'], [['--mode', 'solo'], '--mode must be'], [['--planets', '2'], '--planets values must be integers from 3'],
  [['--tick-ms', 'fast'], '--tick-ms values must be'],
])('rejects %j', (args, message) => {
  expect(() => tournamentOptions(args)).toThrow(message);
});

async function main(...args: string[]) {
  process.argv = ['node', '/repo/worker/sim/tournament-main.ts', ...args];
  await import('../sim/tournament-main');
  await vi.waitFor(() => expect(f.write.mock.calls.length + vi.mocked(console.error).mock.calls.length).toBeGreaterThan(0));
}

test('runs every lineup, prints progress, and writes the scoreboard files', async () => {
  f.runTrial.mockImplementation(async ({ strategies }: { strategies: string[] }) => strategies[0] === 'par'
    ? { report: report(strategies.map(() => true)), failures: [] } : { report: report(strategies.map((_, i) => i !== 1)), failures: ['P02: protocol X'] });
  await main('--candidates', 'par,greedy', '--field', 'passive', '--planets', '3', '--seeds', '1', '--out', 'out', '--journals', '--duration', '6');
  expect(f.runTrial).toHaveBeenCalledTimes(4);
  expect(f.runTrial.mock.calls[2][0]).toMatchObject({ strategies: ['par', 'passive', 'passive'], journalDir: 'out/journals/field-par-3p-seed1', tickMs: 100,
    economy: { planets: 3, seed: 1, durationTicks: 6n, startingStock: 30n, surplusPct: 50n } });
  const lines = vi.mocked(console.log).mock.calls.map(c => String(c[0]));
  expect(lines[0]).toBe('Planets 3; seeds 1; 6 ticks of 100 ms; starting stock 30; surplus 50%; field passive.\n4 trials; results in out');
  expect(lines).toContain('[1/4] everyone-par-3p-seed1: all survived; ours 3/3 survived; 4 trades');
  expect(lines).toContain('[2/4] everyone-greedy-3p-seed1: 1 failed; ours 2/3 survived; 4 trades; client failures: P02: protocol X');
  expect(lines).toContain('[4/4] field-greedy-3p-seed1: 1 failed; ours 1/1 survived; 4 trades; client failures: P02: protocol X');
  expect(f.write.mock.calls.map(c => c[0])).toEqual(['out/scoreboard.md', 'out/scoreboard.json']);
  expect(f.write.mock.calls[0][1]).toContain('| 1 | par | 1 | 100% | 100% (3) |');
  expect(JSON.parse(f.write.mock.calls[1][1]).trials).toHaveLength(4);
});

test('without --journals no per-planet journals are kept', async () => {
  f.runTrial.mockResolvedValue({ report: report([true, true, true]), failures: [] });
  await main('--candidates', 'par', '--mode', 'everyone', '--planets', '3', '--seeds', '1', '--out', 'out');
  expect(f.runTrial.mock.calls[0][0].journalDir).toBeUndefined();
});

test('an invalid option exits 2 with a message', async () => {
  await main('--mode', 'solo');
  expect(console.error).toHaveBeenCalledWith('Tournament failed: --mode must be everyone, field or both');
  expect(process.exitCode).toBe(2);
});
