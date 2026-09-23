import { spawn } from 'node:child_process';
import { mkdtemp, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createServer } from 'node:net';
import assert from 'node:assert/strict';
import { setTimeout as delay } from 'node:timers/promises';
async function run() {
  const dir = await mkdtemp(join(tmpdir(), 'bazaar-validator-'));
  const server = createServer(); await new Promise<void>(resolve => server.listen(0, '127.0.0.1', resolve));
  const port = (server.address() as { port: number }).port;
  await new Promise<void>(resolve => server.close(() => resolve()));
  const binary = resolve('artifacts/bazaar-protobuf-starter-linux/spaceport-validate-linux-' + (process.arch === 'arm64' ? 'arm64' : 'x86_64'));
  const credential = join(dir, 'credentials.json'), report = join(dir, 'report.json');
  const validator = spawn(binary, ['--codec', 'protobuf', '--addr', `127.0.0.1:${port}`, '--credential-file', credential, '--report', report], { stdio: 'ignore' });
  let worker: ReturnType<typeof spawn> | undefined;
  try {
    let available = false;
    for (let i = 0; i < 100; i++) {
      try { await readFile(credential); available = true; break; } catch { await delay(50); }
    }
    assert.ok(available, 'validator did not create credentials');
    worker = spawn(process.execPath, ['--import', 'tsx', 'worker/main.ts', '--exercise'], { env: { ...process.env, BAZAAR_TOKEN: '', BAZAAR_ENV_FILE: '', BAZAAR_ENDPOINT: `ws://127.0.0.1:${port}/ws`, BAZAAR_CREDENTIAL_FILE: credential, BAZAAR_JOURNAL_DIR: join(dir, 'journal') }, stdio: ['ignore', 'pipe', 'pipe'] });
    let output = ''; worker.stdout?.on('data', b => { output += b; }); worker.stderr?.on('data', b => { output += b; });
    const completed = new Promise<number | null>(resolve => worker!.once('exit', resolve));
    const timeout = setTimeout(() => worker?.kill('SIGKILL'), 20000);
    const code = await completed; clearTimeout(timeout);
    assert.equal(code, 0, output);
    const evidence = JSON.parse(await readFile(report, 'utf8'));
    assert.equal(evidence.status, 'sample exchange completed');
    assert.equal(evidence.last_completed_step, 10);
    assert.deepEqual(evidence.final_inventory, { water: 28, food: 31, components: 31 });
    console.log(JSON.stringify({ status: evidence.status, step: evidence.last_completed_step, final_inventory: evidence.final_inventory, evidenceDirectory: dir }));
  } finally { worker?.kill('SIGTERM'); validator.kill('SIGTERM'); }
}
void run().catch(error => { console.error(error); process.exitCode = 1; });
