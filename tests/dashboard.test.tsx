import { afterEach, expect, test, vi } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
vi.mock('server-only', () => ({}));
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
  expect(data).toEqual({ configuration: 'ready', run: { externalId: 'run-42', stationId: 'P01', status: 'running', startedAt: run.started_at }, snapshot: { inventory: { water: 0, food: 2, components: 3 }, tick: 0, worldVersion: 9, updatedAt: run.started_at }, events: [{ id: 7, direction: 'inbound', kind: 'state', created_at: run.started_at }] });
  const urls = fetcher.mock.calls.map(([url]) => new URL(String(url)));
  expect(urls[0].searchParams.get('order')).toBe('started_at.desc');
  expect(urls[0].searchParams.get('limit')).toBe('1');
  expect(urls[1].searchParams.get('run_id')).toBe('eq.internal');
  expect(urls[2].searchParams.get('limit')).toBe('8');
  const html = renderToStaticMarkup(await HomePage());
  expect(html).toContain('Database connected'); expect(html).toContain('run-42');
  expect(html).toContain('<dd>0</dd>'); expect(html).toContain('Tick 0');
  expect(html).toContain('inbound'); expect(html).toContain('<time>');
});
test.each([[], null])('empty runs %s produce an empty ready dashboard', async runs => {
  const fetcher = database({ runs });
  expect(await loadDashboard()).toEqual({ configuration: 'ready', run: null, snapshot: null, events: [] });
  expect(fetcher).toHaveBeenCalledTimes(1);
  const html = renderToStaticMarkup(await HomePage());
  expect(html).toContain('No recorded run'); expect(html).toContain('No events recorded yet.');
});
test('a run without a snapshot renders placeholders', async () => {
  database();
  expect((await loadDashboard()).snapshot).toBeNull();
  expect(renderToStaticMarkup(await HomePage())).toContain('Tick —');
});
test.each(['runs', 'current_snapshots', 'events'])('%s errors surface as an unavailable database', async fail => {
  database({ fail });
  expect(await loadDashboard()).toEqual({ configuration: 'error', message: 'Database unavailable: offline', run: null, snapshot: null, events: [] });
  const html = renderToStaticMarkup(await HomePage());
  expect(html).toContain('Setup needed'); expect(html).toContain('Database unavailable: offline');
});
test('layout preserves content, language, and metadata', () => {
  expect(renderToStaticMarkup(<RootLayout><p>Content</p></RootLayout>)).toContain('<html lang="en"><head></head><body><p>Content</p></body></html>');
  expect(metadata.title).toBe('Spaceport Bazaar');
});
