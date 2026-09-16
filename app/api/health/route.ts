import { getSupabaseEnvironment } from "@/lib/env";

export function GET() {
  const configured = getSupabaseEnvironment() !== null;

  return Response.json(
    { service: "spaceport-bazaar-dashboard", databaseConfigured: configured },
    { status: configured ? 200 : 503 },
  );
}
