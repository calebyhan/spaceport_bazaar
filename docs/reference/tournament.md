# Strategy tournament and scoring

[Documentation index](../README.md)

`npm run tournament` scores trading strategies against each other on the
[local simulation server](simulator.md). Every planet is a real worker
engine speaking the binary protocol over a real WebSocket. Strategies are
chosen by name from the [strategy catalog](../operations/strategies.md),
so any registered strategy can be evaluated without code changes.

```sh
npm run tournament                                   # defaults below, about 10 minutes
npm run tournament -- --candidates baseline --planets 9 --seeds 5 --tick-ms 50
```

| Option | Default | Meaning |
| --- | --- | --- |
| `--candidates` | `baseline` | Strategies to score |
| `--mode` | `both` | `everyone`, `field` or `both` (see below) |
| `--field` | `baseline` | Opponents for P02, P03, …, used in rotation in `field` mode |
| `--planets` | `3,6,9` | Planet counts; each builds a balanced economy |
| `--seeds` | `2` | A count (seeds 1..N) or a list such as `4,7` |
| `--duration` | 120 | Ticks per run |
| `--tick-ms` | 100 | Real time per tick |
| `--stock`, `--surplus` | 30, 50 | Starting units of each resource; production surplus in percent |
| `--out` | `.local/tournament/<time>` | Where `scoreboard.md` and `scoreboard.json` go |
| `--journals` | off | Keep every planet's journal, for the [journal tools](../operations/journal-tools.md) |

A trial runs every combination of mode, candidate, planet count and seed.
Each trial is a fresh world whose production is exactly balanced against
upkeep (see [simulator](simulator.md#balanced-economy)). Progress prints one
line per trial. `scoreboard.json` keeps every trial's server report.

## Two questions, two modes

- **`everyone`:** every planet runs the candidate. This answers: *if the
  whole class adopted this strategy, would every planet survive?*
- **`field`:** P01 runs the candidate while the other planets run a fixed
  rotation of opponents. This answers: *how does this strategy do for us
  when we do not control what classmates run?*

Baseline, surplus50, surplus25 and balanced are registered. The defaults still
use baseline; pass `--candidates baseline,surplus50,surplus25,balanced` to compare
all four. The former par, greedy and passive opponents have been removed. The
historical results below describe the retired catalog.

## Scoring

The score follows the handbook's objectives: the class wins only if no
planet ever reaches zero health, and prizes go to planets that end with the
most resources and lose the least health. Strategies are ranked
lexicographically, never by a weighted sum:

1. **Collective success rate:** the share of trials in which every planet
   survived.
2. **Our survival rate:** the share of our planets that never reached zero
   health (every planet in `everyone`, P01 in `field`).
3. **Health lost,** lowest first: the mean of every health drop on our
   planets, including drops after a failure.
4. **Final resources,** highest first, in `field` mode only: P01's total
   stock at the end.

**Prosperity** (final resources minus health lost) is shown as a single
headline number in `field` mode, but never ranks ahead of survival. `±` is
one standard deviation across our planets. The scoreboard also breaks every
figure down by planet count, and counts client failures (diagnosed engine
stops), which should be zero.

**Why resources are not compared in `everyone` mode.** When every planet runs
the candidate, trades only move resources between our own planets. Their
average final stock then differs only by upkeep that was never consumed, and
failing planets consume less. A small trial run showed this: greedy (every
planet failed) averaged 257.7 final units against baseline's 197.7 (every
planet survived). So `everyone` mode ranks and shows only survival and
health.

## Reading results responsibly

- Runs use real time, so decisions race with the tick clock. At 50 ms ticks,
  9 baseline planets made about 10% fewer trades and lost slightly more
  health than at 100 ms. Use the default for results you report, and more
  seeds when numbers are close.
- The opponents are deliberately simple and the economy is a hypothesis; see
  the simulator's [assumptions and omissions](simulator.md#assumptions-and-omissions).
  A tournament ranks strategies under these conditions. It does not predict
  a classroom run.
- Every figure comes from the server's own records (`World.report()`), never
  from what clients believe.

## Latest results

Default settings (`npm run tournament`): planets 3, 6 and 9; seeds 1 and 2;
120 ticks of 100 ms; 30 starting units; 50% surplus. The run took 48 trials
and about 10 minutes, with zero client failures. This table is a snapshot
from 2026-09-30; re-run it after strategy changes.

**Everyone runs the candidate**

| Rank | Strategy | Collective success | Our survival | Health lost |
| --- | --- | --- | --- | --- |
| 1 | par | 100% | 100% (36) | 0.0 ± 0.0 |
| 2 | baseline | 100% | 100% (36) | 2.1 ± 7.3 |
| 3 | greedy | 0% | 0% (36) | 100.0 ± 0.0 |
| 4 | passive | 0% | 0% (36) | 100.0 ± 0.0 |

**Candidate as P01 in a mixed field** (P02… rotate par, greedy, passive, baseline)

| Rank | Strategy | Collective success | Our survival | Health lost | Final resources | Prosperity |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | baseline | 0% | 67% (6) | 33.3 ± 51.6 | 318.0 ± 74.4 | 284.7 |
| 2 | par | 0% | 50% (6) | 87.5 ± 51.7 | 333.0 ± 72.8 | 245.5 |
| 3 | passive | 0% | 17% (6) | 92.5 ± 47.5 | 358.0 ± 61.3 | 265.5 |
| 4 | greedy | 0% | 0% (6) | 100.0 ± 0.0 | 450.0 ± 0.0 | 350.0 |

What the numbers say:

- **Baseline** keeps every planet alive when the whole class runs it, at 3, 6
  and 9 planets. It loses a little health at 6 and 9 planets, where `par` loses none;
  `--journals` plus the [journal tools](../operations/journal-tools.md) can
  show which shortages cause that. It is the best choice for us in the mixed
  field: P01 survived both 6-planet and both 9-planet trials.
- **No strategy survives 3 planets in the mixed field.** There P03 is
  `greedy`, the only producer of one resource, and it refuses to trade at
  par. This matches the exploratory finding that a single unresponsive or
  extractive supplier can doom its customers.
- **Collective success is 0% in every mixed-field trial,** because the greedy
  and passive opponents always fail. That ranking key only separates
  strategies in `everyone` mode.
- **Why the ranking is lexicographic.** As P01, `greedy` ends with the most
  resources and the highest prosperity (350), yet it failed in every trial.
  A weighted score would have ranked it first.
- **Health lost** counts every drop, including after a failure. A failed
  planet keeps producing and recovering and can be damaged again, so the
  total can exceed 100.

## Tests

`worker/tests/tournament.test.ts` checks:

- the lineups for each mode
- the ranking order and every statistic, against hand-computed synthetic
  trials, including that resources cannot outrank health in `everyone` mode
- the scoreboard text
- a real three-planet trial with a different strategy on each planet, which
  keeps a journal per planet
- a faulted trial, where every client failure is counted and the run still
  starts and finishes

`worker/tests/archetypes.test.ts` covers every opponent decision path with
hand-built snapshots.
