import { afterEach, expect, test } from 'vitest';
import { mkdtemp, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import WebSocket from 'ws';
import { json } from '../serialization';
import type { Bundle, Snapshot } from '../types';
import { amounts, describeAction, newestJournal, offerStatusName, phaseName, readJournal, resultName, type Entry } from '../audit/journal';
import { formatStatus, StatusBuilder } from '../audit/status';
import { formatTrace, TraceBuilder } from '../audit/trace';
import { formatReport, ReportBuilder } from '../audit/report';
import { Engine } from '../engine';
import { Journal } from '../persistence';
import { startSimServer, SUBPROTOCOL } from '../sim/server';
import { createSimulation } from '../sim/setup';
import { defaultEconomy } from '../sim/economy';
import { offer, result } from './fixtures';
import { at, b, entries, journaled, settledState, state, tick } from './journal-fixture';

const upTo = (index: number) => entries.slice(0, index);
const build = <T extends { add(e: Entry): void }>(builder: T, list = entries) => { for (const e of list) builder.add(e); return builder; };
const indexOf = (kind: string, n = 1) => entries.findIndex((e, i) => e.kind === kind && entries.slice(0, i + 1).filter(x => x.kind === kind).length === n);

test('status mid-run: lifecycle, clock, reserves, pending commands, open offers and trades', () => {
  const view = build(new StatusBuilder(), upTo(indexOf('uncertain') + 1)).view(new Date(at(15)));
  expect(view).toMatchObject({ run: 'test-run', station: 'ours', strategy: 'baseline', worker: 'running', lastRecordMs: 1000,
    lifecycle: { stage: 'connecting', sinceMs: 6000 }, connection: { epoch: 2, tick: '1', duration: '6', phase: 'RUNNING', snapshotMs: 5000, stale: false } });
  // Reserve target: 1 upkeep x min(2 reserve ticks, 5 ticks left) = 2.
  expect(view.reserves!.resources).toEqual([{ resource: 'water', stock: '19', target: '2', short: false }, { resource: 'food', stock: '2', target: '2', short: false }, { resource: 'components', stock: '7', target: '2', short: false }]);
  expect(view.pending).toEqual([{ requestId: 'r4', action: 'advertise selling [] seeking [food]', ageMs: 3000, uncertain: true }]);
  expect(view.offers.map(o => [o.id, o.outgoing, o.counterparty, amounts(o.pay), amounts(o.get), o.ticksLeft])).toEqual([
    ['cheap', false, 'supplier-z', '2 water', '1 components', '2'], ['out-2', true, 'supplier-z', '2 water', '2 food', '3']]);
  expect(view.trades).toMatchObject([{ id: 'tx-1', tick: '1', outgoing: false, counterparty: 'supplier-z' }]);
  const text = formatStatus(view);
  expect(text).toContain('Clock:      tick 1/6, RUNNING, connection epoch 2, latest snapshot 5.0 s ago\n');
  expect(text).toContain('Reserves:   water 19/2, food 2/2, components 7/2');
  expect(text).toContain('  r4  advertise selling [] seeking [food], waiting 3.0 s (uncertain: sync requested)');
  expect(text).toContain('  cheap  from supplier-z: we pay 2 water, get 1 components; expires tick 3 (2 left)');
  expect(text).toContain('  out-2  to supplier-z: we pay 2 water, get 2 food; expires tick 4 (3 left)');
  expect(text).toContain('  tick 1  accepted from supplier-z: paid nothing, got 2 food (tx-1)');
});

test('status flags a stale snapshot, a silent worker and a finished run', () => {
  // Latest snapshot at 10 s, latest record (the uncertain command) at 14 s.
  const stale = build(new StatusBuilder(), upTo(indexOf('uncertain') + 1)).view(new Date(at(16)));
  expect(stale.connection!.stale).toBe(true);
  expect(stale.worker).toBe('running');
  expect(formatStatus(stale)).toContain('<< STALE');
  expect(build(new StatusBuilder(), upTo(indexOf('uncertain') + 1)).view(new Date(at(30))).worker).toBe('not writing for 16 s: crashed, killed or hung');
  const done = build(new StatusBuilder()).view(new Date(at(30)));
  expect(done.worker).toBe('exited (run summary written)');
  // Final reserve target: 1 tick left, so 1 of each; food is at 0.
  expect(formatStatus(done)).toContain('food 0/1 SHORT');
  expect(formatStatus(done)).toContain('Pending:    \n  r4');
  expect(build(new StatusBuilder(), upTo(indexOf('run-summary'))).view(new Date(at(30))).worker).toBe('exited (lifecycle finished)');
});

test('status of a journal with no snapshot, or an old journal without lifecycle records', () => {
  const empty = new StatusBuilder().view(new Date(at(0)));
  expect(empty.worker).toBe('not writing for 0 s: crashed, killed or hung');
  expect(formatStatus(empty)).toBe('Run (unknown) as (unknown)\nWorker:     not writing for 0 s: crashed, killed or hung; last record ? ago\nNo snapshot recorded yet.');
  const old = build(new StatusBuilder(), [entries[indexOf('state')]]);
  const failed = journaled({ kind: 'state', payload: state(3, 2, s => {
    s.self.failed_once = true; s.offers.items = [];
    s.transactions.items = [{ transaction_id: 'tx-9', offer_id: 'o', proposer_id: 'ours', recipient_id: 'supplier-z', give: b(1, 0, 0), receive: b(0, 1, 0), settled_tick: 1n, settled_version: 3n }];
  }) });
  old.add(failed);
  old.add(journaled({ kind: 'uncertain', requestId: 'unknown', payload: {} }));
  old.add(journaled({ kind: 'command', at: at(2), requestId: 'waiting-1', payload: { action: { kind: 'withdraw', body: { object_id: 'ad-1' } } } }));
  const text = formatStatus(old.view(new Date(at(3))));
  expect(text).toContain('Run test-run as ours\n');
  expect(text).not.toContain('Lifecycle:');
  expect(text).toContain('connection epoch ?');
  expect(text).toContain('Health:     100 (permanently failed)');
  expect(text).toContain('Open offers: none');
  expect(text).toContain('  waiting-  withdraw ad-1, waiting 1.0 s\n');
  expect(text).toContain('  tick 1  our offer to supplier-z: paid 1 water, got 1 food (tx-9)');
});

const trace = (target: { offer?: string; request?: string }) => {
  const t = build(new TraceBuilder()).trace(target);
  return { t, text: formatTrace(t, target.offer ? `offer ${target.offer}` : `request ${target.request}`) };
};

test('an accepted gift: every verdict, the superseded decision, the command, the result and the settlement', () => {
  const { t, text } = trace({ offer: 'gift' });
  expect(t.verdicts.map(v => [v.verdict, v.count, v.unsent])).toEqual([['not evaluated', 1, false], ['pass', 1, false], ['accept', 1, true], ['accept', 1, false], ['unrecorded', 1, false]]);
  expect(text).toBe([
    'Offer gift: supplier-z -> ours (incoming): we pay nothing, get 2 food; expires tick 3',
    '  First seen at tick 0 (snapshot 1) as OPEN',
    '',
    'What we knew and decided',
    '  tick 0 (snapshot 1): NOT EVALUATED: the engine waited without asking the strategy: Waiting for readiness',
    '    knew: inventory 20 water, 1 food, 8 components; health 100',
    '  tick 0 (snapshot 1): PASS: no command capacity left this tick (value 2.00)',
    '    knew: inventory 20 water, 1 food, 8 components; health 100',
    '  tick 0 (snapshot 1): ACCEPT: Accept a safe inbound gift. (value 2.00); superseded before sending (a new state or result arrived)',
    '    knew: inventory 20 water, 1 food, 8 components; health 100',
    '  tick 0 (snapshot 1): ACCEPT: Accept a safe inbound gift. (value 2.00)',
    '    knew: inventory 20 water, 1 food, 8 components; health 100',
    '  tick 0 (snapshot 1): UNRECORDED: this journal predates per-offer verdicts; the decision chosen was: Offer 2 water for 2 food.',
    '    knew: inventory 20 water, 1 food, 8 components; health 100',
    '',
    'What we sent',
    '  request r1: accept offer gift',
    '    decided at tick 0 (snapshot 1): Accept a safe inbound gift.',
    '    knew: inventory 20 water, 1 food, 8 components; health 100',
    '    plan values: water 1.00, food 2.00, components 1.00',
    '    sent at 2026-09-29T12:00:04.000Z',
    '    server result: OK at tick 1 (world version 2), object gift, transaction tx-1; processed 1 tick after the decision',
    '',
    'What the server confirmed',
    '  tick 1 (snapshot 1): ACCEPTED',
    '  transaction tx-1 settled at tick 1 (snapshot 1)',
    '  inventory 20 water, 1 food, 8 components in the previous snapshot -> 19 water, 2 food, 7 components in the confirming snapshot (includes any tick in between)',
    '  Final status: ACCEPTED at tick 1',
  ].join('\n'));
});

test('a below-par offer: repeated verdicts collapse and the cancelled accept is shown', () => {
  const { text } = trace({ request: 'r5' });
  // The policy wait and both accept decisions for the gift each passed on it.
  expect(text).toContain('  tick 0 (snapshot 1) to tick 0, 3 decisions: PASS: below par: we would receive fewer units than we give');
  expect(text).toContain('  request r5: accept offer cheap\n    cancelled before sending at 2026-09-29T12:00:12.000Z');
  expect(text).toContain('  tick 5 (snapshot 2): EXPIRED\n  Final status: EXPIRED');
});

test('our proposal traced by request links the untagged older decision and omits the empty verdict section', () => {
  const { t, text } = trace({ request: 'r2' });
  expect(t.offerId).toBe('out-2');
  expect(text).not.toContain('What we knew and decided');
  expect(text).toContain('Offer out-2: ours -> supplier-z (our proposal): we pay 2 water, get 2 food; expires tick 4');
  expect(text).toContain('    decided at tick 0 (snapshot 1): Offer 2 water for 2 food.');
  expect(text).toContain('    server result: OK at tick 0 (world version 2), object out-2\n');
});

test('requests that are not about an offer, unanswered requests and unknown targets', () => {
  const withdraw = trace({ request: 'r3' });
  expect(withdraw.t.offerId).toBeUndefined();
  expect(withdraw.text).toContain('    recorded but not confirmed sent\n    server result: REJECTED NOT_FOUND at tick 1 (world version 2)');
  expect(withdraw.text).not.toContain('What the server confirmed');
  const uncertain = trace({ request: 'r4' }).text;
  expect(uncertain).toContain('recorded but not confirmed sent; no result after 2 s, sync requested at 2026-09-29T12:00:14.000Z\n    server result: none recorded');
  const exercise = trace({ request: 'r8' }).text;
  expect(exercise).toContain('    decided before any snapshot: Validator exercise step\n    recorded');
  expect(exercise).not.toContain('plan values');
  expect(trace({ offer: 'ghost' }).text).toContain('Offer ghost: never appeared in a recorded snapshot.');
  const late = trace({ offer: 'late' }).text;
  expect(late).toContain('What we knew and decided\n  No decision was made while it was open to us.');
  expect(late).toContain('What we sent\n  No command referred to it.');
  expect(late).toContain('Final status: OPEN');
  expect(trace({ offer: 'zzz' }).text).toBe('Nothing in this journal refers to offer zzz.');
  expect(trace({ request: 'missing' }).t.found).toBe(false);
});

test('long verdict histories are truncated with a count', () => {
  const builder = new TraceBuilder();
  builder.add(journaled({ kind: 'state', payload: state(1, 0) }));
  for (let i = 0; i < 14; i++) builder.add(journaled({ kind: 'decision', payload: { action: { kind: 'wait' }, explanation: { rationale: 'wait', inbound: { gift: { verdict: 'pass', reason: `reason ${i}` } } } } }));
  builder.add(journaled({ kind: 'decision', payload: { action: { kind: 'wait' }, explanation: { rationale: 'early wait', inbound: {} } } }));
  builder.add(journaled({ kind: 'decision', requestId: 'w1', payload: { action: { kind: 'withdraw', body: { object_id: 'gift' } }, explanation: { rationale: 'Withdraw it.' } } }));
  builder.add(journaled({ kind: 'command', requestId: 'w1', payload: { action: { kind: 'withdraw', body: { object_id: 'gift' } } } }));
  builder.add(journaled({ kind: 'result', requestId: 'w1', payload: result({ request_id: 'w1', ok: false, code: 6, processed_tick: 2n, object_id: { null: true } }) }));
  const text = formatTrace(builder.trace({ offer: 'gift' }), 'offer gift');
  expect(text).toContain('  ... 4 more verdict changes');
  expect(builder.trace({ request: 'w1' }).offerId).toBe('gift');
  expect(text).toContain('REJECTED NOT_FOUND at tick 2 (world version 2); processed 2 ticks after the decision');
  expect(builder.trace({ offer: 'gift' }).verdicts.at(-2)).toMatchObject({ verdict: 'not evaluated', reason: 'the strategy stopped before evaluating offers: early wait' });
});

test('a settlement already visible in the first recorded snapshot has no earlier inventory', () => {
  const builder = new TraceBuilder();
  builder.add(journaled({ kind: 'state', payload: settledState(1, 1, 2) }));
  expect(formatTrace(builder.trace({ offer: 'gift' }), 'offer gift')).toContain('  inventory (no earlier snapshot) -> 19 water, 2 food, 7 components in the confirming snapshot');
});

test('run report: outcome, history, shortages, trades, rejections, disconnections and responsiveness', () => {
  const r = build(new ReportBuilder()).report();
  expect(r).toMatchObject({ run: 'test-run', station: 'ours', strategy: 'baseline', policy: 'market-5', commit: 'abcdef1234',
    outcome: { phase: 'FINISHED', lastTick: '5', failed: false, finalHealth: '90', healthLost: 10, collectiveSuccess: false, runSummaryWritten: true } });
  expect(r.history.map(h => [h.tick, h.food, h.health])).toEqual([[0, 2, 100], [1, 1, 100], [2, 0, 100], [3, 0, 95], [4, 0, 90]]);
  expect(r.shortages[1]).toEqual({ resource: 'food', ticksShort: 2, unitsMissing: 2, firstShortTick: 3, longestStreak: 2, lowestStock: 0, lowestAtTick: 2 });
  expect(r.shortages[0]).toMatchObject({ ticksShort: 0, firstShortTick: undefined, lowestStock: 15, lowestAtTick: 4 });
  expect(r.partners).toEqual({ 'supplier-z': { trades: 1, paid: { water: 0, food: 0, components: 0 }, got: { water: 0, food: 2, components: 0 } } });
  expect(r.commands).toEqual({ decisions: 6, waits: 2, commands: 7, sent: 2, cancelled: 1, uncertain: 1, results: 6, ok: 3 });
  expect(r.rejected).toEqual({ NOT_FOUND: { count: 2, examples: ['tick 1: withdraw nothing', 'tick 1: accept offer ghost'] }, CODE_99: { count: 1, examples: ['tick 1: request r9'] } });
  expect(r.disconnections).toEqual([{ from: at(7), to: at(10), fromTick: '0', toTick: '1', closeCode: 1006, cause: 'ECONNRESET', attempts: 2, durationMs: 3000, ticksMissed: 1 }]);
  expect(r.responsiveness).toEqual({ responses: 2, responseMedianMs: 100, responseP95Ms: 300, decisionMedianMs: 5, decisionP95Ms: 5, missedDeadlines: { decision: 1, response: 1 } });
  const text = formatReport(r);
  expect(text).toContain('# Run report: test-run (ours)\n\nStrategy baseline (market-5), commit abcdef1.');
  expect(text).toContain('| Result | survived |');
  expect(text).toContain('| Commands sent / results / rejected | 2 / 6 / 3 |');
  expect(text).toContain('Closing stock after each tick, plus every shortage tick.');
  expect(text).toContain('| 3 | 16 | 0 | 4 | 95 | 1 food |');
  expect(text).toContain('| food | 2 | 2 | 3 | 2 | 0 (2) |');
  expect(text).toContain('| supplier-z | 1 | nothing | 2 food |');
  expect(text).toContain('| 1 | supplier-z | we accepted | nothing | 2 food | tx-1 |');
  expect(text).toContain('| NOT_FOUND | 2 | tick 1: withdraw nothing; tick 1: accept offer ghost |');
  expect(text).toContain('Control errors: code 2 (request r6).');
  expect(text).toContain(`| ${at(7)} | ${at(10)} | 3000 ms | 1 | 1006 | ECONNRESET | 2 |`);
  expect(text).toContain('Stale periods: tick 3 (No snapshot for 5000 ms).');
  expect(text).toContain('| Server response median / p95 | 100 ms / 300 ms over 2 responses |');
  expect(text).toContain('## Failures\n\n- application X: Y');
});

test('report edge cases: nothing recorded, a failed run, an unfinished disconnection and a long history', () => {
  expect(formatReport(new ReportBuilder().report())).toBe('# Run report: unknown run ()\n\nStrategy unknown.\n\nNo snapshot was recorded, so there is nothing to summarise.');
  const builder = new ReportBuilder();
  builder.add(journaled({ kind: 'state', payload: state(1, 3, s => { s.self.failed_once = true; s.self.first_failure_tick = { value: 2n }; s.offers.items = []; }) }));
  builder.add(journaled({ kind: 'ws-close', at: at(1), payload: { code: 1006 } }));
  builder.add(journaled({ kind: 'result', requestId: 'x', payload: result({ request_id: 'x', ok: false, code: 3 }) }));
  builder.add(journaled({ kind: 'protocol_error', payload: { code: 1 } }));
  const text = formatReport(builder.report());
  expect(text).toContain('| Result | **failed at tick 2** |');
  expect(text).toContain('| Collective success | not reported |');
  expect(text).toContain('| Run summary record | missing (worker did not shut down cleanly) |');
  expect(text).toContain('No tick summaries were recorded.');
  expect(text).toContain('## Completed trades\n\nNone.');
  expect(text).toContain(`| ${at(1)} | end of journal | n/a | unknown | 1006 |  | 0 |`);
  expect(text).toContain('| Server response median / p95 | n/a / n/a over 0 responses |');
  expect(text).toContain('Control errors: code 1.');
  expect(text).not.toContain('## Failures');
  const quiet = new ReportBuilder();
  quiet.add(journaled({ kind: 'state', payload: state(1, 0, s => {
    s.transactions.items = [{ transaction_id: 'tx-9', offer_id: 'o', proposer_id: 'ours', recipient_id: 'supplier-z', give: b(1, 0, 0), receive: b(0, 1, 0), settled_tick: 0n, settled_version: 3n }];
  }) }));
  for (let t = 0; t < 50; t++) quiet.add(journaled({ kind: 'tick-summary', payload: tick(t, b(9, 9, 9), 100, 100) }));
  const long = formatReport(quiet.report());
  expect(long).toContain('Closing stock every 3 ticks, plus every shortage tick.');
  expect(long).toContain('| 48 |');
  expect(long).toContain('| 49 |');
  expect(long).not.toContain('| 47 |');
  expect(long).toContain('| 0 | supplier-z | our offer | 1 water | 1 food | tx-9 |');
  expect(long).toContain('## Rejected requests\n\nNone.');
  expect(long).toContain('## Disconnected periods\n\nNone.');
});

let dir: string | undefined;
afterEach(async () => { if (dir) await rm(dir, { recursive: true, force: true }); dir = undefined; });

test('journal reader: streams entries, skips a torn final line, rejects damage elsewhere', async () => {
  dir = await mkdtemp(join(tmpdir(), 'audit-'));
  const seen: string[] = [];
  await writeFile(join(dir, 'a.jsonl'), '{"kind":"one","payload":{}}\n\n{"kind":"two","payload":{}}\n{"kind":"thr');
  expect(await readJournal(join(dir, 'a.jsonl'), e => seen.push(e.kind))).toEqual({ entries: 2, tornTail: true });
  expect(seen).toEqual(['one', 'two']);
  await writeFile(join(dir, 'b.jsonl'), '{"kind":"one","payload":{}}\n{broken\n{"kind":"two","payload":{}}\n');
  await expect(readJournal(join(dir, 'b.jsonl'), () => {})).rejects.toThrow('Line 2 of');
  await writeFile(join(dir, 'c.jsonl'), '{"kind":"one","payload":{}}\n');
  expect(await readJournal(join(dir, 'c.jsonl'), () => {})).toEqual({ entries: 1, tornTail: false });
  await writeFile(join(dir, 'z-unidentified.jsonl'), '');
  expect(newestJournal(dir)).toBe(join(dir, 'c.jsonl'));
  await expect(async () => newestJournal(join(dir!, '..', 'missing-audit-dir'))).rejects.toThrow();
  await rm(join(dir, 'a.jsonl')); await rm(join(dir, 'b.jsonl')); await rm(join(dir, 'c.jsonl'));
  expect(() => newestJournal(dir!)).toThrow('No journal files in');
});

test('names and descriptions fall back safely for unknown values', () => {
  expect([phaseName(9), resultName(99), offerStatusName(9), resultName(7)]).toEqual(['UNKNOWN', 'CODE_99', 'STATUS_9', 'EXPIRED']);
  expect(amounts({ water: 0n, food: 0n, components: 0n })).toBe('nothing');
  expect(describeAction({ kind: 'wait' })).toBe('wait');
});

test('a real simulated run: every command names its decision and the report matches the server ledger', async () => {
  dir = await mkdtemp(join(tmpdir(), 'audit-run-'));
  const { world, players, tokens } = createSimulation({ ...defaultEconomy, planets: 3, durationTicks: 10n, startingStock: 8n }, 150);
  const server = await startSimServer({ world, tokens, tickMs: 150, autoStart: true });
  try {
    await Promise.all(players.map(p => new Promise<void>(resolve => {
      const journal = new Journal(join(dir!, p.station_id));
      const engine = new Engine({ strategyName: 'baseline', sink: { append: e => journal.append(e), resolve: (run, station) => journal.resolve(run, station) }, done: () => { journal.close(); resolve(); } });
      const socket = new WebSocket(server.url, SUBPROTOCOL, { headers: { Authorization: `Bearer ${p.token}` } });
      const epoch = engine.connect({ send: bytes => socket.send(bytes), close: () => socket.close() });
      socket.on('open', () => engine.opened(epoch));
      socket.on('message', (data, binary) => engine.receive(epoch, data as Buffer, binary));
    })));
  } finally { await server.close(); }
  const file = join(dir, 'P01', (await readdir(join(dir, 'P01')))[0]);
  const report = new ReportBuilder(), trace = new TraceBuilder(), decided = new Set<string>(), commanded: string[] = [];
  await readJournal(file, e => {
    report.add(e); trace.add(e);
    if (e.kind === 'decision' && e.requestId) decided.add(e.requestId);
    if (e.kind === 'command') commanded.push(e.requestId!);
  });
  expect(commanded.length).toBeGreaterThan(0);
  expect(commanded.filter(id => !decided.has(id))).toEqual([]);
  const server1 = world.report().stations[0], r = report.report();
  expect(r.trades.length).toBe(server1.transactions);
  expect(r.outcome).toMatchObject({ lastTick: '10', phase: 'FINISHED', failed: !server1.survived, finalInventory: journaled(server1.final_inventory) });
  expect(r.history).toHaveLength(10);
  const accepted = r.trades.find(t => !t.outgoing);
  if (accepted) expect(formatTrace(trace.trace({ offer: accepted.offer }), 'offer')).toContain('Final status: ACCEPTED');
}, 20000);
