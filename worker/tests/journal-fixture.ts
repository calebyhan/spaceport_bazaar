import { json } from '../serialization';
import type { Bundle, Snapshot } from '../types';
import type { Entry } from '../audit/journal';
import { bundle, offer, result, snapshot } from './fixtures';

// A hand-written journal for station `ours` in a 6-tick run. Timestamps are
// whole seconds; every expected value below is read off these records.
export const at = (second: number) => new Date(Date.UTC(2026, 8, 29, 12, 0, second)).toISOString();
export const journaled = (value: unknown) => JSON.parse(json(value));
export const b = (w: number, f: number, c: number) => bundle(BigInt(w), BigInt(f), BigInt(c));
export const values = { water: 1, food: 2, components: 1 };
export function state(seq: number, tick: number, patch: (s: Snapshot) => void = () => {}) {
  const s = snapshot({ snapshot_sequence: BigInt(seq), tick: BigInt(tick) });
  s.self.inventory = b(20, 1, 8);
  s.offers.items = [
    offer({ offer_id: 'gift', give: b(0, 2, 0), receive: b(0, 0, 0), expires_tick: 3n }),
    offer({ offer_id: 'cheap', give: b(0, 0, 1), receive: b(2, 0, 0), expires_tick: 3n }),
  ];
  patch(s);
  return s;
}
export const tick = (t: number, closing: Bundle, before: number, after: number, unmet = b(0, 0, 0)) =>
  ({ tick: String(t), closing_inventory: closing, opening_inventory: closing, production: b(0, 0, 0), health_before: String(before), health_after: String(after), unmet_upkeep: unmet });
export const settledState = (seq: number, t: number, phase: number, extra: (s: Snapshot) => void = () => {}) => state(seq, t, s => {
  s.phase = phase;
  s.self.inventory = b(19, 2, 7);
  s.offers.items[0].status = 2; s.offers.items[0].closed_tick = { value: 1n }; s.offers.items[0].transaction_id = { value: 'tx-1' };
  s.offers.items.push(offer({ offer_id: 'out-2', proposer_id: 'ours', recipient_id: 'supplier-z', give: b(2, 0, 0), receive: b(0, 2, 0), expires_tick: 4n }));
  s.transactions.items = [{ transaction_id: 'tx-1', offer_id: 'gift', proposer_id: 'supplier-z', recipient_id: 'ours', give: b(0, 2, 0), receive: b(0, 0, 0), settled_tick: 1n, settled_version: 5n }];
  extra(s);
});
export const entries: Entry[] = journaled([
  { kind: 'decision', at: at(0), requestId: 'r8', payload: { source: 'exercise', action: { kind: 'advertise', body: { selling: { items: [1] }, seeking: { items: [2, 3] }, expires_tick: 6n } }, explanation: { rationale: 'Validator exercise step' } } },
  { kind: 'command', at: at(0), requestId: 'r8', payload: { action: { kind: 'advertise', body: { selling: { items: [1] }, seeking: { items: [2, 3] }, expires_tick: 6n } } } },
  { kind: 'result', at: at(0), requestId: 'r8', payload: result({ request_id: 'r8', processed_tick: 0n }) },
  { kind: 'manifest', at: at(1), payload: { server_run_id: 'test-run', station_id: 'ours', strategy: 'baseline', git_commit: 'abcdef1234', config: { reserveTicks: 2n, version: 'market-5' } } },
  { kind: 'lifecycle', at: at(1), payload: { from: 'starting', to: 'connecting', reason: 'Opening', epoch: 1 } },
  { kind: 'state', at: at(2), payload: state(1, 0) },
  { kind: 'decision', at: at(3), payload: { source: 'engine', action: { kind: 'wait' }, explanation: { rationale: 'Waiting for readiness' } } },
  { kind: 'decision', at: at(3), payload: { source: 'policy', action: { kind: 'wait' }, explanation: { rationale: 'Wait: nothing to do.', plan: { value: values },
    inbound: { gift: { verdict: 'pass', reason: 'no command capacity left this tick', value: 2 }, cheap: { verdict: 'pass', reason: 'below par: we would receive fewer units than we give' } } } } },
  { kind: 'decision', at: at(4), requestId: 'r0', payload: { source: 'policy', action: { kind: 'accept', body: { offer_id: 'gift' } }, explanation: { rationale: 'Accept a safe inbound gift.', plan: { value: values },
    inbound: { gift: { verdict: 'accept', reason: 'Accept a safe inbound gift.', value: 2 }, cheap: { verdict: 'pass', reason: 'below par: we would receive fewer units than we give' } } } } },
  { kind: 'decision', at: at(4), requestId: 'r1', payload: { source: 'policy', action: { kind: 'accept', body: { offer_id: 'gift' } }, explanation: { rationale: 'Accept a safe inbound gift.', plan: { value: values },
    inbound: { gift: { verdict: 'accept', reason: 'Accept a safe inbound gift.', value: 2 }, cheap: { verdict: 'pass', reason: 'below par: we would receive fewer units than we give' } } } } },
  { kind: 'command', at: at(4), requestId: 'r1', payload: { action: { kind: 'accept', body: { offer_id: 'gift' } } } },
  { kind: 'sent', at: at(4), requestId: 'r1', payload: {} },
  // An older journal's decision: no request ID and no verdicts.
  { kind: 'decision', at: at(5), payload: { source: 'policy', action: { kind: 'offer', body: { recipient_id: 'supplier-z', give: b(2, 0, 0), receive: b(0, 2, 0), expires_tick: 4n } }, explanation: { rationale: 'Offer 2 water for 2 food.', plan: { value: values } } } },
  { kind: 'command', at: at(5), requestId: 'r2', payload: { action: { kind: 'offer', body: { recipient_id: 'supplier-z', give: b(2, 0, 0), receive: b(0, 2, 0), expires_tick: 4n } } } },
  { kind: 'sent', at: at(5), requestId: 'r2', payload: {} },
  { kind: 'result', at: at(6), requestId: 'r1', payload: result({ request_id: 'r1', processed_tick: 1n, object_id: { value: 'gift' }, transaction_id: { value: 'tx-1' } }) },
  { kind: 'result', at: at(6), requestId: 'r2', payload: result({ request_id: 'r2', processed_tick: 0n, object_id: { value: 'out-2' } }) },
  { kind: 'ws-close', at: at(7), payload: { code: 1006, reason: '' } },
  { kind: 'ws-reconnect-scheduled', at: at(7), payload: { delayMs: 500, attempt: 1, category: 'network', code: 'ECONNRESET' } },
  { kind: 'ws-close', at: at(8), payload: { code: 1006, reason: '' } },
  { kind: 'ws-reconnect-scheduled', at: at(8), payload: { delayMs: 1000, attempt: 2, category: 'network', code: 'ECONNREFUSED' } },
  { kind: 'lifecycle', at: at(9), payload: { from: 'disconnected', to: 'connecting', reason: 'Opening', epoch: 2 } },
  { kind: 'state', at: at(10), payload: settledState(1, 1, 2) },
  { kind: 'tick-summary', at: at(10), payload: tick(0, b(19, 2, 7), 100, 100) },
  { kind: 'command', at: at(11), requestId: 'r3', payload: { action: { kind: 'withdraw', body: { object_id: 'nothing' } } } },
  { kind: 'result', at: at(11), requestId: 'r3', payload: result({ request_id: 'r3', ok: false, code: 6, processed_tick: 1n, object_id: { null: true } }) },
  { kind: 'command', at: at(12), requestId: 'r4', payload: { action: { kind: 'advertise', body: { selling: { items: [] }, seeking: { items: [2] }, expires_tick: 5n } } } },
  { kind: 'uncertain', at: at(14), requestId: 'r4', payload: {} },
  { kind: 'command', at: at(12), requestId: 'r5', payload: { action: { kind: 'accept', body: { offer_id: 'cheap' } } } },
  { kind: 'cancelled', at: at(12), requestId: 'r5', payload: {} },
  { kind: 'command', at: at(12), requestId: 'r7', payload: { action: { kind: 'accept', body: { offer_id: 'ghost' } } } },
  { kind: 'result', at: at(13), requestId: 'r7', payload: result({ request_id: 'r7', ok: false, code: 6, processed_tick: 1n, object_id: { null: true } }) },
  { kind: 'result', at: at(13), requestId: 'r9', payload: result({ request_id: 'r9', ok: false, code: 99, processed_tick: 1n }) },
  { kind: 'protocol_error', at: at(13), requestId: 'r6', payload: { code: 2 } },
  { kind: 'responsiveness', at: at(13), payload: { metric: 'response', duration_ms: 100 } },
  { kind: 'responsiveness', at: at(13), payload: { metric: 'response', duration_ms: 300 } },
  { kind: 'responsiveness', at: at(13), payload: { metric: 'decision', source: 'policy', duration_ms: 5 } },
  { kind: 'responsiveness', at: at(13), payload: { metric: 'decision', source: 'engine', duration_ms: 99 } },
  { kind: 'responsiveness', at: at(13), payload: { metric: 'deadline', deadline_kind: 'response' } },
  { kind: 'responsiveness', at: at(13), payload: { metric: 'deadline', deadline_kind: 'decision' } },
  { kind: 'tick-summary', at: at(14), payload: tick(1, b(18, 1, 6), 100, 100) },
  { kind: 'tick-summary', at: at(15), payload: tick(2, b(17, 0, 5), 100, 100) },
  { kind: 'lifecycle', at: at(16), payload: { from: 'participating', to: 'stale', reason: 'No snapshot for 5000 ms', epoch: 2, tick: 3n } },
  { kind: 'tick-summary', at: at(17), payload: tick(3, b(16, 0, 4), 100, 95, b(0, 1, 0)) },
  { kind: 'tick-summary', at: at(18), payload: tick(4, b(15, 0, 3), 95, 90, b(0, 1, 0)) },
  { kind: 'state', at: at(19), payload: settledState(2, 5, 4, s => {
    s.self.inventory = b(15, 0, 3); s.self.health = 90n;
    s.offers.items[1].status = 4; s.offers.items[2].status = 4;
    s.offers.items.push(offer({ offer_id: 'late', give: b(0, 1, 0), receive: b(0, 0, 0), expires_tick: 6n }));
    s.outcome = { value: { collective_success: { value: false }, self_failed: false, aborted: false } };
  }) },
  { kind: 'failure', at: at(19), payload: { category: 'application', code: 'X', message: 'Y', hint: 'Z' } },
  { kind: 'lifecycle', at: at(19), payload: { from: 'stale', to: 'finished', reason: 'Run FINISHED', epoch: 2, tick: 5n, phase: 4 } },
  { kind: 'run-summary', at: at(20), payload: {} },
]);
