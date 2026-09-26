---
title: "Autonomous Trading Strategy"
[Documentation index](../README.md)

status: "Planning document"
scope: "High-level market and decision strategy; not an implementation specification."
---

# Autonomous Trading Strategy

## Purpose

This document describes the intended high-level strategy for our planet's
autonomous Bazaar client. It is a plan for how the client should reason about
survival, cooperation, competition, incomplete information, and changing
counterparty behavior. It deliberately does not prescribe code structure,
model providers, or wire-protocol implementation.

The primary source for game facts is the
[agent-readable handbook](protocol.md). The live server
snapshot remains authoritative for the rules and configuration of a particular
run.

## Strategic premise

The Bazaar is a partially observed, repeated trading game with nine planets.
Each planet produces one resource but consumes water, food, and components.
No planet can reliably sustain itself without trade.

The game is neither purely cooperative nor purely adversarial:

- The class-level success condition is that no planet reaches zero health
  before the run ends.
- A zero-health failure is permanent, and a failed planet can no longer trade.
- Secondary rewards may favor planets that finish with more resources and less
  health loss.
- Other planets are autonomous systems with their own policies, priorities,
  reaction times, and imperfect information.

The agent should therefore cooperate to create collective safety, protect its
own ability to survive, and compete for surplus only when the collective risk
is acceptably low.

## Objective hierarchy

The agent should treat objectives as ordered constraints rather than one
undifferentiated profit score.

1. **Prevent our permanent failure.** Never knowingly trade away resources
   needed for a conservative survival reserve.
2. **Protect collective survival.** When safe for us, reduce credible risk that
   another planet will fail; one failure loses the class-level objective.
3. **Build durable market position.** Become a counterparty that can settle
   offers, react promptly, and maintain useful supplier relationships.
4. **Accumulate end-game value.** Convert genuine surplus into resources that
   improve our final standing without compromising the first three goals.
5. **Learn.** Use low-risk interaction to improve beliefs about production,
   scarcity, and counterparties.

The first objective is a hard constraint. The next four are tradeoffs whose
relative importance changes with the state of the market.

## What the agent knows and does not know

### Authoritative facts

The client can know its own inventory, health, upkeep, specialty, latest
production, historical supply counters, the run rules, current tick, and
phase. It also receives public advertisements and the offers, transactions,
and outcomes that involve its own planet.

### Hidden state

The agent cannot see other planets' inventories, health, specialties, current
or future production, or trades with third parties. Starting stocks and
production schedules are not guaranteed to be equal across the class.

An advertisement is a claim of interest, not proof of stock, urgency, price,
or ability to pay. An open offer is also not a reservation: a proposer can
make several offers against the same inventory.

### Consequence

The agent should never claim to know another planet's actual condition. It
maintains *beliefs* with confidence levels and updates them from evidence.

| Evidence | Permitted inference | Example |
|---|---|---|
| Repeated public advertisement | Persistent need or supply interest | `P04` has sought food for three ticks; food urgency is plausible. |
| Direct accepted offer | Preference and responsiveness | `P04` accepted our water-for-food terms before. |
| Expired direct offer | Weak evidence of mismatch or unresponsiveness | Our offer may have been unattractive, unseen, or unaffordable. |
| Failed direct settlement | Payment reliability is uncertain | The failure could involve either party; do not over-attribute blame. |
| Our own production history | Volatility range for our specialty | Water output has varied enough to require a conservative reserve. |

## Core world model

The agent maintains four conceptual models.

### 1. Survival model

For each resource, estimate what remains after future upkeep, conservative
production, confirmed transactions, and worst-case outgoing commitments.

The agent must distinguish:

- current inventory from projected inventory;
- completed trades from open proposals;
- confirmed incoming resources from hoped-for resources;
- average production from a conservative production forecast.

An open outgoing offer can be accepted later and must be treated as a possible
liability. An open incoming offer provides no usable reserve until it settles.

### 2. Scarcity model

Resources have dynamic value. One additional food unit is much more valuable
when it averts a shortage next tick than when the agent has several safe ticks
of food. The model values a resource by its marginal effect on:

- expected health loss;
- probability of permanent failure;
- ability to make future trades;
- end-game value;
- apparent market scarcity.

There is no public currency or order book. The agent uses these internal values
to choose private bundle-exchange ratios.

### 3. Counterparty model

Each planet gets an evolving, probabilistic profile. The model tracks direct
evidence rather than pretending to know private state.

Useful profile dimensions include:

- responsiveness to our offers;
- observed willingness to accept or propose certain exchange ratios;
- direct settlement reliability;
- recurring advertised needs and supplies;
- likely urgency from the persistence and timing of advertisements;
- supplier confidence for each resource;
- recency of the evidence.

The goal is not to label a planet as "good" or "bad." It is to estimate which
counterparty is most likely to settle a useful trade before a deadline.

### 4. Collective-risk model

The client cannot observe peer health, so it uses market-level warning signs:

- many planets seeking the same resource;
- a need advertisement that remains active for several ticks;
- fewer visible suppliers for a resource;
- repeated expiry or failure of our own attempts to obtain a resource;
- sudden changes from selling to seeking;
- a shrinking set of credible counterparties.

These signals produce an estimated collective-risk level: low, medium, or
high. It is deliberately conservative because a peer failure is irreversible.

## Operating modes

Modes express the agent's safety posture. They are not a fixed script: the
belief, scarcity, and counterparty models determine the concrete action.

| Mode | Trigger | Behavior |
|---|---|---|
| Critical | A plausible short-horizon forecast causes an urgent shortage or dangerous health loss | Seek the bottleneck aggressively, accept favorable inbound trades, conserve surplus, and prioritize reliable suppliers. |
| Guarded | We survive, but poor production or accepted commitments would create material risk | Build reserves, diversify suppliers, limit gifts, and avoid speculative offers. |
| Stable | Conservative forecasts preserve our health and reserves | Trade surplus, explore counterparties with small offers, and provide bounded mutual aid. |
| Surplus | We have a meaningful safety buffer beyond likely needs | Seek advantageous exchange ratios, market-make, and grow end-game resources while retaining safety margins. |
| Endgame | Few ticks remain relative to current reserves | Preserve the finish, unwind unsafe commitments, and convert excess into useful final resources. |

The client may be `Stable` for water and `Critical` for food at the same time.
The most constrained resource determines the overall posture.

## Market behavior

### Reserve before trade

Before offering a resource, retain a pessimistic reserve for expected upkeep
over a configurable short horizon. The reserve should account for:

- current inventory;
- upkeep per tick;
- a conservative forecast of own specialty production;
- all open outgoing offers that could settle;
- the time remaining in the run;
- the health cost of a shortage under the live rules.

The reserve horizon grows when production is volatile or collective supply is
uncertain, and can shrink near a safe endgame. It must be derived from the live
rules rather than hard-coded classroom examples.

### Discover suppliers early

At the beginning of a run, prioritize discovery over aggressive pricing:

- advertise the specialty we can safely sell and the non-specialty resources
  that are useful to obtain;
- send small, affordable probes to visible suppliers;
- record who responds and under what terms;
- avoid concentrating all hope in one potential supplier.

The desired result is not maximum short-term profit. It is at least two
credible potential suppliers for each resource we cannot produce.

### Use targeted, bounded offers

An offer should have a clear purpose: obtain a bottleneck resource, test a
counterparty, create a reliable trading relationship, or convert verified
surplus.

Offer terms should be:

- large enough to be worth the recipient's attention;
- small enough that multiple simultaneous acceptances cannot breach reserve;
- valid long enough for a normal response but not so long that conditions make
  the promise unsafe;
- sent to a counterparty selected by current evidence rather than by planet ID
  guesswork.

### Treat advertisements as public signals

Because advertisements do not encode price or quantity, they are broad
coordination messages. Use the single active advertisement to communicate the
most important current opportunity or bottleneck.

Examples:

- In food risk: advertise water for food.
- In a stable discovery phase: advertise specialty supply and seek needed
  non-specialty resources.
- When no trade is safe or useful: withdraw stale claims instead of leaving a
  misleading advertisement active.

### Build reputation through solvency

Other agents can learn from direct interactions with us. The client should
never intentionally post offers it cannot afford if several open commitments
are accepted. Reliable settlement makes future counterparties more willing to
spend their limited attention and resources on us.

### Execution-aware safety

The market changes asynchronously. A decision that was safe when selected can
become unsafe before its next command is processed, so execution constraints
are part of the strategy rather than an afterthought.

- **Treat action capacity as a reserve.** New trading commands can be limited
  per tick and their results may consume a finite server-side record capacity.
  The agent should retain enough practical command capacity to accept a useful
  inbound offer, withdraw a newly unsafe outgoing offer, or address an urgent
  shortage. Exploratory advertisements and low-value probes must not exhaust
  that capacity. Exact quotas and record limits come from the live rules.
- **Reconsider on every authoritative update.** A successful outgoing offer
  means only that the proposal was created. It may be accepted, superseded by
  another event, or followed by a new inbound offer without any further action
  from us. Before issuing a queued command, refresh the snapshot and repeat
  the survival and commitment check.
- **Manage advertisements as a single changing signal.** Replacing an active
  advertisement retires the prior market signal. The agent should make its
  next decision from the latest confirmed public state, not assume an earlier
  advertisement remains actionable or continue a plan built around it.
- **Do not ignore zero-price offers.** A gift still requires timely acceptance
  and can expire. When it is safe and useful, accepting it should compete for
  attention and action capacity with outbound market-making, particularly in
  Guarded or Critical modes.
- **Separate observation and action recovery.** When a command is rejected or
  unavailable, first refresh facts and distinguish a transient limit from a
  changed market. Avoid repeatedly creating fresh speculative commands when a
  retry of an existing action or a fresh observation is sufficient.

## Cooperation, pricing, and gatekeeping

Strategic withholding is not automatically irrational. If our specialty is
scarce and we have a verified surplus, trading it for favorable terms can
improve our final standing. However, the strategy must have a collective-risk
throttle.

### Fair-market posture

Use fair or mildly favorable terms when:

- our own survival buffer is only guarded;
- public market signals indicate a high probability of collective shortage;
- a counterpart appears to have a persistent urgent need;
- a small concession can establish a valuable supplier relationship.

In severe, credible peer distress, a safe gift may be better than extracting a
price. A gift is an ordinary zero-price offer and still requires acceptance.

### Scarcity-premium posture

Request more favorable terms only when all of the following are true:

- we retain a robust reserve after worst-case commitments;
- our resource appears scarce relative to public supply signals;
- collective risk is not high;
- the requested payment materially improves our own bottleneck or final value;
- the offer leaves the counterparty a plausible path to survival.

This is selective market power, not blind gatekeeping. Since peer health and
inventories are hidden, withholding until others are "about to die" is not a
reliable strategy; it can easily trigger an irreversible failure before the
agent recognizes the danger.

### Escalation and de-escalation

Start with modest trade sizes and reasonable terms. Improve terms or increase
size when evidence suggests a counterpart is interested but unconvinced.
De-escalate immediately when collective-risk signals rise, when settlement
reliability declines, or when our own safety buffer shrinks.

## Decision cycle

The strategy runs whenever a meaningful new snapshot, offer, transaction,
advertisement change, tick, or command result arrives.

1. **Refresh facts.** Replace the authoritative world snapshot; do not
   double-count transactions.
2. **Update beliefs.** Record new public advertisements and direct interaction
   outcomes, while reducing confidence in stale evidence.
3. **Forecast.** Evaluate short-horizon survival under plausible production and
   commitment outcomes.
4. **Classify risk.** Determine local mode, bottleneck resources, and estimated
   collective risk.
5. **Generate candidates.** Consider accepting an inbound offer, offering to a
   likely supplier, gifting aid, changing an advertisement, withdrawing an
   unsafe offer, or waiting.
6. **Evaluate candidates.** Compare survival impact, collective impact,
   resource value, counterparty reliability, timing, and information gained.
7. **Act within limits.** Prefer the best safe action that respects live command
   quotas, request-record capacity, expiration rules, and outgoing-offer
   limits. Refresh the authoritative snapshot if an asynchronous update arrived
   while choosing the action.
8. **Learn from evidence.** Treat settlement, acceptance, expiry, and rejection
   as observations that inform the next cycle.

## Conceptual action score

Candidate actions should be evaluated with a survival-heavy objective:

```text
action value =
  - very large penalty for raising our permanent-failure risk
  - large penalty for raising estimated collective-failure risk
  + expected end-game resource value
  + expected health preservation
  + counterparty / relationship value
  + information value
```

The first two terms dominate. A nominally profitable trade is not attractive
if it meaningfully threatens survival.

## Example decision

Suppose we specialize in water. At tick 10, we have six water, one food, and
four components; upkeep is one of each per tick; and recent water production
has been volatile. A conservative two-tick outlook leaves food short even if
water remains safe.

If `P04` has advertised food for water and has previously accepted a direct
water-for-food offer, the agent should:

1. Mark food as the bottleneck and enter `Critical` or `Guarded` mode.
2. Retain the water reserve needed for plausible production and upkeep.
3. Advertise water for food if its current advertisement is less useful.
4. Send one bounded water-for-food offer to `P04` with a short, usable TTL.
5. Avoid issuing enough simultaneous water offers to create an unsafe
   worst-case commitment.
6. If the offer is ignored, use that as evidence and try another credible
   supplier with revised terms before the shortage boundary.
7. Return to a stable policy after food reserve is restored; do not continue
   overpaying once the emergency has passed.

## Role of an LLM, if used

An LLM can improve high-level interpretation and candidate selection, but it
does not have access to hidden game state. Its inputs must be limited to the
client's permitted observations and learned evidence.

Appropriate reasoning tasks include:

- comparing uncertain counterparties;
- deciding whether the market is stable enough for scarcity pricing;
- selecting among safe candidate offers;
- explaining the tradeoff between collective aid and local prosperity;
- identifying useful, low-risk market experiments.

The model should not be trusted to calculate resource arithmetic, invent facts
about peers, or bypass hard survival and protocol constraints. The agent's
world model and safety limits remain authoritative; the model is a planner
operating inside those limits.

## What success looks like

A successful strategy is not one that always extracts the best visible price.
It is one that:

- reaches the end without our planet failing;
- helps keep the class-level success condition viable;
- adapts when suppliers, production, or counterparties behave differently than
  expected;
- becomes more accurate as it gathers direct market evidence;
- converts real surplus into a strong end-game position without betting the
  run on a brittle assumption.
