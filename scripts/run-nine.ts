// Launch the same policy in nine independent processes with distinct credentials.
import { spawn } from 'node:child_process';
import { createReadStream, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { createInterface } from 'node:readline';
import { parseArgs } from 'node:util';
import { getStrategy } from '../worker/strategies';

class LaunchError extends Error {}

async function main() {
  if (process.env.BAZAAR_ENV_FILE) {
    try { process.loadEnvFile(process.env.BAZAAR_ENV_FILE); } catch { throw new LaunchError('Cannot read BAZAAR_ENV_FILE'); }
  }
  const { values } = parseArgs({ options: {
    credentials: { type: 'string' }, endpoint: { type: 'string' }, out: { type: 'string' },
    strategy: { type: 'string', default: 'class25' }, timeout: { type: 'string', default: '300' },
  } });
  const credentials = values.credentials ?? process.env.BAZAAR_CREDENTIAL_FILE;
  if (!credentials) throw new LaunchError('Supply --credentials with a private JSON file containing nine players');
  let players: unknown;
  try { players = JSON.parse(readFileSync(credentials, 'utf8')).players; } catch { throw new LaunchError('Cannot read credentials JSON (contents withheld)'); }
  const ids = Array.from({ length: 9 }, (_, i) => `P${String(i + 1).padStart(2, '0')}`);
  if (!Array.isArray(players) || players.length !== 9 || players.some(p => !p || typeof p.station_id !== 'string' || typeof p.token !== 'string' || !p.token.trim())
    || new Set(players.map(p => p.station_id)).size !== 9 || new Set(players.map(p => p.token)).size !== 9
    || ids.some(id => !players.some(p => p.station_id === id))) throw new LaunchError('Credentials must contain P01–P09 exactly once, each with a distinct nonempty token');
  const endpoint = values.endpoint ?? process.env.BAZAAR_ENDPOINT;
  const url = endpoint && URL.parse(endpoint);
  if (!url || !['ws:', 'wss:'].includes(url.protocol) || url.username || url.password) throw new LaunchError('Supply a ws:// or wss:// endpoint without embedded credentials');
  const strategy = getStrategy(values.strategy).name;
  const timeout = Number(values.timeout);
  if (!Number.isSafeInteger(timeout) || timeout < 1 || timeout > 3600) throw new LaunchError('--timeout must be 1–3600 seconds');
  const out = resolve(values.out ?? join('.local', 'nine-clients', new Date().toISOString().replace(/[:.]/g, '-')));
  mkdirSync(out, { recursive: true });
  // Reserve the directory before opening sockets; never mix evidence from runs.
  writeFileSync(join(out, 'launch.json'), JSON.stringify({ strategy, stations: ids, started: new Date().toISOString() }), { flag: 'wx', mode: 0o600 });
  const env = { ...process.env };
  for (const key of Object.keys(env)) if ((key.startsWith('BAZAAR_') && !key.startsWith('BAZAAR_TERMINAL_')) || key.startsWith('SUPABASE_')) delete env[key];
  const children: ReturnType<typeof spawn>[] = [];
  let interrupted = false;
  const stop = () => {
    interrupted = true;
    for (const child of children) if (child.exitCode === null && child.signalCode === null) {
      child.kill('SIGTERM');
      const force = setTimeout(() => child.kill('SIGKILL'), 5000); force.unref();
      child.once('exit', () => clearTimeout(force));
    }
  };
  process.once('SIGINT', stop); process.once('SIGTERM', stop);
  const timer = setTimeout(stop, timeout * 1000);
  console.log(`Starting nine ${strategy} clients; terminal activity defaults to P09. Journals: ${out}`);
  try {
    const outcomes = await Promise.all(ids.map(station => new Promise<{ station: string; code: number | null }>(done => {
      const child = spawn(process.execPath, ['--import', 'tsx', 'worker/main.ts', '--strategy', strategy], {
        env: { ...env, BAZAAR_ENDPOINT: endpoint, BAZAAR_CREDENTIAL_FILE: resolve(credentials), BAZAAR_STATION_ID: station,
          BAZAAR_JOURNAL_DIR: join(out, station), BAZAAR_CONTROL_FILE: join(out, 'controls.json') }, stdio: 'inherit',
      });
      children.push(child);
      child.once('error', () => { stop(); done({ station, code: null }); });
      child.once('exit', code => { if (code !== 0) stop(); done({ station, code }); });
    })));
    const reports = [];
    for (const outcome of outcomes) {
      let summary: { success?: boolean; ever_failed?: boolean; collective_success?: boolean; aborted?: boolean } | undefined;
      let last: { run_id: string; tick: string; phase: number; self_station_id: string; rules: { duration_ticks: string; tick_duration_ms: string }; self: { failed_once: boolean; health: string } } | undefined;
      const dir = join(out, outcome.station);
      let files: string[] = [];
      try { files = readdirSync(dir).filter(f => f.endsWith('.jsonl')); } catch { /* An early startup failure may not create a journal. */ }
      for (const file of files.sort()) {
        const lines = createInterface({ input: createReadStream(join(dir, file), 'utf8'), crlfDelay: Infinity });
        for await (const line of lines) {
          const entry = JSON.parse(line);
          if (entry.kind === 'state') last = entry.payload;
          if (entry.kind === 'run-summary') summary = entry.payload;
        }
      }
      reports.push({ ...outcome, run: last?.run_id, observedStation: last?.self_station_id, tick: last?.tick, health: last?.self.health,
        duration: last?.rules.duration_ticks, tickMs: last?.rules.tick_duration_ms,
        verified: outcome.code === 0 && last?.self_station_id === outcome.station && last?.phase === 4 && last.tick === '120'
          && last.rules.duration_ticks === '120' && last.rules.tick_duration_ms === '1000' && last.self.failed_once === false
          && summary?.success === true && summary.ever_failed === false && summary.collective_success === true && summary.aborted !== true });
    }
    const verified = !interrupted && reports.every(r => r.verified) && new Set(reports.map(r => r.run)).size === 1;
    writeFileSync(join(out, 'verification.json'), JSON.stringify({ verified, strategy, interrupted, reports }, null, 2) + '\n');
    console.log(`${verified ? 'PASS: all nine survived the 120-tick run' : 'NOT VERIFIED: inspect verification.json and journals'}. Evidence: ${out}`);
    if (!verified) process.exitCode = 1;
  } finally {
    clearTimeout(timer); process.removeListener('SIGINT', stop); process.removeListener('SIGTERM', stop);
    stop();
  }
}
void main().catch(error => { console.error(error instanceof LaunchError ? error.message : 'Nine-client launch or verification failed. Check the output path and journal integrity.'); process.exitCode = 1; });
