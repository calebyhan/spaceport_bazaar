import { afterEach, expect, test, vi } from 'vitest';
import { SupabaseSink } from '../persistence';
import { snapshot } from './fixtures';
afterEach(() => vi.unstubAllGlobals());
function setup(failAt = -1, missingRun = false) {
  const requests: { table: string; method: string; body: Record<string, unknown>; url: URL }[] = [];
  vi.stubGlobal('fetch', vi.fn(async (url: string | URL | Request, options?: RequestInit) => {
    const parsed = new URL(String(url));
    const table = parsed.pathname.split('/').at(-1)!;
    requests.push({ table, url: parsed, method: options!.method!, body: JSON.parse(String(options!.body)) });
    expect(options!.signal).toBeInstanceOf(AbortSignal);
    return new Response(JSON.stringify(requests.length === failAt ? { message: 'private server detail' } : table === 'runs' ? missingRun ? null : { id: 'db-run' } : null), { status: requests.length === failAt ? 400 : 200, headers: { 'content-type': 'application/json' } });
  }));
  return { sink: new SupabaseSink('https://database.example', 'test-secret'), requests };
}
test('sink waits for identity, stores exact integers and connection identity, and mirrors command lifecycle', async () => {
  const { sink, requests } = setup();
  await sink.append({ kind: 'ready', payload: {} }); expect(requests).toHaveLength(0);
  const s = snapshot({ world_version: 9007199254740993n });
  await sink.append({ kind: 'state', payload: s, direction: 'inbound', connection: { processId: 'process', epoch: 2 } });
  expect(requests.map(r => r.table)).toEqual(['runs', 'current_snapshots', 'events']);
  expect(requests[0].body.status).toBe('running');
  expect(requests[1].body.world_version).toBe('9007199254740993');
  expect(requests[2].body).toMatchObject({ direction: 'inbound', source_sequence: '1', payload: { _connection: { processId: 'process', epoch: 2 } } });
  await sink.append({ kind: 'command', requestId: 'req', payload: { action: { kind: 'accept' } } });
  expect(requests.at(-1)?.body).toMatchObject({ status: 'prepared', command_type: 'accept', request_id: 'req' });
  for (const kind of ['sent', 'uncertain', 'cancelled', 'control-rejected']) {
    await sink.append({ kind, requestId: 'req', payload: {} });
    expect(requests.at(-1)?.body.status).toBe(kind);
    expect(requests.at(-1)?.url.searchParams.get('run_id')).toBe('eq.db-run');
    expect(requests.at(-1)?.url.searchParams.get('request_id')).toBe('eq.req');
  }
  for (const ok of [true, false]) {
    await sink.append({ kind: 'result', requestId: 'req', payload: { ok, code: 9 } });
    expect(requests.at(-1)?.body).toMatchObject({ status: ok ? 'succeeded' : 'rejected', result_code: '9' });
  }
});
test.each([[1, 'Run'], [2, 'Snapshot'], [3, 'Event']] as const)('state persistence failure at request %i stops with a sanitized %s error', async (at, label) => {
  const { sink, requests } = setup(at);
  await expect(sink.append({ kind: 'state', payload: snapshot() })).rejects.toThrow(`${label} persistence failed`);
  expect(requests).toHaveLength(at);
});
test('missing run identity fails closed', async () => {
  const { sink } = setup(-1, true);
  await expect(sink.append({ kind: 'state', payload: snapshot() })).rejects.toThrow('Run persistence failed');
});
test.each([['command', 'Command'], ['sent', 'Command status'], ['result', 'Result']])('%s persistence failure is propagated', async (kind, label) => {
  const { sink } = setup(5);
  await sink.append({ kind: 'state', payload: snapshot() });
  await expect(sink.append({ kind, requestId: 'req', payload: { action: { kind: 'accept' }, ok: true } })).rejects.toThrow(`${label} persistence failed`);
});
