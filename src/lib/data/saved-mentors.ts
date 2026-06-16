import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Mentor } from "@/types";

export async function getSavedMentorSlugs(userId: string): Promise<string[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("saved_mentors")
    .select("mentor_slug")
    .eq("user_id", userId);
  return (data ?? []).map((r) => r.mentor_slug);
}

export async function getSavedMentors(userId: string): Promise<Mentor[]> {
  const slugs = await getSavedMentorSlugs(userId);
  if (!slugs.length) return [];

  const supabase = createPublicClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("mentor_profiles")
    .select("*, profiles(*)")
    .in("slug", slugs)
    .eq("status", "approved");

  if (!data?.length) return [];

  const { dbToMentor } = await import("@/lib/data/mentors");
  return data.map((m) => dbToMentor(m));
}

export async function isMentorSaved(userId: string, mentorSlug: string): Promise<boolean> {
  if (!isSupabaseConfigured()) return false;
  const supabase = await createClient();
  const { data } = await supabase
    .from("saved_mentors")
    .select("mentor_slug")
    .eq("user_id", userId)
    .eq("mentor_slug", mentorSlug)
    .maybeSingle();
  return !!data;
}
