import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { portfolios as mockPortfolios } from "@/data/portfolios";
import type { DbPortfolio } from "@/types/database";
import type { Portfolio } from "@/types";

function toPortfolio(p: DbPortfolio): Portfolio {
  return {
    slug: p.slug,
    name: p.profiles?.full_name || "Student",
    headline: p.headline,
    university: p.university,
    graduationYear: p.graduation_year ?? new Date().getFullYear(),
    discipline: p.discipline,
    location: p.location,
    openToWork: p.open_to_work,
    seeking: p.seeking as Portfolio["seeking"],
    bio: p.bio,
    skills: p.skills,
    credentials: p.credentials,
    projects: (p.portfolio_projects ?? []).map((proj) => ({
      title: proj.title,
      description: proj.description,
      tags: proj.tags,
      year: proj.year,
    })),
    experience: (p.portfolio_experience ?? []).map((e) => ({
      role: e.role,
      company: e.company,
      duration: e.duration,
      description: e.description,
    })),
  };
}

export async function getPublishedPortfolios(): Promise<Portfolio[]> {
  if (!isSupabaseConfigured()) return mockPortfolios;

  const supabase = createPublicClient();
  if (!supabase) return mockPortfolios;

  const { data } = await supabase
    .from("portfolios")
    .select("*, profiles(*), portfolio_projects(*), portfolio_experience(*)")
    .eq("published", true)
    .order("updated_at", { ascending: false });

  if (!data?.length) return mockPortfolios;
  return data.map((p) => toPortfolio(p as DbPortfolio));
}

export async function getPortfolio(slug: string) {
  if (!isSupabaseConfigured()) {
    return mockPortfolios.find((p) => p.slug === slug) ?? null;
  }

  const supabase = createPublicClient();
  if (!supabase) return mockPortfolios.find((p) => p.slug === slug) ?? null;

  const { data } = await supabase
    .from("portfolios")
    .select("*, profiles(*), portfolio_projects(*), portfolio_experience(*)")
    .eq("slug", slug)
    .single();

  if (!data) return mockPortfolios.find((p) => p.slug === slug) ?? null;
  if (!data.published) {
    const authClient = await createClient();
    const { data: { user } } = await authClient.auth.getUser();
    if (data.user_id !== user?.id) {
      const { data: profile } = await authClient
        .from("profiles")
        .select("role")
        .eq("id", user?.id ?? "")
        .maybeSingle();
      if (profile?.role !== "admin" && data.user_id !== user?.id) {
        return mockPortfolios.find((p) => p.slug === slug) ?? null;
      }
    }
  }
  return toPortfolio(data as DbPortfolio);
}

export async function getPortfolioByUserId(userId: string) {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("portfolios")
    .select("*, portfolio_projects(*), portfolio_experience(*)")
    .eq("user_id", userId)
    .single();
  return data;
}
