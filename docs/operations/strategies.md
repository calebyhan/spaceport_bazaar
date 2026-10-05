# Select and check a strategy

[Documentation index](../README.md)

## What was already available

The baseline policy was already a pure decision function, and `Engine` already
accepted separate `Transport` and `Sink` implementations. TypeScript tests could
feed it snapshots without a server. Runtime selection was hard-coded to the
baseline, however, and there was no JSON-based command for checking a decision.

The worker now has a named strategy catalog, a shared policy contract, and an
offline scenario checker. Transport, encoding and logging use a shared JSON
serializer rather than importing a helper from the baseline trading policy.

## Select a strategy at startup

Use Node 22 and install dependencies with `npm ci`. List the available strategies
without credentials, a server, or a journal:

```sh
npm run worker -- --list-strategies
```

| Name | Behavior |
| --- | --- |
| `baseline` | Existing reserve-preserving trading policy; the default. |
| `observe` | Always returns an intentional `wait`. Useful for observing a run without submitting trades. It still performs protocol readiness and recovery. |
| `par`, `greedy`, `passive` | Simple simulation opponents (1:1 trader, 2:1 trader, accept-only). See the [tournament](../reference/tournament.md); not meant for class runs. |

## Generous mode: a live switch

The baseline has a generous mode you can turn on and off **while the worker
runs**, from the switch at the top of the dashboard's
[live view](../setup/dashboard.md). It takes effect from the worker's next
decision; no restart is needed. While it is on, the baseline:

- asks only at par (1:1) instead of opening at a premium;
- also accepts safe par offers that it pays for from whole-run spare stock,
  even when they do not raise our plan value. The proposer gains; we give up
  units we will never need; and
- gives surplus away free, once the plan is fully covered (nothing left to
  acquire). It offers whole-run spare beyond a buffer of `stockpileTicks` of
  upkeep, at most `lot` units at a time, only to stations that seek that
  resource, with at most one open gift per station and two in total.

Every trade stays at or above par, and every reserve and safety check still
applies. Our own trades rank ahead of helping accepts, and both rank ahead of
giveaways, so a gift only uses a command nothing else needs. Each decision's
explanation in the journal records `generous: true|false`.

Giveaways wait for full cover because, before that, surplus is the currency
we buy our needs with. In simulation, giving water to the stations that sold
us components left us short of components; with the full-cover rule
generous mode lost no health in 6- and 9-planet tournaments. It does end a
mixed-field run with far fewer resources (about 63 against baseline's 270),
which matters if prizes go to the largest stock.

The switch is a small JSON file, `.local/controls.json` by default
(`{"generous":true}`). The dashboard replaces it atomically and the worker
reads it before every decision. A missing or unreadable file means off. Set
`BAZAAR_CONTROL_FILE` to the same path for both if you move it. Only the
baseline reads it; `observe` and the simulation opponents ignore it, and
simulation and tournament workers are never wired to it.

Choose using the CLI:

```sh
BAZAAR_ENV_FILE=.env.worker.local npm run worker -- --strategy observe
BAZAAR_ENV_FILE=.env.worker.local npm run worker -- --strategy=baseline
```

Or put this setting in your existing private worker environment file:

```dotenv
BAZAAR_STRATEGY=observe
```

Precedence is **CLI `--strategy` → `BAZAAR_STRATEGY` → `baseline`**. The worker
loads `BAZAAR_ENV_FILE` before resolving the selection. Endpoint and token setup
are unchanged; see [worker operations](worker.md). The existing `--supabase`
flag can be combined with `--strategy`. Unknown names, missing option values and
unknown CLI flags fail startup instead of silently selecting a different policy.

Selection is fixed for a worker process. To switch, stop the old worker cleanly
and restart it with the new setting, keeping the same journal. Switching never
forgets unresolved commands: they must still reconcile before any new trades.
Policy memory is recovered only from records belonging to the selected strategy.
Legacy records without a strategy tag are treated as baseline records.

`--exercise` is the validator's prescribed script, not a catalog policy. Do not
combine it with `--strategy` or a `BAZAAR_STRATEGY` environment setting; that
combination is rejected. The automated validator test isolates itself from an
ambient strategy setting.

All new journal entries carry `strategy` (`baseline`, `observe`, or `exercise`).
The Supabase event payload stores the same identity as `_strategy`; the existing
connection metadata is unchanged. No database migration is needed.

## Check a planet state and incoming offer offline

A supplied [incoming-gift scenario](../../examples/strategies/incoming-gift.json)
contains a complete state, a separate incoming offer, and independently specified
expected actions for both strategies:

```sh
npm run strategy:check -- --input examples/strategies/incoming-gift.json
npm run strategy:check -- --input examples/strategies/incoming-gift.json --strategy observe
```

The baseline must accept the offer named `gift`; observe must wait. The checker
runs the **same registered policy in the same worker-thread executor** as live
execution. It does not create a socket, engine, journal, database connection,
host lock, validator process or Next.js application. No credentials are needed.

Copy the example JSON and edit these fields:

| Field | Meaning |
| --- | --- |
| `strategy` | Optional default strategy for this scenario. CLI and `BAZAAR_STRATEGY` override it; if all are absent, baseline is used. |
| `state` | Required `Snapshot` data: rules, station inventory/health/upkeep, tick/phase, offers, advertisements and result/history collections. |
| `incomingOffer` | Optional complete offer appended to `state.offers.items`. A duplicate offer ID is rejected. Omit it when the offer is already in the state. |
| `config` | Optional positive integer overrides: any numeric `Config` field (for example `reserveTicks`, `planTicks`, `lot`, `ttl`, `cooldownTicks`, `maxInFlight`). Each must be between 1 and 10000. |
| `expected` | Required map from strategy names to complete expected actions. The selected strategy must have an entry. Both action kind and all body fields are compared exactly. |

For example, the expected-action portion is:

```json
{
  "expected": {
    "baseline": { "kind": "accept", "body": { "offer_id": "gift" } },
    "observe": { "kind": "wait" }
  }
}
```

Use decimal strings for wire-sized integers, such as `"9007199254740993"`.
Safe nonnegative integer JSON numbers are also accepted. Unsafe numeric values,
fractions, negative quantities and uint64 overflow are rejected instead of being
rounded. Identifiers remain strings, even when they look numeric. Nullable wire
fields use `{ "null": true }` or `{ "value": "123" }`; enums such as phase and
offer status use numeric values. Extra server fields inside a snapshot are
ignored, while required strategy input fields are validated. Unknown top-level
scenario/config fields and extra expected-action fields are rejected.

Each scenario starts with empty pending commands and policy memory; it tests one
fresh decision, not reconnect/readiness behavior or a sequence of cooldowns.
State offers still contribute their normal liabilities. Existing TypeScript
policy/engine tests remain the place for multi-step recovery and pending-command
scenarios. The checker shares the live two-second evaluation deadline and the
10,000-tick forecast bound.

The result on stdout is JSON containing `strategy`, `passed`, `expectedAction`,
`decision` (action, next memory and explanation), and `durationMs`. Large integers
are written as decimal strings. For machine-only output, use `npm run --silent
strategy:check -- --input FILE`, or `npx tsx worker/check-strategy.ts --input FILE`.

| Exit code | Meaning |
| --- | --- |
| `0` | Decision matches the expected action. |
| `1` | Valid scenario ran, but the decision differs; inspect the JSON report. |
| `2` | Usage, file, JSON, validation, strategy-selection or execution error. |

The offline command reads only `BAZAAR_STRATEGY` from the environment. It does
not load `BAZAAR_ENV_FILE` or live policy quantity overrides: scenario config is
explicit so a local worker environment cannot silently change a fixture.

## Extend policies independently of transport and logging

[The shared contract](../../worker/strategy-contract.ts) defines a synchronous,
pure `Policy(StrategyInput): Decision`. Inputs contain a snapshot, pending
commands, policy memory and configuration. Outputs contain an action, next
memory, and an explanation with `policyVersion` and `rationale`. Values must be
structured-cloneable; no sockets, loggers, database clients or callbacks belong
in a policy. Current memory uses the shared `attempted` map of action keys to
bigint cooldown ticks.

To add a new implementation, implement this contract in a policy module and
register its name, version, description and function in
[the catalog](../../worker/strategies.ts). Add expected actions for it to your
scenario files. Adding a new algorithm requires code; **selecting any registered
algorithm does not**. The worker thread and offline checker use this one catalog.

Transport and logging remain engine adapters:

```ts
interface Transport {
  send(bytes: Uint8Array): void;
  close(): void;
}
interface Sink {
  append(entry: RecordEntry): Promise<void>;
}
```

Choose the policy with `new Engine({ strategyName: "baseline", sink })`. Pass a
transport to `engine.connect(transport)`, then forward incoming binary frames to
`engine.receive(epoch, bytes, true)` using the returned epoch. Change the socket
adapter in [the CLI wiring](../../worker/main.ts), or supply your own adapter;
the policy files need no changes. `send` must enqueue the bytes synchronously or
throw, and the adapter must report asynchronous transport failure/disconnection
to the engine. Reconnect with a new epoch, and call `engine.stop()` followed by
`await engine.idle()` before closing persistence on shutdown.

To change log formatting, destinations or mirroring, implement/decorate `Sink`
and pass it to the engine. `append` must resolve only when its required writes
finish and reject on failure. Keep the durable `Journal` and its recovery records
in live trading; in-memory sinks and captured transports are suitable for tests.
The engine retains command persistence ordering, stale-decision checks and
responsiveness telemetry regardless of the chosen policy. The existing
`--supabase` option adds a mirror without modifying policy code.

## Verification

```sh
npm run test:strategies       # selection, offline checks, CLI, adapter isolation
npm test                     # all tests, 100% required coverage, TypeScript, lint
npm run test:validator       # existing local live-protocol integration
```

The strategy suite checks both real worker-thread policies, exact JSON integers,
expected-action mismatches, malformed inputs, environment/CLI precedence,
strategy-specific recovery, and swapping transport/log sinks without changing
the trading policy. The supplied scenario is a deterministic decision test,
not evidence of profitability in arbitrary markets.
