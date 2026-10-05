import { notFound } from "next/navigation";

import { AutoRefresh } from "@/app/_components/auto-refresh";
import { RunBody, RunHeader, Trace } from "@/app/_components/run-view";
import { findJournal, traceRun, tryLoadRun } from "@/lib/journals";

export const dynamic = "force-dynamic";

const one = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;

// One run's report. While its worker is still writing, the page refreshes
// itself; `?offer=ID` or `?request=ID` adds that offer's or command's trace.
export default async function RunPage({ params, searchParams }: {
  params: Promise<{ id: string[] }>; searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ id }, query] = await Promise.all([params, searchParams]);
  const file = findJournal(id.map(decodeURIComponent).join("/"));
  if (!file) notFound();
  const loaded = tryLoadRun(file);
  if (!loaded.run) return <main><p className="notice">Could not read <code>{file.id}</code>: {loaded.error}</p></main>;
  const offer = one(query.offer), request = offer ? undefined : one(query.request);
  const trace = offer || request ? await traceRun(file, { offer, request }) : undefined;
  return (
    <main>
      {loaded.run.live ? <AutoRefresh intervalMs={1000} /> : null}
      <RunHeader run={loaded.run} eyebrow={loaded.run.live ? "Live run" : "Run report"} />
      {trace ? <Trace target={offer ? `Offer ${offer}` : `Request ${request}`} text={trace.text} /> : null}
      <RunBody run={loaded.run} />
    </main>
  );
}
