import { createClient } from "@/lib/supabase/server";
import { createPublicClient } from "@/lib/supabase/public";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { DbPortfolio } from "@/types/database";
import type { Portfolio, ProjectEndorsement } from "@/types";

type EndorsementRow = {
  id: string;
  portfolio_id: string;
  portfolio_project_id: string;
  endorsement_text: string;
  mentor_profiles:
    | {
        slug: string;
        headline: string;
        company: string;
        verified: boolean;
        profiles: { full_name: string } | { full_name: string }[] | null;
      }
    | {
        slug: string;
        headline: string;
        company: string;
        verified: boolean;
        profiles: { full_name: string } | { full_name: string }[] | null;
      }[]
    | null;
};

function mentorFromRow(row: EndorsementRow) {
  const mp = Array.isArray(row.mentor_profiles) ? row.mentor_profiles[0] : row.mentor_profiles;
  const profile = Array.isArray(mp?.profiles) ? mp.profiles[0] : mp?.profiles;
  return { mp, profile };
}

function toEndorsement(row: EndorsementRow): ProjectEndorsement {
  const { mp, profile } = mentorFromRow(row);
  return {
    id: row.id,
    mentorName: profile?.full_name ?? "Mentor",
    mentorCompany: mp?.company ?? "",
    mentorHeadline: mp?.headline ?? "",
    mentorSlug: mp?.slug,
    endorsementText: row.endorsement_text,
    verified: mp?.verified,
  };
}

async function fetchEndorsementsMap(
  portfolioIds: string[],
): Promise<Map<string, ProjectEndorsement[]>> {
  const byProject = new Map<string, ProjectEndorsement[]>();
  if (!portfolioIds.length || !isSupabaseConfigured()) return byProject;

  const supabase = createPublicClient();
  if (!supabase) return byProject;

  const { data } = await supabase
    .from("project_endorsements")
    .select(
      "id, portfolio_id, portfolio_project_id, endorsement_text, mentor_profiles (slug, headline, company, verified, profiles (full_name))",
    )
    .in("portfolio_id", portfolioIds);

  for (const row of (data ?? []) as unknown as EndorsementRow[]) {
    const endorsement = toEndorsement(row);
    const list = byProject.get(row.portfolio_project_id) ?? [];
    list.push(endorsement);
    byProject.set(row.portfolio_project_id, list);
  }

  return byProject;
}

function attachEndorsements(
  p: DbPortfolio,
  endorsementsByProject: Map<string, ProjectEndorsement[]>,
): Portfolio {
  const projects = (p.portfolio_projects ?? []).map((proj) => {
    const endorsements = endorsementsByProject.get(proj.id) ?? [];
    return {
      id: proj.id,
      title: proj.title,
      description: proj.description,
      tags: proj.tags,
      year: proj.year,
      endorsements,
    };
  });

  const endorsementCount = projects.reduce((sum, proj) => sum + (proj.endorsements?.length ?? 0), 0);
  const hasMentorEndorsement = endorsementCount > 0;

  return {
    id: p.id,
    userId: p.user_id,
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
    projects,
    experience: (p.portfolio_experience ?? []).map((e) => ({
      role: e.role,
      company: e.company,
      duration: e.duration,
      description: e.description,
    })),
    avatarUrl: p.profiles?.avatar_url ?? null,
    updatedAt: p.updated_at ?? p.created_at,
    endorsementCount,
    hasMentorEndorsement,
  };
}

export async function getPublishedPortfolios(): Promise<Portfolio[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = createPublicClient();
  if (!supabase) return [];

  const { data } = await supabase
    .from("portfolios")
    .select("*, profiles(*), portfolio_projects(*), portfolio_experience(*)")
    .eq("published", true)
    .order("updated_at", { ascending: false });

  if (!data?.length) return [];

  const rows = data as DbPortfolio[];
  const endorsementsByProject = await fetchEndorsementsMap(rows.map((p) => p.id));
  return rows.map((p) => attachEndorsements(p, endorsementsByProject));
}

export async function getPortfolio(slug: string) {
  if (!isSupabaseConfigured()) return null;

  const supabase = createPublicClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("portfolios")
    .select("*, profiles(*), portfolio_projects(*), portfolio_experience(*)")
    .eq("slug", slug)
    .single();

  if (!data) return null;
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
        return null;
      }
    }
  }

  const row = data as DbPortfolio;
  const endorsementsByProject = await fetchEndorsementsMap([row.id]);
  return attachEndorsements(row, endorsementsByProject);
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

/** Portfolios with endorsement metadata for recruiter talent pipeline */
export async function getTalentPipelinePortfolios(): Promise<Portfolio[]> {
  return getPublishedPortfolios();
}
