// Repeatable evidence that the real worker process names the category of each
// connection failure and reports its lifecycle. Every case starts the unchanged
// worker CLI against a local simulation server (with a deliberate fault) or a
// broken configuration, then checks its printed diagnosis and exit code.
import { spawn, type ChildProcess } from 'node:child_process';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { startSimServer, type Faults, type SimServer } from '../sim/server';
import { createSimulation } from '../sim/setup';
import { defaultEconomy } from '../sim/economy';

interface Outcome { code: number | null; output: string }
type React = (output: string, child: ChildProcess) => void;

function worker(env: Record<string, string>, react: React = () => {}, timeoutMs = 30000): Promise<Outcome> {
  const child = spawn(process.execPath, ['--import', 'tsx', 'worker/main.ts'], { env: {
    ...process.env, BAZAAR_STRATEGY: undefined, BAZAAR_ENV_FILE: '', BAZAAR_TOKEN: '', BAZAAR_CREDENTIAL_FILE: '', BAZAAR_ENDPOINT: '', BAZAAR_JOURNAL: '', ...env } });
  let output = '';
  return new Promise(resolve => {
    const read = (chunk: Buffer) => { output += chunk; react(output, child); };
    child.stdout!.on('data', read); child.stderr!.on('data', read);
    // SIGTERM lets the worker release its host lock; SIGKILL would leave it held.
    const timer = setTimeout(() => { child.kill('SIGTERM'); setTimeout(() => child.kill('SIGKILL'), 5000).unref(); }, timeoutMs);
    child.once('exit', code => { clearTimeout(timer); resolve({ code, output }); });
  });
}
async function sim(faults: Faults = {}, durationTicks = 6n) {
  const { world, players, tokens } = createSimulation({ ...defaultEconomy, planets: 3, durationTicks }, 100);
  const server = await startSimServer({ world, tokens, tickMs: 100, faults });
  return { server, token: players[0].token };
}
async function freePort() {
  const probe = createServer();
  await new Promise<void>(resolve => probe.listen(0, '127.0.0.1', resolve));
  const { port } = probe.address() as { port: number };
  await new Promise<void>(resolve => probe.close(() => resolve()));
  return port;
}
const stopOnce = (pattern: RegExp): React => {
  let sent = false;
  return (output, child) => { if (!sent && pattern.test(output)) { sent = true; child.kill('SIGTERM'); } };
};

interface Case { name: string; expect: string; exit?: number; run(journal: string): Promise<Outcome> }
const withServer = (faults: Faults, token?: string, react?: React) => async (journal: string) => {
  const { server, token: valid } = await sim(faults);
  try { return await worker({ BAZAAR_ENDPOINT: server.url, BAZAAR_TOKEN: token ?? valid, BAZAAR_JOURNAL_DIR: journal }, react); }
  finally { await server.close(); }
};
const retries = () => stopOnce(/attempt 2\)/);
// Starts a first worker (P01, its own journal directory), runs `second` once it
// is synchronized, then stops the first worker cleanly.
async function whileRunning(second: (url: string, tokens: string[], firstJournal: string) => Promise<Outcome>): Promise<Outcome> {
  const { world, players, tokens } = createSimulation({ ...defaultEconomy, planets: 3, durationTicks: 6n }, 100);
  const server = await startSimServer({ world, tokens, tickMs: 100 });
  const firstJournal = await mkdtemp(join(tmpdir(), 'bazaar-first-'));
  let outcome: Promise<Outcome> | undefined;
  try {
    await worker({ BAZAAR_ENDPOINT: server.url, BAZAAR_TOKEN: players[0].token, BAZAAR_JOURNAL_DIR: firstJournal }, (output, child) => {
      if (!outcome && /-> synchronized/.test(output)) outcome = second(server.url, players.map(p => p.token), firstJournal).finally(() => child.kill('SIGTERM'));
    });
  } finally { await server.close(); }
  return outcome ?? { code: null, output: 'first worker never synchronized' };
}

const cases: Case[] = [
  { name: 'endpoint not configured', expect: '[configuration] MISSING_ENDPOINT', exit: 2,
    run: journal => worker({ BAZAAR_TOKEN: 'token', BAZAAR_JOURNAL_DIR: journal }) },
  { name: 'endpoint is not a WebSocket URL', expect: '[configuration] INVALID_ENDPOINT', exit: 2,
    run: journal => worker({ BAZAAR_ENDPOINT: 'http://127.0.0.1:3100/ws', BAZAAR_TOKEN: 'token', BAZAAR_JOURNAL_DIR: journal }) },
  { name: 'station missing from credential file', expect: '[configuration] UNKNOWN_STATION', exit: 2, run: async journal => {
    const file = join(journal, '..', 'credentials.json');
    await writeFile(file, JSON.stringify({ players: [{ station_id: 'P01', token: 'secret' }] }));
    return worker({ BAZAAR_ENDPOINT: 'ws://127.0.0.1:3100/ws', BAZAAR_CREDENTIAL_FILE: file, BAZAAR_STATION_ID: 'P09', BAZAAR_JOURNAL_DIR: journal });
  } },
  { name: 'wrong token', expect: '[authentication] HTTP_401', exit: 3, run: withServer({}, 'not-a-token') },
  { name: 'server selects another subprotocol', expect: '[protocol] SUBPROTOCOL_MISMATCH', exit: 4, run: withServer({ subprotocol: 'bazaar.json.v1' }) },
  { name: 'server sends undecodable bytes', expect: '[protocol] UNDECODABLE_FRAME', exit: 4, run: withServer({ garbage: true }) },
  { name: 'nothing listening (retries)', expect: '[network] ECONNREFUSED', run: async journal =>
    worker({ BAZAAR_ENDPOINT: `ws://127.0.0.1:${await freePort()}/ws`, BAZAAR_TOKEN: 'token', BAZAAR_JOURNAL_DIR: journal }, retries()) },
  { name: 'host name does not resolve (retries)', expect: '[network] ENOTFOUND', run: journal =>
    worker({ BAZAAR_ENDPOINT: 'ws://bazaar.invalid/ws', BAZAAR_TOKEN: 'token', BAZAAR_JOURNAL_DIR: journal }, retries()) },
  { name: 'server failing with HTTP 503 (retries)', expect: '[network] HTTP_503', run: withServer({ httpStatus: 503 }, undefined, retries()) },
  { name: 'torn journal', expect: '[application] JOURNAL_UNREADABLE', exit: 6, run: async journal => {
    await mkdir(journal, { recursive: true });
    await writeFile(join(journal, '2026-01-01-P01-run.jsonl'), '{"kind":"manifest","payload":{}}\n{"kind":"sta');
    return worker({ BAZAAR_ENDPOINT: 'ws://127.0.0.1:3100/ws', BAZAAR_TOKEN: 'token', BAZAAR_JOURNAL_DIR: journal });
  } },
  { name: 'second worker using the same token', expect: '[application] LOCK_HELD: Another worker on this host is already using this token', exit: 6,
    run: journal => whileRunning((url, tokens) => worker({ BAZAAR_ENDPOINT: url, BAZAAR_TOKEN: tokens[0], BAZAAR_JOURNAL_DIR: journal })) },
  { name: 'two workers sharing a journal directory', expect: '[application] LOCK_HELD: Another worker on this host is writing to this journal directory', exit: 6,
    run: () => whileRunning((url, tokens, shared) => worker({ BAZAAR_ENDPOINT: url, BAZAAR_TOKEN: tokens[1], BAZAAR_JOURNAL_DIR: shared })) },
  { name: 'full lifecycle to a finished run', expect: 'finished -> ', exit: 0, run: async journal => {
    const { server, token } = await sim({}, 4n);
    try {
      const outcome = await worker({ BAZAAR_ENDPOINT: server.url, BAZAAR_TOKEN: token, BAZAAR_JOURNAL_DIR: journal }, output => { if (/-> synchronized/.test(output)) server.start(); });
      const order = ['starting -> connecting', 'connecting -> connected', 'connected -> authenticated', 'authenticated -> synchronized', 'synchronized -> participating', 'participating -> finished'];
      const positions = order.map(step => outcome.output.indexOf(step));
      const inOrder = positions.every((p, i) => p >= 0 && (i === 0 || p > positions[i - 1]));
      return { ...outcome, output: inOrder ? outcome.output + '\nfinished -> (all stages in order)' : outcome.output };
    } finally { await server.close(); }
  } },
  { name: 'silent server becomes stale, syncs, then reconnects', expect: 'stale -> disconnected', run: async journal => {
    const { server, token } = await sim({ silentAfterTick: 2n }, 1000n);
    try {
      const stop = stopOnce(/disconnected -> connecting[\s\S]*connecting -> connected/);
      return await worker({ BAZAAR_ENDPOINT: server.url, BAZAAR_TOKEN: token, BAZAAR_JOURNAL_DIR: journal }, (output, child) => {
        if (/-> synchronized/.test(output)) server.start();
        stop(output, child);
      });
    } finally { await server.close(); }
  } },
];

async function main() {
  const root = await mkdtemp(join(tmpdir(), 'bazaar-diagnostics-'));
  let failed = 0;
  for (const [i, c] of cases.entries()) {
    await mkdir(join(root, `case-${i}`));
    const outcome = await c.run(join(root, `case-${i}`, 'journal'));
    const ok = outcome.output.includes(c.expect) && (c.exit === undefined || outcome.code === c.exit);
    if (!ok) failed++;
    console.log(`${ok ? 'PASS' : 'FAIL'}  ${c.name.padEnd(52)} ${c.expect}${c.exit === undefined ? ' (retrying)' : `, exit ${c.exit}`}`);
    if (!ok) console.log(`  got exit ${outcome.code}:\n${outcome.output.replace(/^/gm, '    ')}`);
  }
  console.log(failed ? `${failed} of ${cases.length} diagnostic cases failed.` : `All ${cases.length} diagnostic cases produced the expected category and exit code. Evidence: ${root}`);
  process.exitCode = failed ? 1 : 0;
}
void main();
