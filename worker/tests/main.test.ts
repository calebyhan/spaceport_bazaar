import { EventEmitter } from 'node:events';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import type { EngineOptions, Transport } from '../engine';
const f = vi.hoisted(() => ({ sockets: [] as (EventEmitter & { protocol: string; readyState: number; send: ReturnType<typeof vi.fn>; close: ReturnType<typeof vi.fn>; terminate: ReturnType<typeof vi.fn> })[], options: undefined as EngineOptions | undefined, transport: undefined as Transport | undefined, unlock: vi.fn(), journalAppend: vi.fn(), mirrorAppend: vi.fn(), journalClose: vi.fn(), loadEnv: vi.fn(), read: vi.fn(), stopped: false, idle: vi.fn(), fail: vi.fn(), receive: vi.fn(), disconnected: vi.fn() }));
vi.mock('node:fs', () => ({ readFileSync: f.read }));
vi.mock('../persistence', () => ({
  acquireLock: vi.fn(() => f.unlock),
  Journal: class { previous = []; append = f.journalAppend; close = f.journalClose; },
  SupabaseSink: class { append = f.mirrorAppend; },
}));
vi.mock('../engine', () => ({ Engine: class {
  constructor(options: EngineOptions) { f.options = options; }
  get stopped() { return f.stopped; } set stopped(value: boolean) { f.stopped = value; }
  connect(transport: Transport) { f.transport = transport; return 1; }
  idle = f.idle; fail = f.fail; receive = f.receive; disconnected = f.disconnected;
} }));
vi.mock('ws', () => ({ default: class extends EventEmitter {
  static OPEN = 1;
  protocol = 'bazaar.protobuf.v2'; readyState = 1;
  send = vi.fn((_bytes, _options, cb) => cb()); close = vi.fn(); terminate = vi.fn();
  constructor() { super(); f.sockets.push(this); }
} }));
let signals: Map<string, () => void>;
beforeEach(() => {
  vi.resetModules(); vi.clearAllMocks(); vi.useFakeTimers();
  f.sockets.length = 0; f.stopped = false; f.options = undefined; f.idle.mockResolvedValue(undefined);
  signals = new Map();
  vi.spyOn(process, 'once').mockImplementation(((event: string, callback: () => void) => { signals.set(event, callback); return process; }) as typeof process.once);
  vi.spyOn(process, 'loadEnvFile').mockImplementation(f.loadEnv);
  vi.spyOn(console, 'log').mockImplementation(() => {}); vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.stubEnv('BAZAAR_ENDPOINT', 'ws://127.0.0.1:3001/ws'); vi.stubEnv('BAZAAR_TOKEN', 'private-token');
  for (const key of ['BAZAAR_ENV_FILE', 'BAZAAR_CREDENTIAL_FILE', 'BAZAAR_STATION_ID', 'BAZAAR_JOURNAL', 'BAZAAR_RESERVE_TICKS', 'BAZAAR_QUANTITY', 'BAZAAR_GIVE_UNITS', 'BAZAAR_RECEIVE_UNITS', 'BAZAAR_TTL', 'BAZAAR_COOLDOWN_TICKS']) vi.stubEnv(key, undefined);
  process.argv = ['node', 'worker/main.ts']; process.exitCode = 0;
});
const originalArgv = process.argv;
afterEach(() => { process.argv = originalArgv; process.exitCode = 0; vi.useRealTimers(); vi.restoreAllMocks(); vi.unstubAllEnvs(); vi.unstubAllGlobals(); });
async function start() { await import('../main'); await Promise.resolve(); }
test.each(['', 'https://example.com', 'ws://user:pass@example.com'])('invalid endpoint %s fails without opening a socket or logging secrets', async endpoint => {
  vi.stubEnv('BAZAAR_ENDPOINT', endpoint); await start();
  expect(process.exitCode).toBe(1); expect(f.sockets).toHaveLength(0);
  expect(console.error).toHaveBeenCalledWith('Worker startup failed. Check configuration, journal integrity, and local lock ownership.');
});
test.each(['0', '1.5', '10001'])('invalid policy value %s fails startup', async value => {
  vi.stubEnv('BAZAAR_QUANTITY', value); await start(); expect(process.exitCode).toBe(1); expect(f.sockets).toHaveLength(0);
});
test('environment, credential selection, mirror and policy overrides flow into engine', async () => {
  vi.stubEnv('BAZAAR_TOKEN', ''); vi.stubEnv('BAZAAR_ENV_FILE', '/private/env'); vi.stubEnv('BAZAAR_CREDENTIAL_FILE', '/private/credentials');
  vi.stubEnv('BAZAAR_JOURNAL', '/tmp/test-journal'); vi.stubEnv('BAZAAR_QUANTITY', '3');
  vi.stubEnv('SUPABASE_URL', 'https://database.example'); vi.stubEnv('SUPABASE_SECRET_KEY', 'secret');
  f.read.mockReturnValue(JSON.stringify({ players: [{ station_id: 'P02', token: 'other' }, { station_id: 'P01', token: 'token' }] }));
  process.argv.push('--exercise', '--supabase'); await start();
  expect(f.loadEnv).toHaveBeenCalledWith('/private/env'); expect(f.options?.config?.quantity).toBe(3n); expect(f.options?.exercise).toBe(true);
  await f.options!.sink.append({ kind: 'state', payload: {} });
  expect(f.journalAppend).toHaveBeenCalledOnce(); expect(f.mirrorAppend).toHaveBeenCalledOnce();
  f.options!.identity!({ run_id: 'run', self_station_id: 'P01' } as Parameters<NonNullable<EngineOptions['identity']>>[0]);
  f.options!.done!(); f.options!.done!();
  expect(f.unlock).toHaveBeenCalledTimes(2); expect(f.journalClose).toHaveBeenCalledOnce(); expect(process.exitCode).toBe(0);
});
test('unknown credential station fails closed', async () => {
  vi.stubEnv('BAZAAR_TOKEN', ''); vi.stubEnv('BAZAAR_CREDENTIAL_FILE', '/private/credentials'); vi.stubEnv('BAZAAR_STATION_ID', 'absent');
  f.read.mockReturnValue('{"players":[]}'); await start(); expect(process.exitCode).toBe(1);
});
test.each([['', 'secret'], ['https://database.example', '']])('mirror requires both credentials', async (url, key) => {
  vi.stubEnv('SUPABASE_URL', url); vi.stubEnv('SUPABASE_SECRET_KEY', key); process.argv.push('--supabase'); await start(); expect(process.exitCode).toBe(1);
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
  await f.options!.sink.append({ kind: 'ready', payload: {} }); expect(f.mirrorAppend).not.toHaveBeenCalled();
});
test('protocol negotiation and failed upgrades stop the engine', async () => {
  await start(); const ws = f.sockets[0]; ws.protocol = 'wrong'; ws.emit('open');
  const resume = vi.fn(); ws.emit('unexpected-response', {}, { resume });
  expect(f.fail).toHaveBeenCalledTimes(2); expect(resume).toHaveBeenCalledOnce();
});
test('reconnect backs off, resets after open, and stops after shutdown', async () => {
  await start();
  for (const ms of [500, 1000, 2000, 4000, 8000, 10000, 10000]) {
    const count = f.sockets.length; f.sockets.at(-1)!.emit('close');
    await vi.advanceTimersByTimeAsync(ms - 1); expect(f.sockets).toHaveLength(count);
    await vi.advanceTimersByTimeAsync(1); expect(f.sockets).toHaveLength(count + 1);
  }
  f.sockets.at(-1)!.emit('open'); f.sockets.at(-1)!.emit('close'); await vi.advanceTimersByTimeAsync(500);
  expect(f.sockets).toHaveLength(9);
  f.stopped = true; f.sockets.at(-1)!.emit('close'); await vi.advanceTimersByTimeAsync(10000); expect(f.sockets).toHaveLength(9);
  f.options!.done!(); f.sockets.at(-1)!.emit('close'); await vi.advanceTimersByTimeAsync(10000); expect(f.sockets).toHaveLength(9);
});
test.each(['SIGINT', 'SIGTERM'])('%s drains persistence and closes once', async signal => {
  await start(); signals.get(signal)!(); await Promise.resolve(); await Promise.resolve();
  expect(f.stopped).toBe(true); expect(f.journalClose).toHaveBeenCalledOnce(); expect(process.exitCode).toBe(0);
});
test.each(['SIGINT', 'SIGTERM', 'fatal'])('%s handles persistence rejection', async signal => {
  await start(); f.idle.mockRejectedValue(new Error('disk failure'));
  if (signal === 'fatal') f.options!.fatal!(); else signals.get(signal)!();
  await Promise.resolve(); await Promise.resolve(); await Promise.resolve();
  expect(process.exitCode).toBe(1); expect(f.journalClose).toHaveBeenCalledOnce();
});
test('fatal engine outcome stops even when persistence drained successfully', async () => {
  await start(); f.options!.fatal!(); await Promise.resolve(); await Promise.resolve(); expect(process.exitCode).toBe(1);
});
test('an already queued reconnect callback cannot reopen a finished worker', async () => {
  const timer = vi.spyOn(globalThis, 'setTimeout');
  await start(); f.sockets[0].emit('close');
  const callback = timer.mock.calls.at(-1)![0] as () => void;
  f.options!.done!(); callback(); expect(f.sockets).toHaveLength(1);
});
