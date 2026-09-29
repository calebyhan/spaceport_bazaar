import { expect, test } from 'vitest';
import { controlFailure, diagnose, exitCodes, failure, formatDiagnosis, handshakeRejected, socketError } from '../diagnostics';
import { formatLifecycle, Lifecycle, staleAfterMs, steadyState, type LifecycleChange } from '../lifecycle';
import { snapshot } from './fixtures';

test('each category has its own exit code, distinct from success and a clean stop', () => {
  expect(new Set([0, 1, ...Object.values(exitCodes)]).size).toBe(7);
});

test.each([
  [{ code: 'ECONNREFUSED' }, 'network', 'ECONNREFUSED'],
  [{ code: 'ENOTFOUND' }, 'network', 'ENOTFOUND'],
  [{ code: 'EAI_AGAIN' }, 'network', 'EAI_AGAIN'],
  [{ code: 'ETIMEDOUT' }, 'network', 'ETIMEDOUT'],
  [{ code: 'EHOSTUNREACH' }, 'network', 'EHOSTUNREACH'],
  [{ code: 'ENETUNREACH' }, 'network', 'ENETUNREACH'],
  [{ message: 'Opening handshake has timed out' }, 'network', 'HANDSHAKE_TIMEOUT'],
  [{ code: 'ECONNRESET' }, 'network', 'ECONNRESET'],
  [{ code: 'EPIPE' }, 'network', 'EPIPE'],
  [{ code: 'EPROTO' }, 'protocol', 'EPROTO'],
  [{ code: 'ERR_SSL_WRONG_VERSION_NUMBER' }, 'protocol', 'ERR_SSL_WRONG_VERSION_NUMBER'],
  [{ message: 'something with secret-token' }, 'network', 'SOCKET_ERROR'],
  [{}, 'network', 'SOCKET_ERROR'],
  [{ message: 'Server sent an invalid subprotocol' }, 'protocol', 'SUBPROTOCOL_MISMATCH'],
  [{ message: 'Server sent no subprotocol' }, 'protocol', 'SUBPROTOCOL_MISMATCH'],
  [{ message: 'Invalid Sec-WebSocket-Accept header' }, 'protocol', 'HANDSHAKE_INVALID'],
  [{ code: 'ECONNRESET', message: 'Server sent no subprotocol' }, 'network', 'ECONNRESET'],
])('socket error %j is %s/%s', (error, category, code) => {
  const d = socketError(error);
  expect(d).toMatchObject({ category, code });
  expect(JSON.stringify(d)).not.toContain('secret-token');
});

test.each([[401, 'authentication'], [403, 'authentication'], [404, 'configuration'], [500, 'network'], [503, 'network'], [400, 'protocol'], [426, 'protocol']])('HTTP %i handshake rejection is %s', (status, category) => {
  expect(handshakeRejected(status)).toMatchObject({ category, code: `HTTP_${status}` });
});

test.each([[1, 'protocol', 'BAD_MESSAGE'], [3, 'protocol', 'UNSUPPORTED_VERSION'], [4, 'protocol', 'RUN_MISMATCH'], [5, 'authentication', 'INVALID_AUTHENTICATION'], [6, 'authentication', 'SESSION_FENCED'], [99, 'protocol', 'CONTROL_99']])('control code %i is %s/%s', (code, category, name) => {
  expect(controlFailure(code)).toMatchObject({ category, code: name });
});

test('diagnose keeps known diagnoses and never echoes unexpected error text', () => {
  const known = failure('application', 'LOCK_HELD', 'Held', 'Stop it');
  expect(diagnose(known)).toBe(known.diagnosis);
  expect(known.message).toBe('Held');
  expect(diagnose(new TypeError('token=secret'))).toEqual({ category: 'application', code: 'UNEXPECTED', message: 'Unexpected internal error (TypeError)', hint: expect.any(String) });
  expect(diagnose('secret').message).toBe('Unexpected internal error (string)');
  expect(formatDiagnosis(known.diagnosis)).toBe('[application] LOCK_HELD: Held. Next step: Stop it');
});

test('steady lifecycle stage follows readiness, station failure and phase', () => {
  const s = snapshot({ phase: 2 });
  expect(steadyState(false, s)[0]).toBe('authenticated');
  expect(steadyState(true, s)).toEqual(['participating', 'Run is RUNNING; trading']);
  expect(steadyState(true, snapshot({ phase: 1 }))).toEqual(['synchronized', 'Run is READY; waiting for it to run']);
  expect(steadyState(true, snapshot({ phase: 9 }))[1]).toBe('Run is UNKNOWN; waiting for it to run');
  const failed = snapshot({ phase: 2 }); failed.self.failed_once = true;
  expect(steadyState(true, failed)).toEqual(['synchronized', 'Our station has permanently failed; observing only']);
});

test('stale window is three ticks, never less than five seconds', () => {
  const s = snapshot();
  expect(staleAfterMs(s)).toBe(5000);
  s.rules.tick_duration_ms = 5000n;
  expect(staleAfterMs(s)).toBe(15000);
});

test('lifecycle records real changes only and never leaves a terminal stage', () => {
  const changes: LifecycleChange[] = [];
  const life = new Lifecycle(change => changes.push(change));
  life.set('connecting', 'Opening', { epoch: 1 });
  life.set('connecting', 'Again', { epoch: 1 });
  life.set('failed', 'Broken', { epoch: 1 });
  life.set('stopped', 'Stopped', { epoch: 1 });
  expect(changes.map(c => `${c.from}>${c.to}`)).toEqual(['starting>connecting', 'connecting>failed']);
  expect([life.state, life.reason, life.terminal]).toEqual(['failed', 'Broken', true]);
  expect(formatLifecycle(changes[0])).toBe('[lifecycle] starting -> connecting: Opening');
  expect(formatLifecycle({ ...changes[0], tick: 4n, phase: 7 })).toBe('[lifecycle] starting -> connecting (tick 4, UNKNOWN): Opening');
});
