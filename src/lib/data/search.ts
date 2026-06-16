import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type SearchResult = {
  type: "mentor" | "forum" | "portfolio" | "job";
  title: string;
  subtitle: string;
  href: string;
};

export async function searchPlatform(query: string): Promise<SearchResult[]> {
  if (!isSupabaseConfigured() || !query.trim()) return [];

  const supabase = createPublicClient();
  if (!supabase) return [];

  const q = query.trim();
  const pattern = `%${q}%`;
  const results: SearchResult[] = [];

  const [mentors, posts, portfolios, jobs] = await Promise.all([
    supabase
      .from("mentor_profiles")
      .select("slug, headline, company, discipline")
      .eq("status", "approved")
      .or(`headline.ilike.${pattern},company.ilike.${pattern},bio.ilike.${pattern}`)
      .limit(8),
    supabase
      .from("forum_posts")
      .select("slug, title, discipline")
      .or(`title.ilike.${pattern},body.ilike.${pattern}`)
      .limit(8),
    supabase
      .from("portfolios")
      .select("slug, headline, discipline, profiles(full_name)")
      .eq("published", true)
      .or(`headline.ilike.${pattern},bio.ilike.${pattern}`)
      .limit(8),
    supabase
      .from("jobs")
      .select("slug, title, discipline, company_slug")
      .eq("published", true)
      .or(`title.ilike.${pattern},description.ilike.${pattern}`)
      .limit(8),
  ]);

  for (const m of mentors.data ?? []) {
    results.push({
      type: "mentor",
      title: m.headline,
      subtitle: `${m.company} · ${m.discipline}`,
      href: `/mentors/${m.slug}`,
    });
  }
  for (const p of posts.data ?? []) {
    results.push({
      type: "forum",
      title: p.title,
      subtitle: p.discipline,
      href: `/forum/${p.slug}`,
    });
  }
  for (const p of portfolios.data ?? []) {
    const name = (p.profiles as { full_name?: string } | null)?.full_name || "Student";
    results.push({
      type: "portfolio",
      title: name,
      subtitle: p.headline,
      href: `/portfolios/${p.slug}`,
    });
  }
  for (const j of jobs.data ?? []) {
    results.push({
      type: "job",
      title: j.title,
      subtitle: `${j.company_slug} · ${j.discipline}`,
      href: `/jobs/${j.slug}`,
    });
  }

  return results;
}
