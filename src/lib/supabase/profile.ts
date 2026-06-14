import type { User } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function ensureUserProfile(supabase: SupabaseClient, user: User) {
  const { data: existing } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", user.id)
    .maybeSingle();

  if (existing) return existing;

  const metaRole = user.user_metadata?.role as string | undefined;
  const role = metaRole === "mentor" || metaRole === "admin" ? metaRole : "student";

  const { data: profile, error } = await supabase
    .from("profiles")
    .upsert(
      {
        id: user.id,
        email: user.email ?? "",
        full_name: (user.user_metadata?.full_name as string | undefined) ?? "",
        role,
      },
      { onConflict: "id", ignoreDuplicates: false },
    )
    .select("id, role")
    .single();

  if (error || !profile) throw error ?? new Error("Could not create profile");
  return profile;
}
