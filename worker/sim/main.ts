import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { json } from '../serialization';
import { startSimServer } from './server';
import { createSimulation, simOptions } from './setup';

async function main() {
  const options = simOptions(process.argv.slice(2));
  const { world, players, tokens } = createSimulation(options.economy, options.tickMs);
  const server = await startSimServer({ world, tokens, tickMs: options.tickMs, host: options.host, port: options.port, autoStart: true, faults: options.faults });
  if (Object.keys(options.faults).length) console.log(`Deliberate fault enabled: ${json(options.faults)}`);
  // Same shape as the validator's credential file, so BAZAAR_CREDENTIAL_FILE works unchanged.
  mkdirSync(dirname(options.credentials), { recursive: true });
  writeFileSync(options.credentials, json({ run_id: world.runId, endpoint: server.url, players }), { mode: 0o600 });
  console.log(`Simulation ${world.runId}: ${players.length} planets at ${server.url}; credentials in ${options.credentials}.`);
  console.log('The run starts when every planet is ready' + (options.startAfterMs === undefined ? '.' : ` or after ${options.startAfterMs} ms.`));
  if (options.startAfterMs !== undefined) setTimeout(server.start, options.startAfterMs).unref();
  const stop = () => { void server.close().then(() => { process.exitCode = 1; }); };
  process.once('SIGINT', stop); process.once('SIGTERM', stop);
  await server.finished;
  const report = { ...world.report(), economy: options.economy };
  mkdirSync(dirname(options.report), { recursive: true });
  writeFileSync(options.report, json(report));
  for (const s of report.stations) console.log(`${s.station_id} ${s.specialty.padEnd(10)} ${s.survived ? 'survived' : `failed at tick ${s.first_failure_tick}`} health ${s.final_health} resources ${s.final_resources}`);
  console.log(`Collective success: ${report.collective_success}. Report in ${options.report}.`);
  await server.close();
}
void main().catch((error: Error) => { console.error('Simulation failed: ' + error.message); process.exitCode = 2; });
