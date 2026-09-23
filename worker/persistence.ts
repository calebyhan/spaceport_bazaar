import { closeSync, existsSync, fsyncSync, mkdirSync, openSync, readFileSync, rmdirSync, writeFileSync, writeSync, unlinkSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { createHash } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { json } from './policy';
import type { Snapshot } from './types';
export interface RecordEntry { connection?: { processId: string; epoch: number }; kind: string; payload: unknown; direction?: 'internal' | 'inbound' | 'outbound'; requestId?: string }
export interface Sink { append(entry: RecordEntry): Promise<void>; }
export function acquireLock(run: string, station: string): () => void {
  // Host-wide key, independent of checkout, endpoint aliases, and journal path.
  const key = createHash('sha256').update(run + '\0' + station).digest('hex');
  const path = join('/tmp', 'spaceport-bazaar-' + key + '.lock');
  mkdirSync(path, { mode: 0o700 }); // EEXIST fails closed, including stale locks.
  writeFileSync(join(path, 'owner.json'), json({ pid: process.pid, run, station }), { mode: 0o600 });
  return () => { unlinkSync(join(path, 'owner.json')); rmdirSync(path); };
}
export class Journal implements Sink {
  private fd: number;
  readonly previous: RecordEntry[];
  constructor(path: string) {
    mkdirSync(dirname(path), { recursive: true, mode: 0o700 });
    // A torn trailing line is deliberately fatal, not silently discarded.
    this.previous = existsSync(path) ? readFileSync(path, 'utf8').split('\n').filter(Boolean).map(line => JSON.parse(line)) : [];
    this.fd = openSync(path, 'a', 0o600);
    const directory = openSync(dirname(path), 'r');
    try { fsyncSync(directory); } finally { closeSync(directory); }
  }
  async append(entry: RecordEntry) {
    const bytes = Buffer.from(json({ ...entry, at: new Date().toISOString() }) + '\n');
    let offset = 0;
    while (offset < bytes.length) offset += writeSync(this.fd, bytes, offset, bytes.length - offset);
    fsyncSync(this.fd);
  }
  close() { closeSync(this.fd); }
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
    const response = await this.client.from('events').insert({ run_id: this.runId, direction: entry.direction ?? 'internal', kind: entry.kind, request_id: entry.requestId, source_sequence: entry.kind === 'state' ? payload.snapshot_sequence : undefined, payload: { ...payload, _connection: entry.connection } });
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
