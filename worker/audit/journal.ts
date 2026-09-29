// Read-only access to worker journals for operator tools. Journals are JSON
// lines with wire integers as decimal strings; a live journal may end in a
// partly written line, which readers skip and report instead of failing.
import { createReadStream, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { createInterface } from 'node:readline';
import type { Action, Bundle } from '../types';

// A value as the journal stores it: every bigint becomes a decimal string.
export type Journaled<T> = T extends bigint ? string : T extends (infer U)[] ? Journaled<U>[] : T extends object ? { [K in keyof T]: Journaled<T[K]> } : T;
export interface Entry {
  kind: string; payload: unknown;
  requestId?: string; at?: string; sequence?: number; strategy?: string;
  connection?: { processId: string; epoch: number };
}

// Streams entries in order. Only the final line may be torn; a bad line
// anywhere else means the file is not a journal and is an error.
export async function readJournal(path: string, visit: (entry: Entry) => void): Promise<{ entries: number; tornTail: boolean }> {
  const lines = createInterface({ input: createReadStream(path, 'utf8'), crlfDelay: Infinity });
  let entries = 0, pending: string | undefined;
  for await (const line of lines) {
    if (pending !== undefined) throw new Error(`Line ${entries + 1} of ${path} is not valid JSON`);
    if (!line) continue;
    let entry: Entry;
    try { entry = JSON.parse(line); } catch { pending = line; continue; }
    entries++;
    visit(entry);
  }
  return { entries, tornTail: pending !== undefined };
}

// The newest journal file in a directory; file names start with a timestamp.
export function newestJournal(dir: string): string {
  const files = readdirSync(dir).filter(f => f.endsWith('.jsonl') && !f.endsWith('-unidentified.jsonl')).sort();
  if (!files.length) throw new Error(`No journal files in ${dir}`);
  return join(dir, files.at(-1)!);
}

export const resourceNames = ['water', 'food', 'components'] as const;
type Amounts = Record<keyof Bundle, string | number | bigint>;
export const phaseName = (phase: number) => ['UNKNOWN', 'READY', 'RUNNING', 'PAUSED', 'FINISHED', 'ABORTED'][phase] ?? 'UNKNOWN';
export const resultName = (code: number) => ['UNKNOWN', 'OK', 'REQUEST_ID_CONFLICT', 'RUN_NOT_RUNNING', 'RATE_LIMITED', 'INVALID_ARGUMENT', 'NOT_FOUND',
  'EXPIRED', 'NOT_OPEN', 'LIMIT_REACHED', 'INSUFFICIENT_RESOURCES', 'STATION_FAILED'][code] ?? `CODE_${code}`;
export const offerStatusName = (status: number) => ['UNKNOWN', 'OPEN', 'ACCEPTED', 'WITHDRAWN', 'EXPIRED', 'RUN_ENDED'][status] ?? `STATUS_${status}`;

// "3 water + 1 food"; an empty bundle is "nothing".
export function amounts(bundle: Amounts): string {
  const parts = resourceNames.filter(r => BigInt(bundle[r]) > 0n).map(r => `${bundle[r]} ${r}`);
  return parts.length ? parts.join(' + ') : 'nothing';
}

// An offer from our side: what we pay and what we get, whoever proposed it.
export function ourTerms(offer: { proposer_id: string; recipient_id: string; give: Amounts; receive: Amounts }, self: string) {
  const ours = offer.proposer_id === self;
  return { outgoing: ours, counterparty: ours ? offer.recipient_id : offer.proposer_id,
    pay: ours ? offer.give : offer.receive, get: ours ? offer.receive : offer.give };
}

const listed = (items: number[]) => items.map(r => resourceNames[r - 1]).join(', ');
export function describeAction(action: Journaled<Action>): string {
  switch (action.kind) {
    case 'offer': return `offer ${action.body.recipient_id} ${amounts(action.body.give)} for ${amounts(action.body.receive)}, expires tick ${action.body.expires_tick}`;
    case 'accept': return `accept offer ${action.body.offer_id}`;
    case 'withdraw': return `withdraw ${action.body.object_id}`;
    case 'advertise': return `advertise selling [${listed(action.body.selling.items)}] seeking [${listed(action.body.seeking.items)}]`;
    default: return 'wait';
  }
}
