import { afterEach, expect, test } from 'vitest';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { mkdtempSync, writeFileSync, existsSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const exec = promisify(execFile);
const folders: string[] = [];
afterEach(() => { for (const dir of folders.splice(0)) rmSync(dir, { recursive: true, force: true }); });
const players = () => Array.from({ length: 9 }, (_, i) => ({ station_id: `P0${i + 1}`, token: `private-test-key-${i}` }));
test.each(['missing', 'duplicate-key', 'duplicate-station', 'malformed', 'endpoint', 'timeout'])('nine-client launcher rejects %s before creating a run and without exposing credentials', async kind => {
  const dir = mkdtempSync(join(tmpdir(), 'nine-launcher-')); folders.push(dir);
  const file = join(dir, 'credentials.json'), out = join(dir, 'output'), entries = players();
  if (kind === 'missing') entries.pop();
  if (kind === 'duplicate-key') entries[1].token = entries[0].token;
  if (kind === 'duplicate-station') entries[1].station_id = entries[0].station_id;
  writeFileSync(file, kind === 'malformed' ? '{"players":"private-test-key-broken' : JSON.stringify({ players: entries }), { mode: 0o600 });
  const env = { ...process.env }; for (const key of Object.keys(env)) if (key.startsWith('BAZAAR_')) delete env[key];
  let failure: { stdout: string; stderr: string; code: number } | undefined;
  try {
    await exec(process.execPath, ['--import', 'tsx', 'scripts/run-nine.ts', '--credentials', file, '--out', out,
      '--endpoint', kind === 'endpoint' ? 'https://invalid.example' : 'ws://127.0.0.1:1/ws', '--timeout', kind === 'timeout' ? '0' : '1'], { env, timeout: 15000 });
  } catch (error) { failure = error as typeof failure; }
  expect(failure?.code).toBe(1);
  expect(failure?.stderr).toMatch(/Credentials must contain|Cannot read credentials|Supply a ws|timeout must/);
  expect(failure?.stderr).not.toContain('private-test-key');
  expect(existsSync(out)).toBe(false);
}, 20000);
