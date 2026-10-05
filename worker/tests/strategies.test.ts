import { afterEach, expect, test } from 'vitest';
import { Engine } from '../engine';
import { getStrategy, listStrategies } from '../strategies';
import { workerOptions } from '../options';
import { StrategyExecutor } from '../strategy';
import { decodeClient, encodeServer } from '../codec';
import { snapshot, offer, defaultConfig } from './fixtures';
import type { RecordEntry } from '../persistence';
const engines: Engine[] = [];
afterEach(async () => { for (const e of engines) { e.stop(); await e.idle(); } engines.length = 0; });
const input = () => ({ snapshot: { ...snapshot(), offers: { items: [offer()] } }, pending: [], memory: { attempted: {} }, config: defaultConfig });

test('catalog preserves baseline and offers dedicated scenario policies', () => {
  const value = input(), before = structuredClone(value);
  expect(getStrategy().decide(value).action).toEqual({ kind: 'accept', body: { offer_id: 'gift' } });
  expect(value).toEqual(before);
  expect(listStrategies().map(s => s.name)).toEqual(['baseline', 'class25', 'surplus50', 'surplus25', 'balanced']);
});
test('baseline follows the live generous switch and asks only at par while it is on', () => {
  expect(getStrategy().decide(input()).explanation).toMatchObject({ generous: false, config: { maxPremiumPct: 50n } });
  const decision = getStrategy().decide({ ...input(), controls: { generous: true } });
  expect(decision.action).toEqual({ kind: 'accept', body: { offer_id: 'gift' } });
  expect(decision.explanation).toMatchObject({ generous: true, config: { maxPremiumPct: 0n } });
});
test.each(['observe', 'par', 'greedy', 'passive', 'missing', '', 'toString', '__proto__'])('unknown strategy %s fails instead of falling back', name => {
  expect(() => getStrategy(name)).toThrow('Unknown strategy');
  expect(() => new Engine({ strategyName: name, sink: { append: async () => {} } })).toThrow('Unknown strategy');
});
test('CLI selection overrides the environment; omission preserves baseline', () => {
  expect(workerOptions([], {}).strategy.name).toBe('baseline');
  expect(workerOptions([], { BAZAAR_STRATEGY: 'baseline' }).strategy.name).toBe('baseline');
  expect(workerOptions([], { BAZAAR_STRATEGY: 'retired' }, 'baseline').strategy.name).toBe('baseline');
  expect(() => workerOptions(['--strategy=retired'], {}, 'baseline')).toThrow('Unknown strategy');
  expect(workerOptions(['--strategy', 'baseline'], { BAZAAR_STRATEGY: 'observe' }).strategy.name).toBe('baseline');
  expect(() => workerOptions(['--supabase'], {})).toThrow();
  expect(workerOptions(['--exercise'], {}, 'retired').exercise).toBe(true);
  expect(workerOptions(['--list-strategies'], {}).list).toBe(true);
});
test.each([
  [['--strategy'], {}], [['--strategy', 'wrong'], {}], [['--unknown'], {}], [['extra'], {}],
  [['--exercise', '--strategy', 'baseline'], {}], [['--exercise'], { BAZAAR_STRATEGY: 'observe' }],
] as const)('invalid or conflicting options fail before startup: %j', (args, env) => {
  expect(() => workerOptions([...args], env)).toThrow();
});
test.each(['baseline', 'class25', 'surplus50', 'surplus25', 'balanced'])('worker thread executes the selected %s strategy', async name => {
  const executor = new StrategyExecutor(name);
  try {
    const result = await executor.evaluate(input(), 2000, () => {});
    expect(result.decision.action.kind).toBe('accept');
  } finally { executor.close(); }
});
test.each(['baseline'])('transport and activity sinks can change without changing %s policy', async strategyName => {
  const outputs: unknown[][] = [];
  for (const adapter of ['raw', 'buffered']) {
    const records: RecordEntry[] = [], kinds: string[] = [], commands: unknown[] = [];
    const e = new Engine({ strategyName, sink: adapter === 'raw'
      ? { append: async entry => { records.push(entry); } }
      : { append: async entry => { kinds.push(entry.kind); records.push(structuredClone(entry)); } } });
    engines.push(e);
    const epoch = e.connect({ send: bytes => {
      const message = decodeClient(adapter === 'raw' ? bytes : Buffer.from(bytes));
      if (message.accept) commands.push(message.accept.body);
    }, close() {} });
    const s = input().snapshot;
    e.receive(epoch, encodeServer({ state: s }));
    e.receive(epoch, encodeServer({ readiness: { protocol_version: '2.0', run_id: s.run_id, ready: true, snapshot_sequence: s.snapshot_sequence } }));
    await e.idle();
    const decision = records.find(record => record.kind === 'decision' && (record.payload as { source: string }).source === 'policy');
    expect(decision?.strategy).toBe(strategyName);
    expect(e.config.version).toBe('market-5');
    expect(commands).toEqual([{ offer_id: 'gift' }]);
    if (adapter === 'buffered') expect(kinds).toContain('decision');
    outputs.push(commands);
  }
  expect(outputs[0]).toEqual(outputs[1]);
});
test.each(['baseline'])('journal recovery isolates %s memory but retains every outstanding command', async strategyName => {
  const previous: RecordEntry[] = [
    { kind: 'decision', payload: { run: 'test-run', nextMemory: { attempted: { legacy: '7' } } } },
    { kind: 'decision', strategy: 'observe', payload: { run: 'test-run', nextMemory: { attempted: { observation: '9' } } } },
    { kind: 'command', strategy: 'baseline', payload: { run: 'test-run', requestId: 'unresolved', tick: '0', action: { kind: 'accept', body: { offer_id: 'gift' } } } },
  ];
  const e = new Engine({ strategyName, previous, sink: { append: async () => {} } }); engines.push(e);
  const epoch = e.connect({ send() {}, close() {} });
  e.receive(epoch, encodeServer({ state: snapshot({ phase: 3 }) })); await e.idle();
  expect(e.memory.attempted).toEqual({ legacy: 7n });
  expect(e.state.pending[0].requestId).toBe('unresolved');
});
test('the engine reads live controls before each decision and hands them to the policy', async () => {
  const records: RecordEntry[] = [];
  const e = new Engine({ strategyName: 'baseline', controls: () => ({ generous: true }), sink: { append: async entry => { records.push(entry); } } });
  engines.push(e);
  const epoch = e.connect({ send() {}, close() {} });
  const s = input().snapshot;
  e.receive(epoch, encodeServer({ state: s }));
  e.receive(epoch, encodeServer({ readiness: { protocol_version: '2.0', run_id: s.run_id, ready: true, snapshot_sequence: s.snapshot_sequence } }));
  await e.idle();
  const decision = records.find(record => record.kind === 'decision' && (record.payload as { source: string }).source === 'policy');
  expect((decision?.payload as { explanation: { generous: boolean } }).explanation.generous).toBe(true);
});

test('class25 preserves the validated non-generous baseline decisions with its own version and defaults', () => {
  const baseline = getStrategy('baseline'), selected = getStrategy('class25');
  expect(selected.defaults).not.toBe(baseline.defaults);
  expect({ ...selected.defaults, version: baseline.version }).toEqual(baseline.defaults);
  for (const generous of [false, true]) {
    const decision = selected.decide({ ...input(), config: selected.defaults, controls: { generous } });
    const reference = baseline.decide({ ...input(), config: baseline.defaults, controls: { generous: false } });
    expect(decision).toEqual({ ...reference, explanation: { ...reference.explanation, policyVersion: 'class25-1', config: { ...baseline.defaults, version: 'class25-1' } } });
  }
  expect(baseline.version).toBe('market-5');
});
