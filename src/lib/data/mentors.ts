import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Mentor } from "@/types";
import type { DbMentorProfile } from "@/types/database";

function dbToMentor(m: DbMentorProfile): Mentor {
  const name = m.profiles?.full_name || "Mentor";
  return {
    slug: m.slug,
    name,
    headline: m.headline,
    company: m.company,
    discipline: m.discipline,
    subFields: m.sub_fields,
    skills: m.skills,
    goals: m.goals,
    rating: Number(m.rating),
    reviewCount: m.review_count,
    monthlyRate: m.monthly_rate,
    introCallRate: 0,
    yearsExperience: m.years_experience,
    bio: m.bio,
    credentials: m.credentials,
    featured: m.featured,
    reviews: [],
  };
}

export async function getApprovedMentors(): Promise<Mentor[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createPublicClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("mentor_profiles")
    .select("*, profiles(*)")
    .eq("status", "approved")
    .order("featured", { ascending: false })
    .order("rating", { ascending: false });

  if (error || !data?.length) return [];
  return data.map(dbToMentor);
}

export async function getMentorBySlug(slug: string): Promise<Mentor | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = createPublicClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("mentor_profiles")
    .select("*, profiles(*)")
    .eq("slug", slug)
    .eq("status", "approved")
    .single();

  if (!data) return null;
  return dbToMentor(data as DbMentorProfile);
}

export async function getAllMentorProfilesForAdmin() {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("mentor_profiles")
    .select("*, profiles(*)")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getMentorProfileByUserId(userId: string) {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("mentor_profiles")
    .select("*")
    .eq("user_id", userId)
    .single();
  return data;
}
