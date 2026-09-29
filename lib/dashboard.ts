import "server-only";
import { EVENT_WINDOW, summarizeResponsiveness, type Responsiveness } from "./responsiveness";

import { getSupabaseAdmin } from "@/lib/supabase";

export type DashboardEvent = {
  id: number;
  direction: "inbound" | "outbound" | "internal";
  kind: string;
  created_at: string;
  payload?: Record<string, unknown>;
};

export type DashboardData = {
  configuration: "missing" | "ready" | "error";
  message?: string;
  run: {
    externalId: string;
    stationId: string;
    status: string;
    startedAt: string;
  } | null;
  snapshot: {
    inventory: Record<string, number> | null;
    tick: number | null;
    worldVersion: number | null;
    updatedAt: string | null;
  } | null;
  events: DashboardEvent[];
  responsiveness: Responsiveness;
};

type RunRow = {
  id: string;
  external_run_id: string;
  station_id: string;
  status: string;
  started_at: string;
};

type SnapshotRow = {
  inventory: Record<string, number> | null;
  tick: number | null;
  world_version: number | null;
  updated_at: string;
};

function emptyDashboard(configuration: DashboardData["configuration"], message?: string): DashboardData {
  return { configuration, message, run: null, snapshot: null, events: [], responsiveness: summarizeResponsiveness([]) };
}

export async function loadDashboard(): Promise<DashboardData> {
  const supabase = getSupabaseAdmin();

  if (!supabase) {
    return emptyDashboard(
      "missing",
      "Copy .env.example to .env.local, then add the Supabase URL and secret key.",
    );
  }

  const { data: runs, error: runError } = await supabase
    .from("runs")
    .select("id, external_run_id, station_id, status, started_at")
    .order("started_at", { ascending: false })
    .limit(1);

  if (runError) {
    return emptyDashboard("error", `Database unavailable: ${runError.message}`);
  }

  const run = (runs?.[0] ?? null) as RunRow | null;
  if (!run) {
    return { configuration: "ready", run: null, snapshot: null, events: [], responsiveness: summarizeResponsiveness([]) };
  }

  const [snapshotResponse, eventsResponse] = await Promise.all([
    supabase
      .from("current_snapshots")
      .select("inventory, tick, world_version, updated_at")
      .eq("run_id", run.id)
      .maybeSingle(),
    supabase
      .from("events")
      .select("id, direction, kind, created_at, payload")
      .eq("run_id", run.id)
      .order("id", { ascending: false })
      .limit(EVENT_WINDOW),
  ]);

  if (snapshotResponse.error || eventsResponse.error) {
    const message =
      snapshotResponse.error?.message ?? eventsResponse.error?.message ?? "Unknown database error";
    return emptyDashboard("error", `Database unavailable: ${message}`);
  }

  const snapshot = snapshotResponse.data as SnapshotRow | null;
  const recordedEvents = (eventsResponse.data ?? []) as DashboardEvent[];
  return {
    configuration: "ready",
    run: {
      externalId: run.external_run_id,
      stationId: run.station_id,
      status: run.status,
      startedAt: run.started_at,
    },
    snapshot: snapshot
      ? {
          inventory: snapshot.inventory,
          tick: snapshot.tick,
          worldVersion: snapshot.world_version,
          updatedAt: snapshot.updated_at,
        }
      : null,
    events: recordedEvents.filter(event => event.kind !== "responsiveness").slice(0, 8),
    responsiveness: summarizeResponsiveness(recordedEvents),
  };
}
