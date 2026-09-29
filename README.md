# Spaceport Bazaar

A local trading worker and read-only operator dashboard for COMP 590H.
The worker owns the binary Protobuf WebSocket connection, journals decisions
and results, and optionally mirrors them to Supabase for the Next.js dashboard.

Start with the **[documentation index](docs/README.md)** for setup, worker
operations, testing, and protocol references.

```sh
npm ci
npm test
npm run test:validator
npm run build
```

Node 22 and Linux are required for the supplied validator; the
[Dev Container](docs/setup/development.md) provides that environment.

| Directory | Purpose |
| --- | --- |
| `app/`, `lib/` | Dashboard, health endpoint, database reads |
| `worker/` | Protocol engine, policy, durable persistence, worker tests |
| `tests/` | Dashboard and repository checks |
| `docs/` | Maintained project documentation |
| `supabase/migrations/` | Database schema |
| `artifacts/` | Supplied validator binaries, Protobuf schema, and original guide |

The [supplied exercise guide](artifacts/bazaar-protobuf-starter-linux/README.md)
and [schema](artifacts/bazaar-protobuf-starter-linux/bazaar.proto) remain in their
original bundle. Generated bindings in `worker/generated/` must be regenerated,
not edited manually.
