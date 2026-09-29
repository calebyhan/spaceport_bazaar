import { randomUUID } from 'node:crypto';
import type { Action, Command, Config, Memory, Pending, Snapshot } from './types';
import { defaultConfig } from './types';
import { decode, encode, type ServerMessage } from './codec';
import { json } from './policy';
import { StrategyExecutor, StrategyTimeout, type Evaluate } from './strategy';
import { StateStore } from './state';
import type { RecordEntry, ResponsivenessSample, Sink } from './persistence';
import { exercise } from './exercise';
export interface Transport { send(bytes: Uint8Array): void; close(): void }
export interface EngineOptions {
  sink: Sink; config?: Config; exercise?: boolean; previous?: RecordEntry[];
  strategy?: Evaluate; decisionTimeoutMs?: number; responseTimeoutMs?: number;
  identity?: (s: Snapshot) => void; done?: () => void; fatal?: () => void;
}
function restorePending(payload: unknown): Pending & { run: string } {
  const p = payload as Pending & { run: string };
  const action = structuredClone(p.action);
  if (action.kind === 'offer') {
    for (const bundle of [action.body.give, action.body.receive]) {
      for (const key of ['water', 'food', 'components'] as const) bundle[key] = BigInt(bundle[key]);
    }
  }
  if (action.kind === 'offer' || action.kind === 'advertise') action.body.expires_tick = BigInt(action.body.expires_tick);
  return { ...p, action, tick: BigInt(p.tick) };
}
export class Engine {
  readonly state = new StateStore();
  private readonly processId = randomUUID();
  memory: Memory = { attempted: {} };
  stopped = false;
  ready = false;
  private readySequence?: bigint;
  private transport?: Transport;
  private identity?: string;
  private station?: string;
  private persistence: Promise<void> = Promise.resolve();
  private cycling = false;
  private dirty = false;
  private exerciseCapacity = false;
  private exerciseSync = false;
  private capacityExhausted = false;
  private syncTimer?: NodeJS.Timeout;
  private readonly sentAt = new Map<string, number>();
  private readonly missedResponses = new Set<string>();
  private strategyBusy = false;
  private readonly executor = new StrategyExecutor();
  private queuedAt = 0;
  private activity = 'starting';
  private activityReason = 'Waiting for the first state';
  private activitySince = Date.now();
  private pendingSince = Date.now();
  private reconcileSince = Date.now();
  private heartbeat?: NodeJS.Timeout;
  private heartbeatPending = false;
  private get decisionTimeoutMs() { return this.options.decisionTimeoutMs ?? 2000; }
  private get responseTimeoutMs() { return this.options.responseTimeoutMs ?? 2000; }
  private now() { return performance.timeOrigin + performance.now(); }
  private setActivity(activity: string, reason: string) {
    if (this.activity !== activity || this.activityReason !== reason) this.activitySince = Date.now();
    if (activity === 'awaiting_response') this.activitySince = this.pendingSince;
    if (activity === 'reconciling') this.activitySince = this.reconcileSince;
    this.activity = activity; this.activityReason = reason;
    this.reportActivity();
  }
  private reportActivity() {
    if (this.heartbeatPending || !this.identity) return;
    this.heartbeatPending = true;
    void this.record({ kind: 'responsiveness', payload: {
      metric: 'activity', activity: this.activity, reason: this.activityReason,
      observed_at: Date.now(), since: this.activitySince,
      deadline_ms: this.activity === 'deciding' ? this.decisionTimeoutMs : this.activity === 'awaiting_response' ? this.responseTimeoutMs : 10000,
    } satisfies ResponsivenessSample }).finally(() => { this.heartbeatPending = false; }).catch(() => {});
  }
  private response(requestId: string, receivedAt: number) {
    const sent = this.sentAt.get(requestId);
    if (sent === undefined) return;
    const elapsed = receivedAt - sent;
    if (elapsed > this.responseTimeoutMs) this.responseDeadline(requestId);
    this.reconcileSince = Date.now();
    this.sentAt.delete(requestId);
    this.missedResponses.delete(requestId);
    clearTimeout(this.syncTimer);
    this.record({ kind: 'responsiveness', requestId, payload: {
      metric: 'response', duration_ms: elapsed, request_id: requestId,
    } satisfies ResponsivenessSample });
  }
  private responseDeadline(requestId: string) {
    if (!this.sentAt.has(requestId) || this.missedResponses.has(requestId)) return;
    this.missedResponses.add(requestId);
    this.record({ kind: 'responsiveness', requestId, payload: { metric: 'deadline', deadline_kind: 'response', request_id: requestId, missed_deadline: true } satisfies ResponsivenessSample });
  }
  private noAction(reason: string, s?: Snapshot) {
    this.setActivity('waiting', reason);
    this.record({ kind: 'decision', payload: { source: 'engine', action: { kind: 'wait' },
      nextMemory: this.memory, run: this.identity, epoch: this.state.epoch,
      snapshot_sequence: s?.snapshot_sequence, explanation: { rationale: reason } } });
    this.record({ kind: 'responsiveness', payload: { metric: 'decision', source: 'engine',
      action: 'wait', intentional_wait: true, reason } satisfies ResponsivenessSample });
  }
  readonly config: Config;
  constructor(private options: EngineOptions) { this.config = options.config ?? defaultConfig; }
  connect(transport: Transport) {
    this.transport = transport; this.ready = false; this.readySequence = undefined;
    clearInterval(this.heartbeat);
    this.heartbeat = setInterval(() => this.reportActivity(), 1000);
    this.heartbeat.unref();
    const epoch = this.state.newConnection();
    this.setActivity('starting', 'Waiting for connection state');
    return epoch;
  }
  disconnected(epoch: number) {
    if (epoch !== this.state.epoch) return;
    this.ready = false; this.transport = undefined;
    clearInterval(this.heartbeat);
    if (!this.strategyBusy) this.executor.close();
    if (!this.stopped) this.setActivity('disconnected', 'Waiting to reconnect; unresolved commands remain blocked');
  }
  stop() {
    this.stopped = true;
    clearTimeout(this.syncTimer); clearInterval(this.heartbeat);
    this.executor.close();
    this.setActivity('stopped', 'Client stopped');
  }
  fail() {
    if (this.stopped) return;
    this.stop(); this.transport?.close(); this.options.fatal?.();
  }
  private record(entry: RecordEntry) {
    const record = { ...entry, connection: { processId: this.processId, epoch: this.state.epoch } };
    this.persistence = this.persistence.then(() => this.options.sink.append(record));
    // Never send another command after a persistence error. Do not log raw
    // transport/database exceptions: they can contain endpoint credentials.
    void this.persistence.catch(() => this.fail());
    return this.persistence;
  }
  private control(kind: 'ready' | 'sync') {
    const s = this.state.snapshot;
    if (!s || !this.transport || this.stopped) return;
    const fields = { type: 1, protocol_version: '2.0', run_id: s.run_id };
    if (kind === 'ready') this.readySequence = s.snapshot_sequence;
    const message = { [kind]: kind === 'ready' ? { ...fields, ready: true, snapshot_sequence: this.readySequence } : fields };
    this.record({ kind, direction: 'outbound', payload: message });
    this.transport.send(encode(message));
  }
  receive(epoch: number, bytes: Uint8Array, binary = true) {
    if (this.stopped || epoch !== this.state.epoch) return;
    try {
      if (!binary) throw new Error('Text frames are unsupported');
      const receivedAt = this.now();
      this.message(epoch, decode(bytes), receivedAt);
    } catch { this.fail(); }
  }
  private restore(s: Snapshot) {
    const pending = new Map<string, Pending>();
    for (const entry of this.options.previous ?? []) {
      if (entry.kind === 'command') {
        const p = restorePending(entry.payload);
        if (p.run === s.run_id) pending.set(p.requestId, p);
      }
      if (entry.kind === 'cancelled' || entry.kind === 'control-rejected') pending.delete(entry.requestId ?? '');
      if (entry.kind === 'decision') {
        const decision = entry.payload as { run: string; nextMemory: Memory };
        if (decision.run === s.run_id) this.memory = { attempted: Object.fromEntries(Object.entries(decision.nextMemory.attempted).map(([k, v]) => [k, BigInt(v)])) };
      }
    }
    this.state.pending = [...pending.values()];
    this.pendingSince = Date.now();
  }
  private message(epoch: number, msg: ServerMessage, receivedAt: number) {
    const value = msg.state ?? msg.result ?? msg.readiness ?? msg.protocol_error!;
    const wasBusy = this.strategyBusy;
    if (value.protocol_version !== '2.0') throw new Error('Protocol mismatch');
    const run = typeof value.run_id === 'string' ? value.run_id : value.run_id.value;
    if (this.identity && run && run !== this.identity) throw new Error('Run changed');
    if (msg.state) {
      const s = msg.state;
      // Bound CPU work rather than blocking the receive loop on exotic rules.
      if (s.rules.duration_ticks - s.tick > 10000n || s.rules.max_offer_ttl_ticks > 10000n) throw new Error('Run exceeds supported forecast size');
      if (this.station && this.station !== s.self_station_id) throw new Error('Station changed');
      if (!this.identity) { this.options.identity?.(s); this.identity = s.run_id; this.station = s.self_station_id; this.restore(s); }
      if (!this.state.observe(epoch, s)) return;
      this.record({ kind: 'state', direction: 'inbound', payload: s });
      for (const r of s.request_results.items) {
        this.record({ kind: 'result', direction: 'inbound', requestId: r.request_id, payload: r });
        this.response(r.request_id, receivedAt);
      }
      if (!this.state.pending.length) clearTimeout(this.syncTimer);
      if (this.readySequence === undefined) this.control('ready');
      if (this.options.exercise && this.exerciseSync) {
        if (s.self.inventory.water !== 28n || s.self.inventory.food !== 31n || s.self.inventory.components !== 31n || s.transactions.items.length !== 2 || s.request_results.items.length !== 5) throw new Error('Incorrect validator final state');
        this.stop();
        void this.persistence.then(() => { this.transport?.close(); this.options.done?.(); }).catch(() => this.options.fatal?.());
        return;
      }
    } else if (msg.readiness) {
      this.record({ kind: 'readiness', direction: 'inbound', payload: msg.readiness });
      this.ready = msg.readiness.ready && msg.readiness.snapshot_sequence === this.readySequence;
    } else if (msg.result) {
      this.state.result(msg.result);
      this.record({ kind: 'result', direction: 'inbound', requestId: msg.result.request_id, payload: msg.result });
      this.response(msg.result.request_id, receivedAt);
      if (msg.result.code === 2) throw new Error('Request ID conflict');
    } else {
      // decode guarantees exactly one recognized envelope.
      const error = msg.protocol_error!;
      this.record({ kind: 'protocol_error', direction: 'inbound', requestId: error.request_id.value, payload: error });
      this.response(error.request_id.value ?? '', receivedAt);
      if (error.close_session) { this.fail(); return; }
      if (error.code === 2) {
        this.capacityExhausted = true;
        this.state.pending = this.state.pending.filter(p => p.requestId !== error.request_id.value);
        this.record({ kind: 'control-rejected', requestId: error.request_id.value, payload: error });
        if (this.options.exercise && this.exerciseCapacity) this.exerciseSync = true;
        this.control('sync');
      } else { this.fail(); return; }
    }
    this.record({ kind: 'responsiveness', payload: { metric: 'event', duration_ms: this.now() - receivedAt, busy: Boolean(msg.state) && wasBusy } satisfies ResponsivenessSample });
    this.schedule(receivedAt);
  }
  schedule(receivedAt = this.now()) {
    this.queuedAt = receivedAt;
    this.dirty = true;
    if (!this.cycling) void this.cycle().catch(() => this.fail());
  }
  async idle() { while (this.cycling) await new Promise(resolve => setImmediate(resolve)); await this.persistence; }
  private async cycle() {
    this.cycling = true;
    try {
      while (this.dirty && !this.stopped) {
        this.dirty = false;
        this.setActivity('persisting', 'Waiting for durable event records');
        await this.persistence;
        const queuedAt = this.queuedAt;
        const s = this.state.snapshot;
        if (this.stopped) break;
        const reason = !s ? 'No state received' : !this.transport ? 'Disconnected' : !this.ready ? 'Waiting for readiness'
          : this.state.pending.length ? 'Waiting for command reconciliation' : this.capacityExhausted ? 'Request capacity exhausted'
          : s.tick < this.state.blockedUntil ? 'Rate limit backoff' : s.phase !== 2 ? 'Run is not trading'
          : s.self.failed_once ? 'Station has permanently failed' : undefined;
        if (reason) {
          this.record({ kind: 'responsiveness', payload: { metric: 'queue', duration_ms: this.now() - queuedAt } satisfies ResponsivenessSample });
          this.noAction(reason, s);
          if (this.state.pending.length) this.setActivity(this.state.pending.some(p => !p.result) ? 'awaiting_response' : 'reconciling', reason);
          continue;
        }
        const current = s!;
        const epoch = this.state.epoch;
        const memoryBefore = json(this.memory);
        let action: Action;
        let decision: Awaited<ReturnType<Evaluate>>['decision'] | undefined;
        let decisionDuration = 0;
        const exerciseStarted = this.now();
        if (this.options.exercise) {
          const step = exercise(current);
          if (step === 'done') {
            if (this.exerciseCapacity) { this.noAction('Validator capacity probe already sent', current); continue; }
            action = { kind: 'advertise', body: { selling: { items: [1] }, seeking: { items: [2] }, expires_tick: 6n } };
          } else action = step;
          decisionDuration = this.now() - exerciseStarted;
          this.record({ kind: 'responsiveness', payload: { metric: 'queue', duration_ms: exerciseStarted - queuedAt } satisfies ResponsivenessSample });
        } else {
          this.strategyBusy = true;
          this.setActivity('deciding', 'Evaluating the latest state');
          try {
            const measured = await (this.options.strategy ?? this.executor.evaluate)({ snapshot: current, pending: this.state.pending, memory: this.memory, config: this.config }, this.decisionTimeoutMs, startedAt => {
              this.record({ kind: 'responsiveness', payload: { metric: 'queue', duration_ms: Math.max(0, startedAt - queuedAt), snapshot_sequence: current.snapshot_sequence.toString() } satisfies ResponsivenessSample });
            });
            decision = measured.decision;
            decisionDuration = measured.durationMs;
          } catch (error) {
            if (error instanceof StrategyTimeout) this.record({ kind: 'responsiveness', payload: { metric: 'deadline', deadline_kind: 'decision', missed_deadline: true } satisfies ResponsivenessSample });
            throw error;
          } finally { this.strategyBusy = false; if (!this.transport) this.executor.close(); }
          action = decision.action;
        }
        this.setActivity('persisting', 'Recording the decision before transmission');
        // Let queued socket I/O run even when the local journal resolves
        // synchronously; a chain of resolved promises alone only drains microtasks.
        await new Promise<void>(resolve => setImmediate(resolve));
        if (decision) {
          await this.record({ kind: 'decision', payload: { ...decision, source: 'policy', run: current.run_id, epoch, snapshot: current } });
          await this.record({ kind: 'responsiveness', payload: { metric: 'decision', source: 'policy', duration_ms: decisionDuration, action: action.kind, intentional_wait: action.kind === 'wait' } satisfies ResponsivenessSample });
        }
        if (!decision) {
          await this.record({ kind: 'decision', payload: { source: 'exercise', action, nextMemory: this.memory, run: current.run_id, epoch, explanation: { rationale: 'Validator exercise step' } } });
          await this.record({ kind: 'responsiveness', payload: { metric: 'decision', source: 'exercise', duration_ms: decisionDuration, action: action.kind, intentional_wait: action.kind === 'wait' } satisfies ResponsivenessSample });
        }
        if (action.kind === 'wait') { this.setActivity('waiting', decision?.explanation.rationale ?? 'Waiting for validator gift'); continue; }
        // Persistence is asynchronous. New observations continue replacing facts
        // while it runs; never transmit a decision made against older facts.
        if (current !== this.state.snapshot || epoch !== this.state.epoch || !this.ready) { this.dirty = true; continue; }
        const pending: Pending = { requestId: randomUUID(), action, tick: current.tick };
        const bytes = this.commandBytes(current, pending);
        if (BigInt(bytes.length) > current.rules.max_command_bytes || bytes.length > 16384) throw new Error('Command too large');
        await this.record({ kind: 'command', direction: 'outbound', requestId: pending.requestId, payload: { ...pending, run: current.run_id, epoch } });
        await new Promise<void>(resolve => setImmediate(resolve));
        if (current !== this.state.snapshot || epoch !== this.state.epoch || !this.ready || this.stopped) {
          await this.record({ kind: 'cancelled', requestId: pending.requestId, payload: { reason: 'New observation before transmission' } });
          this.dirty = true; continue;
        }
        // No await between the final check, pending insertion, and socket.send.
        if (json(this.memory) !== memoryBefore) throw new Error('Revalidation mismatch');
        this.state.pending.push(pending);
        if (decision) this.memory = decision.nextMemory;
        if (this.options.exercise && current.request_results.items.length === 5) this.exerciseCapacity = true;
        this.pendingSince = Date.now();
        this.sentAt.set(pending.requestId, this.now());
        // A missing result prompts ONE observation request, never fresh IDs or
        // unbounded resubmission. Reconnect recovers recorded results in state.
        this.syncTimer = setTimeout(() => {
          if (!this.sentAt.has(pending.requestId)) return;
          this.record({ kind: 'uncertain', requestId: pending.requestId, payload: { reason: 'No authoritative outcome yet; one sync requested, replacements blocked.' } });
          this.responseDeadline(pending.requestId);
          this.control('sync');
        }, this.responseTimeoutMs);
        this.syncTimer.unref();
        this.transport!.send(bytes);
        this.setActivity('awaiting_response', 'Waiting for the server result');
        this.record({ kind: 'sent', requestId: pending.requestId, payload: { run: current.run_id, epoch } });
      }
    } finally { this.cycling = false; }
  }
  private commandBytes(s: Snapshot, p: Pending) {
    return encode({ [p.action.kind]: { type: 1, protocol_version: '2.0', run_id: s.run_id, request_id: p.requestId, body: (p.action as Command).body } });
  }
  // Explicit exact retry is allowed only for a result ALREADY known to be
  // recorded. It recovers evidence without possibly executing a new action.
  retryRecorded(requestId: string) {
    const s = this.state.snapshot, p = this.state.pending.find(p => p.requestId === requestId);
    if (!s || !p?.result || !this.ready || this.stopped || !this.transport) return false;
    this.transport.send(this.commandBytes(s, p));
    this.record({ kind: 'retry-sent', direction: 'outbound', requestId, payload: { run: s.run_id, epoch: this.state.epoch, action: p.action } });
    return true;
  }
}
