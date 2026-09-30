# Local simulation server

[Documentation index](../README.md)

A local, multi-planet Bazaar server for testing trading behavior. It speaks
the same `bazaar.protobuf.v2` WebSocket protocol as the classroom server, so
the unchanged worker connects to it. Use the supplied validator for protocol
compatibility checks and this server for trading behavior. It is our own model
of the documented rules, not the classroom server.

| File | Role |
| --- | --- |
| [`worker/sim/world.ts`](../../worker/sim/world.ts) | Rules: commands, results, ticks, failure, visibility. No I/O. |
| [`worker/sim/economy.ts`](../../worker/sim/economy.ts) | Seeded, balanced production schedules for any number of planets. |
| [`worker/sim/server.ts`](../../worker/sim/server.ts) | WebSocket transport: authentication, readiness, sessions, tick clock. |
| [`worker/sim/main.ts`](../../worker/sim/main.ts) | `npm run sim:server` command. |

## Run it

```sh
npm run sim:server -- --planets 3 --duration 40 --tick-ms 200 --port 3100 --start-after-ms 5000
```

The server writes `.local/sim/credentials.json` in the validator's format,
including the endpoint, so the worker needs no code or configuration changes:

```sh
BAZAAR_ENDPOINT=ws://127.0.0.1:3100/ws \
BAZAAR_CREDENTIAL_FILE=.local/sim/credentials.json \
BAZAAR_STATION_ID=P02 BAZAAR_JOURNAL_DIR=.local/sim/journal npm run worker
```

The run starts once every planet has sent `ready: true`, or after
`--start-after-ms` if given. With one worker and three planets, as above, the
run starts after 5 seconds. The worker prints each lifecycle stage and exits
by itself when the run finishes. Planets without a client never advertise or
trade, so ours has nobody to trade with. Each planet's 30 starting units of
the resources it does not produce last 30 ticks, so in this 40-tick example
all three planets fail at tick 40. Connect a worker for every planet to see
real trading.

Several workers may run on one host as long as each uses its own token and
its own `BAZAAR_JOURNAL_DIR`; a shared token or journal directory is refused
with `LOCK_HELD`. For example, for three planets:

```sh
for p in P01 P02 P03; do
  BAZAAR_ENDPOINT=ws://127.0.0.1:3100/ws BAZAAR_CREDENTIAL_FILE=.local/sim/credentials.json \
  BAZAAR_STATION_ID=$p BAZAAR_JOURNAL_DIR=.local/sim/journal-$p npm run worker &
done
```

`npm run test:exchange` automates the two-planet case: two worker processes
trade water for food, and the check compares each client's final state with
the server's records. See [testing](../testing.md). For many planets and
strategies, use the [tournament](tournament.md), which runs clients inside
one process. When the run finishes, the server prints each
planet's outcome and writes `.local/sim/report.json`. The report contains
server-side facts that no client sees, such as every planet's final inventory,
health lost and first failure tick.

| Option | Default | Meaning |
| --- | --- | --- |
| `--planets` | 9 | Number of planets, at least 3 |
| `--seed` | 1 | Production schedule seed |
| `--duration` | 120 | Run length in ticks |
| `--surplus` | 50 | Production above total upkeep, percent |
| `--block` | 24 | Ticks per production block |
| `--stock` | 30 | Starting units of each resource |
| `--tick-ms` | 500 | Real time per tick, at least 10 ms |
| `--host`, `--port` | 127.0.0.1, 3100 | Listen address; port 0 picks a free port |
| `--credentials`, `--report` | `.local/sim/…` | Output files; credentials are written with mode 0600 |
| `--start-after-ms` | none | Start without waiting for every planet |
| `--fault` | none | Deliberate fault for diagnostics: `http-STATUS`, `subprotocol`, `garbage`, or `silent-after=TICK` |

## What it implements

These rules come from the [handbook](protocol.md), the
[validator guide](../../artifacts/bazaar-protobuf-starter-linux/README.md) and
[observed mechanics](../game-mechanics-learnings.md). Each has a test in
`worker/tests/sim-world.test.ts` whose expected numbers were worked out by hand:

- **Tick order:** expire offers and advertisements, add production, consume
  upkeep, then apply damage (units missing × damage per unit) or recovery,
  capped at max health. Uses the handbook's (2,0,1) + 3 water example.
- **Atomic exchange:** the handbook's 6 water for 5 food example, with both
  parties' inventories, trade totals, transaction and versions.
- **Exclusive expiry:** an offer expiring at tick 1 settles at tick 0 and is
  `EXPIRED` from tick 1; a later accept returns `EXPIRED`.
- **No reservation:** posting checks affordability but locks nothing. A failed
  acceptance returns `INSUFFICIENT_RESOURCES`, moves nothing and leaves the
  offer open. A competing acceptance can spend the same stock first.
- **Roles:** only the recipient accepts (`INVALID_ARGUMENT` for the proposer,
  `NOT_FOUND` for others), and only the creator withdraws.
- **Offer validation:** a positive give, no resource on both sides, a known
  other station, and an expiry after the current tick, within the offer TTL,
  and no later than the run's end. Gifts are allowed.
- **Limits:** the per-tick command quota (`RATE_LIMITED` with
  `retry_after_tick`), the open outgoing offer cap (`LIMIT_REACHED`), and
  stored request capacity (`REQUEST_CAPACITY_EXCEEDED` control error, with no
  result or state change).
- **Request identity:** an exact retry returns the stored result without
  acting again or advancing `world_version`. Reusing an ID with different
  content returns `REQUEST_ID_CONFLICT`.
- **Advertisements:** one active per planet, replaced by a new one, withdrawn
  by its owner, and expired at their deadline.
- **Permanent failure:** mirrors the validator's station-failure scenario.
  Reaching zero health sets `failed_once` and `first_failure_tick`, withdraws
  every open offer and advertisement involving the planet, and rejects its
  commands and offers to it with `STATION_FAILED`. Production and recovery
  continue.
- **Visibility:** a planet sees its own observation, offers, transactions and
  results, plus every active advertisement and the directory. It never sees
  other planets' inventory, health, specialty, or private trades.
- **Run end:** `FINISHED` at `duration_ticks`, and an outcome reporting
  collective success.

`worker/tests/sim-server.test.ts` covers the network layer:

- HTTP 401 for bad or missing tokens, and HTTP 400 without the subprotocol
- `BAD_MESSAGE` for text frames, undecodable bytes, invalid request IDs, and
  commands before readiness
- the session is closed on a wrong protocol version or run ID
- a new connection fences the old one
- readiness and auto-start
- private states for both parties to an exchange, and public states for an
  advertisement
- stored retries, capacity limits, and the tick clock

The final test runs three real worker engines, using the baseline strategy,
through a balanced run. It checks that no protocol errors occur and that each
client's final inventory equals the server's ledger. `npm run test:mutations`
confirms two deliberately introduced simulator bugs cause test failures: expiring an offer one
tick late, and settling when the proposer can no longer pay.

## Balanced economy

Specialties rotate water, food, components, so each resource gets
`planets / 3` producers, rounded as evenly as possible. Every planet has upkeep of 1 of
each resource. Each producer's average output is sized so that total production of every
resource is exactly upkeep × planets × (1 + surplus) over the run. For
example, 9 planets over 120 ticks at 50% surplus produce 1620 units of each resource,
540 per producer. Tests check the exact totals for 3, 4, 7, 9 and 12 planets,
including uneven producer counts.

Output follows the shape seen in live runs 39 and 40: 24-tick blocks averaging
4.5, 1.5, 6, 6 and 4.5 units per tick relative to a 4.5 mean. Each planet gets
these blocks in its own seeded order. Carried fractions give the live pattern
of alternating 4 and 5. Totals are exact when the duration is a multiple of five blocks.
Otherwise the partial pattern shifts a planet's total slightly.

## Assumptions and omissions

Treat simulation results as hypotheses. The live server may differ here:

- **Production schedule.** The block shape is inferred from two runs of our own
  planet. Other planets' real schedules are unknown.
- **Rejected commands.** Every new request ID stores a result, including
  rejections, and counts toward the per-tick quota. A new request advances
  `world_version` even when rejected.
- **Result codes.** Accepting an expired offer returns `EXPIRED`, as the live
  server did in run-42, when an accept processed four ticks late was
  rejected. Accepting any other closed offer, or withdrawing any closed
  object, returns `NOT_OPEN`.
- **Run end.** Offers and advertisements may not outlive the run, so they
  all expire by the final tick and none is marked `RUN_ENDED`.
- **Message checks.** Unknown Protobuf fields and duplicate singular fields
  are ignored by the Protobuf library rather than rejected as `BAD_MESSAGE`.
  Readiness echoes the client's `snapshot_sequence` without checking it.
- **Timing and phases.** Ticks run on a fixed timer, with no instructor pauses,
  aborts or lobby rule changes. `PAUSED` and `ABORTED` are never produced.
  Result lag is just local processing, unlike run-39's 1–3 tick delays.
- **Transport.** The server only listens on loopback by default and has no TLS
  (`wss://`). It closes client sockets abruptly when it shuts down.
- **Other planets.** They behave only as the clients connected to them do; the
  simulator adds no built-in counterparties.
