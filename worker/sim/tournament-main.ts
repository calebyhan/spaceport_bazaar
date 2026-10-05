import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';
import { json } from '../serialization';
import { getStrategy } from '../strategies';
import { defaultEconomy } from './economy';
import { formatScoreboard, lineup, runTrial, score, type Mode, type Trial } from './tournament';

export function tournamentOptions(args: string[]) {
  const { values } = parseArgs({ args, options: {
    candidates: { type: 'string' }, field: { type: 'string' }, mode: { type: 'string' }, planets: { type: 'string' }, seeds: { type: 'string' },
    duration: { type: 'string' }, 'tick-ms': { type: 'string' }, stock: { type: 'string' }, surplus: { type: 'string' }, out: { type: 'string' }, journals: { type: 'boolean' },
  } });
  const list = (value: string | undefined, fallback: string) => (value ?? fallback).split(',').map(item => item.trim()).filter(Boolean);
  const integer = (name: string, value: string, least: number) => {
    if (!/^[0-9]+$/.test(value) || Number(value) < least || Number(value) > 100000) throw new Error(`--${name} values must be integers from ${least} to 100000`);
    return Number(value);
  };
  const candidates = list(values.candidates, 'baseline'), field = list(values.field, 'baseline');
  for (const name of [...candidates, ...field]) getStrategy(name);
  const mode = values.mode ?? 'both';
  if (!['everyone', 'field', 'both'].includes(mode)) throw new Error('--mode must be everyone, field or both');
  return {
    candidates, field, modes: (mode === 'both' ? ['everyone', 'field'] : [mode]) as Mode[],
    planets: list(values.planets, '3,6,9').map(n => integer('planets', n, 3)),
    // A count (--seeds 3 means seeds 1..3) or an explicit list (--seeds 4,7).
    seeds: values.seeds?.includes(',') ? list(values.seeds, '').map(n => integer('seeds', n, 0)) : Array.from({ length: integer('seeds', values.seeds ?? '2', 1) }, (_, i) => i + 1),
    durationTicks: BigInt(integer('duration', values.duration ?? '120', 1)), tickMs: integer('tick-ms', values['tick-ms'] ?? '100', 10),
    stock: BigInt(integer('stock', values.stock ?? '30', 0)), surplus: BigInt(integer('surplus', values.surplus ?? '50', 0)),
    out: values.out ?? join('.local', 'tournament', new Date().toISOString().replace(/[:.]/g, '-')), journals: values.journals === true,
  };
}

async function main() {
  const o = tournamentOptions(process.argv.slice(2));
  mkdirSync(o.out, { recursive: true });
  const settings = `Planets ${o.planets.join(', ')}; seeds ${o.seeds.join(', ')}; ${o.durationTicks} ticks of ${o.tickMs} ms; starting stock ${o.stock}; surplus ${o.surplus}%; field ${o.field.join(', ')}.`;
  const total = o.modes.length * o.candidates.length * o.planets.length * o.seeds.length;
  console.log(`${settings}\n${total} trials; results in ${o.out}`);
  const trials: Trial[] = [];
  for (const mode of o.modes) for (const candidate of o.candidates) for (const planets of o.planets) for (const seed of o.seeds) {
    const strategies = lineup(mode, candidate, o.field, planets), name = `${mode}-${candidate}-${planets}p-seed${seed}`;
    const { report, failures } = await runTrial({ economy: { ...defaultEconomy, planets, seed, durationTicks: o.durationTicks, startingStock: o.stock, surplusPct: o.surplus },
      tickMs: o.tickMs, strategies, journalDir: o.journals ? join(o.out, 'journals', name) : undefined });
    trials.push({ candidate, mode, planets, seed, strategies, report, failures });
    const ours = mode === 'everyone' ? report.stations : [report.stations[0]];
    console.log(`[${trials.length}/${total}] ${name}: ${report.collective_success ? 'all survived' : `${report.stations.filter(s => !s.survived).length} failed`}; ours ${ours.filter(s => s.survived).length}/${ours.length} survived; ${report.transactions} trades${failures.length ? `; client failures: ${failures.join(', ')}` : ''}`);
  }
  const rows = score(trials), board = formatScoreboard(rows, settings);
  writeFileSync(join(o.out, 'scoreboard.md'), board + '\n');
  writeFileSync(join(o.out, 'scoreboard.json'), json({ settings: o, scores: rows, trials }));
  console.log('\n' + board);
}
if (process.argv[1].endsWith('tournament-main.ts')) void main().catch((error: Error) => { console.error('Tournament failed: ' + error.message); process.exitCode = 2; });
