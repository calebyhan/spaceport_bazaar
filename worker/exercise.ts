import type { Action, Snapshot } from './types';
import { zero } from './domain';
// This is the validator's prescribed script, NEVER the autonomous strategy.
export function exercise(s: Snapshot): Action | 'done' {
  const results = s.request_results.items;
  if (results.some(r => !r.ok)) throw new Error('Validator command rejected');
  if (results.length === 0) return { kind: 'advertise', body: { selling: { items: [1] }, seeking: { items: [2] }, expires_tick: 6n } };
  if (results.length === 1) return { kind: 'advertise', body: { selling: { items: [] }, seeking: { items: [3] }, expires_tick: 6n } };
  if (results.length === 2) return { kind: 'offer', body: { recipient_id: 'P02', give: { ...zero(), water: 2n }, receive: { ...zero(), food: 1n }, expires_tick: 6n } };
  if (results.length === 3) {
    const gift = s.offers.items.find(o => o.proposer_id === 'P02' && o.recipient_id === s.self_station_id && o.status === 1 && o.give.components === 1n);
    if (!gift) return { kind: 'wait' };
    return { kind: 'accept', body: { offer_id: gift.offer_id } };
  }
  if (results.length === 4) {
    const ad = s.advertisements.items.find(a => a.station_id === s.self_station_id);
    if (!ad) throw new Error('Validator advertisement missing');
    return { kind: 'withdraw', body: { object_id: ad.advertisement_id } };
  }
  if (results.length === 5) return 'done';
  throw new Error('Unexpected validator state');
}
