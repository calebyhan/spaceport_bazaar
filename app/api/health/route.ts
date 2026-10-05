// Process liveness only. Run/connection health is shown by the local live view.
export function GET() {
  return Response.json({ service: "spaceport-bazaar-dashboard", persistence: "local-journal" });
}
