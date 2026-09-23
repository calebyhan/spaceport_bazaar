import WebSocket from 'ws';
import { readFileSync } from 'node:fs';
import { Engine } from './engine';
import { acquireLock, Journal, SupabaseSink, type Sink } from './persistence';
import { defaultConfig } from './types';

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
  const settings = { reserveTicks: 'BAZAAR_RESERVE_TICKS', quantity: 'BAZAAR_QUANTITY', giveUnits: 'BAZAAR_GIVE_UNITS', receiveUnits: 'BAZAAR_RECEIVE_UNITS', ttl: 'BAZAAR_TTL', cooldownTicks: 'BAZAAR_COOLDOWN_TICKS' } as const;
  for (const [key, variable] of Object.entries(settings)) {
    const value = process.env[variable];
    if (value) {
      if (!/^[1-9][0-9]*$/.test(value) || BigInt(value) > 10000n) throw new Error('Invalid policy configuration');
      config[key as keyof typeof settings] = BigInt(value);
    }
  }
  let unlock: (() => void) | undefined, socket: WebSocket | undefined, reconnect: NodeJS.Timeout | undefined;
  let closed = false, attempts = 0;
  let unlockHost: (() => void) | undefined;
  const finish = (success: boolean) => {
    if (closed) return;
    closed = true; clearTimeout(reconnect); socket?.close();
    unlock?.(); unlockHost?.(); journal.close();
    console.log(success ? 'Worker completed.' : 'Worker stopped; inspect the local journal before recovery.');
    process.exitCode = success ? 0 : 1;
  };
  const engine = new Engine({ config, exercise, previous: journal.previous,
    sink: { append: async entry => { await journal.append(entry); await mirror?.append(entry); } },
    identity: s => { unlock = acquireLock(s.run_id, s.self_station_id); },
    done: () => finish(true), fatal: () => { void engine.idle().then(() => finish(false)).catch(() => finish(false)); },
  });
  const connect = () => {
    if (closed) return;
    const ws = new WebSocket(endpoint, 'bazaar.protobuf.v2', { headers: { Authorization: `Bearer ${token}` }, handshakeTimeout: 10000, maxPayload: 16 * 1024 * 1024, followRedirects: false });
    socket = ws;
    const epoch = engine.connect({ send: bytes => { if (ws.readyState !== WebSocket.OPEN) throw new Error('Socket not open'); ws.send(bytes, { binary: true }, error => { if (error) ws.terminate(); }); }, close: () => ws.close() });
    ws.on('open', () => { if (ws.protocol !== 'bazaar.protobuf.v2') { engine.fail(); return; } attempts = 0; });
    ws.on('message', (data, binary) => engine.receive(epoch, Buffer.isBuffer(data) ? data : Buffer.concat(data as Buffer[]), binary));
    ws.on('error', () => { /* No raw errors: headers/credentials must stay private. */ });
    ws.on('unexpected-response', (_request, response) => { response.resume(); engine.fail(); });
    ws.on('close', () => {
      engine.disconnected(epoch);
      if (!closed && !engine.stopped) reconnect = setTimeout(connect, Math.min(10000, 500 * 2 ** Math.min(attempts++, 5)));
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
