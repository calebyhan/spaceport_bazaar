# Testing and verification

[Documentation index](README.md)

Use Node 22 and install the locked dependencies with `npm ci`.

| Command | Checks |
| --- | --- |
| `npm test` | Full application coverage suite, TypeScript, ESLint |
| `npm run test:worker` | Worker unit tests and deterministic binary-protocol simulations |
| `npm run test:coverage` | All unit tests with coverage, including dashboard and CLI |
| `npm run test:validator` | Real Linux validator and worker subprocess on loopback; asserts all ten steps and final inventory |
| `npm run check` | TypeScript and ESLint |
| `npm run build` | Next.js production compilation |
| `npm run proto:generate` | Regenerate bindings after a schema change; rerun verification afterward |

## Coverage scope

Vitest's V8 provider measures every TypeScript application file under `app/`,
`lib/`, and `worker/`, including files that no test imports. Generated Protobuf
bindings and test code are excluded. CSS, SQL migrations, shell scripts,
dependencies, and supplied validator binaries are outside this TypeScript
coverage metric. Every measured file must reach 100% statements, branches,
functions, and lines; `npm test` fails if any threshold regresses. No coverage
ignore directives are used. The real validator remains a separate integration check.

Reports are generated in ignored `coverage/`: open `coverage/index.html` for
annotated source, or read `coverage-summary.json` and `coverage-final.json` for
machine-readable results. Coverage is a regression signal, not proof that a
strategy is safe in every possible market.

## Test quality

Tests assert observable outcomes: exact resource quantities and request IDs,
policy ordering, retained liabilities, no sends after persistence failure,
query scoping, database record contents, response status, and rendered content.
Boundary cases include expiry, capacity, permanent failure, malformed messages,
stale observations, delayed persistence, restart recovery, and shutdown.

Worker simulations use the real binary codec, policy and engine. Persistence
unit tests use real temporary files; Supabase adapter tests intercept HTTP with
synthetic responses and make no remote database writes. CLI unit tests isolate
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
