import { expect, test } from 'vitest';
import { Engine } from '../engine';
import { cooperativePlan, deliveries, donationSpare } from '../cooperation';
import { getStrategy } from '../strategies';
import { active, spendable, tradeSafety, zero } from '../domain';
import { plan, observeMarket } from '../market';
import { bundle, offer, snapshot, defaultConfig } from './fixtures';
import type { Pending, Transaction } from '../types';

const names = ['surplus50', 'surplus25', 'balanced'] as const;
function marketState() {
  const s = snapshot({ tick: 5n });
  s.rules.duration_ticks = 60n; s.rules.tick_duration_ms = 1000n;
  s.self.inventory = bundle(80n, 3n, 3n);
  s.self.last_production = bundle(4n, 0n, 0n); s.self.produced_total = bundle(20n, 0n, 0n);
  s.advertisements.items = ['a', 'b'].map(station_id => ({ station_id, advertisement_id: station_id, status: 1, selling: { items: [2] }, seeking: { items: [1] }, expires_tick: 60n }));
  return s;
}
function choose(name: typeof names[number], s = marketState(), pending: Pending[] = []) {
  const strategy = getStrategy(name);
  return strategy.decide({ snapshot: s, pending, memory: { attempted: {} }, config: { ...strategy.defaults, version: strategy.version }, controls: { generous: false } });
}
const tx = (overrides: Partial<Transaction> = {}): Transaction => ({ transaction_id: 't', offer_id: 'o', proposer_id: 'ours', recipient_id: 'a', give: bundle(6n, 0n, 0n), receive: bundle(0n, 6n, 0n), settled_tick: 5n, settled_version: 1n, ...overrides });

test.each(names)('%s uses its named preset, prices at par and preserves its input', name => {
  const selected = getStrategy(name), engine = new Engine({ strategyName: name, sink: { append: async () => {} } });
  expect(engine.config).toEqual({ ...selected.defaults, version: selected.version });
  const s = marketState(), before = structuredClone(s), decision = choose(name, s);
  expect(s).toEqual(before); expect(decision.explanation).toMatchObject({ cooperative: name, generous: true, policyVersion: `${name}-1` });
  expect(decision.action.kind).toBe('offer');
  if (decision.action.kind !== 'offer') throw new Error('Expected trade');
  expect(decision.action.body.give.water).toBe(selected.defaults.lot);
  expect(decision.action.body.receive.food).toBe(selected.defaults.lot);
  expect(tradeSafety(s, [], decision.action.body.give, decision.action.body.receive, engine.config).safe).toBe(true);
});

test.each(names)('%s accepts urgent safe supply and rejects a reserve-destroying exchange', name => {
  const s = marketState(); s.offers.items = [offer({ give: bundle(0n, 2n, 0n), receive: bundle(2n, 0n, 0n), expires_tick: 8n })];
  expect(choose(name, s).action).toEqual({ kind: 'accept', body: { offer_id: 'gift' } });
  s.offers.items[0].receive = bundle(1000n, 0n, 0n); s.offers.items[0].give = bundle(0n, 1000n, 0n);
  expect(choose(name, s).action.kind).not.toBe('accept');
});

test('rolling plan buys the least covered resource, caps its horizon and circulates only excess', () => {
  const s = marketState(), c = getStrategy('balanced').defaults, stock = spendable(s, []);
  const original = plan(s, stock, observeMarket(s, c), c);
  const p = cooperativePlan(s, stock, original, c);
  expect(p.horizon.food).toBe(8n); expect(p.room.food).toBe(5n); expect(p.seeking).toContain('food');
  expect(p.value.food).toBeGreaterThan(p.value.water);
  s.tick = 60n;
  expect(cooperativePlan(s, stock, original, c).horizon.food).toBe(0n);
  const covered = cooperativePlan(marketState(), bundle(80n, 40n, 40n), original, c);
  expect(covered.sellable.food).toBe(32n); expect(covered.seeking).not.toContain('food');
});

test('fair proposals prefer the peer we have supplied less, accounting for both trade roles', () => {
  const s = marketState();
  s.transactions.items = [tx(), tx({ proposer_id: 'a', recipient_id: 'ours', receive: bundle(1n, 0n, 0n) }), tx({ recipient_id: 'b', settled_tick: -20n }), tx({ proposer_id: 'x', recipient_id: 'y' })];
  expect(deliveries(s, 8n)).toEqual(new Map([['a', 7n]]));
  expect(choose('balanced', s).action).toMatchObject({ kind: 'offer', body: { recipient_id: 'b' } });
});

test('one commitment per peer includes pending offers and leaves other peers available', () => {
  const s = marketState();
  const first = choose('balanced', s).action;
  if (first.kind !== 'offer') throw new Error('Expected offer');
  const pending: Pending[] = [{ requestId: 'p', tick: s.tick, action: first }];
  expect(choose('balanced', s, pending).action).toMatchObject({ kind: 'offer', body: { recipient_id: 'b' } });
  s.offers.items = [offer({ proposer_id: 'ours', recipient_id: 'a', give: first.body.give, receive: first.body.receive, expires_tick: 8n })];
  expect(choose('balanced', s).action).toMatchObject({ kind: 'offer', body: { recipient_id: 'b' } });
});

test('donations require whole-run cover despite a covered rolling target', () => {
  const s = marketState(), c = getStrategy('surplus50').defaults;
  s.self.inventory = bundle(80n, 25n, 25n);
  expect(donationSpare(s, s.self.inventory, c)).toEqual(zero());
  expect(choose('surplus50', s).action.kind).not.toBe('offer');
  s.self.inventory = bundle(80n, 100n, 100n);
  s.advertisements.items.push({ station_id: 'ours', advertisement_id: 'own', status: 1, selling: { items: [1, 2, 3] }, seeking: { items: [] }, expires_tick: 60n });
  expect(donationSpare(s, s.self.inventory, c).food).toBe(41n);
  expect(choose('surplus50', s).action).toMatchObject({ kind: 'offer', body: { receive: zero() } });
  s.offers.items = [offer({ proposer_id: 'ours', recipient_id: 'a', give: bundle(1n, 0n, 0n), receive: bundle(0n, 1n, 0n), expires_tick: 7n })];
  expect(choose('surplus50', s).action).toMatchObject({ kind: 'offer', body: { recipient_id: 'b', receive: zero() } });
});

test.each(names)('%s respects phases, failure and in-flight capacity', name => {
  const s = marketState(); s.phase = 3;
  expect(choose(name, s).action.kind).toBe('wait');
  s.phase = 2; s.self.failed_once = true;
  expect(choose(name, s).action.kind).toBe('wait');
  s.self.failed_once = false;
  const pending: Pending[] = Array.from({ length: Number(defaultConfig.maxInFlight) }, (_, i) => ({ requestId: String(i), tick: s.tick, action: { kind: 'accept', body: { offer_id: String(i) } } }));
  expect(choose(name, s, pending).action.kind).toBe('wait');
  expect(s.offers.items.filter(o => active(o.status, o.expires_tick, s.tick))).toHaveLength(0);
});
