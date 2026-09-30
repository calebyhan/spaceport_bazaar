import { expect, test } from 'vitest';
import { archetype, archetypes } from '../archetypes';
import { getStrategy, listStrategies } from '../strategies';
import type { Advertisement, Pending, Snapshot } from '../types';
import { bundle, snapshot, offer, defaultConfig as config } from './fixtures';

// `ours` produces water and holds 20 water, 1 food, 8 components with upkeep
// 1 of each: food (1) and components (8) are needs below 15 ticks, most
// urgent first; the reserve floor is 3 of each (3 ticks for par and greedy).
const par = archetype(archetypes.par), greedy = archetype(archetypes.greedy), passive = archetype(archetypes.passive);
const base = (patch: (s: Snapshot) => void = () => {}) => { const s = snapshot(); patch(s); return s; };
const decide = (policy: typeof par, s: Snapshot, pending: Pending[] = []) => policy({ snapshot: s, pending, memory: { attempted: {} }, config });
const ad = (station_id: string, selling: number[], extra: Partial<Advertisement> = {}): Advertisement =>
  ({ advertisement_id: `${station_id}-ad`, station_id, selling: { items: selling }, seeking: { items: [] }, expires_tick: 6n, status: 1, ...extra });
const ownAd = ad('ours', [1], { seeking: { items: [2, 3] } });

test('opponents are registered in the catalog and selectable by name', () => {
  expect(listStrategies().map(s => s.name)).toEqual(['baseline', 'observe', 'par', 'greedy', 'passive']);
  expect(getStrategy('greedy')).toMatchObject({ version: 'greedy-1' });
});

test.each([['paused', (s: Snapshot) => { s.phase = 3; }], ['failed', (s: Snapshot) => { s.self.failed_once = true; }]])('a %s station waits', (_n, patch) => {
  expect(decide(par, base(patch))).toMatchObject({ action: { kind: 'wait' }, explanation: { policyVersion: 'par-1', rationale: 'The run is not trading for us.' } });
});

test('one command at a time', () => {
  expect(decide(par, base(), [{ requestId: 'r', action: { kind: 'accept', body: { offer_id: 'x' } }, tick: 0n }]).explanation.rationale).toBe('One command at a time: waiting for its result.');
});

test('accepts the first offer that meets its price and reserve, with a verdict for every inbound offer', () => {
  const s = base(s => {
    s.offers.items = [
      offer({ offer_id: 'cheap', give: bundle(0n, 1n, 0n), receive: bundle(2n, 0n, 0n) }),       // 1 unit for our 2
      offer({ offer_id: 'reserve', give: bundle(0n, 0n, 18n), receive: bundle(18n, 0n, 0n) }),   // leaves 2 water, floor is 3
      offer({ offer_id: 'useless', give: bundle(2n, 0n, 0n), receive: bundle(0n, 0n, 2n) }),     // water is not a need
      offer({ offer_id: 'gift', give: bundle(0n, 2n, 0n), receive: bundle(0n, 0n, 0n) }),
      offer({ offer_id: 'good', give: bundle(0n, 2n, 0n), receive: bundle(2n, 0n, 0n) }),
      offer({ offer_id: 'expired', expires_tick: 0n }),
      offer({ offer_id: 'outgoing', proposer_id: 'ours', recipient_id: 'P01' }),
    ];
  });
  const d = decide(par, s);
  expect(d.action).toEqual({ kind: 'accept', body: { offer_id: 'gift' } });
  expect(d.explanation.inbound).toEqual({
    cheap: { verdict: 'pass', reason: 'below our price of 1:1' }, reserve: { verdict: 'pass', reason: 'would breach our reserve' },
    useless: { verdict: 'pass', reason: 'brings nothing we need' }, gift: { verdict: 'accept', reason: 'meets our price and reserve' },
    good: { verdict: 'accept', reason: 'meets our price and reserve' },
  });
  // Greedy wants 2 units for each 1 it pays.
  s.offers.items = s.offers.items.filter(o => o.offer_id === 'good');
  expect(decide(greedy, s).explanation.inbound).toEqual({ good: { verdict: 'pass', reason: 'below our price of 2:1' } });
});

test('advertises its specialty while above the floor, and its needs most urgent first', () => {
  expect(decide(par, base()).action).toEqual({ kind: 'advertise', body: { selling: { items: [1] }, seeking: { items: [2, 3] }, expires_tick: 6n } });
  expect(decide(par, base(s => { s.self.inventory = bundle(3n, 9n, 1n); })).action).toMatchObject({ body: { selling: { items: [] }, seeking: { items: [3, 2] } } });
  // A longer publication limit caps the advertisement at 4 x the offer TTL.
  expect(decide(par, base(s => { s.rules.duration_ticks = 60n; s.rules.max_publication_ttl_ticks = 20n; })).action).toMatchObject({ body: { expires_tick: 12n } });
});

test('proposes a fixed lot to the first advertised seller of its top need without an open offer', () => {
  const s = base(s => {
    s.advertisements.items = [ownAd, ad('P02', [2]), ad('P01', [2]), ad('P03', [3]), ad('ours', [2], { advertisement_id: 'old', status: 2 }), ad('P04', [2], { expires_tick: 0n })];
    s.offers.items = [offer({ offer_id: 'open', proposer_id: 'ours', recipient_id: 'P01' })];
  });
  expect(decide(par, s).action).toEqual({ kind: 'offer', body: { recipient_id: 'P02', give: bundle(3n, 0n, 0n), receive: bundle(0n, 3n, 0n), expires_tick: 3n } });
  expect(decide(par, s).explanation.rationale).toBe('Offer 3 water for 3 food to P02.');
  expect(decide(greedy, s).action).toMatchObject({ body: { receive: bundle(0n, 6n, 0n) } });
  expect(decide(passive, s).action).toEqual({ kind: 'wait' });
  s.rules.max_offer_ttl_ticks = 2n;
  expect(decide(par, s).action).toMatchObject({ body: { expires_tick: 2n } });
});

test.each([
  ['three offers already open', (s: Snapshot) => { s.offers.items = ['P05', 'P06', 'P07'].map(id => offer({ offer_id: id, proposer_id: 'ours', recipient_id: id })); }],
  ['the offer would outlive the run', (s: Snapshot) => { s.tick = 4n; s.advertisements.items[0].expires_tick = 10n; s.advertisements.items[1].expires_tick = 10n; }],
  ['paying the lot would breach the floor', (s: Snapshot) => { s.self.inventory = bundle(5n, 1n, 8n); }],
  ['no station sells the need', (s: Snapshot) => { s.advertisements.items = [ownAd, ad('P01', [1])]; }],
  ['nothing is needed', (s: Snapshot) => { s.self.inventory = bundle(3n, 20n, 20n); s.advertisements.items = []; }],
])('waits when %s', (_name, patch) => {
  const s = base(s => { s.advertisements.items = [ownAd, ad('P01', [2])]; });
  patch(s);
  expect(decide(par, s)).toMatchObject({ action: { kind: 'wait' }, explanation: { rationale: 'Nothing useful to do.' } });
});

test('an advertisement that would outlive the run is not published', () => {
  expect(decide(par, base(s => { s.tick = 1n; })).action).toEqual({ kind: 'wait' });
});
