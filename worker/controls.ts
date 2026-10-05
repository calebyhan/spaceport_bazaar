// The dashboard and worker share one atomically replaced JSON control file.
// Generosity is read before every decision; strategy selection is read only
// at startup so a running worker keeps its policy and recovery identity.
import { mkdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { getStrategy, type StrategyName } from './strategies';

export interface Controls {
  // Ask only at par and accept safe par trades paid from whole-run spare.
  generous: boolean;
  // Startup selection; changing this never hot-swaps a running policy.
  strategy?: StrategyName;
}
export const defaultControls: Controls = { generous: false };

export function controlFile(env: Record<string, string | undefined> = process.env): string {
  return resolve(env.BAZAAR_CONTROL_FILE || '.local/controls.json');
}
// A missing or unreadable file means every switch is off.
export function readControls(path = controlFile()): Controls {
  try {
    const raw = JSON.parse(readFileSync(path, 'utf8')) as Partial<Controls> | null;
    return { generous: raw?.generous === true, ...(raw?.strategy === undefined ? {} : { strategy: getStrategy(raw.strategy).name }) };
  } catch { return { ...defaultControls }; }
}
export function writeControls(controls: Controls, path = controlFile()) {
  mkdirSync(dirname(path), { recursive: true });
  // Rename is atomic, so the worker never reads a half-written file.
  const temp = `${path}.${process.pid}.tmp`;
  writeFileSync(temp, JSON.stringify(controls) + '\n');
  renameSync(temp, path);
}
