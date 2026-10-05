# Dashboard setup

[Documentation index](../README.md)

The dashboard has two sources:

| Page | Reads | Needs |
| --- | --- | --- |
| `/live` | the worker's local journal, refreshed every second | nothing: run it on the worker's machine |
| `/runs`, `/runs/<journal>` | every local journal, as a report per run | nothing |
| `/` (database mirror) | Supabase, refreshed every 2 seconds | the steps below and `npm run worker -- --supabase` |

## Live view and run reports (no setup)

```sh
npm run dev            # or: npm run build && npm start
npm run worker         # in another terminal, as usual
```

Open <http://localhost:3000/live>. It follows whichever worker is writing a
journal and picks up a new run within a second. With several workers (one per
planet in a [local simulation](../reference/simulator.md)) a row of buttons
chooses one. With none, it shows the most recent run.

<http://localhost:3000/runs> lists every journal with its result, health,
ticks, trades, rejections, disconnects and response time. A run's page has:

- outcome tiles (result, ticks, short ticks, trades, commands, disconnects,
  response p95, final stock)
- closing stock and health charts per tick, with shortage ticks marked, and
  the same numbers as a table
- trade totals per resource and counterparty, and every trade
- shortages, rejected requests, disconnected and stale periods, failures
- responsiveness, and Markdown or JSON downloads of the report

Each offer links to its trace (`?offer=ID`; `?request=ID` also works), the same
text as `npm run journal:trace`. These pages use the
[journal tools](../operations/journal-tools.md)' readers, so their numbers match
the CLI. A journal is read once and then only its new lines, so refreshing a
long run stays cheap.

Journals are found under `.local` (up to six folders deep), which covers
`.local/journal`, simulator `journal-P0n` folders and tournament
`--journals` output. Set `BAZAAR_JOURNAL_ROOT` for the dashboard to look
elsewhere. Only files found there can be opened.

## Database mirror

Use this to watch a run from somewhere other than the worker's machine.

### 1. Set local secrets

Copy the template and replace both placeholder values with the server-side
values from the Supabase project:

```sh
cp .env.example .env.local
```

Use the project URL and a `sb_secret_...` key. `.env.local` is ignored by Git.
Share those values through a password manager or encrypted secret-sharing tool,
not in a commit, chat paste, or a public deployment variable.

### 2. Create the schema

In the Supabase project, open **SQL Editor**, paste the contents of
`supabase/migrations/20260916000000_initial_dashboard.sql`, and run it once.

The migration enables Row Level Security and does not give anonymous browsers
access to the tables. The dashboard's server and the protocol worker
use the server-only secret key instead.

### 3. Run the dashboard

```sh
npm ci
npm run dev
```

Open <http://localhost:3000>. The page confirms the database connection and displays an empty run state
until the worker records its first snapshot, then updates every 2 seconds.

`GET /api/health` returns whether the server has Supabase credentials. It does
not expose the URL, key, or any database data.

## Protocol worker

The standalone worker now records this schema when explicitly started with
`--supabase`. It also keeps a durable local journal. See
[worker setup and policy](../operations/worker.md) for credentials, exercise and
autonomous modes, recovery behavior, and reproducible verification commands.
