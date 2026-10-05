import { afterEach, expect, test, vi } from 'vitest';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

// Count fsync calls on the real filesystem; the data still reaches the file.
const fsyncs = vi.hoisted(() => ({ count: 0, failNext: false }));
vi.mock('node:fs', async importOriginal => {
  const actual = await importOriginal<typeof import('node:fs')>();
  return { ...actual, fsyncSync: (fd: number) => {
    fsyncs.count++;
    if (fsyncs.failNext) { fsyncs.failNext = false; throw new Error('fsync failed'); }
    return actual.fsyncSync(fd);
  } };
});
const { Journal } = await import('../persistence');

const directories: string[] = [];
afterEach(() => { vi.useRealTimers(); for (const d of directories.splice(0)) rmSync(d, { recursive: true, force: true }); });
function open() {
  const dir = mkdtempSync(join(tmpdir(), 'bazaar-sync-')); directories.push(dir);
  const journal = new Journal(dir); journal.resolve('run', 'P01');
  fsyncs.count = 0;
  return journal;
}

test('only a command forces the journal to disk when it is written', async () => {
  const journal = open();
  for (const kind of ['state', 'raw', 'decision']) await journal.append({ kind, payload: {} });
  expect(fsyncs.count).toBe(0);
  await journal.append({ kind: 'command', payload: {} });
  expect(fsyncs.count).toBe(1);
  journal.close();
});
test('other records are flushed in the background and when the journal closes', async () => {
  vi.useFakeTimers();
  const journal = open();
  await journal.append({ kind: 'state', payload: {} });
  await vi.advanceTimersByTimeAsync(1000);
  expect(fsyncs.count).toBe(1);
  await vi.advanceTimersByTimeAsync(5000);
  expect(fsyncs.count).toBe(1); // nothing new to flush
  await journal.append({ kind: 'state', payload: {} });
  journal.close();
  expect(fsyncs.count).toBe(2);
});
test('a failed background flush is retried instead of crashing the worker', async () => {
  vi.useFakeTimers();
  const journal = open();
  await journal.append({ kind: 'state', payload: {} });
  fsyncs.failNext = true;
  await vi.advanceTimersByTimeAsync(1000);
  await vi.advanceTimersByTimeAsync(1000);
  expect(fsyncs.count).toBe(2);
  journal.close();
});
