# Autonomous baseline v1

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

Use Node 22 and run from the repository root:

```sh
npm ci
npm run proto:generate
npm run test:worker
npm run test:validator
npm run test:coverage
npm run check
npm run build
```

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
BAZAAR_JOURNAL_DIR=.local/exercise-journal npm run worker:exercise
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

The default journal directory is `.local/journal`; each run gets its own
`<timestamp>-<station>-<run_id>.jsonl` file there, so old runs are never
overwritten or appended into. Restarting into the same server run_id (a crash
recovery, not a fresh run) resumes into that same file — the process finds it
by scanning the directory for the most recent file that has no `run-summary`
record and reusing it only if its own records name that same run_id;
otherwise it starts a new file. Keep the whole directory across restarts. To
mirror records into an **already provisioned and authorized** Supabase database, add
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

The `market` policy (worker/policy.ts, with the market model in
worker/market.ts) replaced `baseline-2` after run-37. Version `market-4` adds
the run-39 fixes and `market-5` the run-40 fixes, described under **Run-39
changes** and **Run-40 changes** below. The analysis behind each change is in
[live run learnings](live-run-learnings.md). In run-37 our station
starved of food while holding over 200 spare components. It never originated
an offer, and it refused favourable trades once food had doomed the forecast.
Defaults, all overridable with the matching `BAZAAR_*` variable in
`.env.example`, all positive integers:

| Setting | Default | Meaning |
| --- | --- | --- |
| `reserveTicks` | 2 | Hard safety floor, in ticks of upkeep, no trade may breach |
| `planTicks` | 40 | Ticks of upkeep the plan holds for resources we produce enough of; others plan for the whole run |
| `urgentTicks` | 10 | Cover below which a need is asked for at par |
| `stockpileTicks` | 10 | Extra ticks held of a resource the market is short of |
| `lot` | 6 | Most units received per proposal |
| `ttl` / `cooldownTicks` | 3 / 1 | Proposal lifetime; retry spacing for identical terms |
| `maxOpenOffers` | 8 | Concurrent outgoing offers, capped by the live rule |
| `maxPremiumPct` / `premiumStepPct` | 50 / 25 | Opening premium and ladder step |
| `maxParMisses` | 2 | Unanswered par offers before a station/pair rests |
| `ladderWindowTicks` | 30 | How far back offer history counts |
| `parRetryTicks` | 3 | After the misses limit, ticks between par retries while still needed |
| `adTtl` | 12 | Advertisement lifetime, capped by the live rule |
| `maxInFlight` | 3 | Commands awaiting a result at once |

Everything the policy believes comes from the snapshot alone. The server keeps
every offer and transaction involving us in each snapshot, so decisions stay
deterministic and replayable without extra policy memory.

**Price floor.** We never receive fewer units than we give: every accepted
bundle and every proposal is at par or better for us. There are no outbound
gifts. Inbound gifts are accepted when safe.

**Counterparty model.** For each station, the model collects the evidence that
it can supply each resource. From weakest to strongest: it advertised the
resource, it offered it to us, or a trade of it settled. The model also records
what the station wants: what it seeks, what it recently asked of us, and what it
accepted from us. It infers a specialty when one supplied resource clearly
leads. Offers go only to stations with supply evidence. When a station's wants
are known, we pay with something it wants.

**Plan and value.** Supply is spendable stock plus conservative production over
the horizon. Before the first tick, the specialty is assumed to cover its own
upkeep. The plan's target is own upkeep plus any relay and stockpile amounts.
Each resource gets a value:

- **Base value** comes from our coverage of it: short resources are worth up to
  2, surplus resources as little as 0.5.
- **Market pressure** adds 0.1 per station seeking the resource more than
  sellers offer it, within ±0.3.

A trade is worth making only when the value it brings in exceeds the value it
pays out.

**Multi-hop sourcing.** Sometimes every supplier of a resource we need wants
only resources we cannot spare. The plan then adds a relay target for one of
those resources that another station sells, and values it at 0.9 × the needed
resource. We buy the currency first, then pay it to the supplier.

**Buy early, sell high.** The plan buys toward a 40-tick target from tick 0
rather than waiting for the safety reserve. When more stations seek a resource
than sell it, the plan also stockpiles it. Stockpiled units count as sellable.
Without any need for a resource, the policy takes it only at a real premium
(brokerage).

**Pricing ladder.** Rungs are the distinct whole-unit payments the premium
ladder yields for the lot, for example 4, 5 and 6 for a 6-unit lot. The ask
opens:

1. at par if what we receive is urgent;
2. otherwise at the price that last cleared with that station for that pair;
3. otherwise at the top premium if the station or the market wants what we pay;
4. otherwise one rung below the top.

Each unanswered (expired) offer since the last acceptance steps down one rung.
After `maxParMisses` unanswered par offers, the pair rests until the window
passes or the station accepts. Only one open ask per station and resource is
kept.

**Accepting.** An inbound offer is accepted when it is at or above par, raises
our value, and passes the safety checks below. The forecast no longer has to
improve. That extra requirement is why run-37 refused 5 water for 4 components
at tick 46.

**Run-39 changes.** Run-39 survived all 120 ticks but went 5 food short. The
server slowed to 1.5–3 second round trips while ticks ran about 1 second apart.
Several problems made that worse:

- 39 of our commands went to stations that had already failed.
- 4 offers had already expired when the server processed them.
- We sold 6 food early, and later ran exactly that short.

The fixes:

- **Failed stations.** A `STATION_FAILED` result for one of our offers marks its
  recipient failed for the rest of the run. Failure is permanent, and no
  snapshot records it. The station is dropped from the market model, so it
  gets no offers and no longer counts as a seller or seeker.
- **Lag-aware expiry.** The engine records how many ticks after sending the
  server processed each command, and keeps the last eight. Offers expire at
  tick + `ttl` + the largest recent lag, capped by the live rule.
- **Whole-run spare.** A resource can be paid only up to its spare amount:
  stock plus production beyond upkeep for the entire remaining run, not just
  the plan horizon. Units held as relay currency can also be paid. Anything
  may be paid to cover an urgent need, still subject to the safety checks.
  So a resource we do not produce is sold only when stock alone covers the
  rest of the run. The advertisement's selling list uses the same rule.
- **Bids as prices.** The highest recent ratio a peer offered us per unit it
  asked for raises that resource's value: +1 for a 3:1 bid, capped there.
  Advertised supply counts toward a resource's sellers only if the station
  has traded with us.
- **Cooldown lift.** Unanswered terms still wait out their cooldown. Terms
  whose latest offer was accepted may be repeated at once. Previously each
  accepted ask to a proven supplier locked out the next one for about
  `ttl` + 1 ticks.
- **Several commands in flight.** See the in-flight paragraph below.
- **Journal size.** Each request result is journaled once, not once per
  snapshot that repeats it.

**Run-40 changes.** Run-40 failed at tick 103, with water gone from tick 83
while we held over 190 components. Two things caused it:

- **Horizon too short.** By tick 17 we held enough water for the 40-tick plan.
  So we offered our only water supplier, P08, 1 unit per tick, and P08
  accepted every offer through tick 31.
- **Ladder rested too long.** After two unanswered par offers, we sent P08 no
  water offers for 26 ticks. P08 never accepted again, and by tick 64 peers
  were bidding 8 components per water.

The fixes:

- **Whole-run buying.** A resource whose planning production is below upkeep
  is planned over the whole remaining run, not `planTicks`. Its buying room is
  everything still needed to finish, so proposals go out in full lots while a
  supplier is selling.
- **Par retries.** After `maxParMisses` unanswered par offers, a pair we still
  need is retried at par once `parRetryTicks` have passed since the last one
  expired. A pair we no longer need still rests.
- **Bids trigger stockpiling.** A peer bidding above par for a resource now
  marks it scarce enough to stockpile, as seekers outnumbering sellers already
  did.
- **Per-command sync timers.** Each in-flight command has its own two-second
  timer. It records `uncertain` and syncs only if that command still has no
  result. Previously each send replaced the one shared timer, and it fired
  even when results had arrived.
- **Slimmer wait decisions.** Wait decisions reference their snapshot by
  sequence, world version, and tick, and omit the forecast. The state record
  already holds the full snapshot. Action decisions still carry everything.
- **Keepalive ping.** The client pings every 30 seconds, since idle lobby
  sockets dropped with code 1006 about every two minutes.

**Advertisement.** The advertisement is whatever the plan will actually trade.
Selling lists every resource with units beyond own and relay needs, which may
include non-specialties. Seeking lists unmet own or relay needs. It is
republished only when its content changes or it expires.

Forecasts run through the end of the simulation using live upkeep, health cap,
shortage damage, and recovery. Each point follows production, upkeep, then
damage or recovery. Production is the conservative estimate: the smaller of the
latest and the average observed rate per resource, and zero before the first
tick. Failure latches even if health later recovers.
Current liabilities are subtracted before forecasting: any still-open offer
could settle now, including one expiring at the next tick. Once spent, those
resources do not return at expiry. A confirmed unfilled offer stops being a
liability exactly at its exclusive expiry; an unresolved command remains
uncertain until reconciled. Incoming resources on open offers are not counted.

For an immediate exchange, payment must be affordable after commitments. A
station currently at reserve must retain reserve. When already below reserve,
a spending exchange may not lower forecast health at any future tick. It must
not turn a surviving forecast into a failure or move projected failure earlier.
Gifts still undergo affordability and failure checks.

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
4. More value realized now (accepted exchanges and gifts).
5. Kind: unsafe-offer withdrawal, gift, exchange, proposal, advertisement, wait.
6. More value a proposal would realize if accepted.
7. Stronger supply evidence for the proposal's counterparty.
8. Canonical action JSON in ascending order breaks remaining ties.

Wait participates as a baseline; worse candidates are discarded.

At most `config.maxOpenOffers` outgoing offers (confirmed or pending) are
permitted concurrently, capped by the live `max_open_outgoing_offers` rule.
Each additional offer still goes through the same safety
checks (`outgoingSafe`) as the first.

Up to `config.maxInFlight` commands may await results at once. The validator
exercise stays at one. Every in-flight command is debited while it awaits
settlement:

- A pending offer counts as a liability.
- A pending acceptance holds back what the offer would take from us, until a
  snapshot shows the offer closed.
- Incoming resources are never credited early.

An action identical to one in flight is never sent, and a pending
advertisement blocks another advertisement change. A command with no result
occupies its slot and keeps its debit until reconciled. If every slot is
ambiguous, trading stops, as it did before in-flight commands.

Nonurgent proposals and advertisements
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
snapshot identity, epoch, and result revision again immediately before `send`.
New state, or a result for any in-flight command, during any await invalidates
the prepared action and records a cancellation. After each send, the loop
decides again while in-flight slots remain. A queued
command never gets a speculative balance update.

Readiness is repeated per connection and must match the acknowledged sequence.
Only RUNNING permits new trading. READY, PAUSED, FINISHED, ABORTED and permanent
failure stop new actions. Reconnect uses bounded exponential delay; authentication,
protocol mismatch, malformed frames and server fencing fail closed. `ws` answers
server pings, and the client sends its own every 30 seconds; application messages must be binary Protobuf.

A command with no result after two seconds causes one `sync`, timed per
command. New connection snapshots
and request results reconcile the original ID. An absent result remains
ambiguous indefinitely: it keeps its in-flight slot and debit, and its action
is never repeated. The engine's
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

`worker/tests/strategy.test.ts` covers the market strategies. It checks
horizon planning, advertising the plan, value-based acceptance (including the
run-37 tick-46 case), the at-par floor, the pricing ladder (premium, step-down,
rest, reopening at the cleared price), urgency at par, multi-hop sourcing,
scarcity stockpiling, and counterparty evidence. The run-39 fixes each have
tests too: failed stations, lag-aware expiry, whole-run spare, bids, verified
sellers, the cooldown lift, and in-flight debits. The run-40 fixes are
covered too: whole-run buying, par retries, and bid-triggered stockpiling. `engine.test.ts` covers
filling several in-flight slots, cancelling a command when a result arrives
mid-preparation, and journaling each result once.

The policy still credits no open incoming promise and preserves capacity. Values and thresholds are heuristics, not fitted to live
data. The pricing ladder assumes counterparties accept at or above some fixed
ratio. It sends no probe offers to stations with no supply evidence. There is
no guarantee of survival when counterparties stop trading. Forecast work is bounded to 10,000 remaining ticks; larger runs fail
closed. The journal is append-only and is not compacted. The existing PostgreSQL
bigint columns have signed 64-bit bounds; wire values remain exact in JSON, but
an out-of-range database clock causes a safe persistence stop. Remote database
permissions and distributed control are not validated by local tests.

Every journal/event record includes a random worker-process ID plus a connection
epoch, a local monotonic sequence number, a UTC timestamp, and a monotonic
(`process.hrtime`) timestamp for latency measurement immune to clock jumps.
This also distinguishes sequence resets across process restarts. The
current snapshot remains the raw authoritative observation; no transaction is
re-applied during database mirroring.

Closing the gaps against `docs/real-run-logging-note.md`, the journal also
records: one immutable `manifest` entry per run (server/local identifiers,
protocol/subprotocol/schema versions, app version or Git commit, endpoint host
and port without credentials, live rules, initial state, policy config); a
`raw` entry per inbound frame and raw bytes on outbound `ready`/`sync`/`command`
entries (base64, alongside the existing decoded payload); a `message-error`
entry with the raw bytes for any frame that fails to decode or validate,
before failing closed; WebSocket-level `ws-open`/`ws-close`/`ws-ping`/
`ws-pong`/`ws-error`/`ws-auth-failure`/`ws-reconnect-scheduled` entries (never
including headers or credential text); derived `market-event` entries per
observed state (advertisement/offer lifecycle, command rejections, resource
risk-threshold crossings) and one `tick-summary` entry per elapsed tick,
computed in `worker/analysis.ts` from consecutive snapshots and never a
substitute for the raw records; and one final `run-summary` entry on shutdown
(final state, failure/collective-success outcome, cumulative counters,
unresolved offers/advertisements, final policy memory). The persistence-then-
decide sequencing intentionally still runs synchronously with respect to
decisions - the logging note's "never block" guidance is not applied there,
since it would weaken the stronger existing guarantee of never deciding on
data that is not yet durably logged.

Coverage excludes generated bindings and test fixtures. The measured suite
covers all domain and policy lines; remaining gaps include the CLI's live socket
lifecycle and Supabase adapter, which are not exercised by the in-process
coverage run. The separate validator exercises the CLI and exercise script but
is not included in that percentage. Local sink-failure tests prove the engine
stops on persistence failure; they do not prove remote database permissions.

Local verification on 2026-09-21 completed the supplied validator's ten steps
with final inventory `(28 water, 31 food, 31 components)`. The three six-tick
autonomous scenarios finished without permanent failure: normal production and
production drop ended at health 100; the low-stock case ended at health 45.
The low-stock case depends on voluntary peer gifts and is not a solvency
guarantee. Schema SHA-256:
`3e5d7631db9577c84c7035d384e75d412d255d3bdcfbb37d2247ca568786f351`.
