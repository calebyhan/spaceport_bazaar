---
title: "Live Run Learnings"
status: "Postmortems and standing lessons"
last_updated: "2026-09-24"
---

# Live Run Learnings

## Purpose

This document records what our live classroom runs taught us: what happened
in each run, why, what we changed, and the lessons that held across runs. It
is the place to add the next postmortem.

Related documents:

- [Game mechanics learnings](game-mechanics-learnings.md#live-run-observations)
  holds the server and rule facts observed live (tick timing, production
  schedule, lag, result codes).
- [Autonomous worker](autonomous-worker.md) describes the policy and engine as
  built, including the code changes each run prompted.
- [Real-run logging note](real-run-logging-note.md) defines what the journal
  must capture.

Evidence levels follow the mechanics document. **Observed** means read
directly from a run journal. **Inferred** means a likely explanation the
journal does not prove.

Run journals live in `.local/journal/<utc>-<station>-<run>.jsonl`. They are
gitignored and exist only on the machine that ran the worker. Run-37's
instructor view is in `.local/spaceport-classroom-history.json`.

## Runs at a glance

All three runs: station P09, 120-tick runs, start inventory 30/30/30, upkeep
1/1/1 per tick.

| | Run-37 | Run-39 | Run-40 |
|---|---|---|---|
| Policy | `baseline-2` | `market-3` (in-between build) | `market-4` |
| Our specialty | Components | Water | Components |
| Our outcome | **Failed at tick 50** (no food) | **Survived**, health 100 | **Failed at tick 103** (no water) |
| Fully supplied ticks | 30 | 115 | 83 |
| Commands sent / OK | 41 / 41 | 194 / 150 | 104 / 104 |
| Imported | 19 water | 93 food, 153 components | 53 water, 75 food |
| Specialty left at the end | 255 | 290 | 332 |
| Collective success | No (all 9 failed) | No | No |

Run-38 has no journal.

## Run-37: starved while hoarding

**What happened (observed).**

- We produced about 5 components a tick but made no trades for the first 24
  ticks.
- Food ran out at tick 30, health fell 5 per tick, and we failed at tick 50
  holding 225 components.
- Our only imports were 19 water, from 1-for-1 offers that P01 initiated.
- Only 4 of 9 stations ever advertised, and none of them produced food. By
  tick 64 every station had failed.

**Why.**

- **Buying started too late.** A resource only counted as needed below the
  2-tick safety reserve. We first advertised for food at tick 29, although the
  forecast showed the food failure from tick 0.
- **Our advertisement was wrong.** It said "selling water, food, components"
  because each resource was above the reserve. P01 then spent five offers
  asking us for food.
- **We never made an offer.** A supplier had to advertise the resource we
  needed *and* seek something we had spare. No advertisement ever did.
- **Trades were tiny.** One unit at 1:1, with at most 2 offers open, while we
  held 200+ spare components.
- **Good trades were refused.** We left P01's offers of 2 water for 2
  components (tick 41) and 5 water for 4 components (tick 46) unaccepted.
  Food was going to kill us anyway, so more water did not "improve the
  forecast".

**Changes (`market-3`).** A 40-tick buying plan from tick 0; an advertisement
of what the plan will actually trade; offers to every station with evidence
it can supply; accepting on value (survival is a filter, not the goal);
multi-hop sourcing; scarcity-based valuation with a premium ladder that
never goes below 1:1; and station profiles built from trades.

## Run-39: survived, then choked on a slow server

**What happened (observed).**

- We produced water and survived all 120 ticks, 115 fully supplied. We were
  short 5 food over 5 separate ticks, each recovered the next tick.
- P07 was the only reliable food source: we traded with it 12 times on our
  offers and 45 times on its own.
- After tick 25 ticks ran about 1 second apart, although the rules said 10
  seconds. From tick 30 the server took 1.5–3 seconds to return results.

**Why food ran short.**

- **Offers to failed stations.** 39 offers were rejected `STATION_FAILED`
  (P05 23, P08 15, P03 1). In ticks 60–99 we sent 29 offers to failed stations
  and 2 to P07. Beliefs about a station never expired, and ties were broken
  alphabetically.
- **One command at a time.** With 2-second round trips and 1-second ticks we
  managed under one command per tick. 4 offers had already expired when the
  server processed them (`INVALID_ARGUMENT`).
- **We sold the shortfall.** At ticks 7 and 12 we sold 6 food for 9
  components. The 40-tick plan counted 40 food as enough, although 114 ticks
  remained and we produce no food. We were later short exactly 5 food.
- **Cooldown lock-out.** Identical terms were blocked until the previous
  offer's expiry plus one tick, even when that offer had been accepted, so
  each accepted ask to P07 locked out the next one for about 4 ticks.

**Changes (`market-4`).**

- Remember stations that return `STATION_FAILED`.
- Stretch offer expiry by the observed server lag.
- Pay with a non-produced resource only beyond a whole run's needs, unless the
  need is urgent.
- Treat peers' bids as price signals, and count advertised supply only from
  stations that have traded with us.
- Lift the cooldown after an acceptance.
- Allow up to 3 commands in flight.
- Log each result once.

## Run-40: stopped buying while the seller still sold

**What happened (observed).**

- We produced components. P08 was our only proven water seller and accepted
  27 of our offers in ticks 0–31.
- Water ran out at tick 83 and we failed at tick 103, holding 193 components
  at the stockout and 332 at the end.
- The server was fast (256 ms median round trip) and every command succeeded.

**Why.**

- **Horizon too short.** By tick 17 we held enough water for the 40-tick plan,
  so the plan had room for 1 unit a tick. We offered P08 1 component for 1
  water each tick through tick 31, and it accepted every one. At tick 20 we
  still needed about 100 more water to finish the run.
- **Ladder rested.** After two unanswered 1:1 offers (ticks 33 and 36) we sent
  P08 no water offers for 26 ticks, although P08 still sent us its own 1-water
  offers at ticks 43 and 45. From tick 62 P08 never accepted again.
- **Scarcity raised price, not quantity.** P01's bids for water climbed to 8
  components each by tick 64. Our valuation rose, but that changes *whether*
  we trade, not *how much* we buy. After tick 62 nobody would sell water at
  1:1.

**Changes (`market-5`).** Plan non-produced resources over the whole
remaining run, so we buy in full lots while a seller is accepting. After the
misses limit, retry at 1:1 every 3 ticks while still needed. Bids above 1:1
trigger stockpiling. Also: per-command sync timers, slimmer "wait" decision
records, and a client keepalive ping.

`market-5` has not yet run live. Replaying run-40's recorded states shows it
offering P08 6 water per tick in ticks 15–31. Whether P08 would have accepted
6-unit lots is unknown; it did accept 5-for-6 and 6-for-6 early in the run.

## Lessons that held across runs

1. **One resource becomes scarce for the whole market every run.** Food in
   37 and 39, water in 40. Few stations actively produce each resource, and
   stations fail mid-run, taking their supply with them.
2. **Buy what you don't produce for the whole run, early, while anyone is
   selling.** Supply disappears without warning. Every shortfall so far came
   from holding "enough for now".
3. **Never sell what you don't produce** unless stock covers the rest of the
   run.
4. **Our specialty always piles up** (255, 290 and 332 units at the end). The
   limit on survival is how fast we can buy, not what we can pay with.
5. **Throughput beats price.** Cooldown lock-outs, one-at-a-time commands and
   resting price ladders cost far more than premiums earned. Premiums do
   sometimes clear: P07 accepted 2 water for 3 food, and P01 2 water for 3
   components. So keep asking, but never stall supply to get them.
6. **Trades are evidence; advertisements are claims.** In run-37 several
   stations advertised "selling everything". In run-39 stations advertising
   food failed. Settled trades are reliable, and peers' bids above 1:1 are the
   clearest scarcity signal.
7. **Assume a slow server and dying counterparties.** Learn failures from
   results, and size offer lifetimes to the observed lag.
8. **Survival is a filter, not the reason to trade.** Refusing value because
   it doesn't change a doomed forecast (run-37, tick 46) throws away options.

## Standing decisions

These are rules the team has set. They override the fair-terms and gift
guidance in the [trading strategy](autonomous-trading-strategy.md).

- **Price floor ("MSRP").** We never receive fewer units than we give, and we
  send no gifts. The code reads MSRP as 1:1 unit parity; confirm if a
  different floor was meant.
- **Advertisements may list any resource**, including non-specialties we hold
  spare or broker. They are not limited to our specialty.
- **Better strategy over workarounds.** Don't design around teams whose
  clients were not running; run-37 was a test run with several of those.

## How to analyse a run

The journal is one JSON record per line. The most useful kinds:

| Kind | Use |
|---|---|
| `manifest` | Policy version, config, git commit, rules, starting state |
| `run-summary` | Outcome, failure tick, cumulative counters (written on shutdown) |
| `tick-summary` | Per-tick inventory, production, unmet upkeep, health, commands used |
| `command` / `sent` / `result` | Join by `requestId`: result codes, round trip, ticks of server lag |
| `decision` | Action and `rationale`; `explanation.plan` (room, value, urgent), `explanation.market` (station beliefs), `nextMemory` (failed stations, lag) |
| `state` | Full snapshot; the last one holds every offer and transaction involving us |

A sequence that has worked:

1. **Outcome:** `run-summary`, then the `tick-summary` timeline around the
   first shortage.
2. **Commands:** count result codes, and measure round trip plus processed
   tick minus send tick.
3. **Speed:** compare our state-to-decision time with the server's
   send-to-result time before blaming either side.
4. **Decisions:** group rationales into 20-tick bands. Long runs of "wait"
   during a shortage point at the plan or the market model; inspect
   `explanation.plan` and `explanation.market` at those ticks.
5. **Counterparties:** tabulate the final state's offers by counterparty,
   resource pair and status.
6. **Replay:** run the recorded states through the current `decide()`,
   converting numeric strings to bigints, to see what the new policy would
   have done. It is open-loop (the world doesn't react), but it catches
   regressions cheaply.

The replay and 120-tick simulation scripts used for runs 37–40 are not in the
repository yet.

## Open questions

- How are runs scored beyond survival?
- Will suppliers used to 1-unit trades accept 6-unit lots (the `market-5`
  default)?
- How often do peers accept premium asks? Evidence so far is a handful of
  acceptances.
- Do peers follow the same production blocks as us? *Inferred:* P08 stopping
  water sales around tick 31 of run-40 may have been its low-production block.
- Is 3 commands in flight safe under live lag? It is tested locally only.
- Does "MSRP" mean 1:1 unit parity?
