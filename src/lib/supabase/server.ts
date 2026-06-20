import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { assertOperationalConnectionProfile } from "@/lib/supabase/connection-profile";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/config";

export async function createClient() {
  assertOperationalConnectionProfile();

  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();

  if (!url || !key) {
    throw new Error("Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Component — middleware refreshes session
        }
      },
    },
  });
}
