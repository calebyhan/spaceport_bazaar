import { test } from 'vitest';
import assert from 'node:assert/strict';
import { active, add, affordable, forecast, liabilities, perspective, reserve, spendable, subtract, tradeSafety, zero } from '../domain';
import { decide, fingerprint } from '../policy';
import { StateStore } from '../state';
import { decode, encodeServer } from '../codec';
import { type Pending } from '../types';
import { bundle, snapshot, offer, result, defaultConfig as config } from './fixtures';
const memory = () => ({ attempted: {} });

test('exact bundle arithmetic and affordability beyond JS integer precision', () => {
  const large = bundle(2n ** 63n, 3n, 4n);
  assert.equal(add(large, bundle(1n, 0n, 0n)).water, 9223372036854775809n);
  assert.equal(subtract(zero(), large).water, -(2n ** 63n));
  assert.equal(affordable(large, bundle(0n, 4n, 0n)), false);
  const s = snapshot(); s.self.inventory = large;
  assert.deepEqual(decode(encodeServer({ state: s })).state?.self.inventory, large);
});
test('offer perspective, including gifts, is proposer-relative', () => {
  const o = offer();
  assert.deepEqual(perspective(o, 'ours'), { pay: zero(), gain: o.give });
  assert.deepEqual(perspective(o, 'supplier-z'), { pay: o.give, gain: zero() });
  assert.throws(() => perspective(o, 'unrelated'));
});
test('pending and confirmed liabilities reconcile without double debit', () => {
  const s = snapshot();
  const p: Pending = { requestId: 'req', tick: 0n, action: { kind: 'offer', body: { recipient_id: 'supplier-z', give: bundle(3n, 0n, 0n), receive: bundle(0n, 1n, 0n), expires_tick: 3n } } };
  assert.equal(spendable(s, [p]).water, 17n);
  p.result = result();
  assert.equal(spendable(s, [p]).water, 17n, 'result before state keeps commitment');
  s.world_version = 2n; s.request_results.items = [p.result];
  s.offers.items = [offer({ offer_id: 'out', proposer_id: 'ours', recipient_id: 'supplier-z', give: p.action.kind === 'offer' ? p.action.body.give : zero() })];
  assert.equal(liabilities(s, [p]).length, 1);
  assert.equal(spendable(s, [p]).water, 17n);
  const withdrawal: Pending = { requestId: 'withdraw', tick: 0n, action: { kind: 'withdraw', body: { object_id: 'out' } } };
  assert.equal(spendable(s, [withdrawal]).water, 17n);
  s.offers.items[0].status = 2; s.self.inventory.water = 17n;
  assert.equal(spendable(s, [withdrawal]).water, 17n, 'acceptance wins withdrawal race, snapshot includes debit');
});
test('multiple liabilities can breach reserves; unsafe offer is withdrawn', () => {
  const s = snapshot(); s.self.inventory = bundle(5n, 5n, 5n);
  s.offers.items = ['a','b'].map(offer_id => offer({ offer_id, proposer_id: 'ours', recipient_id: 'supplier-z', give: bundle(2n,0n,0n) }));
  assert.equal(spendable(s, []).water, 1n);
  assert.equal(decide(s, [], memory(), config).action.kind, 'withdraw');
});
test('exclusive expiry includes the interval before next tick; reserve caps at run end', () => {
  assert.equal(active(1, 3n, 2n), true); assert.equal(active(1, 3n, 3n), false);
  const s = snapshot({ tick: 5n }); assert.deepEqual(reserve(s, config), bundle(1n,1n,1n));
  s.offers.items = [offer({ proposer_id: 'ours', expires_tick: 5n })];
  assert.equal(liabilities(s, []).length, 0);
});
test('live upkeep damage and recovery, zero production, permanent failure', () => {
  const s = snapshot(); s.rules.duration_ticks = 3n; s.self.health = 4n;
  s.self.inventory = bundle(0n, 2n, 2n); s.self.last_production = bundle(100n,0n,0n);
  const f = forecast(s, s.self.inventory, 3n, { tick: 1n, pay: zero(), gain: bundle(10n,10n,10n) });
  assert.equal(f.points[0].health, 0n); assert.equal(f.points[1].health, 5n);
  assert.equal(f.points[2].failed, true); assert.equal(f.failureTick, 1n);
  s.self.failed_once = true; s.self.health = 100n;
  assert.equal(decide(s, [], memory(), config).action.kind, 'wait');
});
test('useful gifts beat market-making; expired gifts are ignored', () => {
  const s = snapshot(); s.offers.items = [offer()];
  assert.equal(decide(s, [], memory(), config).action.kind, 'accept');
  s.tick = 3n;
  assert.notEqual(decide(s, [], memory(), config).action.kind, 'accept');
});
test('emergency exchange must improve health pointwise, cannot create earlier failure', () => {
  const s = snapshot(); s.self.inventory = bundle(10n,0n,6n); s.self.health = 20n;
  assert.equal(tradeSafety(s, [], bundle(1n,0n,0n), bundle(0n,1n,0n), config).safe, true);
  assert.equal(tradeSafety(s, [], bundle(10n,0n,0n), bundle(0n,1n,0n), config).safe, false);
  s.offers.items = [offer({ give: bundle(0n,1n,0n), receive: bundle(1n,0n,0n) })];
  assert.equal(decide(s, [], memory(), config).action.kind, 'accept');
});
test('duplicate snapshots, unchanged world version, and reconnect sequence reset', () => {
  const store = new StateStore(); const epoch = store.newConnection();
  const s = snapshot({ snapshot_sequence: 10n }); assert.equal(store.observe(epoch, s), true);
  assert.equal(store.observe(epoch, snapshot({ snapshot_sequence: 10n })), false);
  assert.equal(store.observe(epoch, snapshot({ snapshot_sequence: 11n })), true);
  const next = store.newConnection(); assert.equal(store.observe(epoch, snapshot({ snapshot_sequence: 99n })), false);
  assert.equal(store.observe(next, snapshot()), true);
});
test('supplier discovery uses advertisements; proposal and advertisement cooldowns', () => {
  const s = snapshot();
  s.advertisements.items = [{ advertisement_id: 'peer-ad', station_id: 'supplier-z', status: 1, selling: { items: [2] }, seeking: { items: [1] }, expires_tick: 5n }];
  const first = decide(s, [], memory(), config);
  assert.equal(first.action.kind, 'offer');
  if (first.action.kind === 'offer') assert.equal(first.action.body.recipient_id, 'supplier-z');
  const next = decide(s, [], first.nextMemory, config); assert.notEqual(next.action.kind, 'offer');
  const ad = decide(snapshot(), [], memory(), config); assert.equal(ad.action.kind, 'advertise');
  assert.equal(decide(snapshot(), [], ad.nextMemory, config).action.kind, 'wait');
  assert.ok(first.nextMemory.attempted[fingerprint(first.action)] > 2n);
});
test('quotas preserve urgent capacity, finite records, uncertain outcomes block replacements', () => {
  const s = snapshot(); s.rules.new_commands_per_station_per_tick = 1n;
  assert.equal(decide(s, [], memory(), config).action.kind, 'wait');
  s.offers.items = [offer()]; assert.equal(decide(s, [], memory(), config).action.kind, 'accept');
  s.rules.max_request_records_per_station = 0n;
  assert.equal(decide(s, [], memory(), config).action.kind, 'wait');
  const p: Pending = { requestId: 'req', tick: 0n, action: { kind: 'accept', body: { offer_id: 'gift' } } };
  assert.equal(decide(snapshot(), [p], memory(), config).action.kind, 'wait');
});
test('a safe outstanding offer is not withdrawn merely because its desired resource is short', () => {
  const s = snapshot();
  s.offers.items = [offer({ offer_id: 'out-safe', proposer_id: 'ours', recipient_id: 'supplier-z', give: bundle(1n,0n,0n), receive: bundle(0n,1n,0n), expires_tick: 2n })];
  assert.notEqual(decide(s, [], memory(), config).action.kind, 'withdraw');
});
test('delayed settlement consumes only available upkeep, never creates negative inventory debt', () => {
  const s = snapshot(); s.self.inventory = bundle(20n,0n,8n);
  const check = tradeSafety(s, [], bundle(1n,0n,0n), bundle(0n,2n,0n), config, 1n);
  assert.equal(check.safe, true);
  assert.equal(check.after.points[0].health, check.before.points[0].health);
  assert.ok(check.after.points[1].health > check.before.points[1].health);
});
test('an unaffordable payment stays unsafe, even if simultaneous receipts would repair it', () => {
  const s = snapshot();
  assert.equal(tradeSafety(s, [], bundle(21n,0n,0n), bundle(0n,100n,0n), config).safe, false);
});

test('rejected and already-observed outgoing offers do not double reserve inventory', () => {
  const s = snapshot();
  const p: Pending = { requestId: 'req', tick: 0n, action: { kind: 'offer', body: { recipient_id: 'peer', give: bundle(3n,0n,0n), receive: zero(), expires_tick: 3n } }, result: result({ ok: false }) };
  assert.deepEqual(liabilities(s, [p]), []);
  p.result = result(); s.offers.items = [offer({ offer_id: 'out', proposer_id: 'ours' })];
  assert.equal(liabilities(s, [p]).length, 1);
});
test('rate limit fallback is monotonic and defaults to the next processed tick', () => {
  const store = new StateStore();
  store.result(result({ code: 4, processed_tick: 2n })); assert.equal(store.blockedUntil, 3n);
  store.result(result({ code: 4, retry_after_tick: { value: 1n } })); assert.equal(store.blockedUntil, 3n);
});
