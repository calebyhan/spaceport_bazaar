// Live switches an operator flips from the dashboard while a worker trades.
// The dashboard and worker share one small JSON file: the dashboard replaces
// it atomically and the worker reads it before every decision, so a change
// applies from the next decision without a restart.
import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

export interface Controls {
  // Ask only at par and accept safe par trades paid from whole-run spare.
  generous: boolean;
}
export const defaultControls: Controls = { generous: false };

export function controlFile(env: Record<string, string | undefined> = process.env): string {
  return resolve(env.BAZAAR_CONTROL_FILE || '.local/controls.json');
}
// A missing or unreadable file means every switch is off.
export function readControls(path = controlFile()): Controls {
  try {
    const raw = JSON.parse(readFileSync(path, 'utf8')) as Partial<Controls> | null;
    return { generous: raw?.generous === true };
  } catch { return { ...defaultControls }; }
}
export function writeControls(controls: Controls, path = controlFile()) {
  mkdirSync(dirname(path), { recursive: true });
  // Rename is atomic, so the worker never reads a half-written file.
  const temp = `${path}.${process.pid}.tmp`;
  writeFileSync(temp, JSON.stringify(controls) + '\n');
  renameSync(temp, path);
}
