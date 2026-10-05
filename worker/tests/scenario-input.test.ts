import { readFileSync } from 'node:fs';
import { expect, test } from 'vitest';
import { checkScenario } from '../scenario';
const fixture = () => JSON.parse(readFileSync('examples/strategies/incoming-gift.json', 'utf8'));

test.each(['baseline'])('JSON gift scenario checks the real %s decision offline', async strategy => {
  const value = fixture(), before = structuredClone(value);
  const report = await checkScenario(value, strategy);
  expect(report.passed).toBe(true); expect(report.strategy).toBe(strategy);
  expect(value).toEqual(before);
  expect(report.decision.action.kind).toBe('accept');
});
test('fixture strategy and default selection work, and a wrong expected action fails the check', async () => {
  const value = fixture();
  expect((await checkScenario(value)).passed).toBe(true);
  delete value.strategy; value.expected.baseline = { kind: 'wait' };
  expect((await checkScenario(value)).passed).toBe(false);
});
test('wire-sized integers stay exact, including expected action quantities', async () => {
  const value = fixture();
  value.state.self.inventory.water = '9007199254740993';
  value.config = { lot: '2', ttl: 1 };
  value.expected.baseline = { kind: 'offer', body: { recipient_id: 'other', give: { water: '9007199254740993', food: 0, components: 0 }, receive: { water: 0, food: 1, components: 0 }, expires_tick: '3' } };
  const report = await checkScenario(value, 'baseline');
  expect(report.passed).toBe(false);
  expect(report.expectedAction).toMatchObject({ body: { give: { water: 9007199254740993n } } });
});
test('existing offers, results, advertisements and nullable fields are read from an exported state', async () => {
  const value = fixture(); value.state.offers.items = [value.incomingOffer]; delete value.incomingOffer;
  value.state.self.first_failure_tick = { value: '0' };
  value.state.offers.items[0].closed_tick = { value: 0 };
  value.state.offers.items[0].transaction_id = { value: '123' };
  value.state.advertisements.items = [{ advertisement_id: 'ad', station_id: 'peer', status: 1, selling: { items: [2] }, seeking: { items: [1] }, expires_tick: '6' }];
  value.state.request_results.items = [{ protocol_version: '2.0', run_id: 'test-run', request_id: 'req', ok: true, code: 1, processed_tick: '0', processed_version: '1', object_id: { value: 'object' }, transaction_id: { null: true }, retry_after_tick: { value: '1' } }];
  value.state.transactions.items = [{ transaction_id: 'history' }];
  expect((await checkScenario(value, 'baseline')).passed).toBe(true);
});
test.each([null, [], 4, false])('invalid top-level value %j fails clearly', async value => {
  await expect(checkScenario(value)).rejects.toThrow('scenario must be an object');
});
test.each([
  ['unknown field', (s: ReturnType<typeof fixture>) => { s.sttae = {}; }],
  ['missing state', s => { delete s.state; }],
  ['missing expectation', s => { delete s.expected.baseline; }],
  ['unknown strategy', s => { s.strategy = 'wrong'; }],
  ['non-text strategy', s => { s.strategy = 42; }],
  ['missing collection', s => { delete s.state.offers.items; }],
  ['missing quantity', s => { delete s.state.self.inventory.food; }],
  ['unsafe number', s => { s.state.self.inventory.water = 9007199254740993; }],
  ['negative number', s => { s.state.self.inventory.water = -1; }],
  ['fraction', s => { s.state.self.inventory.water = 1.5; }],
  ['negative string', s => { s.state.self.inventory.water = '-1'; }],
  ['overflow', s => { s.state.self.inventory.water = '18446744073709551616'; }],
  ['empty text', s => { s.state.run_id = ''; }],
  ['invalid enum', s => { s.state.phase = -1; }],
  ['invalid boolean', s => { s.state.self.failed_once = 'false'; }],
  ['invalid nullable', s => { s.state.self.first_failure_tick = {}; }],
  ['ambiguous nullable', s => { s.state.self.first_failure_tick = { null: true, value: '1' }; }],
  ['protocol', s => { s.state.protocol_version = '1.0'; }],
  ['forecast bound', s => { s.state.rules.duration_ticks = '10001'; }],
  ['ttl bound', s => { s.state.rules.max_offer_ttl_ticks = '10001'; }],
  ['duplicate offer', s => { s.state.offers.items = [s.incomingOffer]; }],
  ['config object', s => { s.config = []; }],
  ['unknown config', s => { s.config = { typo: 1 }; }],
  ['config version', s => { s.config = { version: 'pretend' }; }],
  ['zero config', s => { s.config = { lot: 0 }; }],
  ['large config', s => { s.config = { lot: '10001' }; }],
  ['invalid action', s => { s.expected.baseline = { kind: 'dance' }; }],
  ['non-string action', s => { s.expected.baseline = { kind: 5 }; }],
  ['extra action field', s => { s.expected.baseline.body.typo = 'gift'; }],
  ['unexpected wait body', s => { s.expected.baseline = { kind: 'wait', body: {} }; }],
] satisfies [string, (s: ReturnType<typeof fixture>) => void][])('%s is rejected before strategy execution', async (_name, mutate) => {
  const value = fixture(); mutate(value);
  await expect(checkScenario(value)).rejects.toThrow();
});

test.each(['surplus50', 'surplus25', 'balanced'])('offline %s uses the same preset as the live engine', async strategy => {
  const value = fixture(); value.expected[strategy] = value.expected.baseline;
  const report = await checkScenario(value, strategy);
  expect(report.passed).toBe(true);
  const { getStrategy } = await import('../strategies');
  expect(report.decision.explanation.config).toMatchObject(getStrategy(strategy).defaults);
});
