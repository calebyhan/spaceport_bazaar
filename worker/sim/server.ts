// WebSocket transport for the local World: bearer-token authentication,
// bazaar.protobuf.v2 framing, per-connection readiness and snapshot sequences,
// session fencing, and a fixed-interval tick clock.
import { WebSocketServer, type WebSocket } from 'ws';
import type { AddressInfo } from 'node:net';
import { decodeClient, encodeServer } from '../codec';
import { json } from '../serialization';
import { Control, type CommandKind, type World } from './world';

export const SUBPROTOCOL = 'bazaar.protobuf.v2';
const requestIdPattern = /^[A-Za-z0-9_-]{1,64}$/;

export interface SimServerOptions {
  world: World; tokens: Record<string, string>; tickMs: number;
  host?: string; port?: number;
  // Start once every station has declared readiness; otherwise call start().
  autoStart?: boolean;
}
export interface SimServer { url: string; start(): void; finished: Promise<void>; close(): Promise<void> }
interface Session { socket: WebSocket; station: string; sequence: bigint; ready: boolean }

export async function startSimServer(options: SimServerOptions): Promise<SimServer> {
  const { world, tokens } = options;
  const sessions = new Map<string, Session>();
  const readyStations = new Set<string>();
  const bearer = (header: string | undefined) => tokens[header?.match(/^Bearer (.+)$/)?.[1] ?? ''];
  let clock: NodeJS.Timeout | undefined, finish!: () => void;
  const finished = new Promise<void>(resolve => { finish = resolve; });

  const wss = new WebSocketServer({
    host: options.host ?? '127.0.0.1', port: options.port ?? 0, path: '/ws', maxPayload: Number(world.rules.max_command_bytes),
    // Match the validator: bad credentials are HTTP 401, a missing subprotocol HTTP 400.
    verifyClient: ({ req }, done) => {
      if (!bearer(req.headers.authorization)) return done(false, 401);
      const offered = (req.headers['sec-websocket-protocol'] ?? '').split(',').map(p => p.trim());
      return offered.includes(SUBPROTOCOL) ? done(true) : done(false, 400);
    },
    handleProtocols: () => SUBPROTOCOL,
  });
  await new Promise<void>(resolve => wss.once('listening', resolve));

  const send = (session: Session, message: unknown) => session.socket.send(encodeServer(message), { binary: true });
  const publish = (station: string) => {
    const session = sessions.get(station);
    if (session) send(session, { state: world.view(station, ++session.sequence) });
  };
  const broadcast = () => { for (const station of sessions.keys()) publish(station); };
  const reject = (session: Session, code: number, close: boolean, requestId?: string) => {
    send(session, { protocol_error: { type: 1, protocol_version: '2.0', run_id: { value: world.runId },
      request_id: requestId ? { value: requestId } : { null: true }, code, close_session: close } });
    if (close) session.socket.close();
  };
  const start = () => {
    if (clock) return;
    world.start(); broadcast();
    clock = setInterval(() => {
      world.advance(); broadcast();
      if (world.finished) { clearInterval(clock); finish(); }
    }, options.tickMs);
  };

  const handle = (session: Session, data: Buffer, binary: boolean) => {
    let message: Record<string, Record<string, unknown>>;
    try {
      if (!binary) throw new Error('Text frame');
      message = decodeClient(data);
    } catch { return reject(session, Control.BAD_MESSAGE, false); }
    const kind = Object.keys(message).find(key => message[key]);
    if (!kind) return reject(session, Control.BAD_MESSAGE, false);
    const body = message[kind];
    if (body.protocol_version !== '2.0') return reject(session, Control.UNSUPPORTED_VERSION, true);
    if (body.run_id !== world.runId) return reject(session, Control.RUN_MISMATCH, true);
    if (kind === 'sync') return publish(session.station);
    if (kind === 'ready') {
      session.ready = body.ready as boolean;
      send(session, { readiness: { type: 1, protocol_version: '2.0', run_id: world.runId, ready: session.ready, snapshot_sequence: body.snapshot_sequence } });
      if (session.ready) readyStations.add(session.station);
      if (options.autoStart && world.stationIds.every(id => readyStations.has(id))) start();
      return;
    }
    const requestId = body.request_id as string;
    if (!requestIdPattern.test(requestId) || !session.ready) return reject(session, Control.BAD_MESSAGE, false, requestId);
    const outcome = world.command(session.station, kind as CommandKind, requestId, body.body, kind + json(body.body));
    if ('control' in outcome) return reject(session, outcome.control, false, requestId);
    send(session, { result: outcome.result });
    for (const station of outcome.affected === 'all' ? [...sessions.keys()] : outcome.affected) publish(station);
  };

  wss.on('connection', (socket, request) => {
    const station = bearer(request.headers.authorization);
    const previous = sessions.get(station);
    const session: Session = { socket, station, sequence: 0n, ready: false };
    sessions.set(station, session);
    // A new connection replaces the old one, as on the classroom server; the
    // fenced socket can no longer act for the station.
    if (previous) { previous.socket.removeAllListeners('message'); reject(previous, Control.SESSION_FENCED, true); }
    socket.on('message', (data: Buffer, binary) => handle(session, data, binary));
    socket.on('close', () => { if (sessions.get(station) === session) sessions.delete(station); });
    publish(station);
  });

  const { port } = wss.address() as AddressInfo;
  return {
    url: `ws://${options.host ?? '127.0.0.1'}:${port}/ws`, start, finished,
    close: async () => {
      clearInterval(clock);
      for (const client of wss.clients) client.terminate();
      await new Promise<void>(resolve => wss.close(() => resolve()));
    },
  };
}
