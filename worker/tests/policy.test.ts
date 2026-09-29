import { expect, test } from 'vitest';
import { capacity, commitmentBundle, missingBundle, decide, fingerprint } from '../policy';
import { bundle, snapshot, result, offer, defaultConfig } from './fixtures';
import type { Pending } from '../types';
const memory = { attempted: {} };
test('capacity counts recorded and unrecorded commands once and distinguishes tick slots from lifetime records', () => {
  const s = snapshot(); s.rules.new_commands_per_station_per_tick = 3n;
  s.request_results.items = [result({ request_id: 'recorded' })];
  const pending: Pending[] = ['recorded', 'current', 'old'].map(requestId => ({ requestId, tick: requestId === 'old' ? -1n : 0n, action: { kind: 'accept', body: { offer_id: 'gift' } } }));
  expect(capacity(s, pending, false)).toBe(false); expect(capacity(s, pending, true)).toBe(true);
  s.rules.max_request_records_per_station = 3n; expect(capacity(s, pending, true)).toBe(false);
});
test('audit bundles report liabilities and shortages per resource', () => {
  const s = snapshot(); s.offers.items = [offer({ proposer_id: 'ours', give: bundle(2n,0n,0n) })];
  expect(commitmentBundle(s, [])).toEqual(bundle(2n,0n,0n)); expect(missingBundle(s, [], defaultConfig)).toEqual(bundle(0n,1n,0n));
});
test('equally useful inbound offers are selected canonically independent of input order', () => {
  for (const ids of [['z', 'a'], ['a', 'z']]) {
    const s = snapshot(); s.offers.items = ids.map(offer_id => offer({ offer_id }));
    expect(decide(s, [], memory, defaultConfig).action).toEqual({ kind: 'accept', body: { offer_id: 'a' } });
  }
});
test('unrelated offers and unsafe supplier terms never authorize spending', () => {
  const s = snapshot(); s.offers.items = [offer({ recipient_id: 'other' })];
  s.advertisements.items = [{ advertisement_id: 'peer', station_id: 'peer', status: 1, selling: { items: [2] }, seeking: { items: [1] }, expires_tick: 4n }];
  s.self.inventory = bundle(3n,0n,0n);
  expect(decide(s, [], memory, defaultConfig).action.kind).toBe('advertise');
});
test('an offer that only exchanges already sufficient inventory is ignored', () => {
  const s = snapshot(); s.self.inventory = bundle(6n,6n,6n);
  s.offers.items = [offer({ give: bundle(0n,1n,0n), receive: bundle(1n,0n,0n) })];
  expect(decide(s, [], memory, defaultConfig).action.kind).not.toBe('accept');
});
test('policy memory suppresses identical terms without mutating caller memory', () => {
  const s = snapshot(); const before = structuredClone(s); const m = { attempted: {} };
  const d = decide(s, [], m, defaultConfig);
  expect(s).toEqual(before); expect(m).toEqual({ attempted: {} });
  expect(d.nextMemory.attempted[fingerprint(d.action)]).toBe(s.tick + defaultConfig.cooldownTicks);
});
test('a reserve-preserving exchange improves future shortages without emergency spending', () => {
  const s = snapshot(); s.self.inventory = bundle(6n,2n,6n);
  s.offers.items = [offer({ give: bundle(0n,4n,0n), receive: bundle(1n,0n,0n) })];
  const d = decide(s, [], memory, defaultConfig);
  expect(d.action.kind).toBe('accept'); expect(d.explanation.rationale).toContain('at-or-above-par exchange');
});
test('larger useful gifts outrank smaller gifts regardless of arrival order', () => {
  const s = snapshot(); s.offers.items = [offer({ offer_id: 'small', give: bundle(0n,1n,0n) }), offer({ offer_id: 'large', give: bundle(0n,5n,0n) })];
  expect(decide(s, [], memory, defaultConfig).action).toEqual({ kind: 'accept', body: { offer_id: 'large' } });
});
test('advertising stops when an existing signal is correct and replaces a stale signal', () => {
  const s = snapshot();
  const d = decide(s, [], memory, defaultConfig);
  if (d.action.kind !== 'advertise') throw new Error('Expected advertisement');
  s.advertisements.items = [{ ...d.action.body, advertisement_id: 'own', station_id: 'ours', status: 1 }];
  expect(decide(s, [], memory, defaultConfig).action.kind).toBe('wait');
  s.advertisements.items[0].seeking.items = [];
  expect(decide(s, [], memory, defaultConfig).action.kind).toBe('advertise');
});
test('supplier advertisements must be live, from another station, and sell the needed resource', () => {
  const s = snapshot();
  s.advertisements.items = [
    { advertisement_id: 'self', station_id: 'ours', status: 1, selling: { items: [2] }, seeking: { items: [1] }, expires_tick: 6n },
    { advertisement_id: 'expired', station_id: 'peer', status: 1, selling: { items: [2] }, seeking: { items: [1] }, expires_tick: 0n },
    { advertisement_id: 'wrong', station_id: 'peer', status: 1, selling: { items: [3] }, seeking: { items: [1] }, expires_tick: 6n },
  ];
  expect(decide(s, [], memory, defaultConfig).action.kind).toBe('advertise');
});
