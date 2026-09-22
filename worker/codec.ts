import { bazaar } from './generated/bazaar';
import Long from 'long';
import { json } from './policy';
import type { Snapshot, Result } from './types';
const wire = bazaar.v2;
function integers(value: unknown): unknown {
  if (Long.isLong(value)) return BigInt(value.toString());
  if (Array.isArray(value)) return value.map(integers);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, integers(v)]));
  return value;
}
export interface ServerMessage {
  state?: Snapshot; result?: Result;
  readiness?: { protocol_version: string; run_id: string; ready: boolean; snapshot_sequence: bigint };
  protocol_error?: { protocol_version: string; run_id: { value?: string }; request_id: { value?: string }; code: number; close_session: boolean };
}
export function decode(bytes: Uint8Array): ServerMessage {
  const decoded = wire.ServerMessage.decode(bytes);
  const plain = wire.ServerMessage.toObject(decoded, { defaults: true, arrays: true });
  if (Object.values(plain).filter(Boolean).length !== 1) throw new Error('Expected one server message');
  return integers(plain) as ServerMessage;
}
export function encode(message: unknown): Uint8Array {
  const object = wire.ClientMessage.fromObject(JSON.parse(json(message)));
  const error = wire.ClientMessage.verify(object);
  if (error) throw new Error('Invalid client message: ' + error);
  return wire.ClientMessage.encode(object).finish();
}
export function encodeServer(message: unknown): Uint8Array {
  return wire.ServerMessage.encode(wire.ServerMessage.fromObject(JSON.parse(json(message)))).finish();
}
export function decodeClient(bytes: Uint8Array): Record<string, Record<string, unknown>> {
  return integers(wire.ClientMessage.toObject(wire.ClientMessage.decode(bytes), { defaults: true, arrays: true })) as Record<string, Record<string, unknown>>;
}
