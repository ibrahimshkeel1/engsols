import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/config";

/** Read-only Supabase client — safe for build time and public data (no cookies). */
export function createPublicClient() {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  if (!url || !key) return null;
  return createSupabaseClient(url, key);
}
