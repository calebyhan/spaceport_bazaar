// Reproducible local-only experiment: actual sockets, strategy threads and fsync.
// Sequential trials avoid making competing simulations distort tick timings.
import { createReadStream, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { createInterface } from 'node:readline';
import { parseArgs } from 'node:util';
import { spawn } from 'node:child_process';
import { startSimServer } from '../worker/sim/server';
import { createSimulation } from '../worker/sim/setup';
import type { EconomyOptions } from '../worker/sim/economy';
import { defaultEconomy } from '../worker/sim/economy';
import { json } from '../worker/serialization';
import { getStrategy } from '../worker/strategies';

async function processTrial(economy: EconomyOptions, strategy: string, dir: string) {
  // Refuse to mix new measurements with journals from an earlier trial.
  mkdirSync(dir);
  const { world, players, tokens } = createSimulation(economy, 1000);
  // The server lives here; each disk writer and policy executor is in a child.
  const server = await startSimServer({ world, tokens, tickMs: 1000, autoStart: true });
  const credentials = join(dir, 'credentials.json');
  writeFileSync(credentials, json({ players }), { mode: 0o600 });
  const env: NodeJS.ProcessEnv = { ...process.env };
  for (const key of Object.keys(env)) if (key !== 'BAZAAR_TERMINAL_LOG' && key !== 'BAZAAR_TERMINAL_STATION' && (key.startsWith('BAZAAR_') || key.startsWith('SUPABASE_'))) delete env[key];
  const children = players.map(p => {
    const child = spawn(process.execPath, ['--import', 'tsx', 'worker/main.ts', '--strategy', strategy], { env: { ...env,
      BAZAAR_ENDPOINT: server.url, BAZAAR_CREDENTIAL_FILE: credentials, BAZAAR_STATION_ID: p.station_id,
      BAZAAR_CONTROL_FILE: join(dir, 'controls.json'), BAZAAR_JOURNAL_DIR: join(dir, p.station_id) }, stdio: ['ignore', 'pipe', 'pipe'] });
    let output = '';
    child.stdout.on('data', b => { output += b; process.stdout.write(b); }); child.stderr.on('data', b => { output += b; process.stdout.write(b); });
    const done = new Promise<string | undefined>(resolve => {
      child.once('error', error => resolve(`${p.station_id}: ${error.message}`));
      child.once('exit', code => { writeFileSync(join(dir, `${p.station_id}.log`), output); resolve(code === 0 ? undefined : `${p.station_id}: exit ${code}`); });
    });
    return { child, done };
  });
  let began: number | undefined, beganWall: number | undefined;
  const clock = setInterval(() => { if (world.phase === 2 && began === undefined) { began = performance.now(); beganWall = Date.now(); } }, 10);
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      (async () => {
        await server.finished;
        const clockMs = performance.now() - began!, wallClockMs = Date.now() - beganWall!;
        const outcomes = await Promise.all(children.map(c => c.done));
        return { report: world.report(), clockMs, wallClockMs, failures: outcomes.filter((x): x is string => x !== undefined) };
      })(),
      new Promise<never>((_, reject) => { timer = setTimeout(() => reject(new Error(`Trial exceeded ${Number(economy.durationTicks) + 45}s`)), Number(economy.durationTicks) * 1000 + 45000); }),
    ]);
  } finally {
    clearTimeout(timer); clearInterval(clock);
    for (const { child } of children) if (child.exitCode === null) {
      child.kill('SIGTERM');
      const kill = setTimeout(() => child.kill('SIGKILL'), 2000); kill.unref();
      child.once('exit', () => clearTimeout(kill));
    }
    await server.close();
  }
}

async function main() {
  const { values } = parseArgs({ options: { out: { type: 'string' }, duration: { type: 'string', default: '60' }, planets: { type: 'string', default: '9' }, stock: { type: 'string', default: '10' }, strategy: { type: 'string' }, surplus: { type: 'string' }, seeds: { type: 'string', default: '1' }, 'require-survival': { type: 'boolean' } } });
  const duration = Number(values.duration), planets = Number(values.planets), stock = Number(values.stock);
  if (![duration, planets, stock].every(Number.isSafeInteger) || duration < 5 || duration > 1000 || planets < 3 || planets > 30 || stock < 0) throw new Error('Invalid duration, planets or stock');
  const seeds = values.seeds.split(',').map(Number);
  if (!values.seeds.split(',').every(seed => /^[0-9]+$/.test(seed)) || seeds.some(seed => !Number.isSafeInteger(seed) || seed < 0 || seed > 0xffffffff) || new Set(seeds).size !== seeds.length) throw new Error('Seeds must be distinct unsigned 32-bit integers');
  if ((values.strategy === undefined) !== (values.surplus === undefined)) throw new Error('Use --strategy and --surplus together');
  const selected = values.strategy === undefined ? undefined : getStrategy(values.strategy).name;
  const surplusValue = Number(values.surplus);
  if (selected && (!Number.isSafeInteger(surplusValue) || surplusValue < 0 || surplusValue > 1000)) throw new Error('Invalid surplus');
  const cases = selected ? [[surplusValue, selected] as const] : [[50, 'baseline'], [50, 'surplus50'], [25, 'baseline'], [25, 'surplus25'], [0, 'baseline'], [0, 'balanced']] as const;
  const out = values.out ?? join('.local', 'one-second', new Date().toISOString().replace(/[:.]/g, '-'));
  mkdirSync(out, { recursive: true });
  const percentile = (values: number[], fraction: number) => {
    const sorted = [...values].sort((a, b) => a - b);
    return sorted.length ? sorted[Math.ceil(sorted.length * fraction) - 1] : null;
  };
  const trials = [];
  for (const seed of seeds) {
    for (const [surplus, strategy] of cases) {
      const dir = join(out, `${surplus}-${strategy}-seed${seed}`);
      console.log(`Starting ${strategy}, seed ${seed}, surplus ${surplus}%, ${planets} planets, ${duration} one-second ticks`);
      const started = performance.now();
      const result = await processTrial({ ...defaultEconomy, planets, durationTicks: BigInt(duration), surplusPct: BigInt(surplus), startingStock: BigInt(stock), blockTicks: Math.floor(duration / 5), seed }, strategy, dir);
      const wallMs = performance.now() - started;
      const decisions: number[] = [], responses: number[] = [], queues: number[] = [], snapshotToSend: number[] = [], heartbeats: number[] = [];
      let sent = 0, cancelled = 0, deadlines = 0, stale = 0;
      for (const planet of readdirSync(dir).filter(name => /^P[0-9]+$/.test(name))) {
        const file = readdirSync(join(dir, planet)).find(f => f.endsWith('.jsonl'))!;
        const lines = createInterface({ input: createReadStream(join(dir, planet, file), 'utf8'), crlfDelay: Infinity });
        const states = new Map<string, number>(), sources = new Map<string, number>();
        let heartbeat: number | undefined;
        for await (const line of lines) {
          const e = JSON.parse(line);
          // Wall-clock adjustments must not look like stalled trading.
          const at = Number(BigInt(e.mono)) / 1e6, p = e.payload;
          if (e.kind === 'state') states.set(p.snapshot_sequence, at);
          if (e.kind === 'decision' && e.requestId) sources.set(e.requestId, states.get(p.snapshot?.snapshot_sequence)!);
          if (e.kind === 'sent') { sent++; const source = sources.get(e.requestId); if (source !== undefined) snapshotToSend.push(at - source); }
          if (e.kind === 'cancelled') cancelled++;
          if (e.kind === 'lifecycle' && p.to === 'stale') stale++;
          if (e.kind !== 'responsiveness') continue;
          if (p.metric === 'deadline') deadlines++;
          if (p.metric === 'decision' && p.source === 'policy') decisions.push(p.duration_ms);
          if (p.metric === 'response') responses.push(p.duration_ms);
          if (p.metric === 'queue') queues.push(p.duration_ms);
          if (p.metric === 'activity') { if (heartbeat !== undefined) heartbeats.push(at - heartbeat); heartbeat = at; }
        }
      }
      const timing = (samples: number[]) => ({ samples: samples.length, p95Ms: percentile(samples, .95), p99Ms: percentile(samples, .99), maxMs: percentile(samples, 1) });
      const trial = { strategy, seed, surplus, tickMs: 1000, duration, planets, startingStock: stock, wallMs, serverClockMs: result.clockMs, serverWallClockMs: result.wallClockMs,
        collectiveSuccess: result.report.collective_success, survivors: result.report.stations.filter(s => s.survived).length,
        totalShortageTicks: result.report.stations.reduce((n, s) => n + Number(s.shortage_ticks), 0),
        transactions: result.report.transactions, sent, cancelled, deadlines, stale, failures: result.failures,
        decision: timing(decisions), response: timing(responses), queue: timing(queues), snapshotToSend: { ...timing(snapshotToSend), overOneSecond: snapshotToSend.filter(ms => ms >= 1000).length }, heartbeatGap: timing(heartbeats), report: result.report };
      trials.push(trial);
      writeFileSync(join(out, 'results.json'), json({ trials }) + '\n');
      console.log(json({ ...trial, report: undefined }));
    }
  }
  console.log(`Evidence: ${out}/results.json`);
  if (trials.some(t => (values['require-survival'] && !t.collectiveSuccess) || t.failures.length || t.sent === 0 || t.transactions === 0 || t.deadlines || t.stale
    || t.snapshotToSend.samples !== t.sent || t.snapshotToSend.p99Ms === null || t.snapshotToSend.p99Ms >= 1000
    || !Number.isFinite(t.serverClockMs) || Math.abs(t.serverClockMs - duration * 1000) > duration * 100)) process.exitCode = 1;

}
void main().catch(error => { console.error(error); process.exitCode = 1; });
