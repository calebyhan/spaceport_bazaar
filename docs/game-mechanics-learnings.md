---
title: "Spaceport Bazaar Mechanics and Experimental Learnings"
status: "Research notes"
last_updated: "2026-09-22"
---

# Spaceport Bazaar Mechanics and Experimental Learnings

## Purpose and evidence levels

This document records what we have learned about the game and the strategic
implications of those mechanics. It supplements the
[agent-readable handbook](spaceport-bazaar-agent-readable.md) and the
[autonomous trading strategy](autonomous-trading-strategy.md).

Not every observation has the same authority:

- **Authoritative:** specified by `bazaar.proto`, the supplied handbook, or an
  observed response from the supplied validator.
- **Validator-specific:** demonstrated by a scripted practice scenario, but
  not necessarily representative of the classroom run's configuration.
- **Experimental hypothesis:** observed in our exploratory simulator and useful
  for generating questions, not evidence about the live server.

Live `State.rules`, `self.upkeep_per_tick`, and the latest authoritative
snapshot override examples and simulator assumptions.

## Core objective

There are nine planets and three resource types: water, food, and components.
Each planet produces one specialty but consumes all three resources. The class
wins only if no planet reaches zero health before the run finishes.

Secondary prosperity rewards may exist, but survival is lexicographic:

1. Avoid our permanent failure.
2. Preserve the possibility of collective survival.
3. Build reliable market access and relationships.
4. Accumulate genuine end-game surplus.

A large final inventory does not compensate for a previous failure.

## Tick and health mechanics

While the phase is `RUNNING`, each tick performs these operations in order:

1. Expire offers and advertisements whose deadlines have arrived.
2. Add each planet's specialty production.
3. Consume upkeep independently for water, food, and components.
4. Apply shortage damage, or recovery if all upkeep was supplied.

Trades can settle between ticks as soon as an acceptance is processed.

Important consequences:

- Production credited on a tick can satisfy that tick's upkeep.
- Resources are not substitutes. Extra water cannot cover missing food.
- `expires_tick: 12` means the object is unusable from tick 12 onward.
- An offer that has merely been posted provides no survival benefit.
- Incoming resources are safe to count only after atomic settlement appears in
  the authoritative state.
- Recovery occurs only on a fully supplied tick. A partially supplied tick
  causes damage instead.

For a tick with total unmet upkeep `u`, damage is conceptually:

```text
damage = u * rules.shortage_damage_per_unit
```

The number of missing units that can be survived without reaching zero is:

```text
floor((current_health - 1) / shortage_damage_per_unit)
```

This calculation must use live rules. Standard classroom values are examples,
not constants.

## Permanent failure experiment

The supplied validator includes a `station-failure` scenario in addition to
the default message-sample scenario. We completed it through all eleven steps.

The validator-specific initial state was:

```text
tick:       0
health:     5
inventory:  water 3, food 3, components 3
upkeep:     water 4, food 1, components 1
specialty:  water
```

At tick 1, P01 produced nothing. Water upkeep was short by one unit, health
fell from 5 to 0, and `failed_once` became true.

The server immediately:

- recorded `first_failure_tick: 1`;
- withdrew P01's active advertisement;
- withdrew an open outbound offer;
- withdrew an open inbound component gift;
- rejected acceptance, offers, advertisements, and withdrawals with
  `RESULT_CODE_STATION_FAILED`.

At tick 2, P01 produced four water, fully supplied upkeep, and recovered from
health 0 to health 5. Nevertheless, `failed_once` remained true and a new
offer still returned `STATION_FAILED`.

Therefore:

- Health and trading eligibility are separate state variables.
- Touching zero health is irreversible even if later production restores
  health.
- Passive production, upkeep, counters, and recovery continue after failure.
- Gifts cannot rescue a planet after failure because it can no longer accept.
- Failure removes liquidity by closing every open offer involving the failed
  planet.

The strategic deadline is the tick before failure, not the tick after it.

## Observation boundaries

The client can observe its own:

- inventory, health, failure status, and upkeep;
- specialty and latest production;
- cumulative production, consumption, unmet upkeep, imports, and exports;
- offers and transactions involving it;
- command results;
- public advertisements, directory entries, phase, tick, and rules.

The client cannot observe peers':

- inventory or health;
- specialty or production schedule;
- third-party offers and transactions;
- ability to afford advertised or proposed terms.

An advertisement is an authenticated claim of interest, not proof of need,
stock, price, urgency, or solvency. Peer condition must be represented as a
belief with confidence and recency, never as an asserted fact.

## Advertisement mechanics

- Each planet has at most one active advertisement.
- Publishing a new advertisement replaces the previous one.
- `selling` or `seeking` may be empty; seeking-only advertisements are the
  protocol's help-request mechanism.
- Advertisements contain resource categories but no quantities or prices.
- Trade settlement does not clear an advertisement automatically.
- A failed planet's advertisement is removed automatically.

The single active advertisement should communicate the most important current
bottleneck or opportunity. Decisions should use the latest confirmed
advertisement ID and state rather than an older local intention.

## Offer and transaction mechanics

- There is no currency and no automatic matching engine.
- An offer is a private, directed bundle exchange.
- `give` and `receive` are always from the proposer's perspective.
- Posting checks current affordability but transfers and reserves nothing.
- Multiple open offers can promise the same stock.
- Only the recipient can accept an offer.
- Only the creator can withdraw it.
- Settlement is atomic and requires both parties to remain eligible and able
  to pay.
- An unsuccessful settlement transfers nothing.
- An insufficient-resources acceptance leaves the offer open.
- Terms are fixed; changing them requires withdrawal and a new offer.
- Acceptance and withdrawal can race. The first processed action wins.
- A gift is a positive `give` bundle with an all-zero `receive` bundle and
  still requires acceptance.

The survival model must reserve against the worst plausible combination of
open outgoing offers. Incoming open offers are opportunities, not reserves.

## State, time, and ordering

Three counters have different meanings:

- `tick` governs production, upkeep, health, and expiry.
- `world_version` advances when shared state changes, including some rejected
  commands.
- `snapshot_sequence` orders state messages on one connection.

Snapshots are complete replacements for the previous authoritative view.
Their inventory already includes settled transactions; applying transaction
deltas again would double-count them.

On reconnect, `snapshot_sequence` restarts at 1 and the new connection replaces
the old session. Pending decisions from the old connection must be discarded
or revalidated.

The failure scenario also demonstrated that unsuccessful economic commands can
advance `world_version`, while exact retries and `sync` can return a newer
snapshot without advancing it.

## Request identity, retries, and capacity

- Every new economic command requires a new `request_id`.
- Retrying the exact command with the same ID returns its stored original
  result without repeating the action.
- Reusing an ID with different contents returns `REQUEST_ID_CONFLICT`.
- A successful historical retry does not recreate an expired, replaced, or
  withdrawn object.
- `request_results` must be correlated by request ID; it is not an event log
  whose array ordering should be trusted.
- New commands are limited per tick.
- Stored command results have finite capacity.
- Open outgoing offers have a finite limit.
- `sync` requests an authoritative state without consuming a command-result
  record.

The default practice scenario demonstrated that exceeding request-record
capacity returns `CONTROL_CODE_REQUEST_CAPACITY_EXCEEDED` without creating a
result or changing market state.

## Exploratory simulation findings

`scripts/explore-market.mjs` (`npm run explore:market -- <runs>`) is a
seedable, 9-planet market model. It is an experimental model, not the real
server; its production distribution, acceptance rules, per-tick command
capacity, and counterparty policies are explicit, labeled assumptions.

The simulator names seven strategy archetypes - conservative, greedy,
cooperative, balanced, slow, overextended, and a trust-tracking
reciprocal/tit-for-tat variant - and compares them two ways: **homogeneous
rosters** (what happens if every planet plays the same way) and a
**tournament** (P01's strategy is swapped while the other eight planets stay
a fixed background), the latter isolating "which strategy is best for us"
from "what if the whole class agrees."

Findings, all experimental hypotheses:

- **Trading cautiously was the riskiest posture, not the safest.**
  Conservative, greedy, and slow strategies collapsed to near-0% survival in
  this model even in isolation - no shocks, no bad actors - because refusing
  or delaying trades starves a planet of non-specialty resources faster than
  passive production replaces them.
- **Individual and collective survival were close to decoupled.** Strategies
  that got P01 to ~98-99% survival left the surrounding class at 0-1%
  collective survival in most scenarios. A locally winning strategy is not
  evidence the class is safe.
- **Offer/response throughput, not reserve size or gift-giving, was the
  dominant lever.** Isolating each lever from a common baseline: doubling
  offer volume alone took survival from ~60% to 100% in both a calm and a
  stressed scenario; lowering the reserve threshold alone did nothing
  measurable; gift-giving alone did nothing in calm conditions and
  measurably hurt under stress, because it spends specialty stock without
  buying more trade throughput.
- **A naive command-capacity model can collapse every strategy identically**,
  itself worth recording as a modeling lesson. Framing the validator's
  5-stored-result cap as a slowly draining shared pool saturates permanently
  once any planet's steady demand exceeds the drain rate, throttling every
  strategy - including previously-robust ones - to near zero. A per-tick
  budget that fully resets each tick avoids this and is a more defensible
  reading of "new commands are limited per tick" as a separate, less severe
  constraint from the stored-result cap.
- **The "trade often" ranking survived a direct sweep of that capacity
  guess.** From a per-tick budget of 2 commands up to effectively unlimited,
  multi-offer strategies stayed near 100% survival while single-offer
  strategies plateaued around 60-90%. Only an extremely tight budget of 1
  command/tick collapsed every strategy equally - a plausible hard floor
  rather than evidence favoring any one strategy.
- **Class composition can make individual strategy choice nearly
  irrelevant.** Against a background of mostly greedy/conservative/slow
  classmates, every P01 strategy - including cooperative and overextended -
  fell to under 30% survival. Against a cooperative-leaning or
  mostly-normal-with-one-troublemaker background, cooperative/overextended
  reached 100% and collective survival became nonzero for the first time.
  Past a certain density of unresponsive or extractive counterparties, no
  individual policy compensated.
- **Structural scarcity and compounding shocks amplified the same ranking**
  rather than reordering it - they lowered every strategy's numbers without
  changing which ones came out on top.
- **Adding trust-based selectivity to a high-volume strategy mostly closed
  reciprocal's gap but did not surpass indiscriminate high-volume trading.**
  A "reciprocalVolume" variant (trust-based counterparty choice plus
  cooperative's offer rate) reached ~97-98% P01 survival, matching
  overextended/cooperative far more closely than plain reciprocal's ~68%
  (throughput was reciprocal's real deficit, not its selectivity) - but it
  still did not exceed the indiscriminate strategies.
- **Whether P01's own strategy can move collective survival at all turned out
  to hinge on one specific archetype, not on a smooth "critical mass of
  good actors" effect.** Sweeping the fraction of well-behaved classmates
  from 0 of 9 to 9 of 9, collective survival stayed at 0% for every value
  from 0 through 8 and only reached 100% once literally all nine were
  well-behaved. Isolating which single bad archetype was responsible showed
  greedy and conservative could usually be rescued by 8 generous neighbors
  (~100% and ~99% collective survival in calm conditions, degrading sharply
  under stress to ~2% and ~28%) - but a lone "slow" (cadence-3) planet was
  never rescued, in any scenario, regardless of how generous its neighbors
  were.
- **"Slow" was unrescuable because of a throughput ceiling, not because
  nobody helped it - verified by ruling out a competing hypothesis first.**
  Raising the offer/gift TTL from 2 ticks up to 8 made no difference (still
  0% survival), ruling out "offers expire before it can respond." Directly
  sweeping its response cadence instead showed a clean gradient: cadence 1
  (react every tick) reached 100% survival, cadence 2 reached ~12%, cadence 3
  ("slow") stayed at 0%. With only one active tick in three and a 2-command
  per-tick budget, its maximum possible import rate falls structurally below
  its consumption of two resources it cannot produce, independent of how much
  aid is offered or how long it stays available.
- **Targeting limited aid at the neediest visible advertiser ("triage") did
  not measurably outperform giving generously at random ("cooperative") in
  this model**, including in the multi-distressed-planet sweep above where
  the two are directly comparable. This is one more data point for the same
  conclusion as the lever ablation: raw trade/gift throughput is what moves
  outcomes here, not the sophistication of who receives it.
- **A modeling bug briefly hid genuine need signals.** Advertisements
  originally listed both non-specialty resources as "sought" unconditionally,
  forever, once a planet went active - making every planet's public "need"
  identical and permanent instead of reflecting actual shortage. Restricting
  "seeking" to resources currently below target fixed this and is also a
  more accurate model of what a real advertisement should mean.

These findings support questions and safeguards rather than one fixed policy.
In particular, they suggest monitoring expiry, supplier responsiveness,
settlement failure, and disappearing counterparties as collective-risk
signals, and they argue for prioritizing trade throughput per tick over
reserve conservatism when designing the real decision loop.

## Strategic invariants supported by the evidence

1. Never calculate safety from current inventory alone.
2. Use conservative production and live upkeep over a short horizon.
3. Treat every open outgoing offer as a potential liability until confirmed
   closed.
4. Treat no incoming proposal as inventory until it settles.
5. Revalidate queued actions whenever a newer snapshot arrives.
6. Preserve command capacity for urgent acceptance, procurement, and
   withdrawal.
7. Discover more than one potential supplier for every non-specialty resource.
8. Prefer prompt, bounded, mutually useful offers while collective risk is
   uncertain.
9. Use scarcity premiums only after local reserves and collective conditions
   are convincingly safe.
10. Regard peer failure as a market-wide event because it permanently removes
    a trader and closes offers.
11. Prioritize offer and response throughput per tick over reserve size or
    generosity. In the exploratory model, trade volume was the dominant
    lever; reserve conservatism and gift-giving barely moved survival on
    their own, and gifts alone hurt under stress.
12. Do not expect our own strategy to guarantee collective survival. In the
    model, a sufficiently hostile or unresponsive class background dragged
    every individual strategy down together; treat that as a distinct risk
    to monitor rather than something our own policy can fix alone.
13. Expect a chronically unresponsive counterparty to be unrescuable by aid
    alone. In the model, a planet whose own response cadence fell far enough
    behind its consumption needs failed regardless of how generous or
    persistent its neighbors were; recognizing that pattern early (a
    counterparty that never responds in time) is more useful than continuing
    to offer it help.
14. When choosing between offering aid broadly or targeting it precisely at
    the neediest visible counterparty, this evidence favors breadth. Targeted
    aid did not measurably outperform generous, indiscriminate aid in the
    model - throughput mattered more than precision.

## Questions only the real run can answer

Record rather than assume:

- actual duration and tick duration;
- actual upkeep and health rules;
- starting inventory distribution;
- production levels, variance, and temporal correlation;
- live command, request-record, offer, and TTL limits;
- peer response latency and willingness to trade;
- how quickly advertisements change under stress;
- the exact secondary scoring criteria;
- whether apparent scarcity is local, market-wide, or temporary.

The real run should be treated as both an operational mission and a structured
experiment. The companion [real-run logging note](real-run-logging-note.md)
defines the evidence to preserve.

