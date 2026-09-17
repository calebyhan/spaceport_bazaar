---
title: "Spaceport Bazaar: Agent-Readable Handbook"
description: "Gameplay, protocol, and client-design reference transcribed from the Galaxy Handbook."
source: "Galaxy Handbook / Protocol 2.0"
source_pages: "02/09–09/09"
verified_page_order:
  - "02/09 — 01 Your assignment"
  - "03/09 — 02 The planetary economy"
  - "04/09 — 03 Establish a connection"
  - "05/09 — 04 Read the galaxy"
  - "06/09 — 05 Trade and mutual aid"
  - "07/09 — 06 Design your client"
  - "08/09 — 07 Results and rejections"
  - "09/09 — 08 Prove readiness"
source_note: "Page 01/09 was not included in the uploaded images; the substantive pages supplied run continuously from 02/09 through 09/09."
---

# Spaceport Bazaar: Agent-Readable Handbook

## Fast protocol and gameplay facts

- There are **nine planets**, each operated by a student pair.
- The class-level objective is that **none of the nine planets reaches zero health** before the run ends.
- Each planet has one specialty: **water**, **food**, or **components**.
- Every planet consumes all three resources.
- Trading is necessary because a planet cannot manufacture its way out of every shortage.
- **Zero health is permanent failure for the run.**
- The client communicates with the Bazaar server over a persistent **WebSocket**.
- Protocol version: **2.0**.
- WebSocket subprotocol: `bazaar.protobuf.v2`.
- Authentication header:
  - `Authorization: Bearer <your planet token>`
- Wire format:
  - One `bazaar.v2.ClientMessage` as **binary Protobuf bytes per WebSocket message**.
  - Incoming data is decoded as `bazaar.v2.ServerMessage`.
  - **Do not** add a JSON wrapper, Base64 encoding, or your own length prefix.
- Readiness flow:
  1. Connect.
  2. Receive initial `state`.
  3. Send `ready` with `ready: true`.
  4. Wait for matching `readiness` with `ready: true`.
  5. Trade only when state says `RUNNING`.
- `ready` does **not** start the simulation.
- Wait during `READY` and `PAUSED`.
- Stop new trading actions at `FINISHED` or `ABORTED`.
- Snapshots are authoritative: replace the previous authoritative view with each newer snapshot from the current connection.
- **Do not apply transactions to inventory again**; reported balances already include them.
- Offers are **not reservations**. Posting an offer checks current ability to pay but locks nothing.
- Offer settlement is **atomic**.
- Only the **recipient** accepts an offer.
- Only the **creator** withdraws an offer.
- A gift is a normal offer with a positive `give` and an all-zero `receive`; the recipient must accept.
- Expiry is exclusive: expiry at tick `12` means unusable **from tick 12 onward**.
- Resource quantities are nonnegative integers.
- Offer `give` and `receive` are always from the **proposer's perspective**.
- A successful command result does not necessarily mean a trade happened:
  - successful `advertise` → claim published
  - successful `offer` → proposal created
  - successful `accept` → exchange settled and a transaction created

---

# 01 — Your assignment
**Printed page:** 02/09

## Mission

You and your teammate are assigned one planet in the Spaceport Bazaar. Build software that:

- observes the planet's condition,
- controls its trading,
- keeps its population supplied.

The opening simulation contains **nine planets**, each operated by a student pair. All nine teams begin with cooperative intentions.

## Class objective

The class wins by completing the run without **any of the nine planets ever reaching zero health**.

All nine must survive.

There may also be prizes for prosperous nations: those that accumulate the most overall resources by the end and lose the least health during the simulation.

## Engineering expectations

Investigate the supplied file bundle, understand its contents, and document discoveries so your teammate can reproduce the setup.

Choose a programming language in which both partners can:

- write,
- explain,
- judge clean and expressive code.

Establish:

- reproducible setup,
- tests,
- meaningful coverage,
- clear design for world data,
- communication,
- decisions.

AI may help with:

- project setup,
- generated bindings,
- test scaffolding,
- low-level infrastructure.

The student pair owns:

- the data model,
- architecture,
- controlling logic.

Both engineers must understand the design and review/test AI-generated work.

## Mission order

1. Establish a project both engineers can run and explain.
2. Understand your planet.
3. Send a command.
4. Read the response.
5. Build something worthy of the lives depending on the software.

---

# 02 — The planetary economy
**Printed page:** 03/09

Every planet produces one specialty:

- `water`
- `food`
- `components`

Every planet consumes all three.

The opening roster has three producers of each resource.

## What happens on a tick

A `tick` is one step of simulation time. While the run is `RUNNING`, the server automatically:

1. Expires offers and advertisements whose deadlines have arrived.
2. Adds each planet's production for that tick to its inventory.
3. Consumes that planet's upkeep from each of the three resources.
4. Applies health damage for missing upkeep, or recovery if all upkeep was supplied.

Trades can settle **between ticks** as soon as the server processes an acceptance.

Production, consumption, and health updates are automatic while the simulation is running.

## Production changes; reserves matter

A planet's specialty is fixed for the run, but its output varies over time.

Production is credited automatically.

`self.last_production` reports what actually arrived on the most recent tick, not what will arrive next.

At tick zero, `self.last_production` is zero.

The client is **not** given:

- future production schedules,
- other planets' specialties.

The instructor controls:

- run timing,
- starting stocks,
- production surplus.

"Surplus" describes total production relative to total upkeep **over the whole run**. It does not guarantee that every planet has enough of every resource at every moment.

Example: if upkeep is one unit of each resource per planet, nine planets need:

- 9 water / tick
- 9 food / tick
- 9 components / tick

A 50% production surplus means 50% more of each resource over the full run, excluding starting stocks. Timing and distribution can still cause shortages.

## Health is a hard constraint

Standard classroom rules:

- start health: `100`
- consume: `1` unit of each resource per tick
- lose: `5` health per missing unit
- recover: `5` health on a fully supplied tick
- max health: `100`

**Do not hard-code those numbers.**

Read the actual rules and `self.upkeep_per_tick`.

Example under those rules:

- start inventory: `(2 water, 0 food, 1 component)`
- produce: `3 water`
- after upkeep: `(4, 0, 0)`
- one food unit is missing
- health falls by `5`
- extra water cannot substitute for food

## Permanent failure rule

At zero health:

- failure is permanent for the run,
- trading is disabled,
- open offers involving that planet are withdrawn,
- the active advertisement is withdrawn,
- gifts can no longer rescue it,
- passive production continues,
- health recovery continues,
- neither restores trading nor erases the failure.

---

# 03 — Establish a connection
**Printed page:** 04/09

The client talks to the Bazaar server over a **WebSocket**, a persistent connection on which either side may send messages.

Keep receiving while the client:

- thinks,
- waits,
- sends commands.

Other teams can change the world without waiting for your next request.

## Runtime configuration

Accept the supplied **server address and port at runtime**, without source edits or recompilation.

Prefer a configurable full endpoint such as:

```text
ws://HOST:PORT/ws
```

Support `wss://` when specified.

Keep the access token configurable.

Generate bindings from:

```text
bazaar.proto
```

Use:

- the generated bindings for the chosen language,
- a compatible Protobuf runtime.

## WebSocket subprotocol and authentication

Use WebSocket subprotocol:

```text
bazaar.protobuf.v2
```

Authenticate with connection headers:

```text
Authorization: Bearer <your planet token>
Sec-WebSocket-Protocol: bazaar.protobuf.v2
```

The client should verify that the server selects the requested subprotocol.

Choose a WebSocket library that can set the authentication header. A browser's built-in WebSocket API cannot set that header directly.

Keep credentials out of:

- source control,
- routine logs.

## Wire format

Send one:

```text
bazaar.v2.ClientMessage
```

as **binary Protobuf bytes per WebSocket message**.

Decode incoming data as:

```text
bazaar.v2.ServerMessage
```

Do **not** add:

- JSON wrappers,
- Base64 encoding,
- custom length prefixes.

Handle separately:

- WebSocket ping,
- WebSocket pong,
- WebSocket close controls.

## Connection sequence

1. Connect with:
   - endpoint,
   - token,
   - subprotocol.
2. Receive the initial `state`.
   - Read your planet's identity.
   - Read the current rules.
   - Read the phase of play.
3. Send `ready` with:
   ```text
   ready: true
   ```
   using the required schema structure.
4. Wait for the matching `readiness` confirmation with:
   ```text
   ready: true
   ```
5. Begin new trading actions only when the state says:
   ```text
   RUNNING
   ```

Readiness does **not** start the simulation; the instructor does.

Behavior by phase:

- `READY` → wait
- `PAUSED` → wait
- `RUNNING` → trading actions allowed
- `FINISHED` → stop new trading actions
- `ABORTED` → stop new trading actions

---

# 04 — Read the galaxy
**Printed page:** 05/09

The schema defines exact field names and message shapes. This handbook explains what the messages mean.

## Messages your client sends

| Message | Meaning |
|---|---|
| `advertise` | Publish the resources you claim to sell or seek. |
| `offer` | Propose exact terms to one other planet. |
| `accept` | Settle an open offer addressed to your planet. |
| `withdraw` | Withdraw your own open offer or active advertisement. |
| `ready` | Confirm that this connection has read a snapshot and is ready. |
| `sync` | Request a fresh snapshot; does not advance simulation time. |

The first four are gameplay commands.

`ready` and `sync` are control messages.

Use protocol version `2.0` and consult the schema for every message's required fields.

## Messages your client receives

| Message | Meaning |
|---|---|
| `state` | A complete current snapshot of the world you are allowed to see. |
| `result` | One command's outcome. Inspect and code. |
| `readiness` | Acknowledges your readiness declaration for this connection. |
| `protocol_error` | A control-level problem with a message. Inspect code. |

## What is visible

`self` contains:

- inventory,
- health,
- failure status,
- upkeep,
- specialty,
- latest production,
- cumulative supply counters,
- cumulative trade counters.

`directory` contains:

- planet IDs,
- display names.

`directory` does **not** disclose:

- other planets' inventories,
- other planets' health,
- other planets' specialties,
- other planets' future output.

Public `advertisements` reveal what planets claim to:

- sell,
- need.

`offers` and `transactions` contain:

- your own proposed exchanges,
- your own settled exchanges.

Their terms are private to the two parties.

`request_results` records your commands' outcomes.

Discover potential suppliers through:

- advertisements,
- experience.

Do not assume supplier identity from planet IDs.

## Three different clocks

- `tick`
  - governs production, upkeep, and deadlines.
- `world_version`
  - tracks shared-state revisions;
  - several revisions can occur in one tick.
- `snapshot_sequence`
  - orders snapshots on the current connection.

## Snapshot handling invariant

Replace the previous authoritative view with each newer snapshot from the current connection.

**Do not apply its transactions to inventory again.**

The reported balance already includes them.

A newer snapshot can contain new results even when `world_version` is unchanged.

Keep separate:

- local estimates,
- pending decisions,
- server facts.

---

# 05 — Trade and mutual aid
**Printed page:** 06/09

There is:

- no currency,
- no automatic market matching.

An advertisement expresses **interest**.

An offer proposes an **exchange**.

Acceptance moves resources.

The server authenticates who made a claim, but does **not** verify advertised:

- availability,
- need.

## Complete exchange example

Suppose inventory is:

```text
{10 water, 4 food, 3 components}
```

At tick `7`, propose giving six water to `P02` in exchange for five food, expiring at tick `12`.

Logical contents:

```yaml
offer:
  recipient_id: P02
  give:
    water: 6
    food: 0
    components: 0
  receive:
    water: 0
    food: 5
    components: 0
  expires_tick: 12
```

### Perspective invariant

`give` and `receive` always use the **proposer's perspective**.

Therefore `P02` would:

- pay `5 food`,
- receive `6 water`.

A successful posting result returns an object ID.

Posting the offer moves **no resources yet**.

Both parties see the offer in their snapshots.

If `P02` sends `accept` with that `offer_id`, and if:

- the offer is still open,
- both planets remain eligible to trade,
- both planets can pay,

then the server transfers both bundles together.

This is **atomic settlement**.

Otherwise, nothing moves.

With no intervening production, upkeep, or trades, the proposer's inventory becomes:

```text
(4 water, 9 food, 3 components)
```

A transaction records the exchange.

Read the updated snapshot for the authoritative balance.

The quantities above illustrate mechanics, not a recommended price or reserve policy.

## Signal a need; offer assistance

An advertisement has:

- `selling`
- `seeking`
- `expires_tick`

To request help:

- publish empty `selling`,
- publish nonempty `seeking`.

There is one active advertisement per planet.

A new advertisement replaces the previous one.

There is no separate help-request command.

## Gifts

A gift is an ordinary offer with:

- positive `give`,
- all-zero `receive`.

The recipient **must accept**.

Aid is voluntary and uses existing inventory.

After receiving aid, update or withdraw an outdated advertisement yourself.

Settlement does not clear it.

## Rules your model must express

### Whole resources

Bundles contain:

- water,
- food,
- components,

including zeros.

Quantities are nonnegative integers.

Give something; do not put the same resource on both sides of an offer.

### Exclusive deadlines

Expiry at tick `12` means unusable **from tick 12 onward**.

Respect:

- current TTL limits,
- the run's end.

### No reservation

Posting an offer checks current ability to pay but locks nothing.

Several open offers can promise the same stock.

Budget for:

- commitments,
- upkeep.

### Fixed terms

- only the recipient accepts,
- only the creator withdraws.

To revise terms:

1. withdraw,
2. propose again.

An acceptance processed first cannot be undone by a later withdrawal.

---

# 06 — Design your client
**Printed page:** 07/09

Before building a large decision loop, design the code you want to read at its center.

With your teammate, sketch the top-level API for:

- receiving an observation,
- understanding needs and commitments,
- choosing actions.

Try it against a few concrete situations before committing to an abstraction.

## Give the world a precise vocabulary

Model explicitly:

- resource bundles,
- planet identities,
- offers,
- transactions,
- deadlines,
- command outcomes.

Choose idiomatic types and operations.

Make it difficult to confuse:

- incoming terms vs outgoing terms,
- proposed exchange vs completed transaction,
- advertised resource vs confirmed stock.

A generated Protobuf class describes the wire.

Deliberately decide how it relates to the domain model.

Trading logic should be able to ask useful questions without repeatedly:

- unpacking transport fields,
- rebuilding resource arithmetic.

## Separate responsibilities

| Responsibility | What it should own |
|---|---|
| Connection and codec | Endpoint, authentication, sockets, encoding, decoding. |
| State and command tracking | Current world view and decoded command outcomes. |
| World model | Resource arithmetic, offer meaning, expiry, commitments, supply estimates. |
| Decision policy | When to trade, with whom, on what terms, and how to protect reserves. |
| Execution and evidence | Validate and send chosen actions; record enough to explain their outcomes. |

These are boundaries to discuss, not a requirement for five classes/services/directories.

Keep the design as small as the problem permits.

## Design from the caller's perspective

Useful conceptual boundary:

```text
decide(observation, policy_memory)
  -> proposed_actions, next_policy_memory
```

This is a design prompt, not a supplied API.

Choose names and shapes that feel natural in the chosen language.

Keep decision code testable **without a live socket**.

Avoid hiding a network call inside an innocent-looking model query.

## Questions the design should answer cleanly

- How do we express "stock available after commitments"?
- What does an incoming gift look like?
- How will the API distinguish a proposal from a completed trade?
- What happens if a newer snapshot arrives while we are deciding?

## Own the design

AI can help implement:

- codec adapter,
- test fixture.

AI cannot take responsibility for:

- strategy,
- abstractions,
- understanding.

Both partners should:

- review controlling code,
- explain its behavior on an unfamiliar example.

Aim for code whose:

- names,
- types,
- control flow

make the policy clear without translating it line by line.

---

# 07 — Results and rejections
**Printed page:** 08/09

A command is a request for the server to act.

Even a correctly encoded request can be rejected, for example because:

- the offer expired,
- resources are no longer available,
- the simulation is not running.

## Success means something specific

- Successful `advertise` → claim published.
- Successful `offer` → proposal created.
- Successful `accept` → exchange settled and transaction created.

Neither successful `advertise` nor successful `offer` means a trade happened.

Read each result in the context of the action it answers.

An unsuccessful result is useful information.

The program should:

- recognize it,
- explain it,
- let decision logic respond appropriately.

Printing every response as "command sent" is insufficient.

## Duplicates deserve attention

The client may encounter repeated messages.

Receiving another message does not necessarily mean another transfer occurred.

Test duplicates for:

- successful commands,
- rejections.

Investigate how the protocol represents each case.

## Common result codes

Logical result codes are shown below. Protobuf enum names add `RESULT_CODE_`.

| Result code | Meaning |
|---|---|
| `INSUFFICIENT_RESOURCES` | A party cannot pay. A failed acceptance moves nothing and leaves the offer open. |
| `EXPIRED_NOT_OPEN` | The object has expired or is no longer available for this action. |
| `RATE_LIMITED` | Your planet has reached its command quota; consult `retry_after_tick`. |
| `LIMIT_REACHED` | A limit on game objects prevents the action. |
| `RUN_NOT_RUNNING` | New trading actions are unavailable in the current phase. |
| `STATION_FAILED` | A planet involved in the action has permanently lost trading eligibility. |
| `INVALID_ARGUMENT` / `NOT_FOUND` | Check command values, object references, and which objects you may act on. |
| `REQUEST_ID_CONFLICT` | The server reports a conflict in command identity. Consult the protocol. |

A `protocol_error` is a separate **control message**, not one of these results.

Inspect its code to understand why the message could not be processed.

Read command and object limits from `rules`.

A rejected action is a normal possibility in a changing market.

Build tests that prove the client understands the answer, not merely that it can ask the question.

---

# 08 — Prove readiness
**Printed page:** 09/09

The first delivery should give both engineers a foundation they can:

- understand,
- test,
- extend.

## Establish a project both partners can use

Include:

- version control,
- documented setup,
- documented dependencies,
- commands to:
  - build,
  - run,
  - test,
  - measure coverage.
- configurable endpoint and credentials,
- demonstration that server address/port can be changed without editing code,
- short architecture note,
- examples of intended decision API,
- receive loop,
- readiness handshake,
- evidence of correctly sending/receiving messages,
- logs linking:
  - decisions,
  - input state,
  - commands,
  - results,
  - subsequent snapshots,
- no exposed tokens.

## Test behavior at the boundaries

| Test area | Evidence worth having |
|---|---|
| Resource model | Correct bundle arithmetic, offer perspective, reserves, outstanding commitments. |
| Wire and lifecycle | Required fields and zeros survive encoding; dispatch, readiness, and phase gates work. |
| State handling | Repeated snapshots do not double-count trades; observations remain consistent. |
| Trade decisions | Gifts, competing commitments, changed balances, exact expiry boundary. |
| Command outcomes | Successful commands, duplicate messages, meaningful handling of rejections. |
| Survival | Low stock, changing production, shortages, permanent failure despite health recovery. |

Use:

- unit tests for models and policies,
- message fixtures for state handling,
- integration tests for sending and receiving.

Assert:

- what the client understood,
- how it responded.

A terminal full of messages is **not** evidence that the program interpreted them correctly.

Measure coverage of handwritten code, including:

- decision branches,
- failure paths.

Review gaps and explain exclusions such as generated bindings.

A percentage alone cannot prove correctness.

## First live objective

Start with a policy you can explain:

- protect upkeep reserves,
- discover suppliers,
- keep resources circulating.

Test assumptions with other pairs.

Nine well-intentioned programs can still:

- all wait,
- overcommit,
- respond too late.

The opening Bazaar is cooperative.

Later:

- supplies may tighten,
- trading relationships may weaken,
- claims may become less reliable.

Build enough clarity and evidence to notice when the world stops matching your assumptions.

## Duty order

1. Keep your planet supplied.
2. Keep all nine planets alive.
3. Bring glory to your planet.
