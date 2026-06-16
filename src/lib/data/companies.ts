import { getPublicSupabase } from "@/lib/data/helpers";
import type { DbCompany, DbJob, DbMarketplaceListing } from "@/types/database";
import type { Company } from "@/types";

function toCompany(
  c: DbCompany,
  jobs: DbJob[],
  listings: DbMarketplaceListing[],
  sellerSlug?: string,
): Company {
  return {
    slug: c.slug,
    name: c.name,
    type: c.type as Company["type"],
    headquarters: c.headquarters,
    country: c.country,
    employeeCount: c.employee_count,
    founded: c.founded ?? 0,
    description: c.description,
    disciplines: c.disciplines,
    verified: c.verified,
    website: c.website,
    jobSlugs: jobs.filter((j) => j.company_slug === c.slug).map((j) => j.slug),
    listingSlugs: listings.filter((l) => l.company_slug === c.slug).map((l) => l.slug),
    sellerSlug,
  };
}

export async function getCompanies(): Promise<Company[]> {
  const supabase = getPublicSupabase();
  if (!supabase) return [];

  const [{ data: companies }, { data: jobs }, { data: listings }, { data: sellers }] =
    await Promise.all([
      supabase.from("companies").select("*").eq("published", true).order("name"),
      supabase.from("jobs").select("slug, company_slug").eq("published", true),
      supabase.from("marketplace_listings").select("slug, company_slug").eq("published", true),
      supabase.from("sellers").select("slug, company_slug").eq("published", true),
    ]);

  if (!companies?.length) return [];

  return companies.map((c) =>
    toCompany(
      c as DbCompany,
      (jobs ?? []) as DbJob[],
      (listings ?? []) as DbMarketplaceListing[],
      sellers?.find((s) => s.company_slug === c.slug)?.slug,
    ),
  );
}

export async function getCompanyBySlug(slug: string): Promise<Company | null> {
  const supabase = getPublicSupabase();
  if (!supabase) return null;

  const { data: company } = await supabase.from("companies").select("*").eq("slug", slug).single();
  if (!company) return null;

  const [{ data: jobs }, { data: listings }, { data: seller }] = await Promise.all([
    supabase.from("jobs").select("slug, company_slug").eq("company_slug", slug).eq("published", true),
    supabase.from("marketplace_listings").select("slug, company_slug").eq("company_slug", slug).eq("published", true),
    supabase.from("sellers").select("slug, company_slug").eq("company_slug", slug).maybeSingle(),
  ]);

  return toCompany(
    company as DbCompany,
    (jobs ?? []) as DbJob[],
    (listings ?? []) as DbMarketplaceListing[],
    seller?.slug,
  );
}

export async function getCompanyNamesFromMentors(mentorCompanies: string[]): Promise<string[]> {
  const unique = [...new Set(mentorCompanies.filter(Boolean))].sort();
  if (unique.length) return unique;

  const companies = await getCompanies();
  return companies.slice(0, 10).map((c) => c.name);
}
