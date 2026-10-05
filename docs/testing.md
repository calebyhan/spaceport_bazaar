# Testing and verification

[Documentation index](README.md)

Use Node 22 and install the locked dependencies with `npm ci`.

| Command | Checks |
| --- | --- |
| `npm run test:strategies` | Strategy selection, offline scenario validation, CLI and adapter isolation |
| `npm run strategy:check -- --input examples/strategies/incoming-gift.json` | Check a real policy decision from JSON without a server or app |
| `npm run test:responsiveness` | Focused timing, no-action, liveness, deadline and worker-thread concurrency regressions |
| `npm run verify:responsiveness` | Focused suite, full coverage, TypeScript, ESLint, production build and local validator |
| `npm run test:mutations` | Isolated deliberate bugs must fail named assertions; unchanged baselines must pass |
| `npm test` | Full application coverage suite, TypeScript, ESLint |
| `npm run test:worker` | Worker unit tests and deterministic binary-protocol simulations |
| `npm run test:coverage` | All unit tests with coverage, including dashboard and CLI |
| `npm run test:validator` | Real Linux validator and worker subprocess on loopback; asserts all ten steps and final inventory |
| `npm run test:exchange` | Two real worker processes trade on the local simulator; checks each client against the server ledger, both sides of every transaction, and conservation |
| `npm run tournament` | Scores catalog strategies on the simulator; see [tournament](reference/tournament.md) |
| `npm run test:diagnostics` | Real worker process against 14 failures; checks each diagnosis category, exit code and lifecycle order; see [diagnostics](operations/diagnostics.md) |
| `npm run journal:status`, `journal:trace`, `journal:report` | Read-only views of a journal; see [journal tools](operations/journal-tools.md) |
| `npm run sim:server` | Local multi-planet simulation server for trading behavior; see [simulator](reference/simulator.md) |
| `npm run check` | TypeScript and ESLint |
| `npm run build` | Next.js production compilation |
| `npm run proto:generate` | Regenerate bindings after a schema change; rerun verification afterward |

## Coverage scope

Vitest's V8 provider measures every TypeScript application file under `app/`,
`lib/`, and `worker/`, including files that no test imports. Generated Protobuf
bindings and test code are excluded. CSS, SQL migrations, configuration and verification scripts,
dependencies, and supplied validator binaries are outside this TypeScript
coverage metric. Every measured file must reach 100% statements, branches,
functions, and lines; `npm test` fails if any threshold regresses. No coverage
ignore directives are used. The JavaScript strategy-thread bootstrap is exercised by real worker-thread tests;
its policy implementation is covered by direct policy tests. The real validator
remains a separate integration check.

Reports are generated in ignored `coverage/`: open `coverage/index.html` for
annotated source, or read `coverage-summary.json` and `coverage-final.json` for
machine-readable results. Coverage is a regression signal, not proof that a
strategy is safe in every possible market.

## Test quality

Tests assert observable outcomes: exact resource quantities and request IDs,
policy ordering, retained liabilities, no sends after persistence failure,
journal scoping, record contents, response status, and rendered content.
Boundary cases include expiry, capacity, permanent failure, malformed messages,
stale observations, delayed persistence, restart recovery, and shutdown.

Worker simulations use the real binary codec, policy and engine. Persistence
unit tests use real temporary files; there is no database adapter. CLI unit tests isolate
socket and process boundaries so reconnect and failure paths are deterministic.
The separate validator check covers the real CLI and WebSocket integration.

Dashboard tests await the page's data-loading function and render its returned
React tree. These are server rendering unit tests, not Next.js browser or React
Server Component integration coverage. The production build checks framework
integration. Local tests do not validate a remote project's permissions.

Keep fixtures independent of the decision logic. Prefer explicit expected
results to reproducing the implementation in a test. Restore environment,
mocked timers, and globals after each test. Never use live credentials in tests.
Documentation link checks prevent local Markdown links from breaking when
pages move; add each new guide to the documentation index.

## Mutation checks and simulation regressions

Run `npm run test:mutations` after `npm test`. It copies the worker into a temporary
workspace, links installed dependencies, and checks six deliberate bugs: inclusive
expiry, retaining an already reconciled command, skipping useful incoming trades,
tracking a request after its response, and two simulator rule bugs (expiring an
offer one tick late, settling when the proposer can no longer pay). Each unchanged named test must pass;
each mutated version must fail an assertion. Missing tests, runner crashes,
compilation errors, and timeouts do not count as detected bugs. Source files in
your checkout are never changed. This is a focused mutation smoke check, not an
exhaustive mutation score or proof that every possible bug is detected.

The three binary-protocol simulations now assert fixed command counts, final
inventory, health, all seven observed ticks, completed phase and cleared pending
commands. Their expected values are literal fixtures, not calculated using the
policy's arithmetic. The health outcomes agree with the previously documented
six-tick runs in the [worker guide](operations/worker.md); these are successful
baseline scenarios, not newly discovered historical failures.

Existing regressions preserve the previously reproduced false response deadline
after a prompt result (`response cancels deadline without a snapshot` in
`worker/tests/responsiveness.test.ts`) and stale sends while socket updates are
queued (`queued socket observations run before send` in
`worker/tests/engine.test.ts`). Rejected settlements, losing withdrawal races,
rate limits, persistence failures, and reconnect reconciliation also have explicit
state/decision assertions. There is no archived corpus of external failed
simulation runs in this checkout; do not claim those runs have been replayed.

For each future failed simulation, preserve its initial state, policy/configuration,
ordered incoming events, and seed if randomized. Minimize it into a deterministic
fixture/test, record the failure source in a comment, and assert the correct
action and resulting state (including no action where appropriate). First run it
against the faulty implementation and confirm an assertion failure, then keep it
passing with the fix. Use the offline scenario format for single decisions and
the engine harness for sequences, races, or reconciliation. Do not simply update
expected outputs to match a failing run. Add a focused mutation when feasible so
reintroducing that failure remains demonstrably detectable.
