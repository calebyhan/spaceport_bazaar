import { EventEmitter } from 'node:events';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import type { EngineOptions, Transport } from '../engine';
const f = vi.hoisted(() => ({ sockets: [] as (EventEmitter & { protocol: string; readyState: number; send: ReturnType<typeof vi.fn>; close: ReturnType<typeof vi.fn>; terminate: ReturnType<typeof vi.fn>; ping: ReturnType<typeof vi.fn> })[], options: undefined as EngineOptions | undefined, transport: undefined as Transport | undefined, unlock: vi.fn(), journalAppend: vi.fn(), journalClose: vi.fn(), loadEnv: vi.fn(), read: vi.fn(), stopped: false, idle: vi.fn(), fail: vi.fn(), receive: vi.fn(), disconnected: vi.fn(), record: vi.fn(), journalResolve: vi.fn(), exec: vi.fn(), snapshot: undefined as unknown, last: undefined as unknown, opened: vi.fn(), lock: vi.fn(), journalError: false }));
vi.mock('node:child_process', () => ({ execFileSync: f.exec }));
vi.mock('node:fs', () => ({ readFileSync: f.read, realpathSync: (path: string) => `/real/${path}` }));
vi.mock('../persistence', () => ({
  acquireLock: f.lock,
  Journal: class { previous = []; append = f.journalAppend; close = f.journalClose; resolve = f.journalResolve; constructor() { if (f.journalError) throw new SyntaxError('Unexpected end of JSON input'); } },
}));
vi.mock('../engine', () => ({ Engine: class {
  constructor(options: EngineOptions) { f.options = options; }
  get stopped() { return f.stopped; } set stopped(value: boolean) { f.stopped = value; }
  connect(transport: Transport) { f.transport = transport; return 1; }
  stop() { f.stopped = true; }
  idle = f.idle; fail = f.fail; receive = f.receive; disconnected = f.disconnected; record = f.record; opened = f.opened;
  get state() { return { snapshot: f.snapshot, last: f.last }; }
  config = {}; memory = { attempted: {} };
} }));
vi.mock('ws', () => ({ default: class extends EventEmitter {
  static OPEN = 1;
  protocol = 'bazaar.protobuf.v2'; readyState = 1;
  send = vi.fn((_bytes, _options, cb) => cb()); close = vi.fn(); terminate = vi.fn(); ping = vi.fn();
  constructor() { super(); f.sockets.push(this); }
} }));
let signals: Map<string, () => void>;
beforeEach(() => {
  vi.resetModules(); vi.clearAllMocks(); vi.useFakeTimers();
  f.sockets.length = 0; f.stopped = false; f.options = undefined; f.snapshot = undefined; f.last = undefined; f.journalError = false; f.lock.mockImplementation(() => f.unlock); f.read.mockReset(); f.exec.mockReset(); f.idle.mockResolvedValue(undefined);
  signals = new Map();
  vi.spyOn(process, 'once').mockImplementation(((event: string, callback: () => void) => { signals.set(event, callback); return process; }) as typeof process.once);
  vi.spyOn(process, 'loadEnvFile').mockImplementation(f.loadEnv);
  vi.spyOn(console, 'log').mockImplementation(() => {}); vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.stubEnv('BAZAAR_ENDPOINT', 'ws://127.0.0.1:3001/ws'); vi.stubEnv('BAZAAR_TOKEN', 'private-token');
  for (const key of ['BAZAAR_STRATEGY', 'BAZAAR_ENV_FILE', 'BAZAAR_CREDENTIAL_FILE', 'BAZAAR_STATION_ID', 'BAZAAR_JOURNAL', 'BAZAAR_JOURNAL_DIR', 'BAZAAR_RESERVE_TICKS', 'BAZAAR_LOT', 'BAZAAR_TTL', 'BAZAAR_COOLDOWN_TICKS', 'BAZAAR_MAX_IN_FLIGHT']) vi.stubEnv(key, undefined);
  process.argv = ['node', 'worker/main.ts']; process.exitCode = 0;
});
const originalArgv = process.argv;
afterEach(() => { process.argv = originalArgv; process.exitCode = 0; vi.useRealTimers(); vi.restoreAllMocks(); vi.unstubAllEnvs(); vi.unstubAllGlobals(); });
async function start() { await import('../main'); await Promise.resolve(); }
const printed = () => vi.mocked(console.error).mock.calls.map(call => String(call[0])).join('\n');
test.each([
  ['', 'MISSING_ENDPOINT: BAZAAR_ENDPOINT is not set'],
  ['not a url', 'INVALID_ENDPOINT: BAZAAR_ENDPOINT must be a ws:// or wss:// URL'],
  ['https://example.com', 'INVALID_ENDPOINT: BAZAAR_ENDPOINT must be a ws:// or wss:// URL'],
  ['ws://user:pass@example.com', 'INVALID_ENDPOINT: BAZAAR_ENDPOINT must not contain credentials'],
])('endpoint %j is a configuration failure, without a socket or echoed secrets', async (endpoint, message) => {
  vi.stubEnv('BAZAAR_ENDPOINT', endpoint); await start();
  expect(process.exitCode).toBe(2); expect(f.sockets).toHaveLength(0);
  expect(printed()).toContain(`[configuration] ${message}. Next step:`);
  expect(printed()).toContain('Worker did not start.');
  expect(printed()).not.toContain('user:pass'); expect(printed()).not.toContain('private-token');
});
test.each(['0', '1.5', '10001'])('invalid policy value %s is a configuration failure', async value => {
  vi.stubEnv('BAZAAR_LOT', value); await start(); expect(process.exitCode).toBe(2); expect(f.sockets).toHaveLength(0);
  expect(printed()).toContain('[configuration] INVALID_POLICY_SETTING: BAZAAR_LOT must be an integer from 1 to 10000');
});
test('a missing token is a configuration failure', async () => {
  vi.stubEnv('BAZAAR_TOKEN', ''); await start();
  expect(process.exitCode).toBe(2); expect(printed()).toContain('[configuration] MISSING_TOKEN');
});
test.each([['unreadable', () => { throw new Error('ENOENT /private/credentials'); }], ['invalid JSON', () => '{"players": "secret-token-text']])('a %s credential file is diagnosed without echoing its contents', async (_name, read) => {
  vi.stubEnv('BAZAAR_TOKEN', ''); vi.stubEnv('BAZAAR_CREDENTIAL_FILE', '/private/credentials');
  f.read.mockImplementation(read); await start();
  expect(process.exitCode).toBe(2); expect(printed()).toContain('[configuration] CREDENTIAL_FILE_UNREADABLE');
  expect(printed()).not.toContain('secret-token-text');
});
test('an unreadable environment file is a configuration failure', async () => {
  vi.stubEnv('BAZAAR_ENV_FILE', '/missing/env'); f.loadEnv.mockImplementationOnce(() => { throw new Error('ENOENT'); }); await start();
  expect(process.exitCode).toBe(2); expect(printed()).toContain('[configuration] ENV_FILE_UNREADABLE');
});
test('a torn journal is an application failure that names the recovery step', async () => {
  f.journalError = true; await start();
  expect(process.exitCode).toBe(6); expect(printed()).toContain('[application] JOURNAL_UNREADABLE'); expect(f.sockets).toHaveLength(0);
});
test('a token already in use on this host is an application failure before any socket opens', async () => {
  f.lock.mockImplementation(() => { throw Object.assign(new Error('EEXIST'), { code: 'EEXIST' }); }); await start();
  expect(process.exitCode).toBe(6); expect(printed()).toContain('[application] LOCK_HELD: Another worker on this host is already using this token'); expect(f.sockets).toHaveLength(0);
});
test('locks are keyed by a token hash and the journal directory, never the token itself', async () => {
  vi.stubEnv('BAZAAR_JOURNAL_DIR', 'journal-p02'); await start();
  expect(f.lock.mock.calls).toEqual([['worker-token', expect.stringMatching(/^[0-9a-f]{64}$/)], ['journal-directory', '/real/journal-p02']]);
  expect(JSON.stringify(f.lock.mock.calls)).not.toContain('private-token');
});
test('a journal directory in use releases the token lock and fails before any socket opens', async () => {
  const releaseToken = vi.fn();
  f.lock.mockImplementationOnce(() => releaseToken).mockImplementationOnce(() => { throw new Error('EEXIST'); }); await start();
  expect(process.exitCode).toBe(6); expect(printed()).toContain('[application] LOCK_HELD: Another worker on this host is writing to this journal directory');
  expect(releaseToken).toHaveBeenCalledOnce(); expect(f.sockets).toHaveLength(0);
});
test('a held run lock is reported as LOCK_HELD to the engine', async () => {
  await start();
  f.lock.mockImplementation(() => { throw new Error('EEXIST'); });
  expect(() => f.options!.identity!({ run_id: 'run', self_station_id: 'P01', advertisements: { items: [] } } as unknown as Parameters<NonNullable<EngineOptions['identity']>>[0]))
    .toThrow(expect.objectContaining({ diagnosis: expect.objectContaining({ code: 'LOCK_HELD' }) }));
});
test('environment, credential selection and policy overrides flow into engine', async () => {
  vi.stubEnv('BAZAAR_TOKEN', ''); vi.stubEnv('BAZAAR_ENV_FILE', '/private/env'); vi.stubEnv('BAZAAR_CREDENTIAL_FILE', '/private/credentials');
  vi.stubEnv('BAZAAR_JOURNAL_DIR', '/tmp/test-journal'); vi.stubEnv('BAZAAR_LOT', '3');
  f.read.mockReturnValue(JSON.stringify({ players: [{ station_id: 'P02', token: 'other' }, { station_id: 'P01', token: 'token' }] }));
  process.argv.push('--exercise'); await start();
  expect(f.loadEnv).toHaveBeenCalledWith('/private/env'); expect(f.options?.config?.lot).toBe(3n); expect(f.options?.exercise).toBe(true);
  await f.options!.sink.append({ kind: 'state', payload: {} });
  expect(f.journalAppend).toHaveBeenCalledOnce();
  f.options!.sink.resolve!('run', 'P01'); expect(f.journalResolve).toHaveBeenCalledWith('run', 'P01');
  f.options!.identity!({ run_id: 'run', self_station_id: 'P01', advertisements: { items: [] } } as unknown as Parameters<NonNullable<EngineOptions['identity']>>[0]);
  f.read.mockReturnValueOnce('{"generous":true}');
  expect(f.options!.controls!()).toEqual({ generous: true });
  f.options!.done!(); f.options!.done!();
  expect(f.record).toHaveBeenCalledWith(expect.objectContaining({ kind: 'manifest' }));
  expect(f.unlock).toHaveBeenCalledTimes(3); expect(f.journalClose).toHaveBeenCalledOnce(); expect(process.exitCode).toBe(0);
});
test('the retired single-file journal setting fails startup instead of being ignored', async () => {
  vi.stubEnv('BAZAAR_JOURNAL', '/tmp/old.jsonl'); await start(); expect(process.exitCode).toBe(2); expect(f.sockets).toHaveLength(0);
  expect(printed()).toContain('RETIRED_SETTING');
});
test.each(['{"players":[]}', '{"players":{}}'])('unknown credential station fails closed (%s)', async content => {
  vi.stubEnv('BAZAAR_TOKEN', ''); vi.stubEnv('BAZAAR_CREDENTIAL_FILE', '/private/credentials'); vi.stubEnv('BAZAAR_STATION_ID', 'absent');
  f.read.mockReturnValue(content); await start(); expect(process.exitCode).toBe(2);
  expect(printed()).toContain('[configuration] UNKNOWN_STATION: The credential file has no token for station absent');
});
test('the removed database flag is rejected before startup', async () => {
  process.argv.push('--supabase'); await start();
  expect(process.exitCode).toBe(2); expect(f.sockets).toHaveLength(0);
  expect(printed()).toContain('INVALID_OPTIONS');
});
test('socket forwards binary messages, terminates failed writes, and rejects closed writes', async () => {
  await start(); const ws = f.sockets[0]; ws.emit('open');
  ws.emit('message', Buffer.from('a'), true); ws.emit('message', [Buffer.from('b'), Buffer.from('c')], false);
  expect(f.receive.mock.calls).toEqual([[1, Buffer.from('a'), true], [1, Buffer.from('bc'), false]]);
  f.transport!.send(Buffer.from('x')); expect(ws.send).toHaveBeenCalled();
  ws.send.mockImplementation((_b, _o, cb) => cb(new Error('send failure'))); f.transport!.send(Buffer.from('x')); expect(ws.terminate).toHaveBeenCalledOnce();
  ws.readyState = 0; expect(() => f.transport!.send(Buffer.from('x'))).toThrow('Socket not open');
  f.transport!.close(); expect(ws.close).toHaveBeenCalledOnce();
  ws.emit('error', new Error('secret')); expect(console.error).not.toHaveBeenCalled();
  expect(f.record).toHaveBeenCalledWith({ kind: 'ws-error', payload: { category: 'network', code: 'SOCKET_ERROR' } });
  expect(JSON.stringify(f.record.mock.calls)).not.toContain('secret');
  expect(f.opened).toHaveBeenCalledWith(1);
  await f.options!.sink.append({ kind: 'ready', payload: {} });
});
test('transport close terminates a peer that never completes the close handshake', async () => {
  await start(); const ws = f.sockets[0]; f.transport!.close();
  expect(ws.close).toHaveBeenCalledOnce(); expect(ws.terminate).not.toHaveBeenCalled();
  await vi.advanceTimersByTimeAsync(2000); expect(ws.terminate).toHaveBeenCalledOnce();
});
test('a wrong subprotocol is a protocol failure and is not treated as connected', async () => {
  await start(); const ws = f.sockets[0]; ws.protocol = 'wrong'; ws.emit('open');
  expect(f.fail).toHaveBeenCalledWith(expect.objectContaining({ category: 'protocol', code: 'SUBPROTOCOL_MISMATCH' }));
  expect(f.opened).not.toHaveBeenCalled();
});
test.each([[401, 'authentication', 'HTTP_401'], [403, 'authentication', 'HTTP_403'], [404, 'configuration', 'HTTP_404'], [400, 'protocol', 'HTTP_400']])('HTTP %i upgrade rejection is a final %s failure', async (statusCode, category, code) => {
  await start(); const ws = f.sockets[0];
  const resume = vi.fn(); ws.emit('unexpected-response', {}, { statusCode, resume });
  expect(resume).toHaveBeenCalledOnce();
  expect(f.fail).toHaveBeenCalledWith(expect.objectContaining({ category, code }));
  expect(f.record).toHaveBeenCalledWith({ kind: 'ws-handshake-rejected', payload: { statusCode, category, code } });
});
test('a failing server (HTTP 503) is retried and the retry names the cause', async () => {
  await start(); const ws = f.sockets[0];
  ws.emit('unexpected-response', {}, { statusCode: 503, resume: vi.fn() });
  expect(f.fail).not.toHaveBeenCalled(); expect(ws.terminate).toHaveBeenCalledOnce();
  ws.emit('error', new Error('WebSocket was closed before the connection was established'));
  ws.emit('close', 1006, Buffer.alloc(0));
  expect(printed()).toContain('[network] HTTP_503: The server is reachable but failing.');
  expect(printed()).toContain('Reconnecting in 500 ms (attempt 1).');
  expect(f.record).toHaveBeenCalledWith({ kind: 'ws-reconnect-scheduled', payload: { delayMs: 500, attempt: 1, category: 'network', code: 'HTTP_503' } });
});
test.each([
  ['ECONNREFUSED', '[network] ECONNREFUSED: Nothing is accepting connections at the endpoint'],
  ['ENOTFOUND', '[network] ENOTFOUND: The endpoint host name did not resolve'],
])('socket error %s is printed with its reconnect', async (code, message) => {
  await start(); const ws = f.sockets[0];
  ws.emit('error', Object.assign(new Error(`connect ${code} 127.0.0.1:3001`), { code })); ws.emit('close', 1006, Buffer.alloc(0));
  expect(printed()).toContain(message);
});
test('a handshake the ws library rejects is a final protocol failure, not a retry', async () => {
  await start(); const ws = f.sockets[0];
  ws.emit('error', new Error('Server sent an invalid subprotocol'));
  expect(f.fail).toHaveBeenCalledWith(expect.objectContaining({ category: 'protocol', code: 'SUBPROTOCOL_MISMATCH' }));
});
test('a dropped connection without an error is reported by its close code', async () => {
  await start(); f.sockets[0].emit('open'); f.sockets[0].emit('close', 1001, Buffer.from('bye'));
  expect(printed()).toContain('[network] CLOSE_1001: The server closed the connection.');
});
test('lifecycle changes are printed as one line each', async () => {
  await start(); f.options!.lifecycle!({ from: 'connected', to: 'authenticated', reason: 'Snapshot received', epoch: 1, tick: 3n, phase: 2 });
  expect(console.log).toHaveBeenCalledWith('[lifecycle] connected -> authenticated (tick 3, RUNNING): Snapshot received');
});
test('reconnect backs off, resets after open, and stops after shutdown', async () => {
  await start();
  for (const ms of [500, 1000, 2000, 4000, 8000, 10000, 10000]) {
    const count = f.sockets.length; f.sockets.at(-1)!.emit('close', 1006, Buffer.alloc(0));
    await vi.advanceTimersByTimeAsync(ms - 1); expect(f.sockets).toHaveLength(count);
    await vi.advanceTimersByTimeAsync(1); expect(f.sockets).toHaveLength(count + 1);
  }
  f.sockets.at(-1)!.emit('open'); f.sockets.at(-1)!.emit('close', 1006, Buffer.alloc(0)); await vi.advanceTimersByTimeAsync(500);
  expect(f.sockets).toHaveLength(9);
  f.stopped = true; f.sockets.at(-1)!.emit('close', 1006, Buffer.alloc(0)); await vi.advanceTimersByTimeAsync(10000); expect(f.sockets).toHaveLength(9);
  f.options!.done!(); f.sockets.at(-1)!.emit('close', 1006, Buffer.alloc(0)); await vi.advanceTimersByTimeAsync(10000); expect(f.sockets).toHaveLength(9);
});
test.each(['SIGINT', 'SIGTERM'])('%s drains persistence and closes once, even when repeated', async signal => {
  await start(); signals.get(signal)!(); signals.get(signal)!(); await Promise.resolve(); await Promise.resolve();
  expect(f.stopped).toBe(true); expect(f.journalClose).toHaveBeenCalledOnce(); expect(f.unlock).toHaveBeenCalledTimes(2); expect(process.exitCode).toBe(0);
  expect(console.error).toHaveBeenCalledWith('Shutdown in progress; waiting for durable records and lock release.');
  expect(signals.has(signal)).toBe(true);
});
const persistence = { category: 'application', code: 'PERSISTENCE_FAILED', message: 'A write failed', hint: 'Check the disk' } as const;
test.each(['SIGINT', 'SIGTERM', 'fatal'])('%s handles persistence rejection', async signal => {
  await start(); f.idle.mockRejectedValue(new Error('disk failure'));
  if (signal === 'fatal') f.options!.fatal!(persistence); else signals.get(signal)!();
  await Promise.resolve(); await Promise.resolve(); await Promise.resolve();
  expect(process.exitCode).toBe(signal === 'fatal' ? 6 : 1); expect(f.journalClose).toHaveBeenCalledOnce();
});
test.each([['authentication', 3], ['protocol', 4], ['network', 5], ['application', 6]] as const)('a fatal %s failure prints its diagnosis and exits %i', async (category, code) => {
  await start(); f.options!.fatal!({ ...persistence, category }); await Promise.resolve(); await Promise.resolve();
  expect(process.exitCode).toBe(code);
  expect(printed()).toContain(`[${category}] PERSISTENCE_FAILED: A write failed. Next step: Check the disk`);
});
test('an already queued reconnect callback cannot reopen a finished worker', async () => {
  const timer = vi.spyOn(globalThis, 'setTimeout');
  await start(); f.sockets[0].emit('close', 1006, Buffer.alloc(0));
  const callback = timer.mock.calls.at(-1)![0] as () => void;
  f.options!.done!(); callback(); expect(f.sockets).toHaveLength(1);
});
test('strategy setting reaches the engine and CLI overrides the environment', async () => {
  vi.stubEnv('BAZAAR_STRATEGY', 'observe'); process.argv.push('--strategy=baseline'); await start();
  expect(f.options?.strategyName).toBe('baseline'); expect(f.options?.config?.version).toBe('market-5');
});
test('baseline can be selected using the environment', async () => {
  vi.stubEnv('BAZAAR_STRATEGY', 'baseline'); await start(); expect(f.options?.strategyName).toBe('baseline'); expect(f.options?.config?.version).toBe('market-5');
});
test('strategy listing needs no endpoint, credentials, journal or socket', async () => {
  vi.stubEnv('BAZAAR_ENDPOINT', ''); vi.stubEnv('BAZAAR_TOKEN', ''); process.argv.push('--list-strategies'); await start();
  expect(f.sockets).toHaveLength(0); expect(f.options).toBeUndefined(); expect(console.log).toHaveBeenCalledWith(expect.stringContaining('baseline'));
});
test('invalid strategy selection fails before connecting', async () => {
  process.argv.push('--strategy', 'not-registered'); await start(); expect(process.exitCode).toBe(2); expect(f.sockets).toHaveLength(0);
  expect(printed()).toContain('[configuration] INVALID_OPTIONS: Unknown strategy. Available: baseline');
});

const identity = (s: object) => f.options!.identity!({ run_id: 'run', self_station_id: 'P01', advertisements: { items: [] }, ...s } as unknown as Parameters<NonNullable<EngineOptions['identity']>>[0]);
const manifest = () => f.record.mock.calls.map(([entry]) => entry).find(entry => entry.kind === 'manifest')!.payload;
test('manifest records version, commit, schema checksum and credential-free endpoint', async () => {
  f.read.mockImplementation((path: string) => path === 'package.json' ? '{"version":"1.2.3"}' : Buffer.from('schema'));
  f.exec.mockReturnValue('abc123\n');
  await start(); f.sockets[0].emit('open'); identity({});
  expect(manifest()).toMatchObject({ app_version: '1.2.3', git_commit: 'abc123', endpoint_host: '127.0.0.1', endpoint_port: '3001', strategy: 'baseline', exercise: false });
  expect(manifest().schema_sha256).toHaveLength(64); expect(manifest().connect_utc).toEqual(expect.any(String));
});
test.each([['ws://example.com/ws', '80'], ['wss://example.com/ws', '443']])('manifest without metadata defaults the %s port', async (endpoint, port) => {
  vi.stubEnv('BAZAAR_ENDPOINT', endpoint); f.exec.mockImplementation(() => { throw new Error('no git'); });
  process.argv.push('--exercise'); await start(); identity({});
  expect(manifest()).toMatchObject({ app_version: undefined, git_commit: undefined, schema_sha256: undefined, endpoint_port: port, strategy: 'exercise' });
});
const finalState = (outcome: unknown, first_failure_tick: unknown) => ({
  outcome, self: { failed_once: false, first_failure_tick, inventory: {}, health: 100n },
  offers: { items: [{ status: 1 }, { status: 2 }] }, advertisements: { items: [{ status: 1 }] },
});
test.each([
  [{ null: true }, { null: true }, undefined, undefined, undefined],
  [{ value: { collective_success: { null: true }, aborted: false } }, { value: 3n }, undefined, false, 3n],
  [{ value: { collective_success: { value: true }, aborted: true } }, { null: true }, true, true, undefined],
])('shutdown records a run summary from the final state (%#)', async (outcome, failure, collective, aborted, firstFailure) => {
  f.last = finalState(outcome, failure); await start(); f.options!.done!(); await Promise.resolve(); await Promise.resolve();
  const summary = f.record.mock.calls.map(([entry]) => entry).find(entry => entry.kind === 'run-summary')!.payload;
  expect(summary).toMatchObject({ success: true, collective_success: collective, aborted, first_failure_tick: firstFailure, unresolved_offers: 1, unresolved_advertisements: 1 });
  expect(f.journalClose).toHaveBeenCalledOnce();
});
test('a failing run summary still closes the journal', async () => {
  f.last = finalState({ null: true }, { null: true }); f.idle.mockRejectedValue(new Error('disk failure'));
  await start(); f.options!.done!(); for (let i = 0; i < 4; i++) await Promise.resolve();
  expect(f.journalClose).toHaveBeenCalledOnce(); expect(process.exitCode).toBe(0);
});
test('keepalive pings only an open socket and transport events are journaled', async () => {
  await start(); const ws = f.sockets[0]; ws.emit('open');
  await vi.advanceTimersByTimeAsync(30000); expect(ws.ping).toHaveBeenCalledOnce();
  ws.readyState = 0; await vi.advanceTimersByTimeAsync(30000); expect(ws.ping).toHaveBeenCalledOnce();
  ws.emit('ping'); ws.emit('pong');
  expect(f.record.mock.calls.map(([entry]) => entry.kind)).toEqual(expect.arrayContaining(['ws-open', 'ws-ping', 'ws-pong']));
  ws.emit('close', 1006, Buffer.from('gone'));
  expect(f.record).toHaveBeenCalledWith({ kind: 'ws-close', payload: { code: 1006, reason: 'gone' } });
});

test('saved dashboard strategy is used at startup before the environment default', async () => {
  f.read.mockReturnValueOnce('{"strategy":"baseline","generous":true}');
  vi.stubEnv('BAZAAR_STRATEGY', 'observe');
  await start();
  expect(f.options?.strategyName).toBe('baseline');
});
