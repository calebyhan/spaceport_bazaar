import WebSocket from 'ws';
import { readFileSync, realpathSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { Engine } from './engine';
import { acquireLock, Journal } from './persistence';
import { workerOptions } from './options';
import { listStrategies } from './strategies';
import { controlFile, readControls } from './controls';
import { diagnose, exitCodes, failure, formatDiagnosis, handshakeRejected, socketError, type Diagnosis } from './diagnostics';
import { terminalSink, terminalStationMatches } from './terminal';
import { formatLifecycle } from './lifecycle';

const SUBPROTOCOL = 'bazaar.protobuf.v2';
const PROCESS_START_MONO = process.hrtime.bigint();

function appVersion(): { packageVersion?: string; gitCommit?: string } {
  const packageVersion = (() => { try { return JSON.parse(readFileSync('package.json', 'utf8')).version as string; } catch { return undefined; } })();
  const gitCommit = (() => { try { return execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { return undefined; } })();
  return { packageVersion, gitCommit };
}
function schemaChecksum(): string | undefined {
  try { return createHash('sha256').update(readFileSync('artifacts/bazaar-protobuf-starter-linux/bazaar.proto')).digest('hex'); } catch { return undefined; }
}

const configuration = (code: string, message: string, hint: string) => failure('configuration', code, message, hint);
// Never echo the file's contents: a JSON parse error message quotes them.
function credentialToken(path: string, station: string): string {
  let players: unknown;
  try { players = JSON.parse(readFileSync(path, 'utf8')).players; } catch {
    throw configuration('CREDENTIAL_FILE_UNREADABLE', 'BAZAAR_CREDENTIAL_FILE could not be read as JSON', 'Check the path; the validator and npm run sim:server write this file.');
  }
  const token = Array.isArray(players) ? players.find((p: { station_id?: string }) => p?.station_id === station)?.token : undefined;
  if (typeof token !== 'string') throw configuration('UNKNOWN_STATION', `The credential file has no token for station ${station}`, 'Set BAZAAR_STATION_ID to a station listed in the credential file.');
  return token;
}
const staleLockHint = 'If it crashed, confirm the PID in /tmp/spaceport-bazaar-*.lock/owner.json is dead, then remove only that lock directory.';
function lock(run: string, station: string, message = 'Another worker on this host is already trading this run and station') {
  try { return acquireLock(run, station); } catch {
    throw failure('application', 'LOCK_HELD', message, `Stop the other worker. ${staleLockHint}`);
  }
}

async function main() {
  if (process.env.BAZAAR_ENV_FILE) {
    try { process.loadEnvFile(process.env.BAZAAR_ENV_FILE); } catch {
      throw configuration('ENV_FILE_UNREADABLE', 'BAZAAR_ENV_FILE could not be read', 'Check the path points to a private dotenv file such as .env.worker.local.');
    }
  }
  let selection: ReturnType<typeof workerOptions>;
  try { selection = workerOptions(process.argv.slice(2), process.env, readControls(controlFile()).strategy); } catch (error) {
    // Option and strategy errors name only flags and registered strategies.
    throw configuration('INVALID_OPTIONS', (error as Error).message, 'Run npm run worker -- --list-strategies; flags are --strategy and --exercise.');
  }
  if (selection.list) { console.log(JSON.stringify(listStrategies(), null, 2)); return; }
  const endpoint = process.env.BAZAAR_ENDPOINT;
  const token = process.env.BAZAAR_TOKEN || (process.env.BAZAAR_CREDENTIAL_FILE ? credentialToken(process.env.BAZAAR_CREDENTIAL_FILE, process.env.BAZAAR_STATION_ID ?? 'P01') : undefined);
  if (!endpoint) throw configuration('MISSING_ENDPOINT', 'BAZAAR_ENDPOINT is not set', 'Set it to the server address, for example ws://127.0.0.1:3001/ws, in the environment or BAZAAR_ENV_FILE.');
  if (!token) throw configuration('MISSING_TOKEN', 'No access token: neither BAZAAR_TOKEN nor BAZAAR_CREDENTIAL_FILE is set', 'Set one of them in a private environment file, never on the command line.');
  const url = URL.parse(endpoint);
  if (!url || !['ws:', 'wss:'].includes(url.protocol)) throw configuration('INVALID_ENDPOINT', 'BAZAAR_ENDPOINT must be a ws:// or wss:// URL', 'Use the full endpoint, for example ws://127.0.0.1:3001/ws.');
  if (url.username || url.password) throw configuration('INVALID_ENDPOINT', 'BAZAAR_ENDPOINT must not contain credentials', 'Remove the credentials from the URL and put the token in BAZAAR_TOKEN.');
  const exercise = selection.exercise;
  let terminalStation = process.env.BAZAAR_STATION_ID;
  // Replaced by BAZAAR_JOURNAL_DIR (one file per run instead of one growing
  // file forever); fail loudly rather than silently ignoring a stale setting.
  if (process.env.BAZAAR_JOURNAL) throw configuration('RETIRED_SETTING', 'BAZAAR_JOURNAL was replaced by BAZAAR_JOURNAL_DIR', 'Set BAZAAR_JOURNAL_DIR to a directory; each run gets its own file there.');
  let journal: Journal;
  try { journal = new Journal(process.env.BAZAAR_JOURNAL_DIR ?? '.local/journal'); } catch {
    throw failure('application', 'JOURNAL_UNREADABLE', 'The journal directory could not be opened, or its newest file has a torn or corrupt line',
      'Check permissions for BAZAAR_JOURNAL_DIR and inspect the last line of its newest file; never delete it to bypass recovery.');
  }
  const config = { ...selection.strategy.defaults, version: selection.strategy.version };
  const settings = {
    reserveTicks: 'BAZAAR_RESERVE_TICKS', planTicks: 'BAZAAR_PLAN_TICKS', urgentTicks: 'BAZAAR_URGENT_TICKS', stockpileTicks: 'BAZAAR_STOCKPILE_TICKS',
    lot: 'BAZAAR_LOT', ttl: 'BAZAAR_TTL', cooldownTicks: 'BAZAAR_COOLDOWN_TICKS', maxOpenOffers: 'BAZAAR_MAX_OPEN_OFFERS',
    maxPremiumPct: 'BAZAAR_MAX_PREMIUM_PCT', premiumStepPct: 'BAZAAR_PREMIUM_STEP_PCT', maxParMisses: 'BAZAAR_MAX_PAR_MISSES',
    ladderWindowTicks: 'BAZAAR_LADDER_WINDOW_TICKS', parRetryTicks: 'BAZAAR_PAR_RETRY_TICKS', adTtl: 'BAZAAR_AD_TTL', maxInFlight: 'BAZAAR_MAX_IN_FLIGHT',
  } as const;
  for (const [key, variable] of Object.entries(settings)) {
    const value = process.env[variable];
    if (value) {
      if (!/^[1-9][0-9]*$/.test(value) || BigInt(value) > 10000n) throw configuration('INVALID_POLICY_SETTING', `${variable} must be an integer from 1 to 10000`, 'Fix or remove the setting; see .env.example for defaults.');
      config[key as keyof typeof settings] = BigInt(value);
    }
  }
  let unlock: (() => void) | undefined, socket: WebSocket | undefined, reconnect: NodeJS.Timeout | undefined;
  let closed = false, attempts = 0, connectedAt: string | undefined;
  let unlockToken: (() => void) | undefined, unlockJournal: (() => void) | undefined;
  const finish = async (success: boolean, diagnosis?: Diagnosis) => {
    if (closed) return;
    closed = true; clearTimeout(reconnect); socket?.close();
    // The latest snapshot from any connection: a reconnect clears the current one.
    const s = engine.state.last;
    if (s) {
      try {
        const outcome = s.outcome.null ? undefined : s.outcome.value;
        const collectiveSuccess = outcome && !outcome.collective_success.null ? outcome.collective_success.value : undefined;
        engine.record({ kind: 'run-summary', payload: {
          success, ever_failed: s.self.failed_once,
          first_failure_tick: s.self.first_failure_tick.null ? undefined : s.self.first_failure_tick.value,
          collective_success: collectiveSuccess, aborted: outcome?.aborted,
          final_inventory: s.self.inventory, final_health: s.self.health,
          produced_total: s.self.produced_total, consumed_total: s.self.consumed_total, unmet_total: s.self.unmet_total,
          imported_total: s.self.imported_total, exported_total: s.self.exported_total,
          fully_supplied_ticks: s.self.fully_supplied_ticks, shortage_ticks: s.self.shortage_ticks,
          longest_shortage_streak: s.self.longest_shortage_streak,
          unresolved_offers: s.offers.items.filter(o => o.status === 1).length,
          unresolved_advertisements: s.advertisements.items.filter(a => a.status === 1).length,
          config: engine.config, final_memory: engine.memory,
        } });
        await engine.idle();
      } catch { /* Best-effort final record; already-failed persistence must not block shutdown. */ }
    }
    unlock?.(); unlockToken?.(); unlockJournal?.(); journal.close();
    if (diagnosis) console.error(formatDiagnosis(diagnosis));
    if (terminalStationMatches(terminalStation)) console.log(success ? 'Worker completed.' : 'Worker stopped; inspect the local journal before recovery.');
    process.exitCode = diagnosis ? exitCodes[diagnosis.category] : success ? 0 : 1;
  };
  const { packageVersion, gitCommit } = appVersion();
  const checksum = schemaChecksum();
  const engine = new Engine({ config, exercise, strategyName: selection.strategy.name, previous: journal.previous,
    sink: terminalSink({
      append: async entry => { await journal.append(entry); },
      resolve: (runId, stationId) => journal.resolve(runId, stationId),
    }),
    identity: s => {
      terminalStation = s.self_station_id;
      unlock = lock(s.run_id, s.self_station_id);
      engine.record({ kind: 'manifest', payload: {
        server_run_id: s.run_id, station_id: s.self_station_id,
        protocol_version: s.protocol_version, subprotocol: SUBPROTOCOL,
        app_version: packageVersion, git_commit: gitCommit, schema_sha256: checksum,
        connect_utc: connectedAt, process_start_mono: PROCESS_START_MONO.toString(),
        endpoint_host: url.hostname, endpoint_port: url.port || (url.protocol === 'wss:' ? '443' : '80'),
        rules: s.rules,
        initial: { phase: s.phase, tick: s.tick, world_version: s.world_version, snapshot_sequence: s.snapshot_sequence, self: s.self, advertisements: s.advertisements.items },
        strategy: exercise ? 'exercise' : selection.strategy.name, config, exercise, llm_enabled: false,
      } });
    },
    done: () => finish(true),
    fatal: diagnosis => { void engine.idle().then(() => finish(false, diagnosis)).catch(() => finish(false, diagnosis)); },
    lifecycle: change => { if (terminalStationMatches(terminalStation)) console.log(formatLifecycle(change)); },
    controls: () => readControls(controlFile()),
  });
  const connect = () => {
    if (closed) return;
    const ws = new WebSocket(endpoint, SUBPROTOCOL, { headers: { Authorization: `Bearer ${token}` }, handshakeTimeout: 10000, maxPayload: 16 * 1024 * 1024, followRedirects: false });
    socket = ws;
    let keepalive: NodeJS.Timeout | undefined;
    // Why this connection ended, when known; the first cause wins.
    let cause: Diagnosis | undefined;
    const epoch = engine.connect({
      send: bytes => { if (ws.readyState !== WebSocket.OPEN) throw new Error('Socket not open'); ws.send(bytes, { binary: true }, error => { if (error) ws.terminate(); }); },
      // A dead peer never completes the close handshake; do not wait 30 s for it.
      close: () => { ws.close(); setTimeout(() => ws.terminate(), 2000).unref(); },
    });
    ws.on('open', () => {
      connectedAt = new Date().toISOString();
      engine.record({ kind: 'ws-open', payload: { subprotocol: ws.protocol } });
      if (ws.protocol !== SUBPROTOCOL) {
        engine.record({ kind: 'ws-subprotocol-mismatch', payload: { got: ws.protocol, expected: SUBPROTOCOL } });
        engine.fail({ category: 'protocol', code: 'SUBPROTOCOL_MISMATCH', message: `The server selected subprotocol "${ws.protocol}" instead of ${SUBPROTOCOL}`, hint: 'Check the endpoint is a Bazaar server started with the protobuf codec.' });
        return;
      }
      attempts = 0;
      engine.opened(epoch);
      // Keep an idle socket alive: runs 37 and 40 dropped with code 1006 about
      // every two minutes while waiting in the lobby, when no frames flow.
      keepalive = setInterval(() => { if (ws.readyState === WebSocket.OPEN) ws.ping(); }, 30000);
      keepalive.unref();
    });
    ws.on('ping', () => engine.record({ kind: 'ws-ping', payload: {} }));
    ws.on('pong', () => engine.record({ kind: 'ws-pong', payload: {} }));
    ws.on('message', (data, binary) => engine.receive(epoch, Buffer.isBuffer(data) ? data : Buffer.concat(data as Buffer[]), binary));
    // Record only the classified error code, never the raw error object:
    // its message can contain endpoint or credential text.
    ws.on('error', error => {
      const diagnosis = socketError(error as NodeJS.ErrnoException);
      cause ??= diagnosis;
      engine.record({ kind: 'ws-error', payload: { category: diagnosis.category, code: diagnosis.code } });
      // Only network failures can clear up by themselves; retrying anything else hides it.
      if (diagnosis.category !== 'network') engine.fail(diagnosis);
    });
    ws.on('unexpected-response', (_request, response) => {
      const diagnosis = handshakeRejected(response.statusCode!);
      cause = diagnosis;
      engine.record({ kind: 'ws-handshake-rejected', payload: { statusCode: response.statusCode, category: diagnosis.category, code: diagnosis.code } });
      response.resume();
      // A failing server may recover, so retry; any other rejection will not.
      if (diagnosis.category === 'network') ws.terminate(); else engine.fail(diagnosis);
    });
    ws.on('close', (code, reasonBuffer) => {
      clearInterval(keepalive);
      engine.record({ kind: 'ws-close', payload: { code, reason: reasonBuffer.toString('utf8').slice(0, 200) } });
      engine.disconnected(epoch);
      if (!closed && !engine.stopped) {
        const delay = Math.min(10000, 500 * 2 ** Math.min(attempts++, 5));
        const why = cause ?? { category: 'network', code: `CLOSE_${code}`, message: 'The server closed the connection', hint: 'The worker reconnects automatically.' };
        engine.record({ kind: 'ws-reconnect-scheduled', payload: { delayMs: delay, attempt: attempts, category: why.category, code: why.code } });
        console.error(`${formatDiagnosis(why)} Reconnecting in ${delay} ms (attempt ${attempts}).`);
        reconnect = setTimeout(connect, delay);
      }
    });
  };
  // A repeated signal (a second Ctrl+C) must not fall through to Node's
  // default exit: that would skip the lock release. Only SIGKILL forces it.
  let stopping = false;
  const shutdown = (signal: NodeJS.Signals) => {
    process.once(signal, () => shutdown(signal));
    if (stopping) { console.error('Shutdown in progress; waiting for durable records and lock release.'); return; }
    stopping = true;
    engine.stop(); void engine.idle().then(() => finish(true)).catch(() => finish(false));
  };
  process.once('SIGINT', () => shutdown('SIGINT'));
  process.once('SIGTERM', () => shutdown('SIGTERM'));
  // Acquire before opening a socket: a second connection can fence the first
  // at the server before its initial snapshot reveals the run identity.
  // One worker per token, acquired before the socket opens: a second
  // connection with the same token would fence the first at the server before
  // its snapshot reveals the station. Workers with different tokens (stations)
  // may share a host, but each needs its own journal directory.
  unlockToken = lock('worker-token', createHash('sha256').update(token).digest('hex'), 'Another worker on this host is already using this token');
  try { unlockJournal = lock('journal-directory', realpathSync(process.env.BAZAAR_JOURNAL_DIR ?? '.local/journal'), 'Another worker on this host is writing to this journal directory'); }
  catch (error) { unlockToken(); throw error; }
  connect();
}
void main().catch(error => {
  const diagnosis = diagnose(error);
  console.error(formatDiagnosis(diagnosis));
  console.error('Worker did not start.');
  process.exitCode = exitCodes[diagnosis.category];
});
