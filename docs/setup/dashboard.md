# Dashboard setup

[Documentation index](../README.md)

All dashboard views read local journals:

| Page | Reads | Needs |
| --- | --- | --- |
| `/live` | the worker's local journal, refreshed every second | nothing: run it on the worker's machine |
| `/runs`, `/runs/<journal>` | every local journal, as a report per run | nothing |
| `/` | redirects to `/live` | nothing |

## Live view and run reports (no setup)

```sh
npm run dev            # or: npm run build && npm start
npm run worker         # in another terminal, as usual
```

Open <http://localhost:3000/live>. It follows whichever worker is writing a
journal and picks up a new run within a second. With several workers (one per
planet in a [local simulation](../reference/simulator.md)) a row of buttons
chooses one. With none, it shows the most recent run.

The **generous mode** switch at the top of `/live` changes how the running
worker trades from its next decision onward; see
[generous mode](../operations/strategies.md#generous-mode-a-live-switch). It
writes `.local/controls.json` (or `BAZAAR_CONTROL_FILE`), so the dashboard and
worker must share a machine. The dashboard has no login, so keep it on
localhost.

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

Once a journal has been quiet for a few seconds and has a snapshot, its report is
saved beside it as `<journal>.report.json`, so a server restart does not parse
hundreds of megabytes again. The copy is used only while the journal's size and
modification time are unchanged, so it can be deleted at any time. A journal that
is still being written is never cached.

Journals are found under `.local` (up to six folders deep), which covers
`.local/journal`, simulator `journal-P0n` folders and tournament
`--journals` output. Set `BAZAAR_JOURNAL_ROOT` for the dashboard to look
elsewhere. Only files found there can be opened.

## Strategy selection and health

The strategy buttons select baseline, 50% surplus, 25% surplus or balanced supply
for the next worker process. An explicit CLI `--strategy` takes precedence.
Generosity is a live baseline setting; the three survival policies always use
cooperative par trading. See [strategy selection](../operations/strategies.md).

`GET /api/health` reports process liveness and `persistence: "local-journal"`.
It does not claim the worker is connected or the disk is writable; the live view
shows run health. No database keys or schema setup are needed. Supabase support
and the `--supabase` worker option have been removed.
