import { afterEach, expect, test } from 'vitest';
import { mkdtemp, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { formatScoreboard, lineup, runTrial, score, type Mode, type ServerReport, type Trial } from '../sim/tournament';
import { defaultEconomy } from '../sim/economy';

test('lineups: everyone runs the candidate, or P01 runs it against a rotating field', () => {
  expect(lineup('everyone', 'baseline', ['par'], 3)).toEqual(['baseline', 'baseline', 'baseline']);
  expect(lineup('field', 'baseline', ['par', 'greedy'], 5)).toEqual(['baseline', 'par', 'greedy', 'par', 'greedy']);
});

// Synthetic server reports: only the fields scoring reads.
const station = (survived: boolean, health_lost: number, final_resources: number) => ({ survived, health_lost: BigInt(health_lost), final_resources: BigInt(final_resources) });
const trial = (candidate: string, mode: Mode, planets: number, stations: ReturnType<typeof station>[], failures: string[] = []): Trial => ({
  candidate, mode, planets, seed: 1, strategies: [], failures,
  report: { collective_success: stations.every(s => s.survived), stations } as unknown as ServerReport,
});

test('scores are ranked by collective success, our survival, health lost, then (field only) resources', () => {
  const rows = score([
    // everyone: `a` loses the class once; `b` never fails but loses health; `c` matches `b` on health and must not win on resources.
    trial('a', 'everyone', 3, [station(true, 0, 100), station(true, 0, 100), station(true, 0, 100)]),
    trial('a', 'everyone', 6, [station(false, 100, 300), station(true, 0, 100)]),
    trial('b', 'everyone', 3, [station(true, 10, 100), station(true, 0, 100)]),
    trial('c', 'everyone', 3, [station(true, 10, 900), station(true, 0, 100)], ['P01: application X']),
    // field: only P01 (the first station) counts.
    trial('a', 'field', 3, [station(true, 20, 50), station(false, 100, 0)]),
    trial('b', 'field', 3, [station(true, 20, 80), station(false, 100, 0)]),
  ]);
  expect(rows.map(r => `${r.mode}:${r.candidate}`)).toEqual(['everyone:b', 'everyone:c', 'everyone:a', 'field:b', 'field:a']);
  const a = rows.find(r => r.mode === 'everyone' && r.candidate === 'a')!;
  // 2 trials, 1 all-survived; 4 of 5 planets survived; health lost 0,0,0,100,0.
  expect(a).toMatchObject({ trials: 2, stations: 5, collectiveRate: 0.5, survivalRate: 0.8, healthLost: { mean: 20 }, clientFailures: 0 });
  expect(a.healthLost.sd).toBeCloseTo(44.72, 2);
  expect(a.byPlanets['6']).toMatchObject({ trials: 1, collectiveRate: 0, survivalRate: 0.5 });
  expect(rows[1]).toMatchObject({ candidate: 'c', clientFailures: 1 });
  expect(rows[3]).toMatchObject({ candidate: 'b', stations: 1, survivalRate: 1, finalResources: { mean: 80, sd: 0 }, prosperity: 60 });
});

test('the scoreboard hides resources where trades only move them between our own planets', () => {
  const board = formatScoreboard(score([
    trial('b', 'everyone', 3, [station(true, 10, 100), station(true, 0, 100)]),
    trial('b', 'field', 3, [station(true, 20, 80), station(false, 100, 0)]),
  ]), 'Settings line.');
  expect(board).toContain('# Strategy tournament\n\nSettings line.');
  expect(board).toContain('| Rank | Strategy | Trials | Collective success | Our survival | Health lost | Client failures |\n');
  expect(board).toContain('| 1 | b | 1 | 100% | 100% (2) | 5.0 ± 7.1 | 0 |');
  expect(board).toContain('| 1 | b | 1 | 0% | 100% (1) | 20.0 ± 0.0 | 80.0 ± 0.0 | 60.0 | 0 |');
  expect(board).toContain('| b | 3 | 1 | 100% | 100% | 5.0 ± 7.1 |');
  expect(formatScoreboard(score([trial('b', 'field', 3, [station(true, 0, 1)])]), '')).not.toContain('Everyone runs the candidate');
});

let dir: string | undefined;
afterEach(async () => { if (dir) await rm(dir, { recursive: true, force: true }); dir = undefined; });

test('a real trial plays every planet with its named strategy and keeps per-planet journals', async () => {
  dir = await mkdtemp(join(tmpdir(), 'tournament-'));
  const { report, failures } = await runTrial({ economy: { ...defaultEconomy, planets: 3, durationTicks: 6n }, tickMs: 60, strategies: ['baseline', 'par', 'passive'], journalDir: dir });
  expect(failures).toEqual([]);
  expect(report).toMatchObject({ phase: 4, tick: 6n });
  expect(report.stations.map(s => s.station_id)).toEqual(['P01', 'P02', 'P03']);
  expect((await readdir(dir)).sort()).toEqual(['P01', 'P02', 'P03']);
  expect((await readdir(join(dir, 'P02')))[0]).toMatch(/-P02-sim-1-.*\.jsonl$/);
}, 20000);

test('client failures are counted and a run starts even if clients never become ready', async () => {
  const { report, failures } = await runTrial({ economy: { ...defaultEconomy, planets: 3, durationTicks: 2n }, tickMs: 30, strategies: ['par', 'par', 'par'], faults: { garbage: true }, startAfterMs: 50 });
  expect(failures.sort()).toEqual(['P01: protocol UNDECODABLE_FRAME', 'P02: protocol UNDECODABLE_FRAME', 'P03: protocol UNDECODABLE_FRAME']);
  expect(report.phase).toBe(4);
}, 20000);

test('unknown strategies are rejected before any server starts', async () => {
  await expect(runTrial({ economy: defaultEconomy, tickMs: 50, strategies: ['nope'] })).rejects.toThrow('Unknown strategy');
});
