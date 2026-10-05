import Link from "next/link";

import { AutoRefresh } from "@/app/_components/auto-refresh";
import { EVENT_WINDOW } from "@/lib/responsiveness";
import { loadDashboard } from "@/lib/dashboard";

export const dynamic = "force-dynamic";

function formatTime(value: string | null): string {
  if (!value) return "—";

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(new Date(value));
}

export default async function HomePage() {
  const dashboard = await loadDashboard();
  const inventory = dashboard.snapshot?.inventory;

  return (
    <main>
      {dashboard.configuration === "ready" ? <AutoRefresh intervalMs={2000} /> : null}
      <header className="hero">
        <p className="eyebrow">Spaceport Bazaar · database mirror</p>
        <h1>Run status</h1>
        <p className="subtitle">
          The worker&apos;s Supabase mirror (<code>npm run worker -- --supabase</code>), for viewing a run away from the worker&apos;s machine. On the same machine, the <Link href="/live">live view</Link> reads the local journal directly.
        </p>
        <span className={`status status-${dashboard.configuration}`}>
          {dashboard.configuration === "ready" ? "Database connected" : "Setup needed"}
        </span>
      </header>

      {dashboard.message ? <p className="notice">{dashboard.message}</p> : null}

      <section className="grid" aria-label="Current run">
        <article className="card">
          <p className="label">Active run</p>
          <strong>{dashboard.run?.externalId ?? "No recorded run"}</strong>
          <p>{dashboard.run ? `${dashboard.run.stationId} · ${dashboard.run.status}` : "Start the worker to create one."}</p>
        </article>
        <article className="card">
          <p className="label">Simulation</p>
          <strong>Tick {dashboard.snapshot?.tick ?? "—"}</strong>
          <p>World version {dashboard.snapshot?.worldVersion ?? "—"}</p>
        </article>
        <article className="card">
          <p className="label">Last update</p>
          <strong>{formatTime(dashboard.snapshot?.updatedAt ?? null)}</strong>
          <p>Run started {formatTime(dashboard.run?.startedAt ?? null)}</p>
        </article>
        <article className="card">
          <p className="label">Client activity</p>
          <strong>{dashboard.responsiveness.activity ? (dashboard.responsiveness.activity.stalled ? "Stalled or telemetry delayed" : dashboard.responsiveness.activity.state) : "Unknown"}</strong>
          <p>{dashboard.responsiveness.activity?.reason ?? "No live activity evidence"}</p>
        </article>
      </section>

      <section className="panel responsiveness" aria-label="Responsiveness evidence">
        <p className="label">Measure responsiveness</p>
        <h2>Decision and response evidence</h2>
        <p>Latest {EVENT_WINDOW} recorded events. Typical is the median; slow is the 95th percentile. Updates automatically.</p>
        <table>
          <thead><tr><th>Measurement</th><th>Samples</th><th>Typical (ms)</th><th>Slow p95 (ms)</th><th>Maximum (ms)</th></tr></thead>
          <tbody>{([
            ["queue", "Waiting to evaluate"], ["decision", "Making a decision"],
            ["response", "Awaiting server response"], ["event", "Handling an update"],
          ] as const).map(([metric, label]) => {
            const timing = dashboard.responsiveness.timings[metric];
            return <tr key={metric}><th scope="row">{label}</th><td>{timing.samples}</td>
              <td>{timing.medianMs?.toFixed(2) ?? "—"}</td><td>{timing.p95Ms?.toFixed(2) ?? "—"}</td><td>{timing.maxMs?.toFixed(2) ?? "—"}</td></tr>;
          })}</tbody>
        </table>
        <dl className="inventory">
          <div><dt>Decisions</dt><dd>{dashboard.responsiveness.decisions}</dd></div>
          <div><dt>Intentional waits</dt><dd>{dashboard.responsiveness.intentionalWaits}</dd></div>
          <div><dt>Missed deadlines</dt><dd>{dashboard.responsiveness.missedDeadlines}</dd></div>
          <div><dt>Decision deadlines missed</dt><dd>{dashboard.responsiveness.decisionDeadlines}</dd></div>
          <div><dt>Response deadlines missed</dt><dd>{dashboard.responsiveness.responseDeadlines}</dd></div>
          <div><dt>Updates while busy</dt><dd>{dashboard.responsiveness.updatesWhileBusy}</dd></div>
        </dl>
      </section>

      <section className="panels">
        <article className="panel">
          <div className="panel-heading">
            <div>
              <p className="label">Inventory</p>
              <h2>Current station resources</h2>
            </div>
          </div>
          <dl className="inventory">
            <div><dt>Water</dt><dd>{inventory?.water ?? "—"}</dd></div>
            <div><dt>Food</dt><dd>{inventory?.food ?? "—"}</dd></div>
            <div><dt>Components</dt><dd>{inventory?.components ?? "—"}</dd></div>
          </dl>
        </article>

        <article className="panel">
          <p className="label">Recent events</p>
          <h2>Protocol timeline</h2>
          {dashboard.events.length === 0 ? (
            <p className="empty">No events recorded yet.</p>
          ) : (
            <ol className="timeline">
              {dashboard.events.map((event) => (
                <li key={event.id}>
                  <span className={`direction ${event.direction}`}>{event.direction}</span>
                  <strong>{event.kind}</strong>
                  <time>{formatTime(event.created_at)}</time>
                </li>
              ))}
            </ol>
          )}
        </article>
      </section>
    </main>
  );
}
