import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { DbCertification, DbCompany, DbVideo } from "@/types/database";

export type AdminJob = {
  id: string;
  slug: string;
  title: string;
  company_slug: string;
  discipline: string;
  location: string;
  type: string;
  employer_verified: boolean;
  published: boolean;
  posted_at: string;
  companies?: { name: string } | null;
};

export type AdminContentReport = {
  id: string;
  content_type: string;
  content_id: string;
  reason: string;
  status: string;
  created_at: string;
  reporter_id: string | null;
  profiles?: { full_name: string | null } | null;
};

export async function getJobsForAdmin(): Promise<AdminJob[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("jobs")
    .select("id, slug, title, company_slug, discipline, location, type, employer_verified, published, posted_at, companies(name)")
    .order("posted_at", { ascending: false });

  return (data ?? []).map((row) => {
    const companies = row.companies as { name: string } | { name: string }[] | null;
    const company = Array.isArray(companies) ? companies[0] : companies;
    return {
      id: row.id as string,
      slug: row.slug as string,
      title: row.title as string,
      company_slug: row.company_slug as string,
      discipline: row.discipline as string,
      location: row.location as string,
      type: row.type as string,
      employer_verified: row.employer_verified as boolean,
      published: row.published as boolean,
      posted_at: row.posted_at as string,
      companies: company ?? null,
    };
  });
}

export async function getCompaniesForAdmin(): Promise<DbCompany[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("companies")
    .select("*")
    .order("name");

  return (data ?? []) as DbCompany[];
}

export async function getCertificationsForAdmin(): Promise<DbCertification[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("certifications")
    .select("*")
    .order("name");

  return (data ?? []) as DbCertification[];
}

export async function getVideosForAdmin(): Promise<DbVideo[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("videos")
    .select("*")
    .order("created_at", { ascending: false });

  return (data ?? []) as DbVideo[];
}

export async function getReportsForAdmin(): Promise<AdminContentReport[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("content_reports")
    .select("*, profiles(full_name)")
    .order("created_at", { ascending: false });

  return (data ?? []) as AdminContentReport[];
}
