import { afterEach, expect, test, vi } from 'vitest';
import { bufferedTerminal, TerminalActivity, terminalSink, terminalStationMatches } from '../terminal';
import { bundle, offer, result, snapshot } from './fixtures';
import type { RecordEntry } from '../persistence';

afterEach(() => { vi.unstubAllEnvs(); vi.useRealTimers(); });
const trade = (id: string, proposer = 'peer', recipient = 'ours') => ({ transaction_id: id, offer_id: 'gift', proposer_id: proposer, recipient_id: recipient, give: bundle(0n, 2n, 0n), receive: bundle(1n, 0n, 0n), settled_tick: 1n, settled_version: 2n });
const state = (tick: bigint, extra: Parameters<typeof snapshot>[0] = {}): RecordEntry => ({ kind: 'state', strategy: 'balanced', payload: snapshot({ tick, ...extra }) });
const decision = (requestId?: string, kind = 'accept'): RecordEntry => ({ kind: 'decision', requestId, payload: { action: { kind } } });

test('a 120-tick run prints twelve stable blocks, including intervals with no trades', () => {
  const blocks: string[] = [], activity = new TerminalActivity(block => blocks.push(block));
  for (let tick = 0n; tick <= 120n; tick++) {
    const s = state(tick, { phase: tick === 120n ? 4 : 2 });
    activity.append(s); activity.append(s);
    expect(blocks).toHaveLength(Number(tick / 10n));
  }
  expect(blocks[0]).toContain('Ticks 0–10'); expect(blocks[11]).toContain('Ticks 110–120');
  expect(blocks[0]).toContain('Trades completed: 0');
  activity.append({ kind: 'run-summary', payload: {} });
  expect(blocks).toHaveLength(12);
});
test('aggregates settled trades by peer and perspective; deduplicates history and expired offers', () => {
  const blocks: string[] = [], activity = new TerminalActivity(block => blocks.push(block));
  activity.append(state(0n, { transactions: { items: [trade('historical')] }, offers: { items: [offer({ status: 4, offer_id: 'old' })] } }));
  const extra = { transactions: { items: [trade('historical'), trade('a'), trade('b'), trade('c', 'ours', 'other'), trade('unrelated', 'x', 'y')] }, offers: { items: [offer(), offer({ status: 4 }), offer({ status: 4, offer_id: 'foreign', recipient_id: 'elsewhere' }), offer({ offer_id: 'out', proposer_id: 'ours', recipient_id: 'peer' }), offer({ offer_id: 'elapsed', expires_tick: 0n })] } };
  activity.append(state(1n, extra)); activity.append(state(1n, extra));
  expect(blocks).toHaveLength(0);
  activity.append(state(10n, { ...extra, offers: { items: [offer({ expires_tick: 20n })] } }));
  expect(blocks[0]).toContain('Trades completed: 3');
  expect(blocks[0]).toContain('peer: 2 trades — gave 2 water → received 4 food');
  expect(blocks[0]).toContain('gave 2 water → received 4 food');
  expect(blocks[0]).toContain('gave 2 food → received 1 water');
  expect(blocks[0]).toContain('Offers pending now: 1 | Expired this interval: 1');
  activity.append(state(20n, extra));
  expect(blocks[1]).toContain('Trades completed: 0'); expect(blocks[1]).toContain('Expired this interval: 0');
  activity.append(state(30n, { transactions: { items: [{ ...trade('gift'), receive: bundle(0n, 0n, 0n) }, { ...trade('donation', 'ours', 'other'), receive: bundle(0n, 0n, 0n) }] } }));
  expect(blocks[2]).toContain('gave nothing → received 2 food');
  expect(blocks[2]).toContain('gave 2 food → received nothing');
  activity.append(state(40n, { transactions: { items: [{ ...trade('mixed', 'ours', 'peer'), give: bundle(0n, 3n, 0n), receive: bundle(2n, 2n, 0n) }, { ...trade('neutral', 'ours', 'other'), give: bundle(0n, 2n, 0n), receive: bundle(0n, 2n, 0n) }] } }));
  expect(blocks[3]).toContain('peer: 1 trades — gave 3 food → received 2 water · 2 food');
  expect(blocks[3]).not.toContain('Net change');
});
test('counts rejected trade requests once and keeps advertisements, waits and cancellations quiet', () => {
  const blocks: string[] = [], activity = new TerminalActivity(block => blocks.push(block));
  activity.append(state(0n));
  [decision('ad', 'advertise'), decision('wait', 'wait'), decision(), decision('ok'), decision('bad'), decision('snapshot-result'), decision('cancelled')].forEach(e => activity.append(e));
  activity.append({ kind: 'cancelled', requestId: 'cancelled', payload: {} });
  for (const id of ['ad', 'wait', 'ok', 'bad', 'bad', 'cancelled']) activity.append({ kind: 'result', payload: result({ request_id: id, ok: id === 'ok' }) });
  activity.append({ kind: 'sent', requestId: 'ok', payload: {} });
  expect(blocks).toHaveLength(0);
  activity.append(state(10n, { request_results: { items: [result({ request_id: 'snapshot-result', ok: false })] } }));
  expect(blocks[0]).toContain('Trade requests rejected this interval: 2');
  activity.append({ kind: 'result', payload: result({ request_id: 'snapshot-result', ok: false }) });
  activity.append(state(20n)); expect(blocks[1]).toContain('Trade requests rejected this interval: 0');
});
test('health loss and critical lifecycle alerts are immediate, and shutdown flushes a partial block once', () => {
  const blocks: string[] = [], activity = new TerminalActivity(block => blocks.push(block));
  activity.append({ kind: 'lifecycle', payload: { to: 'disconnected', reason: 'Lost\nconnection\x1b' } });
  expect(blocks[0]).toContain('[?] ALERT disconnected: Lost connection ');
  activity.append({ kind: 'run-summary', payload: {} });
  activity.append(state(0n));
  const s = snapshot(); s.self.health = 95n;
  activity.append(state(3n, { self: s.self }));
  expect(blocks[1]).toContain('ALERT health 100 → 95');
  activity.append(state(3n, { self: s.self })); expect(blocks).toHaveLength(2);
  activity.append({ kind: 'lifecycle', payload: { to: 'failed', reason: 'Disk failure' } });
  expect(blocks[2]).toContain('[ours] ALERT failed'); expect(blocks[3]).toContain('Ticks 0–3');
  expect(blocks[3]).toContain('Health: start 100 → end 95');
  activity.append({ kind: 'lifecycle', payload: { to: 'stopped', reason: 'Stopped' } });
  activity.append({ kind: 'lifecycle', payload: { to: 'participating', reason: 'Running' } });
  expect(blocks).toHaveLength(4);
});
test.each([4, 5])('terminal phase %s flushes partial intervals; late starts and skipped ticks use actual observed spans', phase => {
  const blocks: string[] = [], activity = new TerminalActivity(block => blocks.push(block));
  activity.append(state(23n)); activity.append(state(45n));
  expect(blocks[0]).toContain('Ticks 23–45');
  activity.append(state(47n, { phase })); activity.append(state(47n, { phase }));
  expect(blocks[1]).toContain('Ticks 45–47'); expect(blocks).toHaveLength(2);
});
test('output is deferred, bounded, and drops backlogged display lines without throwing', async () => {
  vi.useFakeTimers();
  const write = vi.fn((_text: string) => true); let ready = true;
  const log = bufferedTerminal(write, () => ready);
  log('first'); expect(write).not.toHaveBeenCalled(); await vi.runAllTimersAsync(); expect(write).toHaveBeenLastCalledWith('first\n');
  for (let i = 0; i < 300; i++) log(String(i));
  await vi.runAllTimersAsync(); expect(write.mock.lastCall![0]).toContain('44 display lines skipped');
  ready = false; log('blocked'); await vi.runAllTimersAsync();
  expect(write).toHaveBeenCalledTimes(2);
  ready = true; log('resumed'); await vi.runAllTimersAsync(); expect(write.mock.lastCall![0]).toContain('1 display lines skipped');
  write.mockImplementationOnce(() => { throw new Error('closed'); });
  log('closed'); await vi.runAllTimersAsync();
});
test('journal errors still propagate and logging can be disabled', async () => {
  vi.stubEnv('BAZAAR_TERMINAL_LOG', '0');
  const sink = { append: vi.fn(async () => {}), resolve: vi.fn() };
  expect(terminalSink(sink)).toBe(sink);
  vi.stubEnv('BAZAAR_TERMINAL_LOG', '1');
  const wrapped = terminalSink(sink); wrapped.resolve!('run', 'ours'); expect(sink.resolve).toHaveBeenCalledWith('run', 'ours');
  await wrapped.append({ kind: 'responsiveness', payload: {} });
  await wrapped.append({ kind: 'state', payload: {} });
  wrapped.resolve!('run', 'P09');
  await wrapped.append({ kind: 'state', payload: { self_station_id: 'P09' } });
  await wrapped.append({ kind: 'lifecycle', payload: { to: 'stale', reason: 'No state' } });
  await wrapped.append({ kind: 'sent', payload: {} });
  await new Promise(resolve => setImmediate(resolve));
  const broken = terminalSink({ append: async () => { throw new Error('disk'); } });
  await expect(broken.append({ kind: 'sent', payload: {} })).rejects.toThrow('disk');
});

test('terminal defaults to P09 and filters display without filtering journal records', async () => {
  vi.stubEnv('BAZAAR_TERMINAL_STATION', undefined);
  expect(terminalStationMatches('P09')).toBe(true);
  expect(terminalStationMatches('P01')).toBe(false);
  expect(terminalStationMatches(undefined)).toBe(false);
  vi.stubEnv('BAZAAR_TERMINAL_STATION', 'P02');
  expect(terminalStationMatches('P02')).toBe(true);
  expect(terminalStationMatches('P09')).toBe(false);
  vi.stubEnv('BAZAAR_TERMINAL_STATION', undefined);
  const write = vi.spyOn(process.stdout, 'write').mockReturnValue(true);
  try {
    const append = vi.fn(async () => {});
    const other = terminalSink({ append });
    other.resolve!('run', 'P01');
    await other.append(state(0n, { self_station_id: 'P01' }));
    await other.append(state(10n, { self_station_id: 'P01' }));
    await other.append({ kind: 'lifecycle', payload: { to: 'failed', reason: 'Hidden planet' } });
    await new Promise(resolve => setImmediate(resolve));
    expect(append).toHaveBeenCalledTimes(3); expect(write).not.toHaveBeenCalled();
    const ours = terminalSink({ append });
    await ours.append(state(0n, { self_station_id: 'P09' }));
    await ours.append(state(10n, { self_station_id: 'P09' }));
    await new Promise(resolve => setImmediate(resolve));
    expect(write).toHaveBeenCalledWith(expect.stringContaining('P09 · balanced · Ticks 0–10'));
  } finally { write.mockRestore(); }
});
