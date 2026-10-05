import { expect, test } from 'vitest';
import { decide, fingerprint } from '../policy';
import type { Action, Bundle, Command, Snapshot } from '../types';
import { bundle, snapshot, offer, result, defaultConfig as config } from './fixtures';

// A components producer at tick 10 of 120 with no water or food production,
// so water and food are dear and components are cheap to it.
function producer(inventory: Bundle): Snapshot {
  const s = snapshot({ tick: 10n });
  s.rules = { ...s.rules, duration_ticks: 120n, max_offer_ttl_ticks: 12n, max_publication_ttl_ticks: 12n, new_commands_per_station_per_tick: 10n, max_open_outgoing_offers: 24n };
  s.self.specialty = 3; s.self.inventory = inventory;
  s.self.last_production = bundle(0n, 0n, 5n); s.self.produced_total = bundle(0n, 0n, 50n);
  s.directory = { items: ['ours', 'P01'].map(station_id => ({ station_id, display_name: station_id })) };
  return s;
}
// Terms from the proposer's side: P01 gives `give` and asks for `receive`.
const incoming = (offer_id: string, give: Bundle, receive: Bundle) => offer({ offer_id, proposer_id: 'P01', give, receive, expires_tick: 14n });

test('every open inbound offer gets a verdict with a reason', () => {
  const s = producer(bundle(20n, 20n, 80n));
  s.offers.items = [
    incoming('below-par', bundle(0n, 1n, 0n), bundle(0n, 0n, 2n)),      // 1 unit for our 2
    incoming('no-value', bundle(0n, 0n, 2n), bundle(0n, 2n, 0n)),       // cheap components for dear food
    incoming('cannot-spare', bundle(3n, 0n, 0n), bundle(0n, 2n, 0n)),   // food we need for the whole run
    incoming('big-gift', bundle(0n, 5n, 0n), bundle(0n, 0n, 0n)),
    incoming('small-gift', bundle(0n, 1n, 0n), bundle(0n, 0n, 0n)),
    offer({ offer_id: 'ours-out', proposer_id: 'ours', recipient_id: 'P01' }),
    incoming('expired', bundle(0n, 1n, 0n), bundle(0n, 0n, 0n)),
  ];
  s.offers.items.at(-1)!.expires_tick = 10n;
  const d = decide(s, [], { attempted: {} }, config);
  expect(d.action).toEqual({ kind: 'accept', body: { offer_id: 'big-gift' } });
  const inbound = d.explanation.inbound;
  expect(Object.keys(inbound).sort()).toEqual(['below-par', 'big-gift', 'cannot-spare', 'no-value', 'small-gift']);
  expect(inbound['below-par']).toEqual({ verdict: 'pass', reason: 'below par: we would receive fewer units than we give', value: undefined });
  expect(inbound['no-value']).toMatchObject({ verdict: 'pass', reason: 'no value gain at current plan values' });
  expect(inbound['no-value'].value).toBeLessThan(0);
  expect(inbound['cannot-spare']).toMatchObject({ verdict: 'pass', reason: 'pays with resources the plan cannot spare' });
  expect(inbound['small-gift']).toMatchObject({ verdict: 'pass', reason: 'safe and valuable, but ranked below the chosen action' });
  expect(inbound['big-gift']).toMatchObject({ verdict: 'accept', reason: 'Accept a safe inbound gift.' });
  expect(inbound['big-gift'].value).toBeGreaterThan(inbound['small-gift'].value!);
});

test('a gift is accepted only when it brings something the plan still needs', () => {
  // Components are our specialty and we hold plenty; food is never produced.
  const s = producer(bundle(20n, 20n, 80n));
  s.offers.items = [incoming('unneeded', bundle(0n, 0n, 5n), bundle(0n, 0n, 0n)), incoming('mixed', bundle(0n, 1n, 5n), bundle(0n, 0n, 0n))];
  for (const generous of [false, true]) {
    const d = decide(s, [], { attempted: {} }, config, { generous });
    expect(d.explanation.inbound['unneeded']).toEqual({ verdict: 'pass', reason: 'a gift of nothing our plan still needs' });
    expect(d.action).toEqual({ kind: 'accept', body: { offer_id: 'mixed' } });
  }
  // Production covers components, but 5 on hand is under 10 ticks of upkeep.
  const thin = producer(bundle(20n, 20n, 5n));
  thin.offers.items = [incoming('top-up', bundle(0n, 0n, 5n), bundle(0n, 0n, 0n))];
  expect(decide(thin, [], { attempted: {} }, config).action).toEqual({ kind: 'accept', body: { offer_id: 'top-up' } });
});

test('a valuable trade that brings forecast failure earlier is refused as unsafe', () => {
  // Food is never produced: 20 food lasts to tick 30 and paying 2 ends it at
  // tick 28. The 6 water is worth more to the plan, but we already hold 40.
  const s = producer(bundle(40n, 20n, 80n));
  s.offers.items = [incoming('pay-food', bundle(6n, 0n, 0n), bundle(0n, 2n, 0n))];
  const verdict = decide(s, [], { attempted: {} }, config).explanation.inbound['pay-food'];
  expect(verdict).toMatchObject({ verdict: 'pass', reason: 'unsafe: it would breach the reserve or bring failure earlier' });
  expect(verdict.value).toBeGreaterThan(0);
});

test('below reserve, a trade that lowers forecast health is refused with that reason', () => {
  // Reserve is 2 ticks of 1 water; we hold 1.
  const s = producer(bundle(1n, 20n, 80n));
  s.offers.items = [incoming('pay-water', bundle(0n, 3n, 0n), bundle(2n, 0n, 0n))];
  expect(decide(s, [], { attempted: {} }, config).explanation.inbound['pay-water'])
    .toMatchObject({ verdict: 'pass', reason: 'unsafe: we are below reserve and it would lower forecast health' });
});

const gift = () => { const s = producer(bundle(20n, 20n, 80n)); s.offers.items = [incoming('gift', bundle(0n, 5n, 0n), bundle(0n, 0n, 0n))]; return s; };
const accept: Action = { kind: 'accept', body: { offer_id: 'gift' } };
test.each([
  ['identical command in flight', 'an identical command is already awaiting its result',
    (s: Snapshot) => decide(s, [{ requestId: 'r', action: accept, tick: 10n }], { attempted: {} }, config)],
  ['recent identical attempt', 'cooling down after an identical attempt',
    (s: Snapshot) => decide(s, [], { attempted: { [fingerprint(accept)]: 12n } }, config)],
  ['no command capacity', 'no command capacity left this tick',
    (s: Snapshot) => { s.rules.new_commands_per_station_per_tick = 1n; s.request_results.items = [result({ processed_tick: 10n })]; return decide(s, [], { attempted: {} }, config); }],
])('a valuable offer filtered by %s says so', (_name, reason, run) => {
  const d = run(gift());
  expect(d.action.kind).not.toBe('accept');
  expect(d.explanation.inbound.gift).toMatchObject({ verdict: 'pass', reason });
});

test('decisions that stop before evaluating offers carry an empty verdict map', () => {
  const s = gift(); s.phase = 3;
  expect(decide(s, [], { attempted: {} }, config).explanation.inbound).toEqual({});
});

test('a generous policy accepts safe par trades paid from spare that baseline passes as valueless', () => {
  // Flush in water and components: swapping them gains us nothing, but
  // the proposer gets components we will never need.
  const s = producer(bundle(400n, 200n, 80n));
  s.offers.items = [incoming('help-a', bundle(2n, 0n, 0n), bundle(0n, 0n, 2n)), incoming('help-b', bundle(3n, 0n, 0n), bundle(0n, 0n, 3n))];
  const strict = decide(s, [], { attempted: {} }, config).explanation.inbound;
  expect(strict['help-a']).toMatchObject({ verdict: 'pass', reason: 'no value gain at current plan values' });
  const d = decide(s, [], { attempted: {} }, config, { generous: true });
  expect(d.action).toEqual({ kind: 'accept', body: { offer_id: 'help-a' } });
  expect(d.explanation.inbound['help-a'].reason).toMatch(/helps the proposer/);
  expect(d.explanation.inbound['help-b']).toMatchObject({ verdict: 'pass', reason: 'safe and helpful, but ranked below the chosen action' });
});

// A components producer flush with everything, next to P01 which seeks `seeks`.
function flush(seeks: number[], inventory = bundle(400n, 400n, 400n)) {
  const s = producer(inventory);
  s.advertisements.items = [{ advertisement_id: 'p01-ad', station_id: 'P01', status: 1, selling: { items: [] }, seeking: { items: seeks }, expires_tick: 30n }];
  return s;
}
// An advertisement in flight keeps our own ad update out of the way.
const advertising = [{ requestId: 'ad', tick: 10n, action: { kind: 'advertise', body: { selling: { items: [] }, seeking: { items: [] }, expires_tick: 20n } } as Command }];
const giving = (s: Snapshot, pending = advertising) => decide(s, pending, { attempted: {} }, config, { generous: true });

test('generous mode gives whole-run surplus free, in a small lot, to a station that seeks it', () => {
  const d = giving(flush([3]));
  expect(d.action).toEqual({ kind: 'offer', body: { recipient_id: 'P01', give: bundle(0n, 0n, 6n), receive: bundle(0n, 0n, 0n), expires_tick: 13n } });
  expect(d.explanation.rationale).toBe('Give 6 components free to P01, which seeks it: surplus beyond our whole-run needs and buffer.');
  expect(decide(flush([3]), advertising, { attempted: {} }, config).action.kind).toBe('wait');
});

test('generous giveaways skip unknown wants, needed or thin stock, unsafe lots and stations already gifted', () => {
  expect(giving(flush([])).action.kind).toBe('wait');
  // Food is never produced and 20 units cannot cover the run, so we need it.
  expect(giving(flush([2], bundle(400n, 20n, 400n))).action.kind).toBe('wait');
  // Sought water is scarce, so the plan stockpiles a buffer of it: short of
  // that we still need it; at exactly the buffer nothing is left to give.
  expect(giving(flush([1], bundle(115n, 400n, 400n))).action.kind).toBe('wait');
  expect(giving(flush([1], bundle(120n, 400n, 400n))).action.kind).toBe('wait');
  // Plenty of production, but only 2 components on hand to pay with.
  expect(giving(flush([3], bundle(400n, 400n, 2n))).action.kind).toBe('wait');
  const open = flush([3]);
  open.offers.items = [offer({ offer_id: 'ours', proposer_id: 'ours', recipient_id: 'P01', give: bundle(0n, 0n, 6n), receive: bundle(0n, 0n, 0n), expires_tick: 12n })];
  expect(giving(open).action.kind).toBe('wait');
  const pendingGifts = (['P02', 'P03'] as const).map(id => ({ requestId: id, tick: 10n,
    action: { kind: 'offer', body: { recipient_id: id, give: bundle(0n, 0n, 6n), receive: bundle(0n, 0n, 0n), expires_tick: 13n } } as Command }));
  expect(giving(flush([3]), pendingGifts).action.kind).not.toBe('offer');
});

test('generous giveaways wait until the plan needs nothing more', () => {
  // 100 food cannot cover the 110 ticks left and we never produce it.
  const short = flush([3], bundle(400n, 100n, 400n));
  expect(giving(short).action).not.toMatchObject({ kind: 'offer', body: { receive: bundle(0n, 0n, 0n) } });
});
