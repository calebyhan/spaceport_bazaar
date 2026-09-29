import { expect, test } from 'vitest';
import { json } from '../serialization';
import type { Bundle, Rules } from '../types';
import { classroomRules, World, type CommandKind, type StationSetup } from '../sim/world';

// Every expected number below is worked out by hand from the handbook rules,
// never computed with the simulator's own arithmetic.
const b = (water: number, food: number, components: number): Bundle => ({ water: BigInt(water), food: BigInt(food), components: BigInt(components) });
function world(stations: Partial<StationSetup>[] = [{}, {}, {}], rules: Partial<Rules> = {}) {
  const w = new World({ runId: 'run', rules: classroomRules({ duration_ticks: 20n, ...rules }), stations: stations.map((s, i) => ({
    id: `P0${i + 1}`, specialty: (i % 3) + 1, inventory: b(30, 30, 30), upkeep: b(1, 1, 1), production: [], ...s })) });
  let n = 0;
  const run = (station: string, kind: CommandKind, body: unknown, id = `req-${++n}`) => {
    const outcome = w.command(station, kind, id, body, kind + json(body));
    if ('control' in outcome) throw new Error('unexpected control');
    return outcome.result;
  };
  return { w, run, view: (station: string) => w.view(station, 1n) };
}
const offer = (recipient_id: string, give: Bundle, receive: Bundle, expires_tick = 5n) => ({ recipient_id, give, receive, expires_tick });
const ad = (selling: number[], seeking: number[], expires_tick = 5n) => ({ selling: { items: selling }, seeking: { items: seeking }, expires_tick });

test('tick order matches the handbook example: produce, consume, then damage', () => {
  const { w, view } = world([{ inventory: b(2, 0, 1), production: [3n, 3n] }, {}]);
  w.start(); w.advance();
  // (2,0,1) + 3 water = (5,0,1); upkeep 1 each leaves (4,0,0) with 1 food missing.
  expect(view('P01').self).toMatchObject({ inventory: b(4, 0, 0), health: 95n, last_production: b(3, 0, 0), last_unmet_upkeep: b(0, 1, 0), shortage_ticks: 1n, current_shortage_streak: 1n });
  w.advance();
  // (4,0,0) + 3 water = (7,0,0); food and components both missing: 95 - 2 * 5.
  expect(view('P01').self).toMatchObject({ inventory: b(6, 0, 0), health: 85n, unmet_total: b(0, 2, 1), consumed_total: b(2, 0, 1), produced_total: b(6, 0, 0), longest_shortage_streak: 2n });
});

test('a fully supplied tick recovers health up to the cap and resets the streak', () => {
  const { w, view } = world([{ health: 90n }, { health: 98n }]);
  w.start(); w.advance();
  expect(view('P01').self).toMatchObject({ health: 95n, fully_supplied_ticks: 1n, current_shortage_streak: 0n, inventory: b(29, 29, 29) });
  expect(view('P02').self.health).toBe(100n);
});

test('complete exchange example: 6 water for 5 food settles atomically for both sides', () => {
  const { w, run, view } = world([{ inventory: b(10, 4, 3), upkeep: b(0, 0, 0) }, { upkeep: b(0, 0, 0) }, {}]);
  w.start();
  for (let i = 0; i < 7; i++) w.advance();
  const posted = run('P01', 'offer', offer('P02', b(6, 0, 0), b(0, 5, 0), 12n));
  expect(posted).toMatchObject({ ok: true, code: 1, processed_tick: 7n, processed_version: 10n, object_id: { value: 'offer-1' }, transaction_id: { null: true } });
  // Posting reserves and moves nothing.
  expect(view('P01').self.inventory).toEqual(b(10, 4, 3));
  expect(view('P02').offers.items[0]).toMatchObject({ offer_id: 'offer-1', proposer_id: 'P01', status: 1, created_tick: 7n });
  const accepted = run('P02', 'accept', { offer_id: 'offer-1' });
  expect(accepted).toMatchObject({ ok: true, processed_version: 11n, object_id: { value: 'offer-1' }, transaction_id: { value: 'tx-2' } });
  expect(view('P01').self).toMatchObject({ inventory: b(4, 9, 3), exported_total: b(6, 0, 0), imported_total: b(0, 5, 0) });
  expect(view('P02').self).toMatchObject({ inventory: b(36, 25, 30), exported_total: b(0, 5, 0), imported_total: b(6, 0, 0) });
  expect(view('P01').offers.items[0]).toMatchObject({ status: 2, closed_tick: { value: 7n }, transaction_id: { value: 'tx-2' } });
  expect(view('P02').transactions.items).toEqual([{ transaction_id: 'tx-2', offer_id: 'offer-1', proposer_id: 'P01', recipient_id: 'P02', give: b(6, 0, 0), receive: b(0, 5, 0), settled_tick: 7n, settled_version: 11n }]);
  expect(view('P03').transactions.items).toEqual([]);
  expect(view('P03').offers.items).toEqual([]);
});

test('expiry is exclusive: an offer expiring at tick 1 is usable at tick 0 only', () => {
  const { w, run, view } = world();
  w.start();
  run('P01', 'offer', offer('P02', b(1, 0, 0), b(0, 0, 0), 1n));
  run('P01', 'offer', offer('P02', b(2, 0, 0), b(0, 0, 0), 1n));
  expect(run('P02', 'accept', { offer_id: 'offer-1' }).code).toBe(1);
  w.advance();
  expect(view('P02').offers.items[1]).toMatchObject({ offer_id: 'offer-2', status: 4, closed_tick: { value: 1n } });
  expect(run('P02', 'accept', { offer_id: 'offer-2' }).code).toBe(7);
});

test('no reservation: a failed acceptance moves nothing and leaves the offer open', () => {
  const { w, run, view } = world([{ inventory: b(5, 0, 0), upkeep: b(0, 0, 0) }, { inventory: b(0, 2, 0), upkeep: b(0, 0, 0), production: [3n] }, { upkeep: b(0, 0, 0) }]);
  w.start();
  run('P01', 'offer', offer('P02', b(5, 0, 0), b(0, 5, 0)));
  run('P01', 'offer', offer('P03', b(5, 0, 0), b(0, 0, 1)));
  expect(run('P02', 'accept', { offer_id: 'offer-1' })).toMatchObject({ ok: false, code: 10, transaction_id: { null: true } });
  expect(view('P02').offers.items[0].status).toBe(1);
  expect(view('P02').self.inventory).toEqual(b(0, 2, 0));
  w.advance(); // P02 now holds 5 food.
  // P03 settles first with the same 5 water, so P01 can no longer pay P02.
  expect(run('P03', 'accept', { offer_id: 'offer-2' }).code).toBe(1);
  expect(run('P02', 'accept', { offer_id: 'offer-1' }).code).toBe(10);
  expect(view('P01').self.inventory).toEqual(b(0, 0, 1));
});

test('only the recipient accepts and only the creator withdraws', () => {
  const { w, run, view } = world();
  w.start();
  run('P01', 'offer', offer('P02', b(1, 0, 0), b(0, 1, 0)));
  expect(run('P01', 'accept', { offer_id: 'offer-1' }).code).toBe(5);
  expect(run('P03', 'accept', { offer_id: 'offer-1' }).code).toBe(6);
  expect(run('P02', 'accept', { offer_id: 'missing' }).code).toBe(6);
  expect(run('P02', 'withdraw', { object_id: 'offer-1' }).code).toBe(6);
  expect(run('P01', 'withdraw', { object_id: 'offer-1' })).toMatchObject({ code: 1, object_id: { value: 'offer-1' } });
  expect(view('P02').offers.items[0]).toMatchObject({ status: 3, closed_tick: { value: 0n } });
  expect(run('P01', 'withdraw', { object_id: 'offer-1' }).code).toBe(8);
  expect(run('P02', 'accept', { offer_id: 'offer-1' }).code).toBe(8);
});

test.each([
  ['own station', offer('P01', b(1, 0, 0), b(0, 1, 0)), 5],
  ['unknown station', offer('P99', b(1, 0, 0), b(0, 1, 0)), 6],
  ['nothing given', offer('P02', b(0, 0, 0), b(0, 1, 0)), 5],
  ['resource on both sides', offer('P02', b(1, 1, 0), b(0, 1, 0)), 5],
  ['expiry at the current tick', offer('P02', b(1, 0, 0), b(0, 1, 0), 0n), 5],
  ['expiry beyond the offer TTL', offer('P02', b(1, 0, 0), b(0, 1, 0), 13n), 5],
  ['more than the proposer holds', offer('P02', b(31, 0, 0), b(0, 1, 0)), 10],
  ['a gift', offer('P02', b(1, 0, 0), b(0, 0, 0), 12n), 1],
])('offer validation: %s', (_name, body, code) => {
  const { w, run } = world();
  w.start();
  expect(run('P01', 'offer', body).code).toBe(code);
});

test('an offer may not outlive the run', () => {
  const { w, run } = world(undefined, { duration_ticks: 10n });
  w.start();
  expect(run('P01', 'offer', offer('P02', b(1, 0, 0), b(0, 0, 0), 11n)).code).toBe(5);
  expect(run('P01', 'offer', offer('P02', b(1, 0, 0), b(0, 0, 0), 10n)).code).toBe(1);
});

test('the open outgoing offer limit is enforced until an offer closes', () => {
  const { w, run } = world(undefined, { max_open_outgoing_offers: 1n });
  w.start();
  run('P01', 'offer', offer('P02', b(1, 0, 0), b(0, 1, 0)));
  expect(run('P01', 'offer', offer('P03', b(1, 0, 0), b(0, 1, 0))).code).toBe(9);
  run('P01', 'withdraw', { object_id: 'offer-1' });
  expect(run('P01', 'offer', offer('P03', b(1, 0, 0), b(0, 1, 0))).code).toBe(1);
});

test('per-tick command quota rejects with a retry tick, and resets next tick', () => {
  const { w, run, view } = world(undefined, { new_commands_per_station_per_tick: 2n });
  w.start();
  expect(run('P01', 'advertise', ad([1], [2])).code).toBe(1);
  expect(run('P01', 'advertise', ad([1], [3])).code).toBe(1);
  expect(run('P01', 'advertise', ad([1], [])) ).toMatchObject({ code: 4, ok: false, retry_after_tick: { value: 1n }, processed_version: 5n });
  expect(run('P02', 'advertise', ad([2], [1])).code).toBe(1);
  expect(view('P01').request_results.items).toHaveLength(3);
  w.advance();
  expect(run('P01', 'advertise', ad([1], [])).code).toBe(1);
});

test('request record capacity returns a control error without a result or state change', () => {
  const { w, run, view } = world(undefined, { max_request_records_per_station: 2n });
  w.start();
  run('P01', 'advertise', ad([1], [2]));
  run('P01', 'advertise', ad([1], [3]));
  const version = w.worldVersion;
  expect(w.command('P01', 'advertise', 'req-x', ad([1], []), 'x')).toEqual({ control: 2 });
  expect(w.worldVersion).toBe(version);
  expect(view('P01').request_results.items.map(r => r.request_id)).toEqual(['req-1', 'req-2']);
});

test('an exact retry returns the stored result; a changed body under the same ID conflicts', () => {
  const { w, run, view } = world();
  w.start();
  const first = run('P01', 'advertise', ad([1], [2]), 'same');
  const version = w.worldVersion;
  expect(run('P01', 'advertise', ad([1], [2]), 'same')).toEqual(first);
  expect(run('P01', 'advertise', ad([1], [3]), 'same')).toMatchObject({ code: 2, ok: false, processed_version: version });
  expect(w.worldVersion).toBe(version);
  expect(view('P01').request_results.items).toEqual([first]);
  expect(view('P02').advertisements.items).toHaveLength(1);
});

test('commands before the run starts are RUN_NOT_RUNNING and time does not advance', () => {
  const { w, run } = world();
  w.advance();
  expect(w.tick).toBe(0n);
  expect(run('P01', 'advertise', ad([1], [2])).code).toBe(3);
});

test('advertisements: one active per station, replaced, withdrawn, validated and expired', () => {
  const { w, run, view } = world();
  w.start();
  expect(run('P01', 'advertise', ad([1], [2]))).toMatchObject({ code: 1, object_id: { value: 'ad-1' } });
  run('P01', 'advertise', ad([], [3], 2n));
  expect(view('P02').advertisements.items).toEqual([{ advertisement_id: 'ad-2', station_id: 'P01', selling: { items: [] }, seeking: { items: [3] }, created_tick: 0n, created_version: 4n, expires_tick: 2n, status: 1 }]);
  expect(run('P01', 'withdraw', { object_id: 'ad-1' }).code).toBe(8);
  expect(run('P02', 'withdraw', { object_id: 'ad-2' }).code).toBe(6);
  expect(run('P01', 'advertise', ad([4], []))).toMatchObject({ code: 5 });
  expect(run('P01', 'advertise', ad([1, 1], [])).code).toBe(5);
  expect(run('P01', 'advertise', ad([1], [], 13n)).code).toBe(5);
  run('P02', 'advertise', ad([2], [], 5n));
  expect(run('P02', 'withdraw', { object_id: 'ad-3' }).code).toBe(1);
  expect(view('P01').advertisements.items.map(a => a.advertisement_id)).toEqual(['ad-2']);
  w.advance(); w.advance();
  expect(view('P01').advertisements.items).toEqual([]);
});

test('zero health is permanent failure: trading stops and open objects are withdrawn', () => {
  // Mirrors the supplied validator's station-failure scenario.
  const { w, run, view } = world([{ health: 5n, inventory: b(3, 3, 3), upkeep: b(4, 1, 1), production: [0n, 4n] }, {}, {}]);
  w.start();
  run('P01', 'advertise', ad([1], [2]));
  run('P01', 'offer', offer('P02', b(1, 0, 0), b(0, 1, 0)));
  run('P02', 'offer', offer('P01', b(0, 0, 1), b(0, 0, 0)));
  run('P02', 'offer', offer('P03', b(0, 1, 0), b(0, 0, 0)));
  w.advance();
  expect(view('P01').self).toMatchObject({ health: 0n, failed_once: true, first_failure_tick: { value: 1n }, inventory: b(0, 2, 2) });
  expect(view('P02').offers.items.map(o => o.status)).toEqual([3, 3, 1]);
  expect(view('P02').advertisements.items).toEqual([]);
  expect(run('P01', 'offer', offer('P02', b(0, 1, 0), b(0, 0, 0))).code).toBe(11);
  expect(run('P01', 'accept', { offer_id: 'offer-3' }).code).toBe(11);
  expect(run('P02', 'offer', offer('P01', b(1, 0, 0), b(0, 0, 0))).code).toBe(11);
  w.advance();
  // Production continues and health recovers, but the failure is permanent.
  expect(view('P01').self).toMatchObject({ health: 5n, failed_once: true, first_failure_tick: { value: 1n }, inventory: b(0, 1, 1) });
  expect(w.report().stations[0]).toMatchObject({ survived: false, first_failure_tick: 1n, health_lost: 5n, final_health: 5n });
});

test('the run finishes at its duration: last offers expire, commands stop, outcome is reported', () => {
  const { w, run, view } = world([{ health: 5n, inventory: b(0, 0, 0) }, {}, {}], { duration_ticks: 2n });
  w.start();
  run('P02', 'advertise', ad([2], [], 2n));
  run('P02', 'offer', offer('P03', b(1, 0, 0), b(0, 0, 1), 2n));
  w.advance();
  expect(w.finished).toBe(false);
  w.advance();
  expect(w).toMatchObject({ tick: 2n, phase: 4, finished: true });
  expect(view('P03').offers.items[0]).toMatchObject({ status: 4, closed_tick: { value: 2n } });
  expect(view('P03').advertisements.items).toEqual([]);
  expect(view('P02').outcome).toEqual({ value: { collective_success: { value: false }, self_failed: false, aborted: false } });
  expect(view('P01').outcome.value?.self_failed).toBe(true);
  expect(view('P01').outcome.value?.collective_success).toEqual({ value: false });
  expect(run('P02', 'advertise', ad([2], [])).code).toBe(3);
  w.advance(); w.start();
  expect(w).toMatchObject({ tick: 2n, phase: 4 });
});

test('a station sees only its own private objects plus public advertisements and the directory', () => {
  const { w, run, view } = world([{ name: 'Water World' }, {}, {}]);
  w.start();
  run('P01', 'offer', offer('P02', b(1, 0, 0), b(0, 1, 0)));
  run('P02', 'accept', { offer_id: 'offer-1' });
  run('P02', 'advertise', ad([2], [1]));
  const third = view('P03');
  expect(third).toMatchObject({ self_station_id: 'P03', snapshot_sequence: 1n, phase: 2, outcome: { null: true } });
  expect(third.self).not.toHaveProperty('production');
  expect(third.self).toMatchObject({ station_id: 'P03', specialty: 3 });
  expect(third.directory?.items).toEqual([{ station_id: 'P01', display_name: 'Water World' }, { station_id: 'P02', display_name: 'P02' }, { station_id: 'P03', display_name: 'P03' }]);
  expect([third.offers.items, third.transactions.items, third.request_results.items]).toEqual([[], [], []]);
  expect(third.advertisements.items.map(a => a.station_id)).toEqual(['P02']);
  expect(view('P01').request_results.items.map(r => r.request_id)).toEqual(['req-1']);
  expect(w.report()).toMatchObject({ collective_success: true, transactions: 1, stations: [{ station_id: 'P01', specialty: 'water', transactions: 1, final_resources: 90n }, { transactions: 1 }, { transactions: 0 }] });
});
