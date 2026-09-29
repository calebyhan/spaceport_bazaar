# Development environment

[Documentation index](../README.md)


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

## Install dependencies

Use Node 22 and run `npm ci` from the repository root. See the [testing guide](../testing.md) for verification and [worker operations](../operations/worker.md) for running a client.
