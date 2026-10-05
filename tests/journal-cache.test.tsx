import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { appendFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
vi.mock('server-only', () => ({}));
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: () => {} }), notFound: () => { throw new Error('NEXT_HTTP_ERROR_FALLBACK;404'); } }));
import { findJournal, listJournals, loadRun } from '../lib/journals';
import RunPage from '../app/runs/[...id]/page';
import { entries } from '../worker/tests/journal-fixture';

// A finished run is cached beside its journal as `<journal>.report.json`,
// valid only for the size and modification time it was built from.
const lines = (list: unknown[]) => list.map(e => JSON.stringify(e)).join('\n') + '\n';
const finished = lines(entries);
let id = 'run.jsonl';
let root: string, path: string;
const cache = () => `${path}.report.json`;
const age = (seconds: number) => { const when = Date.now() / 1000 - seconds; utimesSync(path, when, when); };
function put(text: string, ageSeconds = 60, name = 'run.jsonl') {
  id = name;
  path = join(root, id);
  writeFileSync(path, text);
  age(ageSeconds);
}
const load = () => loadRun(findJournal(id)!);
const edit = (change: (cached: Record<string, unknown>) => void) => {
  const cached = JSON.parse(readFileSync(cache(), 'utf8'));
  change(cached);
  writeFileSync(cache(), JSON.stringify(cached));
};

beforeEach(() => { root = mkdtempSync(join(tmpdir(), 'journal-cache-')); vi.stubEnv('BAZAAR_JOURNAL_ROOT', root); });
afterEach(() => { rmSync(root, { recursive: true, force: true }); vi.unstubAllEnvs(); });

test('a finished run is cached on first read and restored without its status', () => {
  put(finished);
  const built = load();
  expect(built.status).toBeDefined();
  expect(existsSync(cache())).toBe(true);
  expect(listJournals(root).map(f => f.id)).toEqual([id]);

  edit(cached => { (cached.report as { run: string }).run = 'from-cache'; });
  const restored = load();
  expect(restored.report.run).toBe('from-cache');
  expect(restored.status).toBeUndefined();
  expect(restored).toMatchObject({ live: false, entries: built.entries, tornTail: built.tornTail, startedAt: built.startedAt });
  expect({ ...restored.report, run: built.report.run }).toEqual(JSON.parse(JSON.stringify(built.report)));
});

test('the report page is the same whether it was built or restored', async () => {
  put(finished);
  const page = async () => renderToStaticMarkup(await RunPage({ params: Promise.resolve({ id: [id] }), searchParams: Promise.resolve({}) }));
  const built = await page();
  expect(existsSync(cache())).toBe(true);
  expect(await page()).toBe(built);
});

test('a cache for a different file size, time, version or content is ignored', () => {
  put(finished);
  // Each change must make the cached report unusable, so the journal is read again.
  const rebuilds = (change: () => void, expected: number) => {
    load();
    expect(existsSync(cache())).toBe(true);
    change();
    const run = load();
    expect(run.status).toBeDefined();
    expect(run.entries).toBe(expected);
    expect(JSON.parse(readFileSync(cache(), 'utf8')).size).toBe(run.file.size);
  };
  const count = load().entries;
  rebuilds(() => edit(cached => { cached.version = 0; }), count);
  rebuilds(() => edit(cached => { cached.modifiedAt = 1; }), count);
  rebuilds(() => writeFileSync(cache(), 'not json'), count);
  rebuilds(() => { appendFileSync(path, JSON.stringify({ kind: 'note', payload: {} }) + '\n'); age(60); }, count + 1);
});

test('a run that may still be writing, or has nothing to report, is not cached', () => {
  put(finished, 0, 'active.jsonl');
  load();
  expect(existsSync(cache())).toBe(false);

  put(lines(entries.filter(e => e.kind === 'manifest')), 60, 'empty.jsonl');
  expect(load().report.outcome).toBeUndefined();
  expect(existsSync(cache())).toBe(false);

  // Old file time, but records written just now: still running, so still not cached.
  put(lines(entries.filter(e => e.kind !== 'run-summary' && !(e.kind === 'lifecycle' && (e.payload as { to: string }).to === 'finished'))
    .map(e => ({ ...e, at: new Date().toISOString() }))), 60, 'writing.jsonl');
  expect(load().live).toBe(true);
  expect(existsSync(cache())).toBe(false);
});

test('a cache that cannot be written only costs the speed-up', () => {
  put(finished);
  mkdirSync(`${cache()}.${process.pid}.tmp`);
  expect(load().report.outcome).toBeDefined();
  expect(existsSync(cache())).toBe(false);
});
