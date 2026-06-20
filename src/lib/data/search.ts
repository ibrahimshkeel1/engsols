import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export type SearchResult = {
  type: "mentor" | "forum" | "portfolio" | "job" | "news" | "video" | "live" | "certification" | "marketplace";
  title: string;
  subtitle: string;
  href: string;
  meta?: string;
};

const typeMap: Record<string, SearchResult["type"]> = {
  mentor: "mentor",
  forum: "forum",
  portfolio: "portfolio",
  job: "job",
  news: "news",
};

async function searchFallback(query: string): Promise<SearchResult[]> {
  const supabase = createPublicClient();
  if (!supabase) return [];

  const pattern = `%${query.trim()}%`;
  const results: SearchResult[] = [];

  const [mentors, posts, portfolios, jobs, news, videos, live, certs, listings] = await Promise.all([
    supabase.from("mentor_profiles").select("slug, headline, company, discipline").eq("status", "approved").or(`headline.ilike.${pattern},company.ilike.${pattern},bio.ilike.${pattern}`).limit(6),
    supabase.from("forum_posts").select("slug, title, discipline, reply_count").or(`title.ilike.${pattern},body.ilike.${pattern}`).limit(6),
    supabase.from("portfolios").select("slug, headline, discipline, profiles(full_name)").eq("published", true).or(`headline.ilike.${pattern},bio.ilike.${pattern}`).limit(6),
    supabase.from("jobs").select("slug, title, discipline, company").eq("published", true).or(`title.ilike.${pattern},description.ilike.${pattern}`).limit(6),
    supabase.from("news_articles").select("slug, title, discipline, category, summary, excerpt").eq("published", true).or(`title.ilike.${pattern},summary.ilike.${pattern},excerpt.ilike.${pattern},content.ilike.${pattern},body.ilike.${pattern},discipline.ilike.${pattern},category.ilike.${pattern}`).limit(6),
    supabase.from("videos").select("slug, title, discipline, duration").eq("published", true).or(`title.ilike.${pattern},description.ilike.${pattern}`).limit(6),
    supabase.from("live_sessions").select("slug, title, discipline, status").or(`title.ilike.${pattern},description.ilike.${pattern}`).limit(6),
    supabase.from("certifications").select("slug, name, discipline").or(`name.ilike.${pattern},description.ilike.${pattern}`).limit(6),
    supabase.from("marketplace_listings").select("slug, title, category, location").eq("published", true).or(`title.ilike.${pattern},description.ilike.${pattern}`).limit(6),
  ]);

  for (const m of mentors.data ?? []) {
    results.push({ type: "mentor", title: m.headline, subtitle: m.company, href: `/mentors/${m.slug}`, meta: m.discipline });
  }
  for (const p of posts.data ?? []) {
    results.push({ type: "forum", title: p.title, subtitle: p.discipline, href: `/forum/${p.slug}`, meta: `${p.reply_count ?? 0} replies` });
  }
  for (const p of portfolios.data ?? []) {
    const prof = p.profiles as { full_name?: string } | null;
    results.push({ type: "portfolio", title: p.headline, subtitle: prof?.full_name ?? p.discipline, href: `/portfolios/${p.slug}` });
  }
  for (const j of jobs.data ?? []) {
    results.push({ type: "job", title: j.title, subtitle: j.company ?? j.discipline, href: `/jobs/${j.slug}`, meta: j.discipline });
  }
  for (const n of news.data ?? []) {
    results.push({
      type: "news",
      title: n.title,
      subtitle: n.discipline ?? n.category,
      href: `/news/${n.slug}`,
      meta: (n.summary ?? n.excerpt)?.slice(0, 60),
    });
  }
  for (const v of videos.data ?? []) {
    results.push({ type: "video", title: v.title, subtitle: v.discipline, href: `/videos/${v.slug}`, meta: v.duration });
  }
  for (const s of live.data ?? []) {
    results.push({ type: "live", title: s.title, subtitle: s.discipline, href: `/live/${s.slug}`, meta: s.status });
  }
  for (const c of certs.data ?? []) {
    results.push({ type: "certification", title: c.name, subtitle: c.discipline, href: `/certifications/${c.slug}` });
  }
  for (const l of listings.data ?? []) {
    results.push({ type: "marketplace", title: l.title, subtitle: l.category, href: `/marketplace/${l.slug}`, meta: l.location });
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

  const ftsResults = (data as { result_type: string; title: string; subtitle: string; href: string }[]).map((row) => ({
    type: typeMap[row.result_type] ?? "mentor",
    title: row.title,
    subtitle: row.subtitle,
    href: row.href,
  }));

  if (ftsResults.length < 8) {
    const fallback = await searchFallback(query);
    const seen = new Set(ftsResults.map((r) => r.href));
    for (const row of fallback) {
      if (!seen.has(row.href)) ftsResults.push(row);
    }
  }

  return ftsResults;
}

export function groupSearchResults(results: SearchResult[]) {
  const order: SearchResult["type"][] = ["mentor", "forum", "job", "portfolio", "news", "video", "live", "certification", "marketplace"];
  const groups = new Map<SearchResult["type"], SearchResult[]>();
  for (const r of results) {
    const list = groups.get(r.type) ?? [];
    list.push(r);
    groups.set(r.type, list);
  }
  return order.filter((t) => groups.has(t)).map((type) => ({ type, items: groups.get(type)! }));
}
