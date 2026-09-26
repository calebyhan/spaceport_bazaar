# Documentation

[Project overview](../README.md)

## Setup

- [Development environment](setup/development.md): Dev Container, Linux validator, dependencies.
- [Dashboard setup](setup/dashboard.md): Supabase schema, credentials, dashboard startup.

## Operations and development

- [Worker operations](operations/worker.md): exercise and autonomous modes, configuration, recovery, current policy behavior and limitations.
- [Testing](testing.md): verification commands, coverage scope, test quality and reports.

## Reference

- [Protocol and gameplay handbook](reference/protocol.md): canonical gameplay and client-design reference; live `State.rules` supplies run-specific values.
- [Trading strategy design](reference/strategy.md): broader strategy rationale and design proposals. For implemented behavior, use worker operations.
- [Supplied validator guide](../artifacts/bazaar-protobuf-starter-linux/README.md): authoritative local exercise instructions.
- [Protobuf schema](../artifacts/bazaar-protobuf-starter-linux/bazaar.proto): authoritative wire definitions.
- [Environment template](../.env.example) and [database migration](../supabase/migrations/20260916000000_initial_dashboard.sql).

## Maintaining documentation

Keep project guides under `docs/` and add new pages to this index. Setup belongs
in `setup/`, runtime procedures in `operations/`, and specifications/design in
`reference/`. Link to the canonical guide instead of copying command sequences.
The root README stays a short entry point. Root `AGENTS.md` and `CLAUDE.md` stay
where coding tools discover them; the supplied artifact guide stays with its
schema and binaries. Run `npm test` after moving documentation to check links.
