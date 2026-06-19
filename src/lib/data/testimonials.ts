import { featuredTestimonials } from "@/data/featured-testimonials";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { FeaturedTestimonial, Mentor } from "@/types";

async function loadTestimonialsFromReviews(limit: number): Promise<FeaturedTestimonial[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createPublicClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("mentor_reviews")
    .select("rating, text, author_role, mentor_profiles(slug, discipline, profiles(avatar_url, full_name)), profiles(full_name)")
    .gte("rating", 4)
    .order("created_at", { ascending: false })
    .limit(limit * 2);

  const results: FeaturedTestimonial[] = [];
  for (const row of data ?? []) {
    const text = row.text as string;
    if (!text || text.length < 40) continue;
    const mp = row.mentor_profiles as {
      slug?: string;
      discipline?: string;
      profiles?: { avatar_url?: string | null; full_name?: string };
    } | null;
    const author = (row.profiles as { full_name?: string } | null)?.full_name || "Student";
    results.push({
      quote: text,
      name: author,
      role: (row.author_role as string) || "Student",
      discipline: mp?.discipline || "Engineering",
      avatarUrl: mp?.profiles?.avatar_url ?? null,
      mentorSlug: mp?.slug,
    });
    if (results.length >= limit) break;
  }
  return results;
}

/** Merge live mentor reviews with curated stories for the homepage testimonials rail. */
export function buildFeaturedTestimonials(mentors: Mentor[], limit = 3): FeaturedTestimonial[] {
  const fromReviews: FeaturedTestimonial[] = [];

  for (const mentor of mentors) {
    for (const review of mentor.reviews) {
      if (review.rating < 4 || review.text.length < 40) continue;
      fromReviews.push({
        quote: review.text,
        name: review.author,
        role: review.role,
        discipline: mentor.discipline,
        avatarUrl: mentor.avatarUrl,
        mentorSlug: mentor.slug,
      });
      if (fromReviews.length >= limit) break;
    }
    if (fromReviews.length >= limit) break;
  }

  const merged = [...fromReviews];
  for (const story of featuredTestimonials) {
    if (merged.length >= limit) break;
    if (!merged.some((t) => t.quote === story.quote)) merged.push(story);
  }

  return merged.slice(0, limit);
}

export async function getFeaturedTestimonials(limit = 3): Promise<FeaturedTestimonial[]> {
  const fromDb = await loadTestimonialsFromReviews(limit);
  if (fromDb.length >= limit) return fromDb.slice(0, limit);

  const merged = [...fromDb];
  for (const story of featuredTestimonials) {
    if (merged.length >= limit) break;
    if (!merged.some((t) => t.quote === story.quote)) merged.push(story);
  }
  return merged.slice(0, limit);
}
