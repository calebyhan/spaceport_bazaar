import { afterEach, beforeEach, expect, test, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ read: vi.fn(), check: vi.fn() }));
vi.mock('node:fs', () => ({ readFileSync: mocks.read }));
vi.mock('../scenario', () => ({ checkScenario: mocks.check }));
const argv = process.argv;
beforeEach(() => {
  vi.resetModules(); vi.clearAllMocks();
  process.argv = ['node', 'worker/check-strategy.ts', '--input', 'case.json']; process.exitCode = 0;
  vi.stubEnv('BAZAAR_STRATEGY', undefined);
  mocks.read.mockReturnValue('{"state":{}}'); mocks.check.mockResolvedValue({ strategy: 'baseline', passed: true, decision: { action: { kind: 'wait' } } });
  vi.spyOn(console, 'log').mockImplementation(() => {}); vi.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => { process.argv = argv; process.exitCode = 0; vi.restoreAllMocks(); vi.unstubAllEnvs(); });
async function start() { await import('../check-strategy'); await Promise.resolve(); }
test('offline CLI reads a file and prints a machine-readable passing report', async () => {
  await start(); expect(mocks.read).toHaveBeenCalledWith('case.json', 'utf8');
  expect(mocks.check).toHaveBeenCalledWith({ state: {} }, undefined);
  expect(JSON.parse(vi.mocked(console.log).mock.calls[0][0]).passed).toBe(true);
  expect(process.exitCode).toBe(0);
});
test('CLI strategy overrides environment and a mismatch sets exit code 1', async () => {
  vi.stubEnv('BAZAAR_STRATEGY', 'observe'); process.argv.push('--strategy=baseline');
  mocks.check.mockResolvedValue({ passed: false }); await start();
  expect(mocks.check).toHaveBeenCalledWith({ state: {} }, 'baseline'); expect(process.exitCode).toBe(1);
});
test('environment supplies the strategy when no CLI override is provided', async () => {
  vi.stubEnv('BAZAAR_STRATEGY', 'observe'); await start(); expect(mocks.check).toHaveBeenCalledWith({ state: {} }, 'observe');
});
test.each(['missing-input', 'unknown-flag', 'json', 'read', 'validation'])('%s errors set exit code 2', async problem => {
  if (problem === 'missing-input') process.argv = process.argv.slice(0, 2);
  if (problem === 'unknown-flag') process.argv.push('--wrong');
  if (problem === 'json') mocks.read.mockReturnValue('{');
  if (problem === 'read') mocks.read.mockImplementationOnce(() => { throw new Error('Missing fixture'); });
  if (problem === 'validation') mocks.check.mockRejectedValue(new Error('Invalid fixture'));
  await start(); expect(process.exitCode).toBe(2); expect(console.error).toHaveBeenCalled(); expect(console.log).not.toHaveBeenCalled();
});
