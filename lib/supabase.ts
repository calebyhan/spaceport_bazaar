import "server-only";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

import { getSupabaseEnvironment } from "@/lib/env";

export function getSupabaseAdmin(): SupabaseClient | null {
  const environment = getSupabaseEnvironment();

  if (!environment) {
    return null;
  }

  return createClient(environment.url, environment.secretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}
