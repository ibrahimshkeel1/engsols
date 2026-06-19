import type { SupabaseClient, User } from "@supabase/supabase-js";
import { ensureUserProfile } from "@/lib/supabase/profile";
import { getSafeNextPath } from "@/lib/safe-next";

/** Same routing rules as email/password sign-in — used by OAuth callback too. */
export async function resolvePostAuthRedirectPath(
  supabase: SupabaseClient,
  user: User,
  nextPath?: string | null,
): Promise<string> {
  const profile = await ensureUserProfile(supabase, user);

  const safeNext = getSafeNextPath(nextPath ?? undefined);
  if (safeNext) return safeNext;

  if (profile.role === "admin") return "/admin";

  if (profile.role === "mentor") {
    const { data: mentorProfile } = await supabase
      .from("mentor_profiles")
      .select("status")
      .eq("user_id", user.id)
      .maybeSingle();
    if (!mentorProfile) return "/onboarding/mentor";
    if (mentorProfile.status === "approved") return "/mentor";
    return "/apply";
  }

  const { data: portfolio } = await supabase
    .from("portfolios")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!portfolio) return "/onboarding/student";
  return "/";
}
