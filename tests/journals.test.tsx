import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { appendFileSync, mkdirSync, mkdtempSync, rmSync, utimesSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
vi.mock('server-only', () => ({}));
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }));
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: () => {} }), notFound: () => { throw new Error('NEXT_HTTP_ERROR_FALLBACK;404'); } }));
import { NextRequest } from 'next/server';
import { activeJournals, findJournal, journalRoot, listJournals, loadRun, startedAt, traceRun, tryLoadRun, type RunView } from '../lib/journals';
import { LineChart, niceStep } from '../app/_components/line-chart';
import { LiveStatus, Outcome, Problems, RunBody, RunHeader, Trading, resultOf, runHref, runState } from '../app/_components/run-view';
import LivePage from '../app/live/page';
import RunsPage from '../app/runs/page';
import RunPage from '../app/runs/[...id]/page';
import { GET } from '../app/api/runs/report/route';
import { setGenerous, setStrategy } from '../app/live/actions';
import { revalidatePath } from 'next/cache';
import { readControls } from '../worker/controls';
import { entries } from '../worker/tests/journal-fixture';

// A finished run (the audit tests' hand-written journal), and the same run
// still in progress: no shutdown records and every record written just now.
const lines = (list: unknown[]) => list.map(e => JSON.stringify(e)).join('\n') + '\n';
const finished = lines(entries);
const running = () => lines(entries.filter(e => e.kind !== 'run-summary' && !(e.kind === 'lifecycle' && (e.payload as { to: string }).to === 'finished'))
  .map(e => ({ ...e, at: new Date().toISOString() })));
const name = (station: string) => `2026-09-29T12-00-00-000Z-${station}-test-run.jsonl`;
let root: string;
beforeEach(() => { root = mkdtempSync(join(tmpdir(), 'journals-')); vi.stubEnv('BAZAAR_JOURNAL_ROOT', root); vi.stubEnv('BAZAAR_CONTROL_FILE', join(root, 'controls.json')); });
afterEach(() => { rmSync(root, { recursive: true, force: true }); vi.unstubAllEnvs(); });
function put(id: string, text: string, ageSeconds = 0) {
  const path = join(root, id);
  mkdirSync(join(path, '..'), { recursive: true });
  writeFileSync(path, text);
  const when = Date.now() / 1000 - ageSeconds;
  utimesSync(path, when, when);
  return path;
}
const params = (id: string, query: Record<string, string | string[]> = {}) => ({ params: Promise.resolve({ id: id.split('/') }), searchParams: Promise.resolve(query) });
const html = async (page: Promise<React.ReactNode> | React.ReactNode) => renderToStaticMarkup(await page);
const load = (id: string) => loadRun(findJournal(id)!);

test('journals are found anywhere under the root, newest first, and only listed files can be opened', () => {
  vi.stubEnv('BAZAAR_JOURNAL_ROOT', '');
  expect(journalRoot()).toBe(resolve('.local'));
  expect(listJournals(join(root, 'missing'))).toEqual([]);
  put('a/old.jsonl', finished, 60);
  put('b/c/new.jsonl', finished);
  put('notes.txt', 'x');
  put('1/2/3/4/5/6/7/too-deep.jsonl', finished);
  const files = listJournals(root);
  expect(files.map(f => f.id)).toEqual(['b/c/new.jsonl', 'a/old.jsonl']);
  expect(findJournal('b/c/new.jsonl', files)?.path).toBe(join(root, 'b/c/new.jsonl'));
  expect(findJournal('../etc/passwd.jsonl', files)).toBeUndefined();
  expect(activeJournals(files).map(f => f.id)).toEqual(['b/c/new.jsonl']);
  expect(startedAt({ ...files[0], id: `x/${name('P01')}` })).toBe(Date.UTC(2026, 8, 29, 12));
  expect(startedAt(files[0])).toBe(files[0].modifiedAt);
});

test('a growing journal is read incrementally, with a partly written last line held back', () => {
  const path = put(name('P01'), '{"kind"');
  expect(loadRun(listJournals()[0])).toMatchObject({ entries: 0, tornTail: true });
  writeFileSync(path, '\n');
  expect(loadRun(listJournals()[0])).toMatchObject({ entries: 0, tornTail: false });
  const text = finished.replace('\n', '\n\n'), half = text.indexOf('\n', text.length / 2) + 10;
  appendFileSync(path, text.slice(0, half));
  const first = loadRun(listJournals()[0]);
  expect(first.tornTail).toBe(true);
  const seen = first.entries;
  appendFileSync(path, text.slice(half));
  const second = loadRun(listJournals()[0]);
  expect(second).toMatchObject({ tornTail: false, entries: entries.length, live: false });
  expect(seen).toBeLessThan(entries.length);
  expect(second.report.trades).toHaveLength(1);
  // A file that shrank was replaced: it is read again from the start.
  writeFileSync(path, lines(entries.slice(0, 3)));
  expect(loadRun(listJournals()[0]).entries).toBe(3);
  // A file listed larger than it is stops at its real end.
  expect(loadRun({ ...listJournals()[0], size: 10 ** 6 }).entries).toBe(3);
});

test('a bad line is tolerated only at the end of a journal', () => {
  const path = put(name('P01'), lines(entries.slice(0, 3)) + '{"torn\n');
  expect(loadRun(listJournals()[0])).toMatchObject({ tornTail: true, entries: 3 });
  appendFileSync(path, lines(entries.slice(3, 4)));
  expect(tryLoadRun(listJournals()[0])).toEqual({ error: `Line 4 of ${path} is not valid JSON` });
  // The failed read is not cached: the same error comes back from scratch.
  expect(tryLoadRun(listJournals()[0]).error).toContain('Line 4');
});

test('many journals stay cached within a bound', () => {
  for (let i = 0; i < 70; i++) put(`many/${i}.jsonl`, lines(entries.slice(0, 2)));
  for (const file of listJournals()) expect(loadRun(file).entries).toBe(2);
});

test('traces answer for an offer or a request', async () => {
  put(name('P01'), finished);
  const file = listJournals()[0];
  expect(await traceRun(file, { offer: 'gift' })).toMatchObject({ found: true, text: expect.stringContaining('Offer gift') });
  expect(await traceRun(file, { request: 'nope' })).toEqual({ found: false, text: 'Nothing in this journal refers to request nope.' });
});

test('niceStep rounds to 1, 2, 2.5, 5 or 10 of a power of ten', () => {
  expect([0, 4, 8, 9, 20, 40].map(max => niceStep(max))).toEqual([1, 1, 2, 2.5, 5, 10]);
});

test('line charts: legend only for several series, flags, end labels that would collide, and no data', () => {
  expect(renderToStaticMarkup(<LineChart label="x" ticks={[]} series={[]} />)).toContain('No tick summaries');
  const two = renderToStaticMarkup(<LineChart label="Stock" ticks={[0, 1, 2]} flagged={[1]} flagLabel="Shortage tick"
    series={[{ key: 'a', label: 'A', values: [1, 2, 3] }, { key: 'b', label: 'B', values: [1, 2, 3] }]} />);
  expect(two).toContain('aria-label="Stock"');
  expect(two).toContain('<title>Tick 1\nA: 2\nB: 2\nShortage tick</title>');
  expect(two).toContain('A 3'); expect(two).not.toContain('B 3');
  expect(two.match(/class="key /g)).toHaveLength(3);
  const one = renderToStaticMarkup(<LineChart label="Health" ticks={[5]} flagged={[5]} maxValue={100} series={[{ key: 'h', label: 'Health', values: [0] }]} />);
  expect(one).toContain('Health 0'); expect(one).not.toContain('class="key');
  expect(one).toContain('>100</text>');
});

test('the live page waits for a first journal', async () => {
  const page = await html(LivePage({ searchParams: Promise.resolve({}) }));
  expect(page).toContain('Waiting for a worker'); expect(page).toContain('Live · updates every 1 s');
});

test('the live page toggles generous mode through the control file the worker reads', async () => {
  const off = await html(LivePage({ searchParams: Promise.resolve({}) }));
  expect(off).toContain('Generous mode · Off'); expect(off).toContain('value="on"'); expect(off).toContain('Turn on');
  const form = new FormData(); form.set('generous', 'on');
  await setGenerous(form);
  expect(readControls()).toEqual({ generous: true }); expect(revalidatePath).toHaveBeenCalledWith('/live');
  const on = await html(LivePage({ searchParams: Promise.resolve({}) }));
  expect(on).toContain('Generous mode · On'); expect(on).toContain('value="off"'); expect(on).toContain('aria-pressed="true"');
  form.set('generous', 'off'); await setGenerous(form);
  expect(readControls()).toEqual({ generous: false });
});

test('the live page shows the most recent run when no worker is writing', async () => {
  put(name('P01'), finished, 60);
  const page = await html(LivePage({ searchParams: Promise.resolve({}) }));
  expect(page).toContain('No worker is writing a journal right now');
  expect(page).toContain('test-run'); expect(page).toContain('Finished');
  expect(page).not.toContain('Live operating picture');
  expect(page).toContain(`href="/runs/${name('P01')}"`);
});

test('the live page follows active workers and lets one be picked', async () => {
  put(`P01/${name('P01')}`, running());
  put(`P02/${name('P02')}`, running());
  const first = await html(LivePage({ searchParams: Promise.resolve({}) }));
  expect(first).toContain('aria-label="Active workers"');
  expect(first).toContain(`aria-current="page" href="/live?run=P01%2F${name('P01')}"`);
  expect(first).toContain('Live operating picture'); expect(first).toContain('running; last record');
  const second = await html(LivePage({ searchParams: Promise.resolve({ run: `P02/${name('P02')}` }) }));
  expect(second).toContain(`Journal <code>P02/${name('P02')}</code>`);
});

test('the live page reports an unreadable journal', async () => {
  put(name('P01'), '{"torn\n{}\n');
  expect(await html(LivePage({ searchParams: Promise.resolve({}) }))).toContain('Could not read');
});

test('the runs page totals every journal and lists each with its outcome', async () => {
  expect(await html(RunsPage())).toContain('No journals yet');
  put(`a/${name('P01')}`, finished, 60);
  put(`b/${name('P02')}`, running());
  put('c/empty.jsonl', lines(entries.slice(0, 3)), 30);
  put(`e/${name('P03')}`, lines(entries.map(e => e.kind !== 'state' ? e : { ...e, payload: { ...(e.payload as object), self: { ...(e.payload as { self: object }).self, failed_once: true, first_failure_tick: { value: '4' } } } })), 120);
  put('d/bad.jsonl', '{"torn\n{}\n', 90);
  const page = await html(RunsPage());
  expect(page).toContain('Unreadable: Line 1');
  expect(page).toContain('No snapshot');
  expect(page).toContain('1 live now');
  expect(page).toContain(`href="/runs/a/${name('P01')}"`);
  expect(page).toContain('class="down">Failed at tick 4'); expect(page).toContain('Survived'); expect(page).toContain('<span class="hint"><code>c/empty.jsonl</code>');
});

test('the run page renders the report, a trace, and refreshes only while live', async () => {
  put(`a/${name('P01')}`, finished);
  put(`b/${name('P02')}`, running());
  put('c/bad.jsonl', '{"torn\n{}\n');
  await expect(RunPage(params('nope.jsonl'))).rejects.toThrow('404');
  expect(await html(RunPage(params('c/bad.jsonl')))).toContain('Could not read');
  const report = await html(RunPage(params(`a/${name('P01')}`, { offer: ['gift', 'other'] })));
  expect(report).toContain('Run report'); expect(report).toContain('Offer gift');
  expect(report).not.toContain('Live · updates');
  for (const text of ['Survived', 'Resources and health per tick', 'Completed trades', 'NOT_FOUND', 'Control errors: code 2 (request r6)',
    'ECONNRESET', 'Stale periods: tick 3', 'application X', 'Decisions and server responses', 'format=md']) expect(report).toContain(text);
  const request = await html(RunPage(params(`a/${name('P01')}`, { request: 'r1' })));
  expect(request).toContain('Request r1');
  const live = await html(RunPage(params(`b/${name('P02')}`)));
  expect(live).toContain('Live · updates every 1 s'); expect(live).toContain('Live operating picture');
});

test('the report downloads as Markdown or JSON', async () => {
  put(`a/${name('P01')}`, finished);
  put('c/bad.jsonl', '{"torn\n{}\n');
  const get = (query: string) => GET(new NextRequest(`http://localhost/api/runs/report?${query}`));
  expect(get('').status).toBe(404);
  expect(get('id=c/bad.jsonl').status).toBe(500);
  const markdown = get(`id=${encodeURIComponent(`a/${name('P01')}`)}`);
  expect(markdown.headers.get('content-disposition')).toBe('attachment; filename="test-run-ours.md"');
  expect(await markdown.text()).toContain('# Run report: test-run (ours)');
  const json = get(`id=a/${name('P01')}&format=json`);
  expect(json.headers.get('content-type')).toBe('application/json');
  expect(JSON.parse(await json.text())).toMatchObject({ run: 'test-run', station: 'ours' });
  put('d/empty.jsonl', lines(entries.slice(0, 1)));
  expect(get('id=d/empty.jsonl').headers.get('content-disposition')).toBe('attachment; filename="run-station.md"');
});

// Variants of one loaded run for the branches a single journal cannot reach.
// The file is fresh, so it is read, never restored from a cached report, and keeps its status.
function variant(change: (run: RunView & { status: NonNullable<RunView['status']> }) => void): RunView {
  put(`v/${name('P01')}`, finished);
  const run = structuredClone(load(`v/${name('P01')}`)) as RunView & { status: NonNullable<RunView['status']> };
  change(run);
  return run;
}

test('run state and result cover live, finished, stopped, failed and missing outcomes', () => {
  expect(runState(variant(r => { r.live = true; }))).toEqual({ label: 'Live', tone: 'live' });
  expect(runState(variant(r => { r.report.outcome!.phase = 'RUNNING'; }))).toEqual({ label: 'Finished', tone: 'done' });
  expect(runState(variant(r => { r.report.outcome!.phase = 'RUNNING'; r.report.outcome!.runSummaryWritten = false; }))).toEqual({ label: 'Stopped', tone: 'warn' });
  expect(runState(variant(r => { r.report.outcome = undefined; }))).toEqual({ label: 'Stopped', tone: 'warn' });
  expect(resultOf(variant(r => { r.report.outcome = undefined; }))).toEqual({ label: 'No snapshot', tone: 'none' });
  expect(resultOf(variant(r => { r.report.outcome!.failed = true; r.report.outcome!.firstFailureTick = '4'; }))).toEqual({ label: 'Failed at tick 4', tone: 'bad' });
  expect(resultOf(variant(r => { r.report.outcome!.phase = 'RUNNING'; })).label).toBe('Alive');
  expect(runHref('a b/c.jsonl', '?x=1')).toBe('/runs/a%20b/c.jsonl?x=1');
});

test('the header and live picture handle missing details and warning states', () => {
  const bare = renderToStaticMarkup(<RunHeader eyebrow="E" run={variant(r => {
    r.report.run = undefined; r.report.strategy = undefined; r.report.commit = undefined; r.tornTail = true;
  })} />);
  expect(bare).toContain('Unidentified run'); expect(bare).toContain('partly written line');
  const warned = renderToStaticMarkup(<LiveStatus run={variant(r => {
    const s = r.status;
    s.lifecycle = undefined; s.lastRecordMs = undefined;
    s.connection!.stale = true; s.connection!.epoch = undefined;
    s.reserves!.failed = true; s.reserves!.resources[0].short = true;
    s.pending = [{ requestId: 'abcdefghij', action: 'wait', ageMs: 1500, uncertain: true }, { requestId: 'k', action: 'wait', ageMs: 0, uncertain: false }];
    s.offers = [{ ...s.offers[0], outgoing: true }];
  })} />);
  for (const text of ['last record ? ago', 'epoch ?', 'Stale', 'Failed', 'Short', 'abcdefgh', 'Uncertain', 'to supplier-z']) expect(warned).toContain(text);
  expect(warned).not.toContain('Lifecycle');
  const empty = renderToStaticMarkup(<LiveStatus run={variant(r => { r.status.connection = undefined; r.status.reserves = undefined; })} />);
  expect(empty).toContain('No snapshot recorded yet.');
  expect(renderToStaticMarkup(<RunBody run={variant(r => { r.report.outcome = undefined; })} />)).toContain('nothing to summarise yet');
});

test('outcome, trading and problem sections cover their empty and signed cases', () => {
  const healthy = variant(r => {
    r.report.history = r.report.history.map(h => ({ ...h, unmet: { water: 0, food: 0, components: 0 } }));
    r.report.outcome!.collectiveSuccess = true;
  });
  const outcome = renderToStaticMarkup(<Outcome run={healthy} />);
  expect(outcome).toContain('every tick fully supplied'); expect(outcome).toContain('collective success yes');
  expect(renderToStaticMarkup(<Outcome run={variant(r => { r.report.outcome!.collectiveSuccess = undefined; })} />)).toContain('not reported');
  const traded = renderToStaticMarkup(<Trading run={variant(r => {
    const t = r.report.trades[0];
    r.report.trades = [{ ...t, outgoing: true, pay: { water: '2', food: '0', components: '0' }, get: { water: '0', food: '0', components: '0' } }, t];
  })} />);
  expect(traded).toContain('our offer'); expect(traded).toContain('class="up">+2'); expect(traded).toContain('class="down">-2'); expect(traded).toContain('All 2 trades');
  expect(renderToStaticMarkup(<Trading run={variant(r => { r.report.trades = []; })} />)).toContain('No trades completed.');
  const quiet = renderToStaticMarkup(<Problems run={variant(r => {
    r.report.rejected = {}; r.report.controlErrors = [{ code: 1 }]; r.report.stale = []; r.report.failures = [];
    r.report.shortages[0] = { ...r.report.shortages[0], lowestStock: undefined as unknown as number, firstShortTick: undefined as unknown as number };
    r.report.disconnections = [{ attempts: 0, durationMs: undefined, ticksMissed: undefined }];
  })} />);
  expect(quiet).toContain('Control errors: code 1.'); expect(quiet).toContain('end of journal'); expect(quiet).toContain('unknown');
  expect(quiet).not.toContain('Stale periods'); expect(quiet).not.toContain('Failures');
  expect(renderToStaticMarkup(<Problems run={variant(r => { r.report.controlErrors = []; })} />)).not.toContain('Control errors');
});

test('strategy selection is available before startup, persists, and preserves generosity', async () => {
  const form = new FormData(); form.set('generous', 'on'); await setGenerous(form);
  const page = await html(LivePage({ searchParams: Promise.resolve({}) }));
  expect(page).toContain('Strategy for next worker'); expect(page).toContain('value="baseline"');
  expect(page).not.toContain('value="observe"');
  form.set('strategy', 'baseline'); await setStrategy(form);
  expect(readControls()).toEqual({ generous: true, strategy: 'baseline' });
  expect(await html(LivePage({ searchParams: Promise.resolve({}) }))).toContain('Baseline</button>');
  form.set('generous', 'off'); await setGenerous(form);
  expect(readControls()).toEqual({ generous: false, strategy: 'baseline' });
  form.set('strategy', 'observe'); await expect(setStrategy(form)).rejects.toThrow('Unknown strategy');
  form.delete('strategy'); await expect(setStrategy(form)).rejects.toThrow('Choose a strategy');
  expect(readControls()).toEqual({ generous: false, strategy: 'baseline' });
});

test.each(['class25', 'surplus50', 'surplus25', 'balanced'])('the dashboard saves %s for the next worker without changing generosity', async strategy => {
  const form = new FormData(); form.set('strategy', strategy);
  await setStrategy(form);
  expect(readControls()).toEqual({ strategy, generous: false });
  const page = await html(LivePage({ searchParams: Promise.resolve({}) }));
  expect(page).toContain(`Strategy for next worker · ${strategy}`);
  expect(page).toContain('Class: 9 clients · 25%');
  expect(page).toContain('50% surplus'); expect(page).toContain('25% surplus'); expect(page).toContain('Balanced supply');
  form.set('generous', 'on'); await setGenerous(form);
  expect(readControls()).toEqual({ strategy, generous: true });
});
