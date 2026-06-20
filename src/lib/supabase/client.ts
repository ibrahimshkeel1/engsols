import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser client — uses Supabase HTTPS API (NEXT_PUBLIC_SUPABASE_URL).
 * For direct Postgres, use SUPABASE_DB_POOLER_URL (6543) server-side only; see connection-profile.ts.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
