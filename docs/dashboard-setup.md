# Dashboard setup

## 1. Set local secrets

Copy the template and replace both placeholder values with the server-side
values from the Supabase project:

```sh
cp .env.example .env.local
```

Use the project URL and a `sb_secret_...` key. `.env.local` is ignored by Git.
Share those values through a password manager or encrypted secret-sharing tool,
not in a commit, chat paste, or a public deployment variable.

## 2. Create the schema

In the Supabase project, open **SQL Editor**, paste the contents of
`supabase/migrations/20260916000000_initial_dashboard.sql`, and run it once.

The migration enables Row Level Security and does not give anonymous browsers
access to the tables. The dashboard's server and the eventual protocol worker
use the server-only secret key instead.

## 3. Run the dashboard

```sh
npm install
npm run dev
```

Open <http://localhost:3000>. Before the protocol worker is built, the page
will confirm the database connection and display an empty run state.

`GET /api/health` returns whether the server has Supabase credentials. It does
not expose the URL, key, or any database data.

## What comes next

The schema is ready for a single protocol worker to create a `runs` record,
append decoded inbound/outbound messages to `events`, upsert the newest state
into `current_snapshots`, and correlate sent commands in `commands`. That is
the next implementation step; the dashboard already reads this shape.

## Protocol worker

The standalone worker now records this schema when explicitly started with
`--supabase`. It also keeps a durable local journal. See
[worker setup and policy](autonomous-worker.md) for credentials, exercise and
autonomous modes, recovery behavior, and reproducible verification commands.
