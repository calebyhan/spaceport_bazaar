import test from 'node:test';
import assert from 'node:assert/strict';
import { decide } from '../policy';
import { askTerms, misses, observeMarket, plan, premiumLadder } from '../market';
import { spendable, total, zero } from '../domain';
import { StateStore } from '../state';
import type { Advertisement, Offer, Pending, Snapshot } from '../types';
import { bundle, snapshot, offer, result, defaultConfig as config } from './fixtures';
const memory = () => ({ attempted: {} });
const ad = (station_id: string, selling: number[], seeking: number[], expires_tick = 30n): Advertisement =>
  ({ advertisement_id: `${station_id}-ad`, station_id, status: 1, selling: { items: selling }, seeking: { items: seeking }, expires_tick });
// A components producer, like P09 in run-37: long run, no food or water production.
function producer(overrides: Partial<Snapshot> = {}): Snapshot {
  const s = snapshot({ tick: 10n, ...overrides });
  s.rules = { ...s.rules, duration_ticks: 120n, max_offer_ttl_ticks: 12n, max_publication_ttl_ticks: 12n, new_commands_per_station_per_tick: 10n, max_open_outgoing_offers: 24n };
  s.self.specialty = 3;
  s.self.inventory = bundle(20n, 20n, 80n);
  s.self.last_production = bundle(0n, 0n, 5n);
  s.self.produced_total = bundle(0n, 0n, 50n);
  s.directory = { items: ['ours', 'P01', 'P02', 'P03'].map(station_id => ({ station_id, display_name: station_id })) };
  return s;
}
const ours = (s: Snapshot, o: Partial<Offer>) => offer({ proposer_id: s.self_station_id, ...o });

test('plans a whole horizon: buys non-specialties long before the safety reserve is touched', () => {
  const s = producer();
  const p = plan(s, spendable(s, []), observeMarket(s, config), config);
  assert.deepEqual(p.seeking, ['water', 'food']);
  assert.ok(p.room.water > 0n && p.room.food > 0n);
  assert.equal(p.room.components, 0n);
  assert.ok(p.value.food > 1 && p.value.components < 1, 'short resources are dear, the specialty is cheap');
  s.advertisements.items = [ad('P01', [2], [3])];
  const d = decide(s, [], memory(), config);
  assert.equal(d.action.kind, 'offer');
  if (d.action.kind === 'offer') {
    assert.equal(d.action.body.recipient_id, 'P01');
    assert.ok(d.action.body.receive.food > 0n && d.action.body.give.components > 0n);
  }
});

test('the specialty is not treated as a need before production is first observed', () => {
  const s = producer({ tick: 0n }); s.self.inventory = bundle(30n, 30n, 30n);
  s.self.last_production = zero(); s.self.produced_total = zero();
  const p = plan(s, spendable(s, []), observeMarket(s, config), config);
  assert.deepEqual(p.seeking, ['water', 'food']);
  assert.ok(p.sellable.components > 0n);
});

test('advertises the plan: never claims to sell what it is short of', () => {
  const s = producer();
  const d = decide(s, [], memory(), config);
  assert.equal(d.action.kind, 'advertise');
  if (d.action.kind === 'advertise') {
    assert.deepEqual(d.action.body.selling.items, [3]);
    assert.deepEqual(d.action.body.seeking.items, [1, 2]);
    assert.equal(d.action.body.expires_tick, s.tick + config.adTtl);
  }
});

test('an advertisement may list a non-specialty the plan holds in surplus', () => {
  const s = producer(); s.self.inventory = bundle(200n, 20n, 80n);
  const d = decide(s, [], memory(), config);
  assert.equal(d.action.kind, 'advertise');
  if (d.action.kind === 'advertise') assert.deepEqual(d.action.body.selling.items, [1, 3]);
});

test('accepts at-or-above-par trades that raise value even when survival is not at stake', () => {
  // Run-37, tick 46: food already doomed us, so water did not change the
  // failure forecast, and 5 water for 4 components was refused. It is value.
  const s = producer({ tick: 46n }); s.self.inventory = bundle(4n, 0n, 200n); s.self.health = 25n;
  s.self.produced_total = bundle(0n, 0n, 230n);
  s.offers.items = [offer({ offer_id: 'p01', proposer_id: 'P01', give: bundle(5n, 0n, 0n), receive: bundle(0n, 0n, 4n), expires_tick: 51n })];
  assert.equal(decide(s, [], memory(), config).action.kind, 'accept');
});

test('never accepts below par, and refuses at-par trades that lose value', () => {
  const s = producer();
  s.offers.items = [offer({ offer_id: 'below', proposer_id: 'P01', give: bundle(0n, 2n, 0n), receive: bundle(0n, 0n, 3n), expires_tick: 12n })];
  assert.notEqual(decide(s, [], memory(), config).action.kind, 'accept', 'receives 2 units for 3');
  s.offers.items = [offer({ offer_id: 'dear', proposer_id: 'P01', give: bundle(0n, 0n, 2n), receive: bundle(1n, 0n, 0n), expires_tick: 12n })];
  assert.notEqual(decide(s, [], memory(), config).action.kind, 'accept', '2 cheap components are not worth 1 scarce water');
});

test('opening asks carry a premium, step down per unanswered offer, floor at par, then rest', () => {
  assert.deepEqual(premiumLadder(config), [50n, 25n, 0n]);
  const s = producer(); s.advertisements.items = [ad('P01', [2], [3])];
  const market = observeMarket(s, config), p = plan(s, spendable(s, []), market, config);
  const p01 = market.stations.find(b => b.id === 'P01')!;
  const opening = askTerms(s, p, market, p01, 'components', 'food', config)!;
  assert.equal(opening.premium, 50n);
  assert.ok(total(opening.receive) > total(opening.give));
  const expired = (id: string, created: bigint) => ours(s, { offer_id: id, recipient_id: 'P01', give: opening.give, receive: opening.receive, created_tick: created, expires_tick: created + 3n, status: 4 });
  s.offers.items = [expired('a', 1n), expired('b', 4n)];
  assert.equal(misses(s, 'P01', 'components', 'food', config), 2);
  const floor = askTerms(s, p, market, p01, 'components', 'food', config)!;
  assert.equal(floor.premium, 0n);
  assert.equal(total(floor.receive), total(floor.give));
  s.offers.items.push(expired('c', 6n), expired('d', 8n));
  assert.equal(askTerms(s, p, market, p01, 'components', 'food', config), undefined, 'rests after unanswered par offers');
  s.offers.items.push(ours(s, { offer_id: 'e', recipient_id: 'P01', give: floor.give, receive: floor.receive, created_tick: 9n, status: 2 }));
  assert.equal(askTerms(s, p, market, p01, 'components', 'food', config)!.premium, 0n, 'reopens at the price that last cleared');
  s.offers.items.push(ours(s, { offer_id: 'f', recipient_id: 'P01', give: opening.give, receive: opening.receive, created_tick: 10n, status: 2 }));
  assert.equal(askTerms(s, p, market, p01, 'components', 'food', config)!.premium, 50n, 'a premium that cleared is asked again');
});

test('urgent needs are asked for at par immediately', () => {
  const s = producer(); s.self.inventory.food = 3n; s.advertisements.items = [ad('P01', [2], [3])];
  const market = observeMarket(s, config), p = plan(s, spendable(s, []), market, config);
  assert.ok(p.urgent.includes('food'));
  assert.equal(askTerms(s, p, market, market.stations.find(b => b.id === 'P01')!, 'components', 'food', config)!.premium, 0n);
});

test('multi-hop sourcing buys the currency a food supplier wants, then pays it', () => {
  const s = producer(); s.self.inventory = bundle(45n, 20n, 80n);
  // P01 sells food but only wants water; P02 sells water and wants components.
  s.advertisements.items = [ad('P01', [2], [1]), ad('P02', [1], [3])];
  s.self.inventory.water = 40n;
  const market = observeMarket(s, config), p = plan(s, spendable(s, []), market, config);
  assert.ok(p.relay.water > 0n, 'water is needed as currency for food');
  assert.ok(p.value.water >= p.value.food * 0.9 - 1e-9);
  const d = decide(s, [], memory(), config);
  assert.equal(d.action.kind, 'offer');
  if (d.action.kind === 'offer') {
    assert.equal(d.action.body.recipient_id, 'P02');
    assert.ok(d.action.body.receive.water > 0n && d.action.body.give.components > 0n);
  }
  // Once the relay water is in stock, it is paid to the food supplier. Water
  // is also a whole-run need of ours, so buying more may come first.
  s.self.inventory.water = 60n; s.advertisements.items = [ad('P01', [2], [1])];
  s.offers.items = [ours(s, { offer_id: 'bought', recipient_id: 'P02', give: bundle(0n, 0n, 3n), receive: bundle(3n, 0n, 0n), status: 2, created_tick: 9n })];
  let relayed = false;
  for (let i = 0, m = memory(); i < 4 && !relayed; i++) {
    const next = decide(s, [], m, config);
    if (next.action.kind !== 'offer') break;
    const body = next.action.body;
    relayed = body.recipient_id === 'P01' && body.give.water > 0n && body.receive.food > 0n;
    s.offers.items.push(ours(s, { ...body, offer_id: `open-${i}`, created_tick: s.tick }));
    m = next.nextMemory;
  }
  assert.ok(relayed, 'relay water is offered to the food supplier');
});

test('market scarcity raises value and stockpiles a resource for later sale', () => {
  const s = producer(); s.self.inventory = bundle(60n, 60n, 80n);
  s.advertisements.items = [ad('P01', [1], [2]), ad('P02', [3], [2]), ad('P03', [1], [2])];
  const market = observeMarket(s, config), p = plan(s, spendable(s, []), market, config);
  assert.equal(market.seekers.food, 3);
  assert.ok(p.stockpile.food > 0n && p.stockpile.water === 0n);
  assert.ok(p.value.food > p.value.water);
});

test('counterparty beliefs come from settled trades and offers, not just advertisements', () => {
  const s = producer();
  s.transactions.items = [{ transaction_id: 't1', offer_id: 'o1', proposer_id: 'P01', recipient_id: 'ours', give: bundle(2n, 0n, 0n), receive: bundle(0n, 0n, 2n), settled_tick: 5n, settled_version: 9n }];
  s.offers.items = [offer({ offer_id: 'o1', proposer_id: 'P01', give: bundle(2n, 0n, 0n), receive: bundle(0n, 0n, 2n), status: 2, created_tick: 5n }),
    offer({ offer_id: 'o2', proposer_id: 'P02', give: bundle(0n, 1n, 0n), receive: bundle(1n, 0n, 0n), status: 4, created_tick: 6n })];
  s.advertisements.items = [ad('P03', [1, 2, 3], [])];
  const market = observeMarket(s, config);
  const [p01, p02, p03] = ['P01', 'P02', 'P03'].map(id => market.stations.find(b => b.id === id)!);
  assert.equal(p01.gives.water, 3); assert.equal(p01.specialty, 'water'); assert.deepEqual(p01.wants, ['components']);
  assert.equal(p02.gives.food, 2); assert.deepEqual(p02.wants, ['water']);
  assert.equal(p03.gives.food, 1); assert.equal(p03.specialty, undefined);
  // The settled water supplier outranks a mere advertiser.
  s.advertisements.items.push(ad('P01', [1], [3]));
  const d = decide(s, [], memory(), config);
  assert.equal(d.action.kind, 'offer');
  if (d.action.kind === 'offer') assert.equal(d.action.body.recipient_id, 'P01');
});

test('one open ask per station and resource; offers respect declared wants', () => {
  const s = producer(); s.advertisements.items = [ad('P01', [2], [3])];
  s.offers.items = [ours(s, { offer_id: 'open', recipient_id: 'P01', give: bundle(0n, 0n, 2n), receive: bundle(0n, 3n, 0n), expires_tick: 12n })];
  const d = decide(s, [], memory(), config);
  assert.ok(d.action.kind !== 'offer' || d.action.body.recipient_id !== 'P01' || d.action.body.receive.food === 0n);
  s.offers.items = []; s.advertisements.items = [ad('P01', [2], [1])]; s.self.inventory.water = 3n;
  const e = decide(s, [], memory(), config);
  assert.ok(e.action.kind !== 'offer' || e.action.body.give.components === 0n, 'P01 only wants water');
});

// Run-39 follow-ups.
test('failed stations learned from STATION_FAILED are never offered to again', () => {
  const store = new StateStore(); store.newConnection();
  const offerTo = (recipient_id: string): Pending => ({ requestId: `to-${recipient_id}`, tick: 40n, action: { kind: 'offer', body: { recipient_id, give: bundle(3n, 0n, 0n), receive: bundle(0n, 3n, 0n), expires_tick: 43n } } });
  store.pending = [offerTo('P01'), offerTo('P02')];
  store.result(result({ request_id: 'to-P01', ok: false, code: 11, processed_tick: 42n }));
  store.result(result({ request_id: 'to-P02', ok: false, code: 10, processed_tick: 41n }));
  assert.deepEqual([...store.failed], ['P01'], 'only STATION_FAILED marks a station failed');
  assert.deepEqual(store.lags, [2n, 1n]);
  const s = producer(); s.advertisements.items = [ad('P01', [2], [3]), ad('P02', [2], [3])];
  assert.ok(!observeMarket(s, config, ['P01']).stations.some(b => b.id === 'P01'));
  for (let i = 0, m = { attempted: {} as Record<string, bigint>, failed: ['P01'] }; i < 6; i++) {
    const d = decide(s, [], m, config);
    assert.ok(d.action.kind !== 'offer' || d.action.body.recipient_id !== 'P01');
    m = { ...d.nextMemory, failed: ['P01'] };
  }
});

test('offer expiry stretches by the observed server lag', () => {
  const s = producer(); s.advertisements.items = [ad('P01', [2], [3])];
  const d = decide(s, [], { attempted: {}, lag: 2n }, config);
  assert.equal(d.action.kind, 'offer');
  if (d.action.kind === 'offer') assert.equal(d.action.body.expires_tick, s.tick + config.ttl + 2n);
});

test('a resource we do not produce is not sold unless stock covers the rest of the run', () => {
  // Run-39, tick 7: a water producer with 40 food sold food for components,
  // then ran 5 food short late in the run.
  const s = producer({ tick: 7n }); s.self.specialty = 1;
  s.self.inventory = bundle(30n, 40n, 32n); s.self.last_production = bundle(5n, 0n, 0n); s.self.produced_total = bundle(35n, 0n, 0n);
  s.advertisements.items = [ad('P01', [3], [2])];
  s.offers.items = [offer({ offer_id: 'bid', proposer_id: 'P01', give: bundle(0n, 0n, 6n), receive: bundle(0n, 4n, 0n), expires_tick: 10n })];
  const p = plan(s, spendable(s, []), observeMarket(s, config), config);
  assert.equal(p.sellable.food, 0n); assert.ok(p.sellable.water > 0n);
  for (let i = 0, m = memory(); i < 6; i++) {
    const d = decide(s, [], m, config);
    assert.notEqual(d.action.kind, 'accept');
    assert.ok(d.action.kind !== 'offer' || d.action.body.give.food === 0n, 'never pays food');
    if (d.action.kind === 'advertise') assert.ok(!d.action.body.selling.items.includes(2));
    m = d.nextMemory;
  }
  // An urgent need may still be paid for with a non-produced resource.
  s.self.inventory.components = 3n;
  assert.equal(decide(s, [], memory(), config).action.kind, 'accept');
});

test('peer bids above par raise the value of what they ask for', () => {
  const s = producer();
  const before = plan(s, spendable(s, []), observeMarket(s, config), config).value.food;
  s.offers.items = [offer({ offer_id: 'bid', proposer_id: 'P01', give: bundle(0n, 0n, 12n), receive: bundle(0n, 4n, 0n), created_tick: 9n, expires_tick: 12n })];
  const market = observeMarket(s, config);
  assert.equal(market.bids.food, 3);
  // +1 for the 3:1 bid, plus 0.1 market pressure because the bidder now seeks food.
  assert.ok(Math.abs(plan(s, spendable(s, []), market, config).value.food - before - 1.1) < 1e-9);
});

test('unverified advertisements do not count as supply', () => {
  const s = producer(); s.advertisements.items = [ad('P01', [2], []), ad('P02', [2], [])];
  assert.equal(observeMarket(s, config).sellers.food, 0);
  s.offers.items = [offer({ offer_id: 'o', proposer_id: 'P01', give: bundle(1n, 0n, 0n), receive: bundle(0n, 0n, 1n), status: 4 })];
  assert.equal(observeMarket(s, config).sellers.food, 1, 'an advertiser that has traded with us counts');
});

test('accepted terms are repeated at once; unanswered terms wait out the cooldown', () => {
  const s = producer(); s.advertisements.items = [ad('P01', [2], [3])];
  const first = decide(s, [], memory(), config);
  assert.equal(first.action.kind, 'offer');
  if (first.action.kind !== 'offer') return;
  const sent = ours(s, { ...first.action.body, offer_id: 'first', created_tick: s.tick });
  s.offers.items = [{ ...sent, status: 2 }];
  const again = decide(s, [], first.nextMemory, config);
  assert.equal(again.action.kind, 'offer');
  if (again.action.kind === 'offer') assert.deepEqual(again.action.body.give, first.action.body.give);
  s.offers.items = [{ ...sent, status: 4 }];
  const after = decide(s, [], first.nextMemory, config);
  assert.ok(after.action.kind !== 'offer' || after.action.body.give.components !== first.action.body.give.components || after.action.body.recipient_id !== 'P01');
});

test('in-flight acceptances are debited until a snapshot settles them', () => {
  const s = producer(); s.offers.items = [offer({ offer_id: 'in', proposer_id: 'P01', give: bundle(5n, 0n, 0n), receive: bundle(0n, 0n, 30n), expires_tick: 20n })];
  const p: Pending = { requestId: 'acc', tick: 10n, action: { kind: 'accept', body: { offer_id: 'in' } } };
  assert.equal(spendable(s, [p]).components, 50n);
  s.offers.items[0].status = 2;
  assert.equal(spendable(s, [p]).components, 80n, 'a settled offer is already in inventory');
});

// Run-40 follow-ups.
test('buys a non-produced resource toward the whole run, in full lots, while a supplier sells', () => {
  // Run-40, tick 20: 49 water covered the 40-tick plan, so we bought 1 water a
  // tick from the only supplier, then nobody sold water again.
  const s = producer({ tick: 20n }); s.self.inventory = bundle(49n, 84n, 30n);
  s.self.produced_total = bundle(0n, 0n, 100n);
  s.advertisements.items = [ad('P08', [1], [3])];
  const p = plan(s, spendable(s, []), observeMarket(s, config), config);
  assert.equal(p.horizon.water, 100n); assert.equal(p.horizon.components, 40n);
  assert.equal(p.room.water, 51n);
  const d = decide(s, [], memory(), config);
  assert.equal(d.action.kind, 'offer');
  if (d.action.kind === 'offer') assert.equal(d.action.body.receive.water, config.lot);
});

test('an exhausted ladder retries at par every parRetryTicks while the resource is still needed', () => {
  const s = producer({ tick: 36n }); s.advertisements.items = [ad('P08', [1], [3])];
  const market = observeMarket(s, config), p = plan(s, spendable(s, []), market, config);
  const p08 = market.stations.find(b => b.id === 'P08')!;
  const par = (id: string, created: bigint) => ours(s, { offer_id: id, recipient_id: 'P08', give: bundle(0n, 0n, 6n), receive: bundle(6n, 0n, 0n), created_tick: created, expires_tick: created + 3n, status: 4 });
  s.offers.items = [par('a', 20n), par('b', 24n), par('c', 28n), par('d', 32n)];
  assert.equal(askTerms({ ...s, tick: 36n }, p, market, p08, 'components', 'water', config), undefined, 'rests right after the misses');
  const retry = askTerms({ ...s, tick: 38n }, p, market, p08, 'components', 'water', config);
  assert.equal(retry?.premium, 0n, 'then retries at par');
  const full = { ...p, room: { ...p.room, water: 0n } };
  assert.equal(askTerms({ ...s, tick: 38n }, full, market, p08, 'components', 'water', config), undefined, 'but not once the need is met');
});

test('bids above par mark a resource scarce enough to stockpile', () => {
  const s = producer();
  s.offers.items = [offer({ offer_id: 'bid', proposer_id: 'P01', give: bundle(0n, 0n, 8n), receive: bundle(1n, 0n, 0n), created_tick: 9n, expires_tick: 12n })];
  const p = plan(s, spendable(s, []), observeMarket(s, config), config);
  assert.ok(p.stockpile.water > 0n);
});
