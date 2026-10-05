# Run nine independent clients

[Documentation index](../README.md)

The class demonstration runs nine clients **at the same time**, one for each
station P01–P09, using nine distinct API keys and the same strategy. The
`worker:nine` launcher defaults to `class25`; the ordinary single worker still
defaults to `baseline`. Class25 has its own configuration/version and uses the
validated market-5 decision behavior with generosity fixed off. See the
[strategy catalog](strategies.md) for all five policies.

## Test locally without the class server

Start the simulator in one terminal:

```sh
npm run sim:server -- --planets 9 --tick-ms 1000 --surplus 25 --duration 120 --stock 30 --seed 1
```

In another terminal, connect all nine clients:

```sh
npm run worker:nine -- --credentials .local/sim/credentials.json --endpoint ws://127.0.0.1:3100/ws --strategy class25
```

The simulator generates its own keys and starts when all nine clients are ready.
Allow about two minutes for the run. The server writes `.local/sim/report.json`;
the launcher prints its evidence directory and final verification result.
Repeat both commands with another simulator seed to vary production order.
Local generated keys and spreadsheet keys are separate: keep your class keys in
`.local/class-credentials.json`, not the simulator's generated file.

For an automated survival **and timing** acceptance test:

```sh
npm run test:one-second -- --strategy class25 --surplus 25 --seeds 1,2,3 --duration 120 --planets 9 --stock 30 --require-survival
```

This runs three sequential trials, each with nine simultaneous worker processes
and a separate server process at actual one-second ticks. `--require-survival`
adds collective survival to the timing/protocol gates. To reproduce the original
baseline validation, substitute `--strategy baseline`. Omitting both `--strategy`
and `--surplus` runs the six-case comparison described in the
[one-second assessment](../reference/one-second-survival.md).

## Connect to the class server

Put all nine spreadsheet keys in an ignored private file such as
`.local/class-credentials.json`. Match each key to its assigned station; enter
the raw key without a `Bearer ` prefix:

```json
{
  "players": [
    { "station_id": "P01", "token": "REPLACE_WITH_P01_KEY" },
    { "station_id": "P02", "token": "REPLACE_WITH_P02_KEY" },
    { "station_id": "P03", "token": "REPLACE_WITH_P03_KEY" },
    { "station_id": "P04", "token": "REPLACE_WITH_P04_KEY" },
    { "station_id": "P05", "token": "REPLACE_WITH_P05_KEY" },
    { "station_id": "P06", "token": "REPLACE_WITH_P06_KEY" },
    { "station_id": "P07", "token": "REPLACE_WITH_P07_KEY" },
    { "station_id": "P08", "token": "REPLACE_WITH_P08_KEY" },
    { "station_id": "P09", "token": "REPLACE_WITH_P09_KEY" }
  ]
}
```

The launcher rejects missing/duplicate stations and empty/duplicate tokens before
connecting. It does not print keys. Set `BAZAAR_ENDPOINT` in your private
`.env.worker.local` to the class WebSocket endpoint, then run:

```sh
BAZAAR_ENV_FILE=.env.worker.local npm run worker:nine -- --credentials .local/class-credentials.json
```

Stop any earlier workers using these keys first. Confirm with the operator that
the server is configured for 120 ticks, 1000 ms per tick and 25% surplus; the
client does not set those server rules. Previously tested local runs also used
30 starting units per resource and upkeep of 1 per resource per tick.

| Option | Behavior |
| --- | --- |
| `--credentials PATH` | Nine-key file; falls back to `BAZAAR_CREDENTIAL_FILE`. |
| `--endpoint URL` | Overrides `BAZAAR_ENDPOINT`; must use `ws://` or `wss://`. An endpoint in the credential JSON is not read. |
| `--strategy NAME` | Same catalog policy for all nine; default `class25`. |
| `--timeout SECONDS` | 1–3600 seconds, default 300, including lobby time. |
| `--out PATH` | Evidence directory; default `.local/nine-clients/<timestamp>`. Reusing a directory containing `launch.json` is refused. |

The launcher uses explicit strategy selection and isolates controls, credentials,
and policy settings from your ordinary single-worker environment. Saved dashboard
selection, generosity and numeric overrides do not carry into the demonstration.
Terminal preferences do carry over. Each worker gets its own journal directory.
Only P09 prints routine activity by default, in appended ten-tick summaries; see
[terminal output](worker.md#terminal-trade-activity). The dashboard retains full logs.

A startup failure or unsuccessful child exit stops the group. Ctrl-C and timeout
stop all children with SIGTERM, with a five-second SIGKILL fallback.

## Read the result

`verification.json` must report `verified: true`. Verification checks all nine
expected identities, a common run ID, a finished state at tick 120, advertised
120-tick duration and 1000 ms ticks, no planet failure, and successful collective
run summaries. Exit code zero from a worker alone is insufficient. An interrupted
or incomplete fleet run fails verification.

This report does not independently establish 25% surplus or actual tick cadence.
Use the configured server rules and the timing acceptance harness for those
checks. Journals, generated keys and raw reports stay in ignored `.local` paths.

An `HTTP_530` loop means the endpoint returned a server-side HTTP error before a
WebSocket session opened. The origin may be stopped or unreachable behind its
proxy; the status alone cannot establish the cause or validate the keys. The
worker retries automatically. See [connection diagnostics](diagnostics.md).
Local testing above remains available while the class server is unavailable.

## Recorded evidence

The [dedicated class25 trial](../reference/class25-results.json) used nine clients,
120 one-second ticks, 25% surplus, stock 30 and seed 1: 9/9 survived, with zero
shortage ticks, 192 settled exchanges, zero stale/deadline events, and 246.2 ms
snapshot-to-send p99. The [baseline trials](../reference/baseline-class-validation.md)
passed seeds 1–3 without retuning baseline. These are local results; class-server
survival and spreadsheet-key authentication remain unverified. Neither result
guarantees survival under every production schedule or network condition.
