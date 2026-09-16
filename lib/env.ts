export type SupabaseEnvironment = {
  url: string;
  secretKey: string;
};

export function getSupabaseEnvironment(): SupabaseEnvironment | null {
  const url = process.env.SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;

  if (!url || !secretKey) {
    return null;
  }

  return { url, secretKey };
}
