# Journal tools: status, trace and run report

[Documentation index](../README.md)

Three read-only commands turn a worker journal into answers. They need no
server, credentials or database, and they work on a journal that is still
being written. Each one reads the newest file in `.local/journal` by default.
Pass `--journal FILE` for a specific file or `--dir DIR` for another
directory.

| Command | Answers |
| --- | --- |
| `npm run journal:status` | What is the worker doing right now? |
| `npm run journal:trace -- --offer ID` or `--request ID` | What happened to this offer or command, and why? |
| `npm run journal:report` | How did the run go? |

The [dashboard](../setup/dashboard.md) shows the same status live at `/live`
and the same report, with charts, for every journal at `/runs`.

Add `--json` for machine-readable output, or `--out FILE` to write the
result to a file. Each tool streams the journal, so a 200 MB class-run
journal takes about a second. If the last line is only partly written,
because the worker is live or was interrupted, it is skipped with a note.

## Status

```sh
npm run journal:status -- --follow     # refresh every second
```

```text
Run sim-1-99eeba58 as P01
Worker:     running; last record 0.0 s ago
Lifecycle:  participating for 4.7 s: Run is RUNNING; trading
Clock:      tick 37/80, RUNNING, connection epoch 1, latest snapshot 0.0 s ago
Health:     100
Reserves:   water 21/2, food 43/2, components 47/2
Pending:    none
Open offers:
  offer-190  to P03: we pay 6 water, get 6 components; expires tick 38 (1 left)
  offer-195  to P02: we pay 4 components, get 6 food; expires tick 39 (2 left)
Recent trades:
  tick 35  our offer to P02: paid 2 water, got 2 food (tx-191)
  tick 34  our offer to P03: paid 6 water, got 6 components (tx-186)
  tick 30  accepted from P02: paid 6 water, got 6 food (tx-161)
```

This output was captured mid-run from a six-planet simulation (trade list
shortened). The first line also names the strategy when the journal has
the worker's manifest record.

- **Worker** shows whether the process is still writing. A live worker
  records at least once a second. Otherwise it reports how the worker
  exited, or that it has been silent for too long (crashed, killed or hung).
- **Lifecycle** is the connection stage from
  [diagnostics](diagnostics.md). `STALE` marks a snapshot older than the
  staleness window while the run is `RUNNING`.
- **Reserves** compare stock with the strategy's hard floor: `reserveTicks`
  of upkeep, capped at the ticks left in the run.
- **Pending** lists commands with no authoritative result yet. `uncertain`
  means the two-second response deadline has passed and a sync was requested.
- **Open offers** and **Recent trades** are shown from our side: what we pay
  and what we get, whoever proposed the offer.

## Trace one offer or command

```sh
npm run journal:trace -- --offer offer-1824
npm run journal:trace -- --request 2fd700fd-cbd2-4a4a-b728-ebd0b0b9e23e
```

A trace answers five questions from the journal alone:

1. **What we knew:** inventory and health in the snapshot each decision
   used, cited by tick and snapshot sequence.
2. **What we decided:** every decision made while the offer was open to us,
   with runs of identical verdicts collapsed.
3. **Why:** the strategy's verdict for the offer, `accept` or `pass`, with
   the reason and its value to the plan.
4. **What we sent:** the command and its request ID, when it was sent, and
   any missed response deadline.
5. **What the server confirmed:** the result code, the offer's status
   changes, and the transaction with our inventory before and after.

`--request` follows a command. When that command created or acted on an
offer, the trace covers the offer too.

The strategy records a verdict for every open incoming offer in each
decision's explanation, under `inbound`. Pass reasons are:

- below par
- no value gain at current plan values
- unsafe (breaches the reserve, brings failure earlier, or lowers health
  while below reserve)
- pays with resources the plan cannot spare
- no command capacity left this tick
- an identical command is already awaiting its result
- cooling down after an identical attempt
- safe and valuable, but ranked below the chosen action

A decision that stopped before evaluating offers, such as an engine wait for
reconciliation, says so. Each decision record also carries the request ID of
the command it produced. A decision whose command was never sent, because a
newer state or result arrived first, is marked "superseded before sending".

Journals written before these changes (the class runs up to run-42) have no
verdicts. Their traces label each decision `UNRECORDED` and show the decision
that was chosen instead. They still show the command, result and settlement.
Here is a real example from run-42:

```text
Offer offer-1824: P06 -> P09 (incoming): we pay nothing, get 1 food; expires tick 80
What we sent
  request 2fd700fd-…: accept offer offer-1824
    decided at tick 79 (snapshot 696): Accept a safe inbound gift.
    sent at 2026-09-28T13:26:59.725Z; no result after 2 s, sync requested at 2026-09-28T13:27:01.726Z
    server result: REJECTED EXPIRED at tick 83 (world version 1836); processed 4 ticks after the decision
What the server confirmed
  tick 80 (snapshot 697): EXPIRED
```

The gift was accepted in time, but the server processed the acceptance four
ticks later, after the offer had expired.

## Run report

```sh
npm run journal:report -- --journal .local/journal/<run>.jsonl --out .local/run-40.md
```

The Markdown report has these sections:

- **Outcome:** survival or first failure tick, final health, health lost,
  final inventory, collective success, and whether the run summary was written
- **Resources and health:** closing stock and health per tick, with every
  shortage tick shown (`--json` has every tick)
- **Shortages** per resource: ticks short, units missing, first shortage,
  longest streak, and lowest stock
- **Completed trades,** totalled per counterparty and listed by tick
- **Rejected requests,** grouped by result code with example commands, plus
  control errors
- **Disconnected periods:** from each close to the next snapshot, with
  duration, ticks missed, close code, diagnosed cause and reconnect attempts;
  also stale periods
- **Responsiveness:** decisions and waits, server response and decision time
  medians and p95, missed deadlines, and cancelled or uncertain commands

On the class-run journals, the reports reproduce the facts in
[live run learnings](../live-run-learnings.md):

- **run-40:** water ran out from tick 83, and P09 failed at tick 103.
- **run-39:** 39 `STATION_FAILED` rejections, and 4 offers already expired
  when the server processed them.
- **run-37:** four lobby disconnects about two minutes apart.

Older journals have no response-time samples, so those rows read `n/a`.

## Tests

`worker/tests/audit.test.ts` uses a hand-written journal whose expected values
are worked out in its comments. It checks, among other things:

- status at two points in a run
- the full text of a trace, including a superseded decision and a result
  processed one tick late
- every report section
- the damaged-journal rules: a torn final line is skipped, and damage
  anywhere else is an error

A final test runs three real workers through a simulated run. It checks that
every command names the decision that produced it, and that the report's
trades and final inventory match the simulation server's own records.
`worker/tests/verdicts.test.ts` covers each verdict reason with an incoming
offer whose outcome can be checked by hand.
