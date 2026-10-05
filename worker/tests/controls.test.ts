import { afterEach, expect, test } from 'vitest';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { controlFile, readControls, writeControls } from '../controls';

const dirs: string[] = [];
afterEach(() => { for (const d of dirs.splice(0)) rmSync(d, { recursive: true, force: true }); });
const temp = () => { const d = mkdtempSync(join(tmpdir(), 'controls-')); dirs.push(d); return d; };

test('the control file defaults under .local and can be moved', () => {
  expect(controlFile({})).toBe(resolve('.local/controls.json'));
  expect(controlFile({ BAZAAR_CONTROL_FILE: '/x/c.json' })).toBe('/x/c.json');
});
test('a missing, corrupt or odd control file leaves every switch off', () => {
  const dir = temp(), path = join(dir, 'c.json');
  expect(readControls(path)).toEqual({ generous: false });
  for (const text of ['{"gen', 'null', '{"generous":"yes"}']) { writeFileSync(path, text); expect(readControls(path)).toEqual({ generous: false }); }
});
test('written controls round-trip, creating the folder', () => {
  const path = join(temp(), 'nested', 'c.json');
  writeControls({ generous: true }, path);
  expect(readControls(path)).toEqual({ generous: true });
  writeControls({ generous: false }, path);
  expect(readControls(path)).toEqual({ generous: false });
});

test('startup strategy round-trips with live generosity and invalid files fail safely', () => {
  const path = join(temp(), 'c.json');
  writeControls({ generous: true, strategy: 'baseline' }, path);
  expect(readControls(path)).toEqual({ generous: true, strategy: 'baseline' });
  writeFileSync(path, '{"strategy":"observe"}');
  expect(readControls(path)).toEqual({ generous: false });
});
