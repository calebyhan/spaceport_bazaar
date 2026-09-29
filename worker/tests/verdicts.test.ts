import { expect, test } from 'vitest';
import { decide, fingerprint } from '../policy';
import type { Action, Bundle, Snapshot } from '../types';
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
