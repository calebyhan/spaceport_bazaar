import { expect, test } from 'vitest';
import { summarizeResponsiveness } from '../lib/responsiveness';
const sample = (payload: Record<string, unknown>) => ({ kind: 'responsiveness', payload });
test('separate distributions have independent counts, median, p95 and maximum', () => {
  const data = summarizeResponsiveness([
    ...Array.from({ length: 20 }, (_, i) => sample({ metric: 'response', duration_ms: i + 1 })),
    sample({ metric: 'decision', duration_ms: 400 }), sample({ metric: 'queue', duration_ms: 50 }),
    sample({ metric: 'decision', action: 'wait', intentional_wait: true }),
    sample({ metric: 'event', busy: true, duration_ms: 0.25 }),
    sample({ metric: 'deadline', deadline_kind: 'decision', missed_deadline: true }),
    sample({ metric: 'deadline', deadline_kind: 'response', missed_deadline: true }),
    sample({ metric: 'response', duration_ms: -1 }), sample({ metric: 'response', duration_ms: NaN }),
    sample({ metric: 'response', duration_ms: Infinity }), sample({ metric: 'response', duration_ms: '100' }),
    { kind: 'state', payload: { metric: 'response', duration_ms: 99999 } }, { kind: 'responsiveness' },
  ]);
  expect(data.timings.response).toEqual({ samples: 20, medianMs: 10.5, p95Ms: 19, maxMs: 20 });
  expect(data.timings.decision).toEqual({ samples: 1, medianMs: 400, p95Ms: 400, maxMs: 400 });
  expect(data.timings.queue.samples).toBe(1);
  expect(data).toMatchObject({ decisions: 2, intentionalWaits: 1, missedDeadlines: 2, responseDeadlines: 1, decisionDeadlines: 1, updatesWhileBusy: 1, activity: null });
});
test('no samples have unknown timings, not zero latency', () => {
  expect(summarizeResponsiveness([]).timings.response).toEqual({ samples: 0, medianMs: null, p95Ms: null, maxMs: null });
});
test('fresh heartbeats distinguish intentional waiting from a stalled client or stale telemetry', () => {
  const heartbeat = sample({ metric: 'activity', activity: 'waiting', reason: 'No useful action', observed_at: 9000, since: 0, deadline_ms: 2000 });
  expect(summarizeResponsiveness([heartbeat], 10000).activity).toMatchObject({ state: 'waiting', stalled: false });
  expect(summarizeResponsiveness([heartbeat], 15000).activity?.stalled).toBe(true);
  const deciding = sample({ ...heartbeat.payload, activity: 'deciding', since: 6000 });
  expect(summarizeResponsiveness([deciding], 10000).activity?.stalled).toBe(true);
  const current = sample({ ...deciding.payload, observed_at: 10000, since: 9500 });
  expect(summarizeResponsiveness([deciding, current], 10000).activity?.stalled).toBe(false);
});
test.each(['observed_at', 'since', 'deadline_ms', 'activity', 'reason'])('incomplete activity without %s is unknown', key => {
  const payload: Record<string, unknown> = { metric: 'activity', observed_at: 1, since: 1, deadline_ms: 2, activity: 'waiting', reason: 'No action' };
  delete payload[key];
  expect(summarizeResponsiveness([sample(payload)]).activity).toBeNull();
});
