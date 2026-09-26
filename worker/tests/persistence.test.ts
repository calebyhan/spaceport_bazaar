import { afterEach, test } from 'vitest';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { acquireLock, Journal } from '../persistence';
import { Engine } from '../engine';
import { encodeServer, decodeClient } from '../codec';
import { snapshot } from './fixtures';

const directories: string[] = [];
afterEach(() => { for (const path of directories) rmSync(path, { recursive: true, force: true }); directories.length = 0; });
function temporaryDirectory(prefix: string) {
  const path = mkdtempSync(join(tmpdir(), prefix)); directories.push(path); return path;
}

test('host/run lock refuses a concurrent owner and can be released', () => {
  const id = randomUUID(); const release = acquireLock(id, 'station');
  try { assert.throws(() => acquireLock(id, 'station'), /EEXIST/); } finally { release(); }
  acquireLock(id, 'station')();
});
test('durable journal restores uncertain commands after process restart', async () => {
  const path = join(temporaryDirectory('bazaar-journal-'), 'events.jsonl');
  const journal = new Journal(path);
  const sends: unknown[] = [];
  const first = new Engine({ sink: journal });
  const epoch = first.connect({ send: bytes => sends.push(decodeClient(bytes)), close: () => {} });
  const s = snapshot();
  first.receive(epoch, encodeServer({ state: s }));
  first.receive(epoch, encodeServer({ readiness: { protocol_version: '2.0', run_id: s.run_id, ready: true, snapshot_sequence: 1n } }));
  await first.idle(); const request = first.state.pending[0].requestId;
  first.disconnected(epoch); journal.close();
  assert.ok(readFileSync(path, 'utf8').includes(request));
  const reopened = new Journal(path); let submitted = 0;
  const second = new Engine({ sink: reopened, previous: reopened.previous });
  const epoch2 = second.connect({ send: bytes => { const msg = decodeClient(bytes); if (msg.advertise) submitted++; }, close: () => {} });
  second.receive(epoch2, encodeServer({ state: s }));
  second.receive(epoch2, encodeServer({ readiness: { protocol_version: '2.0', run_id: s.run_id, ready: true, snapshot_sequence: 1n } }));
  await second.idle(); assert.equal(submitted, 0); assert.equal(second.state.pending[0].requestId, request);
  second.disconnected(epoch2); reopened.close();
});
test('torn journal fails closed instead of losing pending tracking', () => {
  const path = join(temporaryDirectory('bazaar-torn-'), 'events.jsonl');
  writeFileSync(path, '{"kind":'); assert.throws(() => new Journal(path));
});
