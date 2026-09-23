import WebSocket from 'ws';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { Engine } from './engine';
import { acquireLock, Journal, SupabaseSink, type Sink } from './persistence';
import { defaultConfig } from './types';

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

async function main() {
  if (process.env.BAZAAR_ENV_FILE) process.loadEnvFile(process.env.BAZAAR_ENV_FILE);
  const endpoint = process.env.BAZAAR_ENDPOINT;
  let token = process.env.BAZAAR_TOKEN;
  if (!token && process.env.BAZAAR_CREDENTIAL_FILE) {
    const credentials = JSON.parse(readFileSync(process.env.BAZAAR_CREDENTIAL_FILE, 'utf8'));
    token = credentials.players.find((p: { station_id: string }) => p.station_id === (process.env.BAZAAR_STATION_ID ?? 'P01'))?.token;
  }
  if (!endpoint || !token) throw new Error('Missing runtime endpoint or token');
  const url = new URL(endpoint);
  if (!['ws:', 'wss:'].includes(url.protocol) || url.username || url.password) throw new Error('Invalid endpoint');
  const exercise = process.argv.includes('--exercise');
  const journal = new Journal(process.env.BAZAAR_JOURNAL ?? '.local/worker.jsonl');
  let mirror: Sink | undefined;
  if (process.argv.includes('--supabase')) {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) throw new Error('Missing persistence configuration');
    mirror = new SupabaseSink(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY);
  }
  const config = { ...defaultConfig };
  const settings = { reserveTicks: 'BAZAAR_RESERVE_TICKS', quantity: 'BAZAAR_QUANTITY', giveUnits: 'BAZAAR_GIVE_UNITS', receiveUnits: 'BAZAAR_RECEIVE_UNITS', ttl: 'BAZAAR_TTL', cooldownTicks: 'BAZAAR_COOLDOWN_TICKS', maxOpenOffers: 'BAZAAR_MAX_OPEN_OFFERS' } as const;
  for (const [key, variable] of Object.entries(settings)) {
    const value = process.env[variable];
    if (value) {
      if (!/^[1-9][0-9]*$/.test(value) || BigInt(value) > 10000n) throw new Error('Invalid policy configuration');
      config[key as keyof typeof settings] = BigInt(value);
    }
  }
  let unlock: (() => void) | undefined, socket: WebSocket | undefined, reconnect: NodeJS.Timeout | undefined;
  let closed = false, attempts = 0, connectedAt: string | undefined;
  let unlockHost: (() => void) | undefined;
  const finish = async (success: boolean) => {
    if (closed) return;
    closed = true; clearTimeout(reconnect); socket?.close();
    const s = engine.state.snapshot;
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
    unlock?.(); unlockHost?.(); journal.close();
    console.log(success ? 'Worker completed.' : 'Worker stopped; inspect the local journal before recovery.');
    process.exitCode = success ? 0 : 1;
  };
  const { packageVersion, gitCommit } = appVersion();
  const checksum = schemaChecksum();
  const engine = new Engine({ config, exercise, previous: journal.previous,
    sink: { append: async entry => { await journal.append(entry); await mirror?.append(entry); } },
    identity: s => {
      unlock = acquireLock(s.run_id, s.self_station_id);
      engine.record({ kind: 'manifest', payload: {
        server_run_id: s.run_id, station_id: s.self_station_id,
        protocol_version: s.protocol_version, subprotocol: SUBPROTOCOL,
        app_version: packageVersion, git_commit: gitCommit, schema_sha256: checksum,
        connect_utc: connectedAt, process_start_mono: PROCESS_START_MONO.toString(),
        endpoint_host: url.hostname, endpoint_port: url.port || (url.protocol === 'wss:' ? '443' : '80'),
        rules: s.rules,
        initial: { phase: s.phase, tick: s.tick, world_version: s.world_version, snapshot_sequence: s.snapshot_sequence, self: s.self, advertisements: s.advertisements.items },
        config, exercise, llm_enabled: false,
      } });
    },
    done: () => finish(true), fatal: () => { void engine.idle().then(() => finish(false)).catch(() => finish(false)); },
  });
  const connect = () => {
    if (closed) return;
    const ws = new WebSocket(endpoint, SUBPROTOCOL, { headers: { Authorization: `Bearer ${token}` }, handshakeTimeout: 10000, maxPayload: 16 * 1024 * 1024, followRedirects: false });
    socket = ws;
    const epoch = engine.connect({ send: bytes => { if (ws.readyState !== WebSocket.OPEN) throw new Error('Socket not open'); ws.send(bytes, { binary: true }, error => { if (error) ws.terminate(); }); }, close: () => ws.close() });
    ws.on('open', () => {
      connectedAt = new Date().toISOString();
      engine.record({ kind: 'ws-open', payload: { subprotocol: ws.protocol } });
      if (ws.protocol !== SUBPROTOCOL) { engine.record({ kind: 'ws-subprotocol-mismatch', payload: { got: ws.protocol, expected: SUBPROTOCOL } }); engine.fail(); return; }
      attempts = 0;
    });
    ws.on('ping', () => engine.record({ kind: 'ws-ping', payload: {} }));
    ws.on('pong', () => engine.record({ kind: 'ws-pong', payload: {} }));
    ws.on('message', (data, binary) => engine.receive(epoch, Buffer.isBuffer(data) ? data : Buffer.concat(data as Buffer[]), binary));
    // No raw error objects: they can contain endpoint/credential text.
    ws.on('error', () => engine.record({ kind: 'ws-error', payload: {} }));
    ws.on('unexpected-response', (_request, response) => {
      engine.record({ kind: 'ws-auth-failure', payload: { statusCode: response.statusCode } });
      response.resume(); engine.fail();
    });
    ws.on('close', (code, reasonBuffer) => {
      engine.record({ kind: 'ws-close', payload: { code, reason: reasonBuffer.toString('utf8').slice(0, 200) } });
      engine.disconnected(epoch);
      if (!closed && !engine.stopped) {
        const delay = Math.min(10000, 500 * 2 ** Math.min(attempts++, 5));
        engine.record({ kind: 'ws-reconnect-scheduled', payload: { delayMs: delay, attempt: attempts } });
        reconnect = setTimeout(connect, delay);
      }
    });
  };
  process.once('SIGINT', () => { engine.stopped = true; void engine.idle().then(() => finish(true)).catch(() => finish(false)); });
  process.once('SIGTERM', () => { engine.stopped = true; void engine.idle().then(() => finish(true)).catch(() => finish(false)); });
  // Acquire before opening a socket: a second connection can fence the first
  // at the server before its initial snapshot reveals the run identity.
  unlockHost = acquireLock('host-worker', 'single-owner');
  connect();
}
void main().catch(() => { console.error('Worker startup failed. Check configuration, journal integrity, and local lock ownership.'); process.exitCode = 1; });
