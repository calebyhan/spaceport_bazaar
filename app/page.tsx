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
      <header className="hero">
        <p className="eyebrow">Spaceport Bazaar · operator console</p>
        <h1>Run status</h1>
        <p className="subtitle">
          The validator stays local; this dashboard reads the shared event record.
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
