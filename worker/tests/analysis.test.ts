import { test } from 'vitest';
import assert from 'node:assert/strict';
import { deriveMarketEvents } from '../analysis';
import type { Advertisement } from '../types';
import { snapshot, defaultConfig as config } from './fixtures';

const ad = (selling: number[], seeking: number[]): Advertisement =>
  ({ advertisement_id: 'P01-ad', station_id: 'P01', status: 1, selling: { items: selling }, seeking: { items: seeking }, expires_tick: 30n });

test('an advertisement whose selling or seeking lists change is reported as changed, once', () => {
  const before = snapshot({ advertisements: { items: [ad([1], [2])] } });
  const types = (after: typeof before) => deriveMarketEvents(before, after, config).filter(e => e.type.startsWith('advertisement')).map(e => e.type);
  assert.deepEqual(types(snapshot({ snapshot_sequence: 2n, advertisements: { items: [ad([1], [2])] } })), []);
  assert.deepEqual(types(snapshot({ snapshot_sequence: 2n, advertisements: { items: [ad([1, 3], [2])] } })), ['advertisement-changed']);
  assert.deepEqual(types(snapshot({ snapshot_sequence: 2n, advertisements: { items: [ad([1], [])] } })), ['advertisement-changed']);
});
