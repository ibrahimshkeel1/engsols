import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { DbNewsArticle } from "@/types/database";

const mockNews: DbNewsArticle[] = [
  {
    id: "1",
    slug: "permian-hiring-surge-2026",
    title: "Permian Basin Sees 15% Hiring Surge for Drilling Engineers",
    excerpt: "Operators and service companies ramp up graduate programs amid record production levels.",
    body: "The Permian Basin continues to drive US oil production growth, with major operators announcing expanded graduate drilling engineer programs for 2026. Schlumberger, Halliburton, and several independents have posted increased openings for directional drilling and well planning roles.\n\nIndustry analysts cite aging workforce demographics and digital drilling adoption as key drivers. Students with IWCF certification and internship experience are particularly competitive.",
    category: "Careers",
    featured: true,
    published: true,
    published_at: "2026-06-08T10:00:00Z",
    created_at: "2026-06-08T10:00:00Z",
  },
  {
    id: "2",
    slug: "fe-exam-civil-changes-2026",
    title: "NCEES Announces FE Exam Format Updates for 2026",
    excerpt: "Civil and mechanical examinees should review updated specifications before registering.",
    body: "NCEES has published updated FE exam specifications effective July 2026. Civil engineering candidates will see revised structural depth topics, while mechanical examinees face updated thermodynamics weighting.\n\nEngSols mentors recommend beginning preparation at least 3 months before your scheduled exam date.",
    category: "Certifications",
    featured: false,
    published: true,
    published_at: "2026-06-05T14:00:00Z",
    created_at: "2026-06-05T14:00:00Z",
  },
  {
    id: "3",
    slug: "north-sea-subsea-projects",
    title: "North Sea Subsea Tiebacks Gain Momentum",
    excerpt: "EPC contractors report increased demand for facilities and subsea engineers in Aberdeen and Stavanger.",
    body: "Several North Sea operators have sanctioned subsea tieback projects, creating demand for facilities engineers, subsea engineers, and project managers. Wood and Aker Solutions among firms actively recruiting.\n\nRemote and hybrid arrangements remain common for design-phase roles.",
    category: "Industry",
    featured: true,
    published: true,
    published_at: "2026-06-01T09:00:00Z",
    created_at: "2026-06-01T09:00:00Z",
  },
];

export async function getPublishedNews() {
  if (!isSupabaseConfigured()) return mockNews;

  const supabase = createPublicClient();
  if (!supabase) return mockNews;
  const { data } = await supabase
    .from("news_articles")
    .select("*, profiles(*)")
    .eq("published", true)
    .order("published_at", { ascending: false });

  return data?.length ? data : mockNews;
}

export async function getNewsArticle(slug: string) {
  const articles = await getPublishedNews();
  return articles.find((a) => a.slug === slug) ?? null;
}

export async function getAllNewsForAdmin() {
  if (!isSupabaseConfigured()) return mockNews;
  const supabase = createPublicClient();
  if (!supabase) return mockNews;
  const { data } = await supabase
    .from("news_articles")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}
