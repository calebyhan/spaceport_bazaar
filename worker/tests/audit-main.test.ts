import { afterAll, afterEach, beforeAll, beforeEach, expect, test, vi } from 'vitest';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { json } from '../serialization';
import { offer, snapshot } from './fixtures';

let dir: string, journal: string;
beforeAll(async () => {
  dir = await mkdtemp(join(tmpdir(), 'audit-cli-'));
  journal = join(dir, '2026-09-29-P01-run.jsonl');
  const s = snapshot(); s.offers.items = [offer()];
  const lines = [
    { kind: 'manifest', at: new Date().toISOString(), payload: { server_run_id: 'test-run', station_id: 'ours' } },
    { kind: 'state', at: new Date().toISOString(), payload: s },
  ].map(e => json(e)).join('\n');
  await writeFile(journal, lines + '\n');
  await writeFile(join(dir, '2026-09-29-P02-torn.jsonl'), lines + '\n{"kind":"sta');
});
afterAll(async () => { await rm(dir, { recursive: true, force: true }); });
const argv = process.argv;
beforeEach(() => {
  vi.resetModules(); process.exitCode = 0;
  vi.spyOn(console, 'log').mockImplementation(() => {}); vi.spyOn(console, 'error').mockImplementation(() => {}); vi.spyOn(console, 'clear').mockImplementation(() => {});
});
afterEach(() => { process.argv = argv; process.exitCode = 0; vi.useRealTimers(); vi.restoreAllMocks(); });
async function run(...args: string[]) {
  process.argv = ['node', 'worker/audit/main.ts', ...args];
  await import('../audit/main');
  await vi.waitFor(() => expect(vi.mocked(console.log).mock.calls.length + vi.mocked(console.error).mock.calls.length).toBeGreaterThan(0));
  await new Promise(resolve => setImmediate(resolve));
}
const out = () => vi.mocked(console.log).mock.calls.map(c => String(c[0])).join('\n');
const err = () => vi.mocked(console.error).mock.calls.map(c => String(c[0])).join('\n');

test('status prints the journal path and the operating picture', async () => {
  await run('status', '--journal', journal);
  expect(out()).toContain(`${journal}\nRun test-run as ours`);
  expect(out()).toContain('gift  from supplier-z: we pay nothing, get 2 food');
});

test('status --json is machine readable; --dir picks the newest journal and notes a torn tail', async () => {
  await run('status', '--dir', dir, '--json');
  expect(JSON.parse(out())).toMatchObject({ run: 'test-run', station: 'ours' });
  expect(err()).toContain('partly written line');
});

test('status --follow re-renders every second', async () => {
  vi.useFakeTimers({ toFake: ['setInterval'] });
  await run('status', '--journal', journal, '--follow');
  await vi.advanceTimersByTimeAsync(1000);
  await vi.waitFor(() => expect(vi.mocked(console.log).mock.calls.length).toBe(2));
  expect(console.clear).toHaveBeenCalledOnce();
  vi.clearAllTimers();
});

test('trace finds an offer; an unknown target exits 1', async () => {
  await run('trace', '--journal', journal, '--offer', 'gift');
  expect(out()).toContain('Offer gift: supplier-z -> ours (incoming)');
  expect(process.exitCode).toBe(0);
  vi.resetModules(); vi.mocked(console.log).mockClear();
  await run('trace', '--journal', journal, '--request', 'missing', '--json');
  expect(JSON.parse(out())).toMatchObject({ found: false });
  expect(process.exitCode).toBe(1);
  vi.resetModules(); vi.mocked(console.log).mockClear();
  await run('trace', '--journal', journal, '--request', 'missing');
  expect(out()).toBe('Nothing in this journal refers to request missing.');
});

test('report writes Markdown to a file or JSON to stdout', async () => {
  const file = join(dir, 'report.md');
  await run('report', '--journal', journal, '--out', file);
  expect(err()).toBe(`Wrote ${file}`);
  expect(await readFile(file, 'utf8')).toContain('# Run report: test-run (ours)');
  vi.resetModules(); vi.mocked(console.error).mockClear();
  await run('report', '--journal', journal, '--json');
  expect(JSON.parse(out())).toMatchObject({ run: 'test-run', trades: [] });
});

test('without --journal or --dir the newest file in .local/journal is used', async () => {
  const cwd = process.cwd();
  const home = await mkdtemp(join(tmpdir(), 'audit-home-'));
  await mkdir(join(home, '.local', 'journal'), { recursive: true });
  await writeFile(join(home, '.local', 'journal', '2026-09-29-P01-run.jsonl'), await readFile(journal));
  process.chdir(home);
  try {
    await run('report');
    expect(out()).toContain('# Run report: test-run (ours)');
  } finally { process.chdir(cwd); await rm(home, { recursive: true, force: true }); }
});

test.each([
  [['unknown'], 'Usage: npm run journal:'],
  [['trace', '--journal', 'x'], 'trace needs exactly one of --offer ID or --request ID'],
  [['trace', '--journal', 'x', '--offer', 'a', '--request', 'b'], 'trace needs exactly one of --offer ID or --request ID'],
  [['report', '--dir', '/nonexistent-audit-dir'], 'ENOENT'],
])('%j fails with exit code 2 and a message', async (args, message) => {
  await run(...args);
  expect(err()).toContain(message);
  expect(process.exitCode).toBe(2);
});
