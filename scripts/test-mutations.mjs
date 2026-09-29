import assert from 'node:assert/strict';
import { cp, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

// Small, intentional behavioral mutations; this is not an exhaustive mutation score.
const mutations = [
  {
    name: 'expired offer remains active', file: 'worker/domain.ts',
    before: 'tick < expiry', after: 'tick <= expiry',
    test: 'worker/tests/domain.test.ts', title: 'exclusive expiry includes the interval before next tick; reserve caps at run end',
  },
  {
    name: 'reconciled command remains pending', file: 'worker/state.ts',
    before: 'state.world_version < p.result.processed_version', after: 'state.world_version <= p.result.processed_version',
    test: 'worker/tests/engine.test.ts', title: 'ambiguous outcome survives reconnect; snapshot results reconcile original identity',
  },
  {
    name: 'useful incoming trades are skipped', file: 'worker/policy.ts',
    before: 'if (gained <= EPSILON) continue;', after: 'if (gained > EPSILON) continue;',
    test: 'worker/tests/scenario.test.ts', title: 'autonomous binary-protocol simulation: low-stock',
  },
  {
    name: 'answered request remains in response tracking', file: 'worker/engine.ts',
    before: 'this.sentAt.delete(requestId);', after: 'this.sentAt.get(requestId);',
    test: 'worker/tests/responsiveness.test.ts', title: 'snapshot resolves response once, even when repeated',
  },
  {
    name: 'simulator keeps an offer open on its expiry tick', file: 'worker/sim/world.ts',
    before: 'offer.expires_tick <= this.tick) this.close(offer, OfferStatus.EXPIRED)', after: 'offer.expires_tick < this.tick) this.close(offer, OfferStatus.EXPIRED)',
    test: 'worker/tests/sim-world.test.ts', title: 'expiry is exclusive: an offer expiring at tick 1 is usable at tick 0 only',
  },
  {
    name: 'simulator settles without checking the proposer can still pay', file: 'worker/sim/world.ts',
    before: 'if (!affordable(proposer.inventory, offer.give) || !affordable(station.inventory, offer.receive))', after: 'if (!affordable(station.inventory, offer.receive))',
    test: 'worker/tests/sim-world.test.ts', title: 'no reservation: a failed acceptance moves nothing and leaves the offer open',
  },
];
const root = fileURLToPath(new URL('../', import.meta.url));
const workspace = await mkdtemp(join(tmpdir(), 'bazaar-mutations-'));
try {
  // All edits and reports live in a disposable copy, including on failure.
  for (const path of ['worker', 'lib', 'package.json', 'tsconfig.json', 'vitest.config.mts']) {
    await cp(join(root, path), join(workspace, path), { recursive: true });
  }
  await symlink(join(root, 'node_modules'), join(workspace, 'node_modules'), 'dir');
  async function run(mutation, mutated) {
    const reportPath = join(workspace, 'report.json');
    await rm(reportPath, { force: true });
    const titlePattern = `^${mutation.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`;
    const result = spawnSync(process.execPath, [
      join(root, 'node_modules/vitest/vitest.mjs'), 'run', mutation.test,
      '--testNamePattern', titlePattern, '--reporter=json', `--outputFile=${reportPath}`,
    ], { cwd: workspace, encoding: 'utf8', timeout: 60000, maxBuffer: 4 * 1024 * 1024 });
    assert.ifError(result.error);
    assert.equal(result.signal, null, 'A crashed/timed-out runner is not a detected mutation');
    const report = JSON.parse(await readFile(reportPath, 'utf8'));
    const tests = report.testResults.flatMap(file => file.assertionResults).filter(test => test.title === mutation.title);
    assert.equal(tests.length, 1, `Expected exactly one named test: ${mutation.title}`);
    assert.equal(result.status, mutated ? 1 : 0, result.stdout + result.stderr);
    assert.equal(tests[0].status, mutated ? 'failed' : 'passed', JSON.stringify(tests[0]));
    if (mutated) {
      assert.match(tests[0].failureMessages.join('\n'), /AssertionError/, 'Only an assertion failure counts, not setup/import errors');
    }
  }
  for (const mutation of mutations) {
    const path = join(workspace, mutation.file);
    const source = await readFile(path, 'utf8');
    assert.equal(source.split(mutation.before).length, 2, `Mutation must match exactly once: ${mutation.name}`);
    await run(mutation, false);
    try {
      await writeFile(path, source.replace(mutation.before, mutation.after));
      await run(mutation, true);
      console.log(`DETECTED: ${mutation.name}`);
    } finally {
      await writeFile(path, source);
    }
  }
  console.log(`All ${mutations.length} deliberate bugs caused the expected assertion failures; all baselines passed.`);
} finally {
  await rm(workspace, { recursive: true, force: true });
}
