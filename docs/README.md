# Documentation

[Project overview](../README.md)

## Setup

- [Development environment](setup/development.md): Dev Container, Linux validator, dependencies.
- [Dashboard setup](setup/dashboard.md): live view and run reports from local journals; strategy selection and startup.

## Operations and development

- [Strategy selection and offline checks](operations/strategies.md): configure a policy, check a JSON state/offer, and replace transport or logging adapters.
- [Nine-client class demonstration](operations/nine-clients.md): local rehearsal, nine-key setup, class25 defaults and verification.
- [Worker operations](operations/worker.md): exercise and autonomous modes, configuration, recovery, current policy behavior and limitations.
- [Connection lifecycle and failure diagnosis](operations/diagnostics.md): lifecycle stages, stale state, failure categories and exit codes.
- [Journal tools](operations/journal-tools.md): live status, per-offer traces and run reports from a journal.
- [Testing](testing.md): verification commands, coverage scope, test quality and reports.

## Reference

- [Protocol and gameplay handbook](reference/protocol.md): canonical gameplay and client-design reference; live `State.rules` supplies run-specific values.
- [Trading strategy design](reference/strategy.md): broader strategy rationale and design proposals. For implemented behavior, use worker operations.
- [One-second survival assessment](reference/one-second-survival.md): implemented surplus policies, timing diagnosis and local results.
- [Baseline nine-client validation](reference/baseline-class-validation.md): original 120-tick survival evidence and its limits.
- [Responsiveness assessment](reference/responsiveness.md): timing instrumentation, independent deadlines and measured responsiveness.
- [Local simulation server](reference/simulator.md): multi-planet test server, balanced economy, and what it does not simulate.
- [Strategy tournament and scoring](reference/tournament.md): score catalog strategies against each other on the simulator.
- [Self-assessment evidence](self-assessment.md): the command and expected result behind each rating in sections 1, 2 and 6.
- [Supplied validator guide](../artifacts/bazaar-protobuf-starter-linux/README.md): authoritative local exercise instructions.
- [Protobuf schema](../artifacts/bazaar-protobuf-starter-linux/bazaar.proto): authoritative wire definitions.
- [Environment template](../.env.example).

## Run findings

- [Live run learnings](live-run-learnings.md): per-run postmortems and the standing decisions they produced.
- [Game mechanics learnings](game-mechanics-learnings.md): observed server mechanics and market behavior across runs.
- [Real-run logging note](real-run-logging-note.md): what the journal must record for post-run analysis.

## Maintaining documentation

Keep project guides under `docs/` and add new pages to this index. Setup belongs
in `setup/`, runtime procedures in `operations/`, specifications/design in
`reference/`, and run findings at the top level. Link to the canonical guide instead of copying command sequences.
The root README stays a short entry point. Root `AGENTS.md` and `CLAUDE.md` stay
where coding tools discover them; the supplied artifact guide stays with its
schema and binaries. Run `npm test` after moving documentation to check links.
