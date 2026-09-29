import { writeFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { json } from '../serialization';
import { newestJournal, readJournal } from './journal';
import { formatReport, ReportBuilder } from './report';
import { formatStatus, StatusBuilder } from './status';
import { formatTrace, TraceBuilder } from './trace';

const usage = 'Usage: npm run journal:<status|trace|report> -- [--journal FILE | --dir DIR] [--offer ID | --request ID] [--json] [--out FILE] [--follow]';

async function main() {
  const [command, ...args] = process.argv.slice(2);
  const { values } = parseArgs({ args, options: {
    journal: { type: 'string' }, dir: { type: 'string' }, offer: { type: 'string' }, request: { type: 'string' },
    json: { type: 'boolean' }, out: { type: 'string' }, follow: { type: 'boolean' },
  } });
  if (!['status', 'trace', 'report'].includes(command)) throw new Error(usage);
  const path = values.journal ?? newestJournal(values.dir ?? '.local/journal');
  const emit = (text: string) => {
    if (!values.out) return console.log(text);
    writeFileSync(values.out, text + '\n');
    console.error(`Wrote ${values.out}`);
  };
  const load = async <T extends { add(entry: Parameters<StatusBuilder['add']>[0]): void }>(builder: T) => {
    const { tornTail } = await readJournal(path, entry => builder.add(entry));
    if (tornTail) console.error('Note: the journal ends in a partly written line (a live or interrupted worker); it was skipped.');
    return builder;
  };
  if (command === 'status') {
    const render = async () => {
      const view = (await load(new StatusBuilder())).view(new Date());
      emit(values.json ? json(view) : `${path}\n${formatStatus(view)}`);
    };
    await render();
    // Re-reads the whole journal each second: simple and always consistent.
    if (values.follow) setInterval(() => { console.clear(); void render(); }, 1000);
  } else if (command === 'trace') {
    if (!values.offer === !values.request) throw new Error('trace needs exactly one of --offer ID or --request ID');
    const trace = (await load(new TraceBuilder())).trace({ offer: values.offer, request: values.request });
    emit(values.json ? json(trace) : formatTrace(trace, values.offer ? `offer ${values.offer}` : `request ${values.request}`));
    if (!trace.found) process.exitCode = 1;
  } else {
    const report = (await load(new ReportBuilder())).report();
    emit(values.json ? json(report) : formatReport(report));
  }
}
void main().catch((error: Error) => { console.error(error.message); process.exitCode = 2; });
