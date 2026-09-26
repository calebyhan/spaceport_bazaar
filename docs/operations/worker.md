# Autonomous baseline v1

[Documentation index](../README.md)

The worker is a separate Node process; the dashboard never owns the trading
socket. `worker/policy.ts` contains the deterministic decision function and
`worker/domain.ts` contains bundle, commitment, and forecast arithmetic.

The initial production assumption is **zero future production**, including the
specialty. Last production is an observation, not a promise. This sacrifices
trade volume for an explainable reserve. An advertisement never proves stock,
and an unaccepted offer never supplies usable incoming inventory.

Snapshots replace state. Transactions are history, never balance deltas.
Connection epochs fence old callbacks; snapshot sequences order observations
within an epoch; world versions and ticks have different meanings.

Commands are recorded durably before sending. A pending outgoing offer remains
a liability until a snapshot reconciles its result and object. Sending a
withdrawal does not remove its liability. An ambiguous outcome blocks new
commands: reconnect, repeat readiness, inspect authoritative request results,
and recover the original command identity rather than inventing a replacement.

No deployment or remote schema changes are required to run local verification.

## Run locally

Use Node 22. Follow [development setup](../setup/development.md) and the
[testing guide](../testing.md) for installation and verification commands.

`proto:generate` uses the supplied schema with proto2 required fields and
unpacked lists. Generated JavaScript and declarations live in `worker/generated`;
never edit them by hand. The adapter preserves uint64 quantities as `bigint`,
including values beyond JavaScript's safe-number range. Journals and JSONB use
decimal strings for those values.

For the supplied exercise, use two terminals:

```sh
sh scripts/start-validator.sh
```

```sh
BAZAAR_ENDPOINT=ws://127.0.0.1:3001/ws \
BAZAAR_CREDENTIAL_FILE=validation-credentials.json \
BAZAAR_JOURNAL=.local/exercise.jsonl npm run worker:exercise
```

The credential file selects P01 by default (`BAZAAR_STATION_ID` overrides it).
Do not put the token on the command line. `test:validator` automates both
processes on an ephemeral loopback port, asserts the report and decoded final
state, then stops them. Its private credentials and journal remain in a temporary
evidence directory. The prescribed P02/2-water-for-1-food exercise is isolated
in `exercise.ts`; it intentionally exceeds the five-record limit once. It is
never the autonomous policy.

For autonomous operation, place `BAZAAR_ENDPOINT`, `BAZAAR_TOKEN`, and any
optional settings from `.env.example` in an ignored, private environment file:

```sh
BAZAAR_ENV_FILE=.env.worker.local npm run worker
```

The endpoint must be `ws://` or `wss://`. Both endpoint and credentials are runtime
configuration. Nothing loads `.env.local` implicitly, and no remote connection
is made by the test suite except the locally launched validator socket.

The default journal is `.local/worker.jsonl`. Keep it across restarts. To mirror
records into an **already provisioned and authorized** Supabase database, add
`SUPABASE_URL` and `SUPABASE_SECRET_KEY` to the worker environment and explicitly
run `npm run worker -- --supabase`. This reuses `runs`, `events`, `commands`, and
`current_snapshots`; it needs no migration. The worker never applies migrations.
The dashboard remains unchanged. Database writes were not exercised against a
remote project as part of this implementation.

## Policy and comparisons

`decide(snapshot, pendingCommands, policyMemory, config)` returns one action,
next memory, and an explanation. It performs no I/O. The engine commits memory
only when submitting the action. Persisted explanations contain the full input
snapshot, connection epoch, policy/config version, liabilities, reserve bundle,
tick-by-tick wait forecast, action and rationale. Results and subsequent states
are linked through request IDs in the journal and optional database mirror.

Defaults are a two-tick reserve, one unit per offer, a 1:1 opening ratio, a
two-tick TTL, and two-tick cooldown. Reserve is capped by remaining upkeep ticks;
TTL is capped by live limits and run end. All config quantities must be positive
integers. `GIVE_UNITS` and `RECEIVE_UNITS` multiply `QUANTITY` independently.

Forecasts run through the end of the simulation using live upkeep, health cap,
shortage damage, and recovery. Each point follows production (zero assumed),
upkeep, then damage or recovery. Failure latches even if health later recovers.
Current liabilities are subtracted before forecasting: any still-open offer
could settle now, including one expiring at the next tick. Once spent, those
resources do not return at expiry. A confirmed unfilled offer stops being a
liability exactly at its exclusive expiry; an unresolved command remains
uncertain until reconciled. Incoming resources on open offers are not counted.

For an immediate exchange, payment must be affordable after commitments. A
station currently at reserve must retain reserve. When already below reserve,
a spending exchange must weakly improve health at **every** future tick and
strictly improve it at least once. It must not turn a surviving forecast into a
failure or move projected failure earlier. A free useful gift cannot spend
resources and still undergoes affordability and failure checks.

For a new proposal, reserve the selling resource through the last possible
acceptance tick plus the remaining reserve window. Check the conditional
settlement at every valid tick against waiting. The unfilled branch is waiting;
rank the proposal using that wait forecast, not hoped-for receipts. Once sent,
its full outgoing amount becomes a liability and receipts remain uncredited.
An existing proposal is withdrawn if it no longer passes these same checks.
Withdrawal only releases its commitment after an authoritative snapshot. A
counterparty may accept first; that snapshot's settled balances win.

Candidates compare lexicographically, with no weighted score:

1. Later failure tick (survival through run end outranks any failure).
2. Higher minimum forecast health, including current health.
3. Less total shortage damage through run end.
4. Smaller total reserve deficit.
5. On otherwise equal outcomes: unsafe-offer withdrawal, useful gift,
   shortage-improving exchange, supplier proposal, advertisement, wait.
6. Canonical action JSON in ascending order breaks remaining ties.

Wait participates as a baseline; worse candidates are discarded. Missing
resources are ordered by whole upkeep ticks remaining, then water, food,
components. Suppliers must currently advertise the wanted resource and seek
the offered resource; lexical action order chooses between equally suitable
suppliers. No planet ID encodes specialty. No supplier learning or pricing
model is present.

At most one outgoing offer (confirmed or pending) is permitted. Pending commands
block additional commands entirely. Nonurgent proposals and advertisements
leave one per-tick command slot and one request-record slot unused. Acceptance
and withdrawal may use the final slot. Failed results count against observed
quotas. `RATE_LIMITED` blocks until `retry_after_tick`; request capacity exhaustion
stops new commands for the run. Cooldowns apply to attempted canonical terms
regardless of success: proposals wait through expiry plus cooldown, other
actions wait the configured ticks. A different offer ID is a different inbound
opportunity. This avoids hammering failed settlements or repeating ignored
identical proposals with fresh request IDs.

## Execution and recovery

The receive handler immediately replaces in-memory facts, fences callbacks by
connection epoch, and enqueues persistence. The single submission loop waits for
persistence, decides, persists the decision and prepared command, and checks the
snapshot identity and epoch again immediately before `send`. New state during
any await invalidates the prepared action and records a cancellation. A queued
command never gets a speculative balance update.

Readiness is repeated per connection and must match the acknowledged sequence.
Only RUNNING permits new trading. READY, PAUSED, FINISHED, ABORTED and permanent
failure stop new actions. Reconnect uses bounded exponential delay; authentication,
protocol mismatch, malformed frames and server fencing fail closed. `ws` handles
ping/pong controls; application messages must be binary Protobuf.

A missing outcome causes one `sync` after two seconds. New connection snapshots
and request results reconcile the original ID. An absent result remains
ambiguous and blocks replacement actions indefinitely. The engine's
`retryRecorded` method permits only byte-equivalent retries with the original
ID and a known recorded result; the server returns stored evidence without
repeating the action. There is deliberately no automatic replay of an absent
result, since it could first execute after inventory or policy has changed.
This is a conservative availability limitation. Do not delete the journal to
bypass unresolved commands; investigate the authoritative run and retain its
original command identity.

The local journal is appended and fsynced before a command is sent. If local
persistence or the explicitly enabled Supabase mirror fails, the worker stops
trading; the journal retains prepared or uncertain commands for reconciliation.
A torn journal is rejected, not silently truncated. A disk-full or broken
mirror therefore affects availability, not silent command tracking.

A host-wide atomic directory lock is acquired **before opening the socket**,
so a second worker cannot first fence the current server session. A second lock
keys the observed run/station independently of checkout and endpoint aliases.
This intentionally permits only one worker per host, even for different runs.
Locks live under `/tmp/spaceport-bazaar-*.lock/owner.json`; clean shutdown removes
the owned locks. After SIGKILL/crash, inspect the PID, verify that no owner is
alive, retain the journal, and manually remove only the stale lock directory.
No automatic stale-lock takeover is attempted. Separate hosts are outside this
local guarantee; server session fencing remains the last defense.

## Verification and limits

The tests cover arithmetic, perspective, pending/confirmed reconciliation,
multiple liabilities, exact expiry, permanent failure and recovery, useful gifts,
emergency health dominance, duplicate snapshots, reconnect sequence resets,
state changes during decision and command persistence, failed settlement,
rate limits, unknown outcomes, exact recorded retries, cooldowns, persistence
failure, restart restoration, and concurrent lock refusal.

Three deterministic autonomous simulations run the binary codec and real engine
against a stocked cooperative simulated peer. The peer accepts proposals and
sends exchanges or aid; it is independent of the validator script. Six upkeep
ticks include normal production, zero starting food/low stocks, and specialty
production dropping to zero after one tick. These are local simulations, not
evidence of success against arbitrary classmates or a complete reference server.

The baseline can wait too long or refuse useful risky trades because it assumes
zero production, credits no open incoming promise, serializes commands, and
preserves capacity. There is no guarantee of survival when counterparties stop
helping. Forecast work is bounded to 10,000 remaining ticks; larger runs fail
closed. The journal is append-only and is not compacted. The existing PostgreSQL
bigint columns have signed 64-bit bounds; wire values remain exact in JSON, but
an out-of-range database clock causes a safe persistence stop. Remote database
permissions and distributed control are not validated by local tests.

Every journal/event record includes a random worker-process ID plus a connection
epoch. This also distinguishes sequence resets across process restarts. The
current snapshot remains the raw authoritative observation; no transaction is
re-applied during database mirroring.

Coverage scope, quality expectations, and reproducible commands are maintained
in the [testing guide](../testing.md).

Local verification on 2026-09-21 completed the supplied validator's ten steps
with final inventory `(28 water, 31 food, 31 components)`. The three six-tick
autonomous scenarios finished without permanent failure: normal production and
production drop ended at health 100; the low-stock case ended at health 45.
The low-stock case depends on voluntary peer gifts and is not a solvency
guarantee. Schema SHA-256:
`3e5d7631db9577c84c7035d384e75d412d255d3bdcfbb37d2247ca568786f351`.
