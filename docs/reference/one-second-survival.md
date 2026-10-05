# Survival policies and one-second ticks

[Documentation index](../README.md)

The worker and dashboard now use local journals exclusively. Supabase clients,
configuration, database pages, migrations and the `--supabase` worker option have
been removed. No remote service participates in persistence or reporting.

## Implemented policies

Choose a policy on `/live` before starting the worker, or pass an explicit CLI
flag, for example `npm run worker -- --strategy surplus25`. Selection takes effect
at process startup. The saved dashboard selection overrides the environment
fallback, and an explicit CLI flag overrides both. Baseline remains the default.

| Policy | Intended condition | Target / reserve / extra buffer (ticks) | Lot |
| --- | --- | --- | --- |
| `baseline` | Existing standard behavior | Existing whole-run needs and baseline defaults | 6 |
| `class25` | Nine-client class demonstration at 25% surplus | Validated market-5 behavior, independent defaults, generosity off | 6 |
| `surplus50` | 50% production surplus | 16 / 2 / 4 | 6 |
| `surplus25` | 25% production surplus | 20 / 4 / 6 | 3 |
| `balanced` | Just enough supply | 8 / 2 / 0 | 2 |

These are explicit operator choices, not automatic estimates of galaxy supply.
Surplus means production relative to consumption for **each resource**, not a
sum across interchangeable units. Initial stock and timing also matter.

The three new policies share [baseline's decision engine](../../worker/policy.ts)
and use the following additions:

- Always propose at par, accept safe helpful par trades, and avoid premium
  negotiation. Their cooperative behavior does not depend on baseline's live
  generosity switch.
- Buy toward a rolling supply target plus the profile buffer, prioritizing the
  largest fractional uncovered need rather than accumulating a whole run's stock.
  Conservative observed production informs targets; promised imports do not.
- Prefer the peer we have supplied less within the profile's planning window
  when proposal survival and realized-value ranks tie. This uses settled trades
  in either role; it does not invent hidden peer health or inventory.
- Keep at most one open or pending outgoing offer per peer and four overall.
  Short two-tick offers (extended by measured server lag) release commitments
  quickly. Smaller balanced lots support recurring replenishment.
- Allow stock above the rolling target to circulate in exchanges, but retain
  baseline's reserve and forecast safety checks at every possible settlement tick.
- Donate only after conservative whole-run coverage of all our needs, from
  surplus beyond the profile buffer, at most two gifts open. Rolling coverage
  alone cannot authorize a gift. Unsafe offers are withdrawn as in baseline.

The common implementation is in [cooperative planning](../../worker/cooperation.ts)
and [policy wrappers](../../worker/survival.ts). Catalog presets initialize live,
simulation and offline checker configurations consistently; numeric environment
or scenario overrides remain available. Par pricing is enforced by the new
policies even if an old premium setting remains in the environment.

`balanced` is an initial decentralized allocation policy, not a global planner.
A worker cannot see peer inventory, health or exact production. Advertisements
and our own trade history provide incomplete signals. Atomic three-party
exchanges are not available: circular demand can still require bridge inventory
or coordinated staged transfers. Guaranteed galaxy survival needs cooperation
and feasible supply before every consumption deadline, not just sufficient totals.

## What changed in the delay path

Previously, the CLI sink awaited the local journal and Supabase uploads for
**every** record. The engine serializes appends and waits for persistence before
sending. A slow remote upload could therefore age a decision across a tick,
trigger freshness cancellation, and repeat. That path is now gone: the CLI sink
only appends to the local journal. Existing database credentials cannot enable it.

The local command fsync remains: a command must be durable before transmission
so recovery can reconcile commands without double-spending. Non-command fsync
already runs on a one-second timer, and the activity heartbeat runs independently
of policy completion. These timers and socket processing still share a worker's
main thread with synchronous journal writes. A slow disk can therefore still
cause delays; removing Supabase is not a hard real-time guarantee.

No freshness check or command recovery safeguard was removed, and decision and
response deadlines remain two seconds. This deliberately tests the effect of
removing the database path before introducing a new scheduler or persistence
architecture. There is no blind "send every second" loop: trades still require a
valid decision, current facts and server capacity.

## Reproduce the timing experiment

```sh
npm run test:one-second
# Optional longer or different-size trials:
npm run test:one-second -- --duration 120 --planets 9 --stock 10
```

The harness runs six **sequential** trials: baseline versus the corresponding
survival policy at 50%, 25% and 0% surplus. Defaults are nine planets, 60 ticks,
1000 ms per tick, seed 1, and 10 initial units of every resource. Five production
blocks span the trial. Each planet runs the real CLI in a separate process,
with its own strategy thread, token, host locks and local durable journal.
The loopback server runs outside those worker processes so fsync cannot stall
the simulation clock. Ambient worker settings and real credentials are excluded.

Evidence is written under `.local/one-second/<timestamp>`: local journals, worker
output, server reports inside `results.json`, and p95/p99/max decision, queue,
response and snapshot-to-send timing. The report also counts actual sends,
cancellations, missed deadlines, stale states, trades and survivors. Total wall
time includes child startup and shutdown; `serverClockMs` measures the active run.
Timing uses monotonic journal timestamps from received snapshots, not unseen upstream network delay.
Heartbeat gaps include readiness/startup and are not trading-only measurements.

The command fails on missing trades/sends, worker errors, stale state, missed
deadlines, incomplete send-timing evidence, send-age p99 of at least one second,
or a simulation clock more than 10% off the requested duration. Survival is reported separately from timing. Successful completion
must not be read as proof that every station survived. Likewise, a 60-tick test
is a useful regression check, not evidence covering every seed or longer run.

An initial shared-process trial was rejected as timing evidence: its 60 ticks
took about 88 seconds because simulator and journal writers shared an event loop.
Use only the independent-process results below when assessing one-second support.

## Next steps if delays persist

Measure local append/fsync duration and journal queue age separately from policy
runtime. If disk latency dominates, move journal serialization and writes to an
ordered writer thread, keeping a compact durable command/recovery transaction
before send. Bound and coalesce noncritical metrics; never drop command outcomes.
A shorter warmed-up decision budget and coalesced monotonic planning scheduler
can be evaluated next. Do not bypass stale-state validation or recovery to force
more sends. Test reconnects, disk stalls and crashes around transmission before
changing those safeguards.

## Measured results — 2026-10-05

[Machine-readable results](one-second-results.json). Nine planets per trial;
all six trials had 9/9 survivors, zero worker errors, zero stale-state events
and zero decision/response deadline misses. Active server clocks ran for
60.03–60.49 monotonic seconds for 60 ticks.

| Surplus | Strategy | Trades | Total shortage ticks | Monotonic send age p95 / p99 / max (ms) |
| --- | --- | --- | --- | --- |
| 50% | `baseline` | 154 | 1 | 69.7 / 133.1 / 772.6 |
| 50% | `surplus50` | 392 | 2 | 79.5 / 123.1 / 999.7 |
| 25% | `baseline` | 141 | 9 | 75.6 / 127.1 / 938.5 |
| 25% | `surplus25` | 467 | 0 | 132.2 / 219.2 / 855.4 |
| 0% | `baseline` | 148 | 47 | 52.1 / 704.7 / 880.2 |
| 0% | `balanced` | 593 | 4 | 85.0 / 117.0 / 953.8 |

The new 25% and balanced policies improved shortage counts in these runs. The
50% policy traded more, but did not reduce shortages compared with baseline;
trade count itself is not the goal. All policies preserved collective survival
in this small experiment, which is not a guarantee for different seeds or peers.

Every recorded send age was below one second on the monotonic clock. The
initial analysis incorrectly used UTC wall timestamps and reported outliers
of 2–3 seconds. For example, a surplus50 acceptance showed 2028 ms on wall time
but 17.425 ms between the corresponding `mono` stamps. The corrected harness
uses monotonic journal timestamps, matching the engine's timing metrics; original
wall-clock results are retained for comparison.

There is a real measurement limit: each full run spanned approximately 66.4–66.8
wall-clock seconds versus 60.0–60.5 monotonic seconds. We did not independently
distinguish time corrections from host suspension. A co-located server cannot
prove a strict real-time guarantee against an external host in those conditions.
The harness now reports both server clocks. Some trials also overlapped repository
checks. No before/after run against a real Supabase deployment was performed.

The supported conclusion is that local-only workers sustained trading through
configured one-second ticks without a remote persistence dependency or measured
monotonic backlog. This does not prove the cause of a previous live incident,
nor eliminate synchronous local disk I/O as a possible future bottleneck.

Raw evidence remains under `.local/one-second/2026-10-05T17-04-58-415Z`, including
`results.json`, `results-wall-clock.json`, `outliers.json`, and `clock-spans.json`.
The original benchmark's `wallMs` included journal analysis; it must not be used
as the game-clock measurement. The reusable harness now streams analysis and
measures process wall duration before analysis. A fresh six-trial, three-planet,
five-tick smoke run also passed with the corrected monotonic harness.

At the time of this experiment, 512 tests, 100% coverage, TypeScript, ESLint, production build and
the supplied protocol validator passed. The audit integration test now runs at
one-second cadence; its old 150 ms ticks could finish before thread startup under
heavy parallel test load. Final coverage used two test workers to avoid resource
contention with journal analysis.

For the subsequent 120-tick, stock-30 class trials and dedicated `class25` result,
see the [nine-client guide](../operations/nine-clients.md). The six-case table
above remains the original 60-tick, stock-10 evidence. Current test counts and the
verified constrained-memory build command are in [testing](../testing.md).
