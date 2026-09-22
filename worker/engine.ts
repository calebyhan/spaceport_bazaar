import { randomUUID } from 'node:crypto';
import type { Action, Command, Config, Memory, Pending, Snapshot } from './types';
import { defaultConfig } from './types';
import { decode, encode, type ServerMessage } from './codec';
import { decide, fingerprint } from './policy';
import { StateStore } from './state';
import type { RecordEntry, Sink } from './persistence';
import { exercise } from './exercise';
export interface Transport { send(bytes: Uint8Array): void; close(): void }
export interface EngineOptions {
  sink: Sink; config?: Config; exercise?: boolean; previous?: RecordEntry[];
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
  private restored = false;
  readonly config: Config;
  constructor(private options: EngineOptions) { this.config = options.config ?? defaultConfig; }
  connect(transport: Transport) {
    this.transport = transport; this.ready = false; this.readySequence = undefined;
    clearTimeout(this.syncTimer);
    return this.state.newConnection();
  }
  disconnected(epoch: number) {
    if (epoch !== this.state.epoch) return;
    this.ready = false; this.transport = undefined; clearTimeout(this.syncTimer);
  }
  fail() {
    if (this.stopped) return;
    this.stopped = true; clearTimeout(this.syncTimer); this.transport?.close(); this.options.fatal?.();
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
      this.message(epoch, decode(bytes));
    } catch { this.fail(); }
  }
  private restore(s: Snapshot) {
    if (this.restored) return;
    this.restored = true;
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
  }
  private message(epoch: number, msg: ServerMessage) {
    const value = msg.state ?? msg.result ?? msg.readiness ?? msg.protocol_error!;
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
      for (const r of s.request_results.items) this.record({ kind: 'result', direction: 'inbound', requestId: r.request_id, payload: r });
      if (!this.state.pending.length) clearTimeout(this.syncTimer);
      if (this.readySequence === undefined) this.control('ready');
      if (this.options.exercise && this.exerciseSync) {
        if (s.self.inventory.water !== 28n || s.self.inventory.food !== 31n || s.self.inventory.components !== 31n || s.transactions.items.length !== 2 || s.request_results.items.length !== 5) throw new Error('Incorrect validator final state');
        this.stopped = true;
        void this.persistence.then(() => { this.transport?.close(); this.options.done?.(); }).catch(() => this.options.fatal?.());
        return;
      }
    } else if (msg.readiness) {
      this.record({ kind: 'readiness', direction: 'inbound', payload: msg.readiness });
      this.ready = msg.readiness.ready && msg.readiness.snapshot_sequence === this.readySequence;
    } else if (msg.result) {
      this.state.result(msg.result);
      this.record({ kind: 'result', direction: 'inbound', requestId: msg.result.request_id, payload: msg.result });
      if (msg.result.code === 2) throw new Error('Request ID conflict');
    } else if (msg.protocol_error) {
      const error = msg.protocol_error;
      this.record({ kind: 'protocol_error', direction: 'inbound', requestId: error.request_id.value, payload: error });
      if (error.close_session) { this.fail(); return; }
      if (error.code === 2) {
        this.capacityExhausted = true;
        this.state.pending = this.state.pending.filter(p => p.requestId !== error.request_id.value);
        this.record({ kind: 'control-rejected', requestId: error.request_id.value, payload: error });
        if (this.options.exercise && this.exerciseCapacity) this.exerciseSync = true;
        this.control('sync');
      } else { this.fail(); return; }
    }
    this.schedule();
  }
  schedule() {
    this.dirty = true;
    if (!this.cycling) void this.cycle().catch(() => this.fail());
  }
  async idle() { while (this.cycling) await new Promise(resolve => setImmediate(resolve)); await this.persistence; }
  private async cycle() {
    this.cycling = true;
    try {
      while (this.dirty && !this.stopped) {
        this.dirty = false;
        await this.persistence;
        const s = this.state.snapshot;
        if (!s || !this.ready || !this.transport || this.state.pending.length || this.capacityExhausted || s.tick < this.state.blockedUntil || s.phase !== 2 || s.self.failed_once) continue;
        const epoch = this.state.epoch;
        let action: Action;
        let decision: ReturnType<typeof decide> | undefined;
        if (this.options.exercise) {
          const step = exercise(s);
          if (step === 'done') {
            if (this.exerciseCapacity) continue;
            action = { kind: 'advertise', body: { selling: { items: [1] }, seeking: { items: [2] }, expires_tick: 6n } };
          } else if (step === 'sync') { this.control('sync'); continue; }
          else action = step;
        } else {
          decision = decide(s, this.state.pending, this.memory, this.config);
          action = decision.action;
        }
        // Let queued socket I/O run even when the local journal resolves
        // synchronously; a chain of resolved promises alone only drains microtasks.
        await new Promise<void>(resolve => setImmediate(resolve));
        if (decision) await this.record({ kind: 'decision', payload: { ...decision, run: s.run_id, epoch, snapshot: s } });
        if (action.kind === 'wait') continue;
        // Persistence is asynchronous. New observations continue replacing facts
        // while it runs; never transmit a decision made against older facts.
        if (s !== this.state.snapshot || epoch !== this.state.epoch || !this.ready) { this.dirty = true; continue; }
        const pending: Pending = { requestId: randomUUID(), action, tick: s.tick };
        const bytes = this.commandBytes(s, pending);
        if (BigInt(bytes.length) > s.rules.max_command_bytes || bytes.length > 16384) throw new Error('Command too large');
        await this.record({ kind: 'command', direction: 'outbound', requestId: pending.requestId, payload: { ...pending, run: s.run_id, epoch } });
        await new Promise<void>(resolve => setImmediate(resolve));
        if (s !== this.state.snapshot || epoch !== this.state.epoch || !this.ready || this.stopped) {
          await this.record({ kind: 'cancelled', requestId: pending.requestId, payload: { reason: 'New observation before transmission' } });
          this.dirty = true; continue;
        }
        // No await between the final check, pending insertion, and socket.send.
        if (decision && fingerprint(decide(s, [], this.memory, this.config).action) !== fingerprint(action)) throw new Error('Revalidation mismatch');
        this.state.pending.push(pending);
        if (decision) this.memory = decision.nextMemory;
        if (this.options.exercise && s.request_results.items.length === 5) this.exerciseCapacity = true;
        this.transport!.send(bytes);
        this.record({ kind: 'sent', requestId: pending.requestId, payload: { run: s.run_id, epoch } });
        // A missing result prompts ONE observation request, never fresh IDs or
        // unbounded resubmission. Reconnect recovers recorded results in state.
        this.syncTimer = setTimeout(() => {
          this.record({ kind: 'uncertain', requestId: pending.requestId, payload: { reason: 'No authoritative outcome yet; one sync requested, replacements blocked.' } });
          this.control('sync');
        }, 2000);
        this.syncTimer.unref();
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
    return true;
  }
}
