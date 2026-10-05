# Self-assessment evidence: sections 1, 2 and 6

[Documentation index](README.md)

Each row names a repeatable command, what it demonstrates, and where it is
explained. The tests run offline on Node 22 after `npm ci`, with no
credentials; only the question 21 evidence needs a class run. The ratings
are the engineers' to choose.

## 1. Launch and operate

| # | Question | Evidence | Command |
| --- | --- | --- | --- |
| 01 | Another pair can install, configure, authenticate and run without editing source | Setup, endpoint, token and strategy are runtime configuration. A fresh copy of the tree installed, tested, built and passed the validator by following the docs. | [Development](setup/development.md), [worker](operations/worker.md); `npm ci && npm test && npm run build && npm run test:validator` |
| 02 | Distinguish process running, connected, authenticated, synchronized, participating; recognise stale state | The worker prints and journals each stage. A server that goes silent mid-run moves the worker to `stale`, then one sync, then a reconnect. `journal:status` shows the stage, snapshot age and a `STALE` flag. | [Diagnostics](operations/diagnostics.md); `npm run test:diagnostics` (the "full lifecycle" and "silent server" cases) |
| 03 | Diagnostics distinguish configuration, authentication, protocol, network and application failures | Every failure prints `[category] CODE: what happened. Next step: …` and exits with the category's code (2–6). 14 failures are prepared on purpose; each must produce the expected category and exit code. | `npm run test:diagnostics` |

## 2. Observe, explain and review

| # | Question | Evidence | Command |
| --- | --- | --- | --- |
| 04 | Reserves, epoch, pending actions, open offers and recent trades in an interpretable view | A live or finished journal gives one view: lifecycle, epoch, tick, stock against reserve, pending and uncertain commands, open offers from our side, and recent trades. | `npm run journal:status -- --follow`; [journal tools](operations/journal-tools.md) |
| 05 | For one offer: what we knew, decided, why, sent, and what the server confirmed | Each decision records a verdict and reason for every open incoming offer, plus the request ID of its command. The trace joins snapshot, decision, command, result and settlement. Real example: a run-42 gift accepted at tick 79 but processed at tick 83, after it expired. | `npm run journal:trace -- --offer ID` |
| 06 | Structured logs survive a crash or run end, with identifiers linking events | The journal is fsynced before every command is sent (other records within a second). Records carry process ID, connection epoch, sequence, request ID, snapshot sequence and tick. The end-of-run summary survives reconnects. Tests replay journals from disk. | [Worker](operations/worker.md#verification-and-limits); `npm test` |
| 07 | Run summary: resource histories, trades, rejections, disconnections, shortages | The report takes about a second on a 200 MB class journal, and matches the class-run postmortems: run-40 failed at tick 103, and run-39 had 39 `STATION_FAILED` rejections. | `npm run journal:report -- --journal FILE` |

## 6. Test a functioning trading system

| # | Question | Evidence | Command |
| --- | --- | --- | --- |
| 18 | Two clients on our own server complete an exchange; inventories verified | Two separate worker processes trade water for food. Each client's final inventory must equal the server's, both clients must record the same transactions, one side's exports must equal the other's imports, and every inventory must reconcile to start + produced − consumed + imported − exported. | `npm run test:exchange` |
| 19 | Local simulation with multiple copies of our strategy, varying planet count, balanced production | Balanced economies of any size of three or more planets; exact totals are tested for 3, 4, 7, 9 and 12. The tournament runs every planet with our strategy (`everyone` mode) at 3, 6 and 9 planets, and scores it against named alternatives. | `npm run tournament`; [tournament](reference/tournament.md) |
| 20 | The test server implements the rules we depend on, shown with small hand-checked examples; omissions explained | 24 rule tests with hand-computed numbers, including the handbook's own examples and the validator's station-failure scenario. Two deliberate simulator bugs must fail named tests. Assumptions and omissions are listed. | `npx vitest run worker/tests/sim-world.test.ts`; `npm run test:mutations`; [simulator](reference/simulator.md) |
| 21 | Exchange messages and complete trades with another pair's client in a shared environment | Class runs 37, 39, 40 and 42 traded with other pairs' clients on the class server. For example, run-42 settled 122 trades with seven stations. Our server also accepts any Bazaar protobuf client, so another pair can connect to `npm run sim:server` with the tokens it writes. | [Live run learnings](live-run-learnings.md); `npm run journal:report -- --journal FILE` on a class-run journal |

## Instructor note: scoring strategies

> Since your focus is on being able to hot swap strategies in the API, and you
> already have the start to a server, see if you can also approach Task 19
> such that you can run a server that produces some ultimate scoring metric
> that you could assess your client's strategies by.

`npm run tournament` swaps strategies by name, with no code changes, on
every planet of the local server. It ranks them by collective success, our
survival, health lost, and (against a mixed field) final resources; the
[tournament page](reference/tournament.md) explains why. The server computes
every score from its own records, never from what clients report.
