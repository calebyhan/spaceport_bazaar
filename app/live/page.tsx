import Link from "next/link";

import { AutoRefresh } from "@/app/_components/auto-refresh";
import { RunBody, RunHeader, runHref } from "@/app/_components/run-view";
import { activeJournals, listJournals, tryLoadRun } from "@/lib/journals";

export const dynamic = "force-dynamic";

type Search = Promise<Record<string, string | string[] | undefined>>;

// Follows whichever worker is writing now. With several (one per planet in
// a local simulation) a picker chooses; with none, the most recent run shows.
export default async function LivePage({ searchParams }: { searchParams: Search }) {
  const { run: wanted } = await searchParams;
  const files = listJournals(), active = activeJournals(files);
  const file = active.find(f => f.id === wanted) ?? active[0] ?? files[0];
  if (!file) {
    return (
      <main>
        <AutoRefresh intervalMs={1000} />
        <header className="hero">
          <p className="eyebrow">Live run</p>
          <h1>Waiting for a worker</h1>
          <p className="subtitle">No journal yet. Start the worker (<code>npm run worker</code>) and this page picks it up within a second.</p>
        </header>
      </main>
    );
  }
  const loaded = tryLoadRun(file);
  return (
    <main>
      <AutoRefresh intervalMs={1000} />
      {active.length > 1 ? (
        <nav className="picker" aria-label="Active workers">
          {active.map(f => <Link key={f.id} href={`/live?run=${encodeURIComponent(f.id)}`} aria-current={f === file ? "page" : undefined}>{f.id}</Link>)}
        </nav>
      ) : null}
      {active.length ? null : (
        <p className="notice">No worker is writing a journal right now. Showing the most recent run; this page switches to the next run as soon as it starts.</p>
      )}
      {loaded.run ? (
        <>
          <RunHeader run={loaded.run} eyebrow="Live run" />
          <RunBody run={loaded.run} />
          <p className="downloads"><Link href={runHref(file.id)}>Open the full run page</Link></p>
        </>
      ) : <p className="notice">Could not read <code>{file.id}</code>: {loaded.error}</p>}
    </main>
  );
}
