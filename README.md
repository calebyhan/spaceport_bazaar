# Spaceport Bazaar

COMP 590H project workspace for a collaborative trading client and operator
dashboard. Our client controls station **P01** in the supplied two-planet
practice scenario.

The authoritative protocol exercise is the supplied
[starter guide](artifacts/bazaar-protobuf-starter-linux/README.md); the
[Protobuf schema](artifacts/bazaar-protobuf-starter-linux/bazaar.proto) is the
source of truth for every wire message.

The [agent-readable handbook](docs/spaceport-bazaar-agent-readable.md) is the
canonical gameplay and client-design reference. It complements the schema with
the simulation rules and class objective; use the live `State.rules` snapshot
for the configuration of a particular run.

## Development setup

Use the included Dev Container. It gives macOS (including Apple Silicon) and
Windows developers the same Linux environment, which is required by the
validator binaries.

1. Install Docker Desktop and the VS Code **Dev Containers** extension.
2. Open this repository in VS Code and choose **Dev Containers: Reopen in
   Container**.
3. In the container, start the local exercise server:

   ```sh
   ./scripts/start-validator.sh
   ```

4. In another container terminal, read the generated
   `validation-credentials.json` and connect P01's client to
   `ws://127.0.0.1:3001/ws`.

The launcher detects the container CPU at runtime: an M-series Mac gets the
Linux ARM64 validator and a typical Windows Docker/WSL environment gets the
Linux x86-64 validator. Both the client and validator must run in the same
container because the validator only accepts loopback connections.

To use a different port or save the generated files somewhere else, pass the
validator arguments through:

```sh
./scripts/start-validator.sh --addr 127.0.0.1:3002 \
  --credential-file .local/credentials.json --report .local/report.json
```

`validation-credentials.json` contains a short-lived local bearer token and is
intentionally ignored by Git.

### Coding-assistant state

The container includes `codex` and `claude`. The container user's home lives
in a Docker volume outside the repository, so chats, settings, and
container-side authentication survive a rebuild. Sign in once per developer
from the container:

```sh
codex
claude
```

The first sign-in is intentionally per container: credentials stored in macOS
Keychain or Windows Credential Manager cannot be safely shared with Linux.
After signing in, rebuilding this Dev Container will retain the Linux-side
assistant state. Removing the `spaceport-bazaar-node-home` Docker volume is the
deliberate way to erase that state.

## Project direction

We are building more than a script that completes the exercise: a local-first
web application that makes the Bazaar state legible and eventually helps drive
AI-assisted decisions. A useful first shape is:

```text
Practice server <-> protocol worker <-> shared database <-> web dashboard
                              |                    ^
                              +-> event log -------+
                              +-> strategy/AI jobs (later)
```

- **Protocol worker:** the single WebSocket owner. It encodes commands,
  continuously decodes binary Protobuf messages, and writes immutable events
  plus current state. Keeping one owner avoids duplicate command submissions.
- **Shared database:** enables two teammates to view the same run, state
  history, command outcomes, and annotations. Start locally with Postgres in
  Docker; move the same schema to a hosted Postgres instance when remote
  collaboration is needed.
- **Web dashboard:** reads the persisted state rather than connecting directly
  to the validator. It can show inventory, offers, advertisements,
  transactions, protocol errors, scenario progress, and a live event timeline.
- **Strategy/AI layer (later):** consumes the event log and a structured
  snapshot, proposes actions with rationale and confidence, and always leaves
  the protocol worker in charge of validation and sending.

This separation also makes the project testable: replay recorded events into
the dashboard or strategy logic without needing a live validator.

## Suggested milestones

1. Define the TypeScript Protobuf bindings and a small protocol worker that
   completes the supplied validator scenario reliably.
2. Persist raw events and normalized current state in Postgres; add run and
   event identifiers from day one.
3. Build a dashboard with the current snapshot, event timeline, and explicit
   command/result correlation via `request_id`.
4. Add collaboration: a shared hosted Postgres database and a deployed
   read-only dashboard, with one designated worker owner per live run.
5. Add AI/strategy experiments as advisory jobs, recording prompts, proposed
   actions, evaluations, and final human/worker decisions for later analysis.

## Repository map

```text
.devcontainer/                         Reproducible Linux development setup
artifacts/bazaar-protobuf-starter-linux/ Validator, schema, and exercise guide
scripts/start-validator.sh              Architecture-aware validator launcher
```

## Protocol guardrails

- Send and receive binary Protobuf WebSocket frames—never JSON/Base64.
- First read `state`, then send `ready`; wait for `readiness.ready: true`.
- Copy `run_id` from the current state into every command.
- Treat each state as a full snapshot, and correlate command outcomes using
  `request_id`.
- Follow the exact order in the supplied exercise. New commands out of order
  end the practice scenario.
