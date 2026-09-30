# Connection lifecycle and failure diagnosis

[Documentation index](../README.md)

The worker prints one `[lifecycle]` line each time its connection stage
changes, and one diagnosis line for every failure. Both are also journaled:
`lifecycle` records hold each change, and `failure` records hold each
diagnosis. Nothing printed includes tokens, credential-file contents or raw
exception text.

## Lifecycle stages

```text
[lifecycle] starting -> connecting: Opening the WebSocket connection
[lifecycle] connecting -> connected: WebSocket open with bazaar.protobuf.v2; waiting for the first snapshot
[lifecycle] connected -> authenticated (tick 0, READY): Snapshot received as P01; waiting for readiness confirmation
[lifecycle] authenticated -> synchronized (tick 0, READY): Run is READY; waiting for it to run
[lifecycle] synchronized -> participating (tick 0, RUNNING): Run is RUNNING; trading
[lifecycle] participating -> finished (tick 4, FINISHED): Run FINISHED; no further trading is possible
```

| Stage | Meaning | Evidence |
| --- | --- | --- |
| `starting` | The process is running; no socket yet | First line printed |
| `connecting` | The socket is opening | |
| `connected` | The WebSocket is open and the server selected `bazaar.protobuf.v2` | `ws-open` record |
| `authenticated` | The server sent a valid snapshot for our station | First `state` record on the connection |
| `synchronized` | Readiness was confirmed for that snapshot, but we are not trading: the run is `READY` or `PAUSED`, or our station has failed | `readiness` record |
| `participating` | Synchronized while `RUNNING`: decisions and commands flow | `decision` records |
| `stale` | Synchronized and `RUNNING`, but no snapshot within the staleness window | `lifecycle` record with `snapshot_age_ms` |
| `disconnected` | The socket closed; the worker is reconnecting | Diagnosis line with the retry delay |
| `finished` | The run is `FINISHED` or `ABORTED`; the worker exits 0 | `run-summary` record |
| `failed` | A final failure; the worker exits with the category's code | `failure` record |
| `stopped` | Stopped by SIGINT/SIGTERM | `run-summary` record |

Each stage requires the ones before it on the current connection. A reconnect
starts again at `connecting`. Every `lifecycle` record includes the connection
epoch, tick, phase and the age of the latest snapshot.

**Stale state.** While `RUNNING`, the server sends a snapshot at least every
tick. The worker allows `max(5 s, 3 × tick_duration_ms)`. When that window
passes with no snapshot, it moves to `stale` and sends one `sync`. A live
server always answers a sync, so any snapshot returns the worker to
`participating`. If nothing arrives for twice the window, the worker records
`stale-reconnect` and reconnects. Silence during `READY` or `PAUSED` is
normal and never counts as stale. The worker keeps the tick-based checks it
already had: pending commands still get their own response deadlines (see
[worker operations](worker.md)).

## Failure categories

Every failure prints one line in this form:

```text
[category] CODE: what happened. Next step: what to check.
```

| Category | Exit code | Examples | Retried? |
| --- | --- | --- | --- |
| `configuration` | 2 | `MISSING_ENDPOINT`, `INVALID_ENDPOINT`, `MISSING_TOKEN`, `CREDENTIAL_FILE_UNREADABLE`, `UNKNOWN_STATION`, `ENV_FILE_UNREADABLE`, `INVALID_OPTIONS`, `INVALID_POLICY_SETTING`, `HTTP_404` | No |
| `authentication` | 3 | `HTTP_401`/`HTTP_403` (bad token), `INVALID_AUTHENTICATION`, `SESSION_FENCED` (the token was used elsewhere), `STATION_CHANGED` | No |
| `protocol` | 4 | `SUBPROTOCOL_MISMATCH`, `HTTP_400`, `UNDECODABLE_FRAME`, `TEXT_FRAME`, `UNSUPPORTED_VERSION`, `RUN_MISMATCH`, `RUN_CHANGED`, `BAD_MESSAGE`, `REQUEST_ID_CONFLICT`, TLS errors | No |
| `network` | 5 | `ECONNREFUSED`, `ENOTFOUND`, `ETIMEDOUT`, `ECONNRESET`, `HANDSHAKE_TIMEOUT`, `HTTP_5xx`, `CLOSE_<code>` | Yes, with backoff |
| `application` | 6 | `LOCK_HELD`, `JOURNAL_UNREADABLE`, `PERSISTENCE_FAILED`, `STRATEGY_TIMEOUT`, `COMMAND_TOO_LARGE`, `RUN_TOO_LONG`, `UNEXPECTED` | No |

Exit code 0 means the run finished, or the worker was stopped cleanly.
Exit code 1 means a stop with unresolved persistence.

Network failures are the only kind that can clear up without anyone acting.
The worker reconnects after 0.5, 1, 2, 4, 8, then every 10 seconds, and prints
the cause each time:

```text
[network] ECONNREFUSED: Nothing is accepting connections at the endpoint. Next step: Check the server is running and the host and port in BAZAAR_ENDPOINT. Reconnecting in 1000 ms (attempt 2).
```

A second Ctrl+C or SIGTERM during shutdown does not force an exit: the
worker still waits for durable records and releases its locks. Only SIGKILL
skips that, and it leaves a stale lock that you must remove by hand (see
[worker operations](worker.md)).

`application` means our own worker or host is at fault, not the server.
Command rejections such as `INSUFFICIENT_RESOURCES` are normal gameplay
results, not connection failures, and never stop the worker.

## Demonstrate it

```sh
npm run test:diagnostics
```

This runs the unchanged worker CLI as a separate process against 14 prepared
failures and prints `PASS`/`FAIL` for each. It uses the local
[simulation server](../reference/simulator.md), deliberate server faults, and
broken configurations. For each case it checks the printed category and code,
and the exit code where the failure is final. It covers:

- **Configuration:** no endpoint, an `http://` endpoint, and a station missing
  from the credential file
- **Authentication:** a wrong token
- **Protocol:** the server selects another subprotocol, or sends undecodable
  bytes
- **Network:** nothing listening, an unresolvable host, and a server failing
  with HTTP 503
- **Application:** a torn journal, a second worker using the same token, and
  two workers sharing one journal directory
- **Lifecycle:** every stage in order through a finished run, and a server
  that goes silent mid-run (stale, then sync, then reconnect)

The evidence directory printed at the end keeps each case's journal. Every
case uses its own simulated server, token and journal directory, so a worker
already running on the host does not interfere.

To reproduce a single fault by hand, start the simulator with `--fault`:

```sh
npm run sim:server -- --planets 3 --fault subprotocol   # or http-401, http-503, garbage, silent-after=5
```
