# Measure responsiveness

[Documentation index](../README.md)

The engine records timing and activity evidence in the local durable journal.
The live dashboard and run reports read that journal directly. No remote
persistence participates in trading. Timing categories keep separate sample
counts and percentiles; missing evidence is not treated as zero latency.

## Timing boundaries

| Metric | Start → end |
| --- | --- |
| `queue` | Receipt of the latest triggering protocol message → start of strategy evaluation (or an engine no-action decision). Includes decoding, waiting behind a previous evaluation, durable input recording, and worker dispatch/startup. |
| `decision` | Policy evaluation start → completion inside the strategy worker. Engine skips have no computation sample; validator exercise computation is measured separately with `source=exercise`. |
| `response` | Command transmission → first matching authoritative result, snapshot result, or capacity rejection received by the client. Includes transport and client delivery overhead; it is not a server-only execution measurement. |
| `event` | Entry to the receive handler → completion of decoding and applying the protocol update. |

All durations use a monotonic clock (shared time origin across worker threads).
Sub-millisecond durations are retained. Queue samples describe evaluated inputs:
newer observations replace older queued observations, so this is not one strategy
execution per network message. The client cannot measure time in the network or
OS buffers before the receive callback. After a process restart, original
monotonic send timestamps are unavailable: recovered results are audited but do
not invent response-duration samples.

## Decisions and liveness

Every completed policy evaluation records its action and rationale, including
`wait`. Engine skips record explicit no-action reasons: readiness, reconciling a
command, capacity, rate-limit backoff, non-trading phase, or permanent failure.
The validator exercise also records its decisions. Prepared commands, actual
transmissions (including exact retries), cancellations and authoritative results remain separate audit
records. Old decisions cannot transmit after a newer snapshot or connection
replaces their input; changed policy memory also prevents transmission.

A one-second heartbeat records activity, reason, observation time, and the time
that activity began. It continues during policy evaluation and intentional idle
waiting. The dashboard marks evidence older than five seconds as **stalled or
telemetry delayed**, and also flags an operation exceeding its activity deadline.
This is evidence of missing progress, not a diagnosis of a failed remote server.
Heartbeats are coalesced when persistence is busy so they do not create an
unbounded heartbeat backlog. Refresh the dashboard to re-evaluate freshness.

## Deadlines and concurrent updates

Policy computation runs in a reusable Node worker thread, leaving the socket
receive loop free to apply newer states. The `busy` flag on state-update samples
means strategy evaluation is in progress, not merely that a command is pending.

The default decision deadline is two seconds, including thread startup and
handoff; exceeding it records a decision deadline, terminates the thread and
stops further trading. The default response deadline is two seconds from send.
An unanswered command records one missed response deadline and requests one
sync when connected. Results cancel that timer immediately even if a later snapshot is still
needed for reconciliation. Duplicate results and late responses cannot double
count deadlines. A reconnect retains unresolved response timing/deadlines in the
same process. Recovery after a process restart has unknown send timing and
remains visibly awaiting reconciliation without inventing a send timestamp.
Decision and response deadlines are configurable through `EngineOptions`.
Reconciliation and persistence activity are flagged after ten seconds without
completion; these health indications are distinct from counted response or
decision deadlines.

## Run the checks

From the repository root, using Node 22 and dependencies installed by `npm ci`:

```sh
# Focused regressions: timing separation, real CPU concurrency, liveness,
# no-action auditing, deadline cancellation, reconnect, duplicates and rendering.
npm run test:responsiveness

# Full coverage suite, TypeScript, ESLint, production build and real local validator.
npm run verify:responsiveness
```

The focused suite needs no credentials or running services. The full verification
also launches the supplied Linux validator on loopback; it does not contact a live
trading server or a remote database. Its final output gives the temporary evidence
directory containing the validator report and worker journal. Coverage artifacts
are written to `coverage/`.

To inspect an actual run, start the worker and open `/live` or `/runs`. Compare
timing categories independently.
