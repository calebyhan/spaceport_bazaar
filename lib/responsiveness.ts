export const EVENT_WINDOW = 500;
export const HEARTBEAT_STALE_MS = 5000;
export type TimingMetric = 'queue' | 'decision' | 'response' | 'event';
export type TimingSummary = { samples: number; medianMs: number | null; p95Ms: number | null; maxMs: number | null };
export type Responsiveness = {
  timings: Record<TimingMetric, TimingSummary>;
  decisions: number;
  intentionalWaits: number;
  missedDeadlines: number;
  decisionDeadlines: number;
  responseDeadlines: number;
  updatesWhileBusy: number;
  activity: { state: string; reason: string; observedAt: number; stalled: boolean } | null;
};

export function summarizeResponsiveness(events: { kind: string; payload?: Record<string, unknown> }[], now = Date.now()): Responsiveness {
  const samples = events.filter(event => event.kind === 'responsiveness').flatMap(event => event.payload ? [event.payload] : []);
  const timing = (metric: TimingMetric): TimingSummary => {
    const values = samples.filter(sample => sample.metric === metric).map(sample => sample.duration_ms)
      .filter((value): value is number => typeof value === 'number' && Number.isFinite(value) && value >= 0).sort((a, b) => a - b);
    const n = values.length;
    return { samples: n, medianMs: n ? (values[Math.floor((n - 1) / 2)] + values[Math.floor(n / 2)]) / 2 : null,
      p95Ms: n ? values[Math.ceil(n * 0.95) - 1] : null, maxMs: n ? values[n - 1] : null };
  };
  const decisions = samples.filter(sample => sample.metric === 'decision');
  const deadlines = samples.filter(sample => sample.metric === 'deadline' && sample.missed_deadline === true);
  const activity = samples.filter(sample => sample.metric === 'activity' && typeof sample.observed_at === 'number'
    && typeof sample.since === 'number' && typeof sample.deadline_ms === 'number'
    && typeof sample.activity === 'string' && typeof sample.reason === 'string')
    .sort((a, b) => Number(b.observed_at) - Number(a.observed_at))[0];
  return {
    timings: { queue: timing('queue'), decision: timing('decision'), response: timing('response'), event: timing('event') },
    decisions: decisions.length,
    intentionalWaits: decisions.filter(sample => sample.intentional_wait === true).length,
    missedDeadlines: deadlines.length,
    decisionDeadlines: deadlines.filter(sample => sample.deadline_kind === 'decision').length,
    responseDeadlines: deadlines.filter(sample => sample.deadline_kind === 'response').length,
    updatesWhileBusy: samples.filter(sample => sample.metric === 'event' && sample.busy === true).length,
    activity: activity ? { state: String(activity.activity), reason: String(activity.reason), observedAt: Number(activity.observed_at),
      stalled: now - Number(activity.observed_at) > HEARTBEAT_STALE_MS ||
        (['deciding', 'persisting', 'awaiting_response', 'reconciling', 'starting'].includes(String(activity.activity)) && now - Number(activity.since) > Number(activity.deadline_ms)) } : null,
  };
}
