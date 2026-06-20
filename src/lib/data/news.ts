import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getCertifications } from "@/lib/data/certifications";
import { getPublishedMockExams } from "@/lib/data/exams";
import { getMentorsByDiscipline } from "@/lib/data/mentors";
import { mapNewsArticle, type NewsArticle } from "@/lib/news-utils";
import type { Certification } from "@/types";
import type { MockExamMeta } from "@/lib/data/exams";
import type { Mentor } from "@/types";
import type { DbNewsArticle } from "@/types/database";

function normalizeDiscipline(value: string | null | undefined): string | null {
  if (!value || value === "All") return null;
  return value;
}

export async function getPublishedArticles(disciplineFilter?: string): Promise<NewsArticle[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createPublicClient();
  if (!supabase) return [];

  let query = supabase
    .from("news_articles")
    .select("*")
    .eq("published", true)
    .order("published_at", { ascending: false });

  const discipline = normalizeDiscipline(disciplineFilter);
  if (discipline) {
    query = query.eq("discipline", discipline);
  }

  const { data } = await query;
  return (data ?? []).map((row) => mapNewsArticle(row as DbNewsArticle));
}

/** @deprecated Use getPublishedArticles */
export async function getPublishedNews(disciplineFilter?: string) {
  return getPublishedArticles(disciplineFilter);
}

export async function getArticleBySlug(
  slug: string,
  options?: { incrementViews?: boolean },
): Promise<NewsArticle | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = createPublicClient();
  if (!supabase) return null;

  if (options?.incrementViews !== false) {
    await supabase.rpc("increment_news_article_views", { article_slug: slug });
  }

  const { data } = await supabase
    .from("news_articles")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  return data ? mapNewsArticle(data as DbNewsArticle) : null;
}

/** Metadata / OG — does not increment views */
export async function getNewsArticle(slug: string) {
  return getArticleBySlug(slug, { incrementViews: false });
}

export async function getAllNewsForAdmin(): Promise<DbNewsArticle[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("news_articles")
    .select("*")
    .order("created_at", { ascending: false });
  return (data ?? []) as DbNewsArticle[];
}

export type RelatedOpportunities = {
  mentors: Mentor[];
  certification: Certification | null;
  exam: MockExamMeta | null;
};

export async function getRelatedOpportunities(discipline: string): Promise<RelatedOpportunities> {
  const [mentors, certifications, exams] = await Promise.all([
    getMentorsByDiscipline(discipline, 2),
    getCertifications(),
    getPublishedMockExams(),
  ]);

  const disciplineToken = discipline.toLowerCase().split(" ")[0];

  const certification =
    certifications.find((c) => c.discipline === discipline) ??
    certifications.find((c) => c.discipline.toLowerCase().includes(disciplineToken)) ??
    null;

  const exam = certification
    ? null
    : exams.find((e) => e.discipline === discipline) ??
      exams.find((e) => e.discipline.toLowerCase().includes(disciplineToken)) ??
      null;

  return { mentors, certification, exam };
}
