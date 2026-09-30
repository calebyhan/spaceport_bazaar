// Q19: run strategies from the catalog against each other on the local
// simulation server and score them. Every planet is a real Engine speaking
// the binary protocol over a real socket; strategies are chosen by name, so
// any registered strategy can be swapped in without code changes.
import { join } from 'node:path';
import WebSocket from 'ws';
import { Engine } from '../engine';
import { Journal, type Sink } from '../persistence';
import { getStrategy } from '../strategies';
import type { EconomyOptions } from './economy';
import { startSimServer, SUBPROTOCOL, type Faults } from './server';
import { createSimulation } from './setup';
import type { World } from './world';

export type Mode = 'everyone' | 'field';
export type ServerReport = ReturnType<World['report']>;
export interface Trial { candidate: string; mode: Mode; planets: number; seed: number; strategies: string[]; report: ServerReport; failures: string[] }

// `everyone`: every planet runs the candidate (can the class survive if all
// adopt it?). `field`: P01 runs it against a fixed rotation of opponents
// (how does it do for us when we do not control classmates?).
export function lineup(mode: Mode, candidate: string, field: string[], planets: number): string[] {
  return Array.from({ length: planets }, (_, i) => mode === 'everyone' || i === 0 ? candidate : field[(i - 1) % field.length]);
}

export interface TrialOptions {
  economy: EconomyOptions; tickMs: number; strategies: string[];
  journalDir?: string; faults?: Faults;
  // Start anyway if some client never declares readiness.
  startAfterMs?: number;
}
export async function runTrial(options: TrialOptions): Promise<{ report: ServerReport; failures: string[] }> {
  for (const name of options.strategies) getStrategy(name);
  const { world, players, tokens } = createSimulation(options.economy, options.tickMs);
  const server = await startSimServer({ world, tokens, tickMs: options.tickMs, autoStart: true, faults: options.faults });
  const fallback = setTimeout(server.start, options.startAfterMs ?? 10000);
  const failures: string[] = [], engines: Engine[] = [], journals: Journal[] = [];
  try {
    const finished = players.map((player, i) => new Promise<void>(resolve => {
      const journal = options.journalDir === undefined ? undefined : new Journal(join(options.journalDir, player.station_id));
      if (journal) journals.push(journal);
      const sink: Sink = journal ? { append: entry => journal.append(entry), resolve: (run, station) => journal.resolve(run, station) } : { append: async () => {} };
      const engine = new Engine({ strategyName: options.strategies[i], sink, previous: journal?.previous, done: resolve,
        fatal: diagnosis => { failures.push(`${player.station_id}: ${diagnosis.category} ${diagnosis.code}`); resolve(); } });
      engines.push(engine);
      const socket = new WebSocket(server.url, SUBPROTOCOL, { headers: { Authorization: `Bearer ${player.token}` } });
      const epoch = engine.connect({ send: bytes => socket.send(bytes), close: () => socket.close() });
      socket.on('open', () => engine.opened(epoch));
      socket.on('message', (data, binary) => engine.receive(epoch, data as Buffer, binary));
    }));
    await server.finished;
    // Clients complete on the FINISHED snapshot; give them a moment to record it.
    await Promise.race([Promise.all(finished), new Promise(resolve => setTimeout(resolve, 5000).unref())]);
  } finally {
    clearTimeout(fallback);
    for (const engine of engines) engine.stop();
    // A failed journal write must not lose the trial's server report.
    await Promise.allSettled(engines.map(engine => engine.idle()));
    for (const journal of journals) journal.close();
    await server.close();
  }
  return { report: world.report(), failures };
}

const mean = (values: number[]) => values.reduce((a, b) => a + b, 0) / values.length;
const sd = (values: number[]) => values.length < 2 ? 0 : Math.sqrt(values.reduce((a, v) => a + (v - mean(values)) ** 2, 0) / (values.length - 1));
function summarise(trials: Trial[]) {
  // The candidate's own planets: all of them in `everyone`, P01 in `field`.
  const ours = trials.flatMap(t => t.mode === 'everyone' ? t.report.stations : [t.report.stations[0]]);
  const lost = ours.map(s => Number(s.health_lost)), resources = ours.map(s => Number(s.final_resources));
  return {
    trials: trials.length, stations: ours.length,
    collectiveRate: trials.filter(t => t.report.collective_success).length / trials.length,
    survivalRate: ours.filter(s => s.survived).length / ours.length,
    healthLost: { mean: mean(lost), sd: sd(lost) }, finalResources: { mean: mean(resources), sd: sd(resources) },
    prosperity: mean(resources) - mean(lost),
    clientFailures: trials.reduce((n, t) => n + t.failures.length, 0),
  };
}
export type Score = ReturnType<typeof summarise> & { candidate: string; mode: Mode; byPlanets: Record<string, ReturnType<typeof summarise>> };

// Ranked lexicographically, never by a weighted sum: the class wins only if
// no planet fails, then our own survival, then least health lost, then (in
// `field` only) the most resources P01 holds at the end. When every planet
// runs the candidate, trades just move resources between our own planets, so
// their average final stock changes only by upkeep a failing planet never
// consumed; it would reward failure and is not ranked or shown.
export function score(trials: Trial[]): Score[] {
  const groups = new Map<string, Trial[]>();
  for (const trial of trials) groups.set(`${trial.mode}\0${trial.candidate}`, [...groups.get(`${trial.mode}\0${trial.candidate}`) ?? [], trial]);
  const rows = [...groups.values()].map(group => ({
    ...summarise(group), candidate: group[0].candidate, mode: group[0].mode,
    byPlanets: Object.fromEntries([...new Set(group.map(t => t.planets))].sort((a, b) => a - b).map(n => [String(n), summarise(group.filter(t => t.planets === n))])),
  }));
  return rows.sort((a, b) => a.mode.localeCompare(b.mode) || b.collectiveRate - a.collectiveRate || b.survivalRate - a.survivalRate
    || a.healthLost.mean - b.healthLost.mean || (a.mode === 'field' ? b.finalResources.mean - a.finalResources.mean : 0) || a.candidate.localeCompare(b.candidate));
}

const pct = (rate: number) => `${Math.round(rate * 100)}%`;
const spread = (m: { mean: number; sd: number }) => `${m.mean.toFixed(1)} ± ${m.sd.toFixed(1)}`;
export function formatScoreboard(rows: Score[], settings: string): string {
  const lines = ['# Strategy tournament', '', settings, '',
    'Ranked by collective success rate, then our survival rate, then least health lost, then (mixed field only) most final resources. `±` is one standard deviation across our planets. Prosperity is final resources minus health lost.', ''];
  for (const mode of ['everyone', 'field'] as const) {
    const ranked = rows.filter(r => r.mode === mode);
    if (!ranked.length) continue;
    const field = mode === 'field';
    lines.push(`## ${field ? 'Candidate as P01 in a mixed field' : 'Everyone runs the candidate'}`, '',
      field ? 'Scores P01 only.' : 'Scores every planet. Trades only move resources between these planets, so final resources are not compared here.', '',
      `| Rank | Strategy | Trials | Collective success | Our survival | Health lost |${field ? ' Final resources | Prosperity |' : ''} Client failures |`,
      `| --- | --- | --- | --- | --- | --- |${field ? ' --- | --- |' : ''} --- |`,
      ...ranked.map((r, i) => `| ${i + 1} | ${r.candidate} | ${r.trials} | ${pct(r.collectiveRate)} | ${pct(r.survivalRate)} (${r.stations}) | ${spread(r.healthLost)} |${field ? ` ${spread(r.finalResources)} | ${r.prosperity.toFixed(1)} |` : ''} ${r.clientFailures} |`), '',
      '| Strategy | Planets | Trials | Collective success | Our survival | Health lost |', '| --- | --- | --- | --- | --- | --- |',
      ...ranked.flatMap(r => Object.entries(r.byPlanets).map(([n, s]) => `| ${r.candidate} | ${n} | ${s.trials} | ${pct(s.collectiveRate)} | ${pct(s.survivalRate)} | ${spread(s.healthLost)} |`)), '');
  }
  return lines.join('\n');
}
