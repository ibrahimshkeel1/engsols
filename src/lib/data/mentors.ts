import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { Mentor, Review } from "@/types";
import type { DbMentorProfile } from "@/types/database";

async function loadReviews(mentorProfileId: string): Promise<Review[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("mentor_reviews")
    .select("rating, text, author_role, profiles(full_name)")
    .eq("mentor_profile_id", mentorProfileId)
    .order("created_at", { ascending: false })
    .limit(20);

  return (data ?? []).map((r) => ({
    author: (r.profiles as { full_name?: string } | null)?.full_name || "Anonymous",
    role: r.author_role || "Student",
    text: r.text,
    rating: r.rating,
  }));
}

export function dbToMentor(m: DbMentorProfile, reviews: Review[] = []): Mentor {
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
    reviews,
    avatarUrl: m.profiles?.avatar_url ?? null,
    calendlyUrl: (m as DbMentorProfile & { calendly_url?: string | null }).calendly_url ?? null,
    introCalendlyUrl: (m as DbMentorProfile & { intro_calendly_url?: string | null }).intro_calendly_url ?? null,
    studyPlanCalendlyUrl: (m as DbMentorProfile & { study_plan_calendly_url?: string | null }).study_plan_calendly_url ?? null,
    interviewCalendlyUrl: (m as DbMentorProfile & { interview_calendly_url?: string | null }).interview_calendly_url ?? null,
    verified: (m as DbMentorProfile & { verified?: boolean }).verified ?? false,
    introVideoUrl: (m as DbMentorProfile & { intro_video_url?: string | null }).intro_video_url ?? null,
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
  return data.map((m) => dbToMentor(m as DbMentorProfile));
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
  const reviews = await loadReviews(data.id);
  return dbToMentor(data as DbMentorProfile, reviews);
}

export async function getMentorsByDiscipline(discipline: string, limit = 3): Promise<Mentor[]> {
  const mentors = await getApprovedMentors();
  return mentors.filter((m) => m.discipline === discipline).slice(0, limit);
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
