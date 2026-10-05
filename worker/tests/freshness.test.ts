import { expect, test } from 'vitest';
import { stillCurrent } from '../freshness';
import { bundle, offer, snapshot } from './fixtures';
import type { Action, Advertisement, Snapshot } from '../types';

const accept: Action = { kind: 'accept', body: { offer_id: 'gift' } };
const ad = (overrides: Partial<Advertisement> = {}): Advertisement =>
  ({ advertisement_id: 'ad-1', station_id: 'supplier-z', status: 1, selling: { items: [1] }, seeking: { items: [] }, expires_tick: 5n, ...overrides });
const withOffer = (o = offer(), overrides: Partial<Snapshot> = {}) => { const s = snapshot(overrides); s.offers.items = [o]; return s; };

test('the same or an unrelated newer snapshot leaves a decision current', () => {
  const decided = withOffer();
  expect(stillCurrent(accept, decided, decided)).toBe(true);
  const later = withOffer(offer(), { snapshot_sequence: 2n, world_version: 2n });
  later.advertisements.items = [ad(), ad({ advertisement_id: 'ad-2', station_id: 'other' })];
  expect(stillCurrent(accept, decided, later)).toBe(true);
});
test.each([
  ['no snapshot', () => undefined],
  ['a later tick', () => withOffer(offer(), { tick: 1n, snapshot_sequence: 2n })],
  ['a paused run', () => withOffer(offer(), { phase: 3, snapshot_sequence: 2n })],
  ['another run', () => withOffer(offer(), { run_id: 'other', snapshot_sequence: 2n })],
  ['a changed inventory', () => { const s = withOffer(offer(), { snapshot_sequence: 2n }); s.self = { ...s.self, inventory: bundle(19n, 1n, 8n) }; return s; }],
  ['a failed station', () => { const s = withOffer(offer(), { snapshot_sequence: 2n }); s.self = { ...s.self, failed_once: true }; return s; }],
  ['a new own open offer', () => { const s = withOffer(offer(), { snapshot_sequence: 2n }); s.offers.items.push(offer({ offer_id: 'ours-1', proposer_id: 'ours', recipient_id: 'supplier-z' })); return s; }],
  ['a new own advertisement', () => { const s = withOffer(offer(), { snapshot_sequence: 2n }); s.advertisements.items = [ad({ station_id: 'ours' })]; return s; }],
  ['the target offer gone', () => snapshot({ snapshot_sequence: 2n })],
  ['the target offer settled', () => withOffer(offer({ status: 2 }), { snapshot_sequence: 2n })],
  ['the target offer expired', () => withOffer(offer({ expires_tick: 0n }), { snapshot_sequence: 2n })],
  ['the target offer changing terms', () => withOffer(offer({ give: bundle(0n, 1n, 0n) }), { snapshot_sequence: 2n })],
])('a decision is superseded by %s', (_, latest) => {
  expect(stillCurrent(accept, withOffer(), latest())).toBe(false);
});
test('withdrawing needs its target still open', () => {
  const mine = offer({ offer_id: 'ours-1', proposer_id: 'ours', recipient_id: 'supplier-z' });
  const decided = withOffer(mine), action: Action = { kind: 'withdraw', body: { object_id: 'ours-1' } };
  expect(stillCurrent(action, decided, withOffer(mine, { snapshot_sequence: 2n }))).toBe(true);
  expect(stillCurrent(action, decided, withOffer(offer({ ...mine, status: 2 }), { snapshot_sequence: 2n }))).toBe(false);
});
test('withdrawing an advertisement needs it still open, and anything else is gone', () => {
  const mine = ad({ station_id: 'ours' });
  const decided = snapshot(); decided.advertisements.items = [mine];
  const action: Action = { kind: 'withdraw', body: { object_id: 'ad-1' } };
  const later = (a: Advertisement[]) => { const s = snapshot({ snapshot_sequence: 2n }); s.advertisements.items = a; return s; };
  expect(stillCurrent(action, decided, later([mine]))).toBe(true);
  expect(stillCurrent(action, decided, later([{ ...mine, status: 4 }]))).toBe(false);
  expect(stillCurrent({ kind: 'withdraw', body: { object_id: 'nothing' } }, decided, later([mine]))).toBe(false);
});
test('offers and advertisements are valid whenever the shared facts hold', () => {
  const decided = snapshot(), later = snapshot({ snapshot_sequence: 2n });
  expect(stillCurrent({ kind: 'advertise', body: { selling: { items: [1] }, seeking: { items: [] }, expires_tick: 5n } }, decided, later)).toBe(true);
});
