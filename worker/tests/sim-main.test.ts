import { afterEach, beforeEach, expect, test, vi } from 'vitest';
const f = vi.hoisted(() => ({ write: vi.fn(), mkdir: vi.fn(), start: vi.fn(), close: vi.fn(), finish: undefined as undefined | (() => void), options: undefined as unknown }));
vi.mock('node:fs', () => ({ writeFileSync: f.write, mkdirSync: f.mkdir }));
vi.mock('../sim/server', () => ({ startSimServer: vi.fn(async (options: unknown) => {
  f.options = options;
  return { url: 'ws://127.0.0.1:4000/ws', start: f.start, close: f.close, finished: new Promise<void>(resolve => { f.finish = resolve; }) };
}) }));
const argv = process.argv;
let signals: Map<string, () => void>;
beforeEach(() => {
  vi.resetModules(); vi.clearAllMocks(); vi.useFakeTimers();
  f.close.mockResolvedValue(undefined);
  process.argv = ['node', 'worker/sim/main.ts', '--planets', '3', '--duration', '2', '--credentials', 'out/credentials.json', '--report', 'out/report.json'];
  process.exitCode = 0;
  signals = new Map();
  vi.spyOn(process, 'once').mockImplementation(((event: string, callback: () => void) => { signals.set(event, callback); return process; }) as typeof process.once);
  vi.spyOn(console, 'log').mockImplementation(() => {}); vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => { process.argv = argv; process.exitCode = 0; vi.useRealTimers(); vi.restoreAllMocks(); });
async function start() { await import('../sim/main'); await vi.waitFor(() => expect(f.finish).toBeDefined()); }

test('writes validator-shaped private credentials, then a report when the run finishes', async () => {
  f.finish = undefined;
  await start();
  expect(f.options).toMatchObject({ tickMs: 500, host: '127.0.0.1', port: 3100, autoStart: true });
  expect(f.mkdir).toHaveBeenCalledWith('out', { recursive: true });
  const [path, content, mode] = f.write.mock.calls[0];
  expect([path, mode]).toEqual(['out/credentials.json', { mode: 0o600 }]);
  const credentials = JSON.parse(content);
  expect(credentials.endpoint).toBe('ws://127.0.0.1:4000/ws');
  expect(credentials.players.map((p: { station_id: string }) => p.station_id)).toEqual(['P01', 'P02', 'P03']);
  expect(vi.mocked(console.log).mock.calls[1][0]).toBe('The run starts when every planet is ready.');
  const { world } = f.options as { world: { start(): void; advance(): void } };
  world.start(); world.advance(); world.advance();
  f.finish!();
  await vi.waitFor(() => expect(f.close).toHaveBeenCalled());
  const report = JSON.parse(f.write.mock.calls[1][1]);
  expect(f.write.mock.calls[1][0]).toBe('out/report.json');
  expect(report).toMatchObject({ collective_success: true, tick: '2', economy: { planets: 3 } });
  expect(report.stations).toHaveLength(3);
  expect(console.log).toHaveBeenCalledWith('Collective success: true. Report in out/report.json.');
  expect(process.exitCode).toBe(0);
});

test('a failed planet is reported with its failure tick', async () => {
  f.finish = undefined;
  process.argv.push('--stock', '0', '--duration', '12');
  await start();
  const { world } = f.options as { world: { start(): void; advance(): void } };
  world.start();
  for (let i = 0; i < 12; i++) world.advance();
  f.finish!();
  await vi.waitFor(() => expect(f.close).toHaveBeenCalled());
  // No stock and no trades: each tick misses the two non-specialty units,
  // 2 x 5 = 10 damage per tick, so 100 health reaches zero at tick 10.
  expect(console.log).toHaveBeenCalledWith(expect.stringMatching(/^P01 water +failed at tick 10 health 0 resources \d+$/));
  expect(console.log).toHaveBeenCalledWith('Collective success: false. Report in out/report.json.');
});

test('an enabled fault is announced', async () => {
  f.finish = undefined;
  process.argv.push('--fault', 'http-503');
  await start();
  expect(console.log).toHaveBeenCalledWith('Deliberate fault enabled: {"httpStatus":503}');
  expect(f.options).toMatchObject({ faults: { httpStatus: 503 } });
});
test('--start-after-ms starts without waiting for every planet', async () => {
  f.finish = undefined;
  process.argv.push('--start-after-ms', '250');
  await start();
  expect(vi.mocked(console.log).mock.calls[1][0]).toBe('The run starts when every planet is ready or after 250 ms.');
  vi.advanceTimersByTime(250);
  expect(f.start).toHaveBeenCalledOnce();
});

test('SIGINT closes the server with a nonzero exit code', async () => {
  f.finish = undefined;
  await start();
  signals.get('SIGINT')!();
  await vi.waitFor(() => expect(process.exitCode).toBe(1));
  expect(f.close).toHaveBeenCalledOnce();
});

test('invalid options fail with exit code 2 before starting a server', async () => {
  process.argv.push('--planets', '1');
  await import('../sim/main');
  await vi.waitFor(() => expect(process.exitCode).toBe(2));
  expect(console.error).toHaveBeenCalledWith('Simulation failed: --planets must be an integer from 3 to 1000000');
  expect(f.write).not.toHaveBeenCalled();
});
