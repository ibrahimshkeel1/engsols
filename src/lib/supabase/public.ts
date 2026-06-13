import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/** Read-only Supabase client — safe for build time and public data (no cookies). */
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createSupabaseClient(url, key);
}
