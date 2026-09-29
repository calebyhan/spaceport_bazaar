// Operator-facing failure diagnosis. Every failure the worker can report is
// mapped to one category, a stable code, a message and a next step. Messages
// are written here, never copied from exceptions: raw errors can contain
// endpoint credentials, tokens or credential-file contents.
export type FailureCategory = 'configuration' | 'authentication' | 'protocol' | 'network' | 'application';
export interface Diagnosis { category: FailureCategory; code: string; message: string; hint: string }

// Distinct process exit codes, so scripts can branch without parsing text.
// 1 remains a clean operator stop with unresolved work.
export const exitCodes: Record<FailureCategory, number> = { configuration: 2, authentication: 3, protocol: 4, network: 5, application: 6 };

export class WorkerError extends Error {
  constructor(readonly diagnosis: Diagnosis) { super(diagnosis.message); }
}
export const failure = (category: FailureCategory, code: string, message: string, hint: string) => new WorkerError({ category, code, message, hint });

export function diagnose(error: unknown): Diagnosis {
  if (error instanceof WorkerError) return error.diagnosis;
  const name = error instanceof Error ? error.name : typeof error;
  return { category: 'application', code: 'UNEXPECTED', message: `Unexpected internal error (${name})`, hint: 'Inspect the journal for the last records before the stop; this is a worker bug, not a server rejection.' };
}

// The ws library rejects a bad upgrade response itself, with an uncoded error
// whose fixed message names the problem ("Server sent an invalid subprotocol").
const handshakeErrors: [RegExp, string, string][] = [
  [/^Server sent (an invalid|no) subprotocol$/, 'SUBPROTOCOL_MISMATCH', `The server did not select the bazaar.protobuf.v2 subprotocol`],
  [/^Invalid [A-Za-z-]+ header$/, 'HANDSHAKE_INVALID', 'The server sent an invalid WebSocket upgrade response'],
];
export function socketError(error: { code?: string; message?: string }): Diagnosis {
  for (const [pattern, code, message] of handshakeErrors) {
    if (!error.code && pattern.test(error.message ?? '')) return { category: 'protocol', code, message, hint: 'Check the endpoint is a Bazaar server started with the protobuf codec, not another WebSocket service.' };
  }
  const code = error.code ?? (error.message === 'Opening handshake has timed out' ? 'HANDSHAKE_TIMEOUT' : 'SOCKET_ERROR');
  const network = (message: string, hint: string): Diagnosis => ({ category: 'network', code, message, hint });
  switch (code) {
    case 'ECONNREFUSED': return network('Nothing is accepting connections at the endpoint', 'Check the server is running and the host and port in BAZAAR_ENDPOINT.');
    case 'ENOTFOUND': case 'EAI_AGAIN': return network('The endpoint host name did not resolve', 'Check the host name in BAZAAR_ENDPOINT and DNS/network access.');
    case 'ETIMEDOUT': case 'EHOSTUNREACH': case 'ENETUNREACH': case 'HANDSHAKE_TIMEOUT':
      return network('The endpoint did not respond in time', 'Check network access (VPN, firewall, container networking) to the endpoint host.');
    case 'ECONNRESET': case 'EPIPE': return network('The connection was reset by the network or server', 'The worker reconnects automatically; if this repeats, check the server and network.');
    case 'EPROTO': case 'ERR_SSL_WRONG_VERSION_NUMBER':
      return { category: 'protocol', code, message: 'TLS negotiation failed', hint: 'Use ws:// for a plain server and wss:// only when the endpoint supports TLS.' };
    default: return network('The WebSocket connection failed', 'The worker reconnects automatically; check the endpoint and network if it repeats.');
  }
}

export function handshakeRejected(status: number): Diagnosis {
  if (status === 401 || status === 403) return { category: 'authentication', code: `HTTP_${status}`, message: 'The server rejected the access token', hint: 'Check BAZAAR_TOKEN, or BAZAAR_CREDENTIAL_FILE and BAZAAR_STATION_ID. Tokens change when a practice server restarts.' };
  if (status === 404) return { category: 'configuration', code: 'HTTP_404', message: 'No WebSocket endpoint exists at that path', hint: 'Check the path in BAZAAR_ENDPOINT; Bazaar endpoints usually end in /ws.' };
  if (status >= 500) return { category: 'network', code: `HTTP_${status}`, message: 'The server is reachable but failing', hint: 'The worker reconnects automatically; report the server error to its operator if it repeats.' };
  return { category: 'protocol', code: `HTTP_${status}`, message: 'The server rejected the WebSocket upgrade', hint: 'Check the subprotocol (bazaar.protobuf.v2) and the station selected by the token.' };
}

const controls: Record<number, Diagnosis> = {
  1: { category: 'protocol', code: 'BAD_MESSAGE', message: 'The server could not process one of our messages', hint: 'Inspect the outbound raw bytes in the journal against bazaar.proto.' },
  3: { category: 'protocol', code: 'UNSUPPORTED_VERSION', message: 'The server does not support our protocol version', hint: 'Check the server expects protocol 2.0 and regenerate bindings if the schema changed.' },
  4: { category: 'protocol', code: 'RUN_MISMATCH', message: 'Our messages name a different run than the server is running', hint: 'Restart the worker so it reads the new run from the first snapshot.' },
  5: { category: 'authentication', code: 'INVALID_AUTHENTICATION', message: 'The server rejected our authentication', hint: 'Check BAZAAR_TOKEN, or BAZAAR_CREDENTIAL_FILE and BAZAAR_STATION_ID.' },
  6: { category: 'authentication', code: 'SESSION_FENCED', message: 'Another connection using this token replaced ours', hint: 'Make sure no other worker, teammate or tool is connected with the same token.' },
};
export function controlFailure(code: number): Diagnosis {
  return controls[code] ?? { category: 'protocol', code: `CONTROL_${code}`, message: 'The server sent an unrecognised control error', hint: 'Compare the control code with bazaar.proto; the schema may have changed.' };
}

export function formatDiagnosis(d: Diagnosis) {
  return `[${d.category}] ${d.code}: ${d.message}. Next step: ${d.hint}`;
}
