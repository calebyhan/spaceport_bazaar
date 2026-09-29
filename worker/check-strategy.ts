import { readFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { checkScenario } from './scenario';
import { json } from './serialization';

async function main() {
  const { values } = parseArgs({ options: { input: { type: 'string' }, strategy: { type: 'string' } } });
  if (!values.input) throw new Error('Usage: npm run strategy:check -- --input FILE [--strategy NAME]');
  const report = await checkScenario(JSON.parse(readFileSync(values.input, 'utf8')), values.strategy ?? process.env.BAZAAR_STRATEGY);
  console.log(json(report));
  process.exitCode = report.passed ? 0 : 1;
}
void main().catch((error: Error) => { console.error('Scenario check failed: ' + error.message); process.exitCode = 2; });
