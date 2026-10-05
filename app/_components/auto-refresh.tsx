"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Re-renders the current server page on an interval so a running worker's
// journal (or the database mirror) shows up without a manual reload. Hidden
// tabs skip refreshes.
export function AutoRefresh({ intervalMs }: { intervalMs: number }) {
  const router = useRouter();
  useEffect(() => {
    const timer = setInterval(() => { if (!document.hidden) router.refresh(); }, intervalMs);
    return () => clearInterval(timer);
  }, [router, intervalMs]);
  return <p className="live-indicator" role="status"><span aria-hidden="true" />Live · updates every {intervalMs / 1000} s</p>;
}
