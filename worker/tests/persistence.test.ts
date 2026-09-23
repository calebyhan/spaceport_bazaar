import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { acquireLock, Journal } from '../persistence';
import { Engine } from '../engine';
import { encodeServer, decodeClient } from '../codec';
import { snapshot } from './fixtures';

test('host/run lock refuses a concurrent owner and can be released', () => {
  const id = randomUUID(); const release = acquireLock(id, 'station');
  try { assert.throws(() => acquireLock(id, 'station'), /EEXIST/); } finally { release(); }
  acquireLock(id, 'station')();
});
test('durable journal restores uncertain commands after process restart', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'bazaar-journal-'));
  const journal = new Journal(dir);
  const first = new Engine({ sink: journal });
  const epoch = first.connect({ send: () => {}, close: () => {} });
  const s = snapshot();
  first.receive(epoch, encodeServer({ state: s }));
  first.receive(epoch, encodeServer({ readiness: { protocol_version: '2.0', run_id: s.run_id, ready: true, snapshot_sequence: 1n } }));
  await first.idle(); const request = first.state.pending[0].requestId;
  first.disconnected(epoch); journal.close();
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
  second.disconnected(epoch2); reopened.close();
  // Resuming the same run_id after a restart continues its own file rather
  // than starting a new one.
  assert.equal(readdirSync(dir).length, 1);
});
test('a new run_id gets its own journal file instead of joining the last one', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'bazaar-journal-rotate-'));
  const first = new Journal(dir);
  const engineA = new Engine({ sink: first });
  const epochA = engineA.connect({ send: () => {}, close: () => {} });
  const s1 = snapshot();
  engineA.receive(epochA, encodeServer({ state: s1 }));
  await engineA.idle(); engineA.disconnected(epochA); first.close();
  assert.equal(readdirSync(dir).length, 1);
  const second = new Journal(dir);
  const engineB = new Engine({ sink: second, previous: second.previous });
  const epochB = engineB.connect({ send: () => {}, close: () => {} });
  const s2 = snapshot({ run_id: randomUUID() });
  engineB.receive(epochB, encodeServer({ state: s2 }));
  await engineB.idle(); engineB.disconnected(epochB); second.close();
  assert.equal(readdirSync(dir).length, 2);
});
test('torn journal fails closed instead of losing pending tracking', () => {
  const dir = mkdtempSync(join(tmpdir(), 'bazaar-torn-'));
  writeFileSync(join(dir, 'events.jsonl'), '{"kind":');
  assert.throws(() => new Journal(dir));
});
