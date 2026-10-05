import Link from "next/link";

import { formatTime, ms, resultOf, runHref, runState } from "@/app/_components/run-view";
import { journalRoot, listJournals, tryLoadRun } from "@/lib/journals";

export const dynamic = "force-dynamic";

// Every journal under the root, newest first, with the numbers that tell
// runs apart at a glance. Each row links to the full report.
export default function RunsPage() {
  const runs = listJournals().map(file => ({ file, ...tryLoadRun(file) }));
  const loaded = runs.flatMap(r => r.run ? [r.run] : []);
  const outcomes = loaded.filter(r => r.report.outcome);
  const survived = outcomes.filter(r => !r.report.outcome!.failed).length;
  return (
    <main>
      <header className="hero">
        <p className="eyebrow">Run history</p>
        <h1>Runs</h1>
        <p className="subtitle">Every worker journal under <code>{journalRoot()}</code>. Open a run for its charts, trades, problems and responsiveness.</p>
      </header>
      <section className="grid tiles" aria-label="Totals">
        <article className="card tile"><p className="label">Journals</p><strong>{runs.length}</strong><p>{loaded.filter(r => r.live).length} live now</p></article>
        <article className="card tile tone-good"><p className="label">Survived</p><strong>{survived}</strong><p>of {outcomes.length} with a snapshot</p></article>
        <article className="card tile tone-bad"><p className="label">Failed</p><strong>{outcomes.length - survived}</strong><p>health reached zero</p></article>
        <article className="card tile"><p className="label">Trades</p><strong>{loaded.reduce((n, r) => n + r.report.trades.length, 0)}</strong><p>completed across all runs</p></article>
      </section>
      <section className="panel" aria-label="All runs">
        {runs.length ? (
          <div className="table-wrap">
            <table className="runs">
              <thead><tr>{["Run", "Opened", "State", "Result", "Health", "Ticks", "Trades", "Rejected", "Disconnects", "Response p95"].map(h => <th key={h} scope="col">{h}</th>)}</tr></thead>
              <tbody>{runs.map(({ file, run, error }) => {
                if (!run) return <tr key={file.id}><td><code>{file.id}</code></td><td colSpan={9} className="down">Unreadable: {error}</td></tr>;
                const o = run.report.outcome, state = runState(run), result = resultOf(run);
                return (
                  <tr key={file.id}>
                    <td><Link href={runHref(file.id)}>{run.report.run ?? "Unidentified"}</Link><br /><span className="hint">{[run.report.station, run.report.strategy].filter(Boolean).map(part => `${part} · `)}<code>{file.id}</code></span></td>
                    <td>{formatTime(run.startedAt)}</td>
                    <td><span className={`badge ${state.tone}`}>{state.label}</span></td>
                    <td className={result.tone === "bad" ? "down" : result.tone === "good" ? "up" : undefined}>{result.label}</td>
                    <td>{o?.finalHealth ?? "—"}</td>
                    <td>{o ? `${o.lastTick} / ${o.duration}` : "—"}</td>
                    <td>{run.report.trades.length}</td>
                    <td>{run.report.commands.results - run.report.commands.ok}</td>
                    <td>{run.report.disconnections.length}</td>
                    <td>{ms(run.report.responsiveness.responseP95Ms)}</td>
                  </tr>
                );
              })}</tbody>
            </table>
          </div>
        ) : <p className="empty">No journals yet. Run the worker, the simulator or a tournament with <code>--journals</code>.</p>}
      </section>
    </main>
  );
}
