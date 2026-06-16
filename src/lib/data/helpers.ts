import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export function getPublicSupabase() {
  if (!isSupabaseConfigured()) return null;
  return createPublicClient();
}
