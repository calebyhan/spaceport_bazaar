import type { NextRequest } from "next/server";

import { findJournal, tryLoadRun } from "@/lib/journals";
import { json } from "@/worker/serialization";
import { formatReport } from "@/worker/audit/report";

// The same report as `npm run journal:report`, for download.
export function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id") ?? "";
  const file = findJournal(id);
  if (!file) return Response.json({ error: "No such journal" }, { status: 404 });
  const loaded = tryLoadRun(file);
  if (!loaded.run) return Response.json({ error: loaded.error }, { status: 500 });
  const name = `${loaded.run.report.run ?? "run"}-${loaded.run.report.station || "station"}`.replace(/[^\w-]/g, "_");
  if (request.nextUrl.searchParams.get("format") === "json") {
    return new Response(json(loaded.run.report), { headers: { "content-type": "application/json", "content-disposition": `attachment; filename="${name}.json"` } });
  }
  return new Response(formatReport(loaded.run.report) + "\n", { headers: { "content-type": "text/markdown; charset=utf-8", "content-disposition": `attachment; filename="${name}.md"` } });
}
