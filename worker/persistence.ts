import { closeSync, fsyncSync, mkdirSync, openSync, readdirSync, readFileSync, rmdirSync, writeFileSync, writeSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { json } from './policy';
import type { Snapshot } from './types';
export interface RecordEntry {
  connection?: { processId: string; epoch: number }; kind: string; payload: unknown;
  direction?: 'internal' | 'inbound' | 'outbound'; requestId?: string;
  sequence?: number; at?: string; mono?: string;
}
export interface Sink {
  append(entry: RecordEntry): Promise<void>;
  // Called once, synchronously, the moment a run's identity (server run_id,
  // station) is known. Lets a sink that files records per run (see Journal)
  // pick its destination before any buffered pre-identity record is flushed.
  resolve?(runId: string, stationId: string): void;
}
export function acquireLock(run: string, station: string): () => void {
  // Host-wide key, independent of checkout, endpoint aliases, and journal path.
  const key = createHash('sha256').update(run + '\0' + station).digest('hex');
  const path = join('/tmp', 'spaceport-bazaar-' + key + '.lock');
  mkdirSync(path, { mode: 0o700 }); // EEXIST fails closed, including stale locks.
  writeFileSync(join(path, 'owner.json'), json({ pid: process.pid, run, station }), { mode: 0o600 });
  return () => { unlinkSync(join(path, 'owner.json')); rmdirSync(path); };
}
function sanitizeForFilename(value: string): string {
  return value.replace(/[^A-Za-z0-9_-]/g, '_').slice(0, 80);
}
function timestampForFilename(): string {
  return new Date().toISOString().replace(/[:.]/g, '-');
}
// Every record that carries a run identifier names it `run`, `run_id`, or
// (the manifest) `server_run_id`; the first one found in a file is enough to
// tell which run that file belongs to.
function runIdOf(entries: RecordEntry[]): string | undefined {
  for (const entry of entries) {
    const payload = entry.payload as Record<string, unknown> | undefined;
    const id = payload?.run ?? payload?.run_id ?? payload?.server_run_id;
    if (typeof id === 'string') return id;
  }
  return undefined;
}
// One journal file per run, so a run's raw log stays a self-contained,
// independently reviewable artifact instead of an ever-growing file shared
// by every run the process has ever handled. A run still resumes into its
// own file across a crash/restart: the constructor loads the most recent
// unfinished (no `run-summary`) file in the directory as a *candidate*, and
// `resolve()` — called once the server's run_id is known — reuses that file
// only if the candidate itself names the same run_id; otherwise it opens a
// fresh file, leaving the candidate as evidence of whatever it was.
export class Journal implements Sink {
  private fd?: number;
  private path?: string;
  private readonly pending: RecordEntry[] = [];
  private readonly candidate?: { path: string; runId?: string };
  readonly previous: RecordEntry[];
  constructor(private readonly dir: string) {
    mkdirSync(dir, { recursive: true, mode: 0o700 });
    const files = readdirSync(dir).filter(f => f.endsWith('.jsonl')).sort();
    const last = files.at(-1);
    let previous: RecordEntry[] = [];
    if (last) {
      const path = join(dir, last);
      // A torn trailing line is deliberately fatal, not silently discarded.
      const entries: RecordEntry[] = readFileSync(path, 'utf8').split('\n').filter(Boolean).map(line => JSON.parse(line));
      if (!entries.some(e => e.kind === 'run-summary')) {
        this.candidate = { path, runId: runIdOf(entries) };
        previous = entries;
      }
    }
    this.previous = previous;
  }
  resolve(runId: string, stationId: string) {
    if (this.fd !== undefined) return;
    this.path = this.candidate?.runId === runId ? this.candidate.path : join(this.dir, `${timestampForFilename()}-${sanitizeForFilename(stationId)}-${sanitizeForFilename(runId)}.jsonl`);
    this.open();
  }
  private open() {
    this.fd = openSync(this.path!, 'a', 0o600);
    const directory = openSync(this.dir, 'r');
    try { fsyncSync(directory); } finally { closeSync(directory); }
    for (const entry of this.pending.splice(0)) this.write(entry);
  }
  async append(entry: RecordEntry) {
    // Buffer anything recorded before the run's identity is known (e.g. the
    // socket's open/error/reconnect events); resolve() flushes it in order.
    if (this.fd === undefined) { this.pending.push(entry); return; }
    this.write(entry);
  }
  private write(entry: RecordEntry) {
    // Records normally already carry timing metadata from Engine.record();
    // this fallback only matters for direct/test callers that bypass it.
    const bytes = Buffer.from(json({ at: new Date().toISOString(), ...entry }) + '\n');
    let offset = 0;
    while (offset < bytes.length) offset += writeSync(this.fd!, bytes, offset, bytes.length - offset);
    fsyncSync(this.fd!);
  }
  close() {
    // The run never reached an identified connection (e.g. it could never
    // reach the server): flush whatever was buffered rather than losing it.
    if (this.fd === undefined && this.pending.length) {
      this.path = join(this.dir, `${timestampForFilename()}-unidentified.jsonl`);
      this.open();
    }
    if (this.fd !== undefined) closeSync(this.fd);
  }
}
export class SupabaseSink implements Sink {
  private client;
  private runId?: string;
  constructor(url: string, secret: string) {
    this.client = createClient(url, secret, { auth: { persistSession: false, autoRefreshToken: false }, global: { fetch: (url, options) => fetch(url, { ...options, signal: AbortSignal.timeout(10000) }) } });
  }
  async append(entry: RecordEntry) {
    const payload = JSON.parse(json(entry.payload));
    if (entry.kind === 'state') {
      const s = entry.payload as Snapshot;
      const { data, error } = await this.client.from('runs').upsert({ external_run_id: s.run_id, station_id: s.self_station_id, status: ['unknown', 'ready', 'running', 'paused', 'finished', 'aborted'][s.phase] }, { onConflict: 'external_run_id' }).select('id').single();
      if (error || !data) throw new Error('Run persistence failed');
      this.runId = data.id;
      const response = await this.client.from('current_snapshots').upsert({ run_id: this.runId, snapshot_sequence: s.snapshot_sequence.toString(), world_version: s.world_version.toString(), tick: s.tick.toString(), phase: String(s.phase), inventory: payload.self.inventory, state: payload, updated_at: new Date().toISOString() });
      if (response.error) throw new Error('Snapshot persistence failed');
    }
    if (!this.runId) return;
    const response = await this.client.from('events').insert({ run_id: this.runId, direction: entry.direction ?? 'internal', kind: entry.kind, request_id: entry.requestId, source_sequence: entry.kind === 'state' ? payload.snapshot_sequence : undefined, payload: { ...payload, _connection: entry.connection, _sequence: entry.sequence, _at: entry.at, _mono: entry.mono } });
    if (response.error) throw new Error('Event persistence failed');
    if (entry.kind === 'command') {
      const response = await this.client.from('commands').upsert({ run_id: this.runId, request_id: entry.requestId, command_type: payload.action.kind, status: 'prepared', command: payload }, { onConflict: 'run_id,request_id' });
      if (response.error) throw new Error('Command persistence failed');
    } else if (['sent', 'uncertain', 'cancelled', 'control-rejected'].includes(entry.kind)) {
      const response = await this.client.from('commands').update({ status: entry.kind, result: payload }).eq('run_id', this.runId).eq('request_id', entry.requestId);
      if (response.error) throw new Error('Command status persistence failed');
    } else if (entry.kind === 'result') {
      const response = await this.client.from('commands').update({ status: payload.ok ? 'succeeded' : 'rejected', result_code: String(payload.code), result: payload, resolved_at: new Date().toISOString() }).eq('run_id', this.runId).eq('request_id', entry.requestId);
      if (response.error) throw new Error('Result persistence failed');
    }
  }
}
