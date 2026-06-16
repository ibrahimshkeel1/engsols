import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type SearchResult = {
  type: "mentor" | "forum" | "portfolio" | "job";
  title: string;
  subtitle: string;
  href: string;
};

const typeMap: Record<string, SearchResult["type"]> = {
  mentor: "mentor",
  forum: "forum",
  portfolio: "portfolio",
  job: "job",
};

async function searchFallback(query: string): Promise<SearchResult[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];

  const pattern = `%${query.trim()}%`;
  const results: SearchResult[] = [];

  const [mentors, posts, portfolios, jobs] = await Promise.all([
    supabase.from("mentor_profiles").select("slug, headline, company, discipline").eq("status", "approved").or(`headline.ilike.${pattern},company.ilike.${pattern},bio.ilike.${pattern}`).limit(8),
    supabase.from("forum_posts").select("slug, title, discipline").or(`title.ilike.${pattern},body.ilike.${pattern}`).limit(8),
    supabase.from("portfolios").select("slug, headline, discipline, profiles(full_name)").eq("published", true).or(`headline.ilike.${pattern},bio.ilike.${pattern}`).limit(8),
    supabase.from("jobs").select("slug, title, discipline").eq("published", true).or(`title.ilike.${pattern},description.ilike.${pattern}`).limit(8),
  ]);

  for (const m of mentors.data ?? []) {
    results.push({ type: "mentor", title: m.headline, subtitle: m.company, href: `/mentors/${m.slug}` });
  }
  for (const p of posts.data ?? []) {
    results.push({ type: "forum", title: p.title, subtitle: p.discipline, href: `/forum/${p.slug}` });
  }
  for (const p of portfolios.data ?? []) {
    const prof = p.profiles as { full_name?: string } | null;
    results.push({ type: "portfolio", title: p.headline, subtitle: prof?.full_name ?? p.discipline, href: `/portfolios/${p.slug}` });
  }
  for (const j of jobs.data ?? []) {
    results.push({ type: "job", title: j.title, subtitle: j.discipline, href: `/jobs/${j.slug}` });
  }
  return results;
}

export async function searchPlatform(query: string): Promise<SearchResult[]> {
  if (!isSupabaseConfigured() || !query.trim()) return [];

  const supabase = createPublicClient();
  if (!supabase) return [];

  const { data, error } = await supabase.rpc("search_platform_fts", { search_query: query.trim() });

  if (error || !data?.length) {
    return searchFallback(query);
  }

  return (data as { result_type: string; title: string; subtitle: string; href: string }[]).map((row) => ({
    type: typeMap[row.result_type] ?? "mentor",
    title: row.title,
    subtitle: row.subtitle,
    href: row.href,
  }));
}
