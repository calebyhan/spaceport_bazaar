# Baseline: nine-client class validation

Baseline `market-5` passed all three local acceptance trials without a policy change.
Each used nine independent worker processes, nine distinct generated keys, local
durable journals, 120 one-second ticks, and 25% production surplus. Starting stock
was 30 per resource and upkeep was 1 per resource per tick, matching previously
observed class runs. Production used five 24-tick blocks with different seeded
orders. Baseline ran with default settings and generosity off.

| Seed | Survived | Trades | Fleet shortage ticks | Snapshot-to-send p99 | Sends over 1 second |
| --- | --- | --- | --- | --- | --- |
| 1 | 9/9 | 197 | 0 | 462.1 ms | 0 |
| 2 | 9/9 | 187 | 10 | 683.3 ms | 3 |
| 3 | 9/9 | 160 | 0 | 166.2 ms | 0 |

All three trials had zero worker failures, stale-state events and engine deadline
misses. All passed the timing gate (p99 below one second and server monotonic
duration within 10% of 120 seconds). Seed 2 had temporary shortages; survival
does not imply uninterrupted supply. Some sends exceeded one second, so these
results are not a hard latency guarantee. Wall-clock drift was observed again;
latency comparisons use monotonic timestamps.

The initial 60-tick experiment started with only 10 units per resource. These
120-tick results use the previously observed class starting stock of 30 and must
not be presented as proof for a 10-stock run. Confirm the new class server uses
the same settings. Local production orders and network/disk conditions are a
model of the class run, not evidence about the actual class server.

No baseline changes were needed to pass the tested survival requirement. The
`surplus25` policy remains available, but was not silently substituted for baseline.

Reproduce with the command in [the results JSON](baseline-class-results.json).
Raw evidence is under `.local/baseline-class-validation`; generated credentials
and journals are intentionally untracked. [Nine-client launch instructions](../operations/nine-clients.md)
describe how to run the actual spreadsheet keys and verify every final state.

The `worker:nine` launcher, using baseline at the time, also passed a separate local 120-tick trial at
25% surplus (seed 4): 9/9 survived, 184 exchanges settled, and
0 total shortage ticks were recorded. It verified the nine identities, common
run ID, terminal tick, advertised tick duration and collective success from the
workers' journals. Evidence is under `.local/nine-launcher-validation`. This
checks the launcher end to end; the timing table above covers the three dedicated
benchmark trials.

The launcher now defaults to the separate `class25` strategy; the seed-4 result
above remains baseline evidence. See the [class25 result](class25-results.json)
for its dedicated trial. Class-server verification is pending; local results do
not validate spreadsheet keys or the remote endpoint/configuration.
