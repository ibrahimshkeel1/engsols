import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function getStudentOnboardingContext(userId: string) {
  if (!isSupabaseConfigured()) {
    return { goal: "", discipline: "", hasBasics: false };
  }

  const supabase = await createClient();
  const [{ data: profile }, { data: portfolio }] = await Promise.all([
    supabase.from("profiles").select("career_goals").eq("id", userId).single(),
    supabase.from("portfolios").select("discipline").eq("user_id", userId).maybeSingle(),
  ]);

  const goal = (profile?.career_goals as string[] | null)?.[0] ?? "";
  const discipline = portfolio?.discipline ?? "";

  return {
    goal,
    discipline,
    hasBasics: Boolean(goal && discipline),
  };
}
