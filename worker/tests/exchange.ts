// Q18: two independent worker processes trade on our own server, and the
// resulting inventories are checked three ways: against each client's own
// journal, against the other side of every transaction, and against the
// server's production/consumption/trade ledger.
import { spawn } from 'node:child_process';
import { mkdtemp, readdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import assert from 'node:assert/strict';
import { json } from '../serialization';
import { resources, type Bundle } from '../types';
import { startSimServer } from '../sim/server';
import { classroomRules, World } from '../sim/world';

const b = (water: number, food: number, components: number): Bundle => ({ water: BigInt(water), food: BigInt(food), components: BigInt(components) });
// Each planet needs the other's specialty: P01 has 3 food, P02 has 3 water.
const initial = { P01: b(30, 3, 30), P02: b(3, 30, 30) };

async function run() {
  const dir = await mkdtemp(join(tmpdir(), 'bazaar-exchange-'));
  const world = new World({ runId: 'exchange-' + Date.now(), rules: classroomRules({ duration_ticks: 12n, tick_duration_ms: 300n }), stations: [
    { id: 'P01', specialty: 1, inventory: initial.P01, upkeep: b(1, 1, 1), production: Array(12).fill(2n) },
    { id: 'P02', specialty: 2, inventory: initial.P02, upkeep: b(1, 1, 1), production: Array(12).fill(2n) },
  ] });
  const players = [{ station_id: 'P01', token: 'exchange-token-p01' }, { station_id: 'P02', token: 'exchange-token-p02' }];
  const server = await startSimServer({ world, tokens: Object.fromEntries(players.map(p => [p.token, p.station_id])), tickMs: 300, autoStart: true });
  const credentials = join(dir, 'credentials.json');
  await writeFile(credentials, json({ players }), { mode: 0o600 });
  try {
    // Two separate worker processes, each with its own token and journal directory.
    const outcomes = await Promise.all(players.map(p => new Promise<{ code: number | null; output: string }>(resolve => {
      const child = spawn(process.execPath, ['--import', 'tsx', 'worker/main.ts'], { env: { ...process.env, BAZAAR_STRATEGY: 'baseline', BAZAAR_ENV_FILE: '', BAZAAR_TOKEN: '',
        BAZAAR_ENDPOINT: server.url, BAZAAR_CREDENTIAL_FILE: credentials, BAZAAR_STATION_ID: p.station_id, BAZAAR_JOURNAL_DIR: join(dir, p.station_id) } });
      let output = '';
      child.stdout.on('data', chunk => { output += chunk; }); child.stderr.on('data', chunk => { output += chunk; });
      const timer = setTimeout(() => child.kill('SIGTERM'), 30000);
      child.once('exit', code => { clearTimeout(timer); resolve({ code, output }); });
    })));
    outcomes.forEach((o, i) => assert.equal(o.code, 0, `${players[i].station_id} worker did not finish cleanly:\n${o.output}`));
    const report = world.report();
    assert.equal(report.phase, 4, 'the run finished');

    // 1. Each client's last journaled snapshot matches the server's inventory.
    const finalStates = await Promise.all(players.map(async p => {
      const folder = join(dir, p.station_id), file = (await readdir(folder)).find(f => f.endsWith('.jsonl'))!;
      const states = (await readFile(join(folder, file), 'utf8')).trim().split('\n').map(line => JSON.parse(line)).filter(e => e.kind === 'state');
      return states.at(-1).payload;
    }));
    report.stations.forEach((s, i) => assert.deepEqual(finalStates[i].self.inventory, JSON.parse(json(s.final_inventory)), `${s.station_id} client and server inventories agree`));

    // 2. Both clients saw the same transactions, and at least one was an exchange (both sides paid).
    assert.deepEqual(finalStates[0].transactions.items, finalStates[1].transactions.items, 'both parties record the same transactions');
    const exchanges = finalStates[0].transactions.items.filter((t: { give: Record<string, string>; receive: Record<string, string> }) =>
      Object.values(t.give).some(v => v !== '0') && Object.values(t.receive).some(v => v !== '0'));
    assert.ok(exchanges.length > 0, 'at least one two-sided exchange settled');

    // 3. Conservation: what one planet exported the other imported, and each
    // inventory equals start + produced - consumed + imported - exported.
    const [p1, p2] = report.stations;
    assert.deepEqual(p1.exported_total, p2.imported_total);
    assert.deepEqual(p2.exported_total, p1.imported_total);
    for (const s of report.stations) {
      const start = initial[s.station_id as keyof typeof initial];
      for (const r of resources) assert.equal(s.final_inventory[r], start[r] + s.produced_total[r] - s.consumed_total[r] + s.imported_total[r] - s.exported_total[r]);
    }
    console.log(json({ transactions: report.transactions, exchanges: exchanges.length, stations: report.stations.map(s => ({ station: s.station_id, survived: s.survived, final: s.final_inventory, imported: s.imported_total, exported: s.exported_total })), evidenceDirectory: dir }));
  } finally { await server.close(); }
}
void run().catch(error => { console.error(error); process.exitCode = 1; });
