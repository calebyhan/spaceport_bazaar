import { expect, test, vi } from 'vitest';
import { decode, encode, encodeServer } from '../codec';
import { bazaar } from '../generated/bazaar';
test('empty and malformed server envelopes are rejected', () => {
  expect(() => decode(new Uint8Array())).toThrow('Expected one server message');
  expect(() => decode(Uint8Array.from([255]))).toThrow();
});
test('schema verification errors are propagated before transmission', () => {
  const verify = vi.spyOn(bazaar.v2.ClientMessage, 'verify').mockReturnValue('invalid schema');
  try {
  expect(() => encode({ ready: { type: 999, protocol_version: '2.0', run_id: 'test-run', ready: true, snapshot_sequence: 1n } })).toThrow('Invalid client message: invalid schema');
  } finally { verify.mockRestore(); }
});
