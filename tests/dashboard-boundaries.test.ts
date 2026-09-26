import { expect, test, vi } from 'vitest';
vi.mock('server-only', () => ({}));
vi.mock('../lib/supabase', () => ({ getSupabaseAdmin: vi.fn() }));
import { getSupabaseAdmin } from '../lib/supabase';
import { loadDashboard } from '../lib/dashboard';
test.each([false, true])('nullable query responses and errors without messages are handled (error=%s)', async fail => {
  const run = { id: 'id', external_run_id: 'run', station_id: 'station', status: 'running', started_at: 'now' };
  const client = { from: (table: string) => {
    const response = table === 'runs' ? { data: [run], error: null } : { data: null, error: fail ? {} : null };
    const query = { select: () => query, order: () => query, eq: () => query, limit: async () => response, maybeSingle: async () => response };
    return query;
  } };
  vi.mocked(getSupabaseAdmin).mockReturnValue(client as unknown as NonNullable<ReturnType<typeof getSupabaseAdmin>>);
  const data = await loadDashboard();
  if (fail) expect(data).toEqual({ configuration: 'error', message: 'Database unavailable: Unknown database error', run: null, snapshot: null, events: [] });
  else { expect(data.configuration).toBe('ready'); expect(data.events).toEqual([]); expect(data.snapshot).toBeNull(); }
});
