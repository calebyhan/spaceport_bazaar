import { afterEach, test } from 'vitest';
import assert from 'node:assert/strict';
import { mkdtempSync, readdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
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
  const dir = temporaryDirectory('bazaar-journal-');
  const journal = new Journal(dir);
  const first = new Engine({ sink: journal });
  const epoch = first.connect({ send: () => {}, close: () => {} });
  const s = snapshot();
  first.receive(epoch, encodeServer({ state: s }));
  first.receive(epoch, encodeServer({ readiness: { protocol_version: '2.0', run_id: s.run_id, ready: true, snapshot_sequence: 1n } }));
  await first.idle(); const request = first.state.pending[0].requestId;
  first.disconnected(epoch); await first.idle(); journal.close();
  const files = readdirSync(dir);
  assert.equal(files.length, 1);
  const written = readFileSync(join(dir, files[0]), 'utf8');
  assert.ok(written.includes(request));
  const reopened = new Journal(dir); let submitted = 0;
  const second = new Engine({ sink: reopened, previous: reopened.previous });
  const epoch2 = second.connect({ send: bytes => { const msg = decodeClient(bytes); if (msg.advertise) submitted++; }, close: () => {} });
  second.receive(epoch2, encodeServer({ state: s }));
  second.receive(epoch2, encodeServer({ readiness: { protocol_version: '2.0', run_id: s.run_id, ready: true, snapshot_sequence: 1n } }));
  await second.idle(); assert.equal(submitted, 0); assert.equal(second.state.pending[0].requestId, request);
  second.disconnected(epoch2); await second.idle(); reopened.close();
  // Resuming the same run_id after a restart continues its own file rather
  // than starting a new one.
  assert.equal(readdirSync(dir).length, 1);
});
test('a new run_id gets its own journal file instead of joining the last one', async () => {
  const dir = temporaryDirectory('bazaar-journal-rotate-');
  const first = new Journal(dir);
  const engineA = new Engine({ sink: first });
  const epochA = engineA.connect({ send: () => {}, close: () => {} });
  const s1 = snapshot();
  engineA.receive(epochA, encodeServer({ state: s1 }));
  await engineA.idle(); engineA.disconnected(epochA); await engineA.idle(); first.close();
  assert.equal(readdirSync(dir).length, 1);
  const second = new Journal(dir);
  const engineB = new Engine({ sink: second, previous: second.previous });
  const epochB = engineB.connect({ send: () => {}, close: () => {} });
  const s2 = snapshot({ run_id: randomUUID() });
  engineB.receive(epochB, encodeServer({ state: s2 }));
  await engineB.idle(); engineB.disconnected(epochB); await engineB.idle(); second.close();
  assert.equal(readdirSync(dir).length, 2);
});
test('records buffered before any run identity are flushed to an unidentified file on close', async () => {
  const dir = temporaryDirectory('bazaar-journal-unidentified-');
  const journal = new Journal(dir);
  await journal.append({ kind: 'ws-error', payload: {} });
  assert.equal(readdirSync(dir).length, 0);
  journal.close();
  const files = readdirSync(dir);
  assert.equal(files.length, 1); assert.match(files[0], /-unidentified\.jsonl$/);
  assert.equal(JSON.parse(readFileSync(join(dir, files[0]), 'utf8')).kind, 'ws-error');
  new Journal(dir).close();
});
test('torn journal fails closed instead of losing pending tracking', () => {
  const dir = temporaryDirectory('bazaar-torn-');
  writeFileSync(join(dir, 'events.jsonl'), '{"kind":');
  assert.throws(() => new Journal(dir));
});
