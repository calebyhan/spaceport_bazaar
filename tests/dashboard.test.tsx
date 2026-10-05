import { summarizeResponsiveness } from '../lib/responsiveness';
import { afterEach, expect, test, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
vi.mock('server-only', () => ({}));
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: () => {} }) }));
import { getSupabaseEnvironment } from '../lib/env';
import { getSupabaseAdmin } from '../lib/supabase';
import { loadDashboard } from '../lib/dashboard';
import { GET } from '../app/api/health/route';
import HomePage from '../app/page';
import RootLayout, { metadata } from '../app/layout';

afterEach(() => { vi.unstubAllEnvs(); vi.unstubAllGlobals(); });
function configure() {
  vi.stubEnv('SUPABASE_URL', 'https://database.example');
  vi.stubEnv('SUPABASE_SECRET_KEY', 'test-secret');
}
const run = { id: 'internal', external_run_id: 'run-42', station_id: 'P01', status: 'running', started_at: '2026-09-01T12:00:00Z' };
function database(options: { runs?: unknown; snapshot?: unknown; events?: unknown; fail?: string; message?: string } = {}) {
  configure();
  const fetcher = vi.fn(async (url: string | URL | Request) => {
    const table = String(url).split('/rest/v1/')[1]?.split('?')[0];
    const failed = table === options.fail;
    const data = table === 'runs' ? (options.runs === undefined ? [run] : options.runs) : table === 'events' ? (options.events ?? []) : (options.snapshot ?? null);
    return new Response(JSON.stringify(failed ? { message: options.message ?? 'offline' } : data), { status: failed ? 500 : 200, headers: { 'content-type': 'application/json' } });
  });
  vi.stubGlobal('fetch', fetcher);
  return fetcher;
}
test('missing and partial credentials disable database access and report a 503 without exposing secrets', async () => {
  vi.stubEnv('SUPABASE_URL', ''); vi.stubEnv('SUPABASE_SECRET_KEY', '');
  expect(getSupabaseEnvironment()).toBeNull(); expect(getSupabaseAdmin()).toBeNull();
  expect((await loadDashboard()).configuration).toBe('missing');
  expect(GET().status).toBe(503);
  vi.stubEnv('SUPABASE_URL', 'https://database.example');
  expect(getSupabaseEnvironment()).toBeNull();
  configure();
  expect(GET().status).toBe(200);
  expect(await GET().json()).toEqual({ service: 'spaceport-bazaar-dashboard', databaseConfigured: true });
});
test('dashboard maps database rows and queries the latest run with bounded, run-scoped events', async () => {
  const fetcher = database({ snapshot: { inventory: { water: 0, food: 2, components: 3 }, tick: 0, world_version: 9, updated_at: run.started_at }, events: [{ id: 7, direction: 'inbound', kind: 'state', created_at: run.started_at }] });
  const data = await loadDashboard();
  expect(data).toEqual({ configuration: 'ready', run: { externalId: 'run-42', stationId: 'P01', status: 'running', startedAt: run.started_at }, snapshot: { inventory: { water: 0, food: 2, components: 3 }, tick: 0, worldVersion: 9, updatedAt: run.started_at }, events: [{ id: 7, direction: 'inbound', kind: 'state', created_at: run.started_at }], responsiveness: summarizeResponsiveness([]) });
  const urls = fetcher.mock.calls.map(([url]) => new URL(String(url)));
  expect(urls[0].searchParams.get('order')).toBe('started_at.desc');
  expect(urls[0].searchParams.get('limit')).toBe('1');
  expect(urls[1].searchParams.get('run_id')).toBe('eq.internal');
  expect(urls[2].searchParams.get('limit')).toBe('500');
  const html = renderToStaticMarkup(await HomePage());
  expect(html).toContain('Database connected'); expect(html).toContain('run-42');
  expect(html).toContain('<dd>0</dd>'); expect(html).toContain('Tick 0');
  expect(html).toContain('inbound'); expect(html).toContain('<time>');
  expect(html).toContain('Live · updates every 2 s');
});
test.each([[], null])('empty runs %s produce an empty ready dashboard', async runs => {
  const fetcher = database({ runs });
  expect(await loadDashboard()).toEqual({ configuration: 'ready', run: null, snapshot: null, events: [], responsiveness: summarizeResponsiveness([]) });
  expect(fetcher).toHaveBeenCalledTimes(1);
  const html = renderToStaticMarkup(await HomePage());
  expect(html).toContain('No recorded run'); expect(html).toContain('No events recorded yet.');
});
test('a run without a snapshot renders placeholders', async () => {
  database();
  expect((await loadDashboard()).snapshot).toBeNull();
  expect(renderToStaticMarkup(await HomePage())).toContain('Tick —');
});
test('dashboard summarizes responsiveness samples and keeps telemetry out of the visible timeline', async () => {
  database({ events: [
    { id: 10, direction: 'internal', kind: 'responsiveness', created_at: run.started_at, payload: { metric: 'event', duration_ms: 12, busy: true } },
    { id: 9, direction: 'internal', kind: 'responsiveness', created_at: run.started_at, payload: { metric: 'decision', duration_ms: 4, intentional_wait: true } },
    { id: 8, direction: 'internal', kind: 'responsiveness', created_at: run.started_at, payload: { metric: 'response', duration_ms: 80 } },
    { id: 7, direction: 'internal', kind: 'responsiveness', created_at: run.started_at, payload: { metric: 'deadline', missed_deadline: true } },
    { id: 6, direction: 'inbound', kind: 'state', created_at: run.started_at },
  ] });
  const data = await loadDashboard();
  expect(data.responsiveness).toMatchObject({ timings: { event: { samples: 1, medianMs: 12 }, decision: { samples: 1, medianMs: 4 }, response: { samples: 1, medianMs: 80 }, queue: { samples: 0, medianMs: null } }, decisions: 1, intentionalWaits: 1, missedDeadlines: 1, updatesWhileBusy: 1 });
  expect(data.events).toHaveLength(1);
  expect(renderToStaticMarkup(await HomePage())).toContain('Updates while busy');
});
test.each(['runs', 'current_snapshots', 'events'])('%s errors surface as an unavailable database', async fail => {
  database({ fail });
  expect(await loadDashboard()).toEqual({ configuration: 'error', message: 'Database unavailable: offline', run: null, snapshot: null, events: [], responsiveness: summarizeResponsiveness([]) });
  const html = renderToStaticMarkup(await HomePage());
  expect(html).toContain('Setup needed'); expect(html).toContain('Database unavailable: offline');
  expect(html).not.toContain('Live · updates');
});
test('layout preserves content, language, and metadata', () => {
  const page = renderToStaticMarkup(<RootLayout><p>Content</p></RootLayout>);
  expect(page).toMatch(/^<html lang="en"><head><\/head><body><nav class="site-nav" aria-label="Dashboard">.*<\/nav><p>Content<\/p><\/body><\/html>$/);
  for (const href of ['/live', '/runs', '/']) expect(page).toContain(`href="${href}"`);
  expect(metadata.title).toBe('Spaceport Bazaar');
});
test.each([false, true])('activity renders fresh waiting or stale evidence (stale=%s)', async stale => {
  database({ events: [{ id: 1, direction: 'internal', kind: 'responsiveness', created_at: run.started_at,
    payload: { metric: 'activity', activity: 'waiting', reason: 'No useful trade', since: 0, deadline_ms: 2000, observed_at: Date.now() - (stale ? 10000 : 0) } }] });
  const html = renderToStaticMarkup(await HomePage());
  expect(html).toContain(stale ? 'Stalled or telemetry delayed' : '<strong>waiting</strong>');
  expect(html).toContain('No useful trade'); expect(html).toContain('Latest 500 recorded events');
});
