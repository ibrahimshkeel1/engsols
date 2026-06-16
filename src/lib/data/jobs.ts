import { getPublicSupabase } from "@/lib/data/helpers";
import type { DbJob } from "@/types/database";
import type { Job } from "@/types";

function toJob(j: DbJob & { companies?: { name: string } }): Job {
  return {
    slug: j.slug,
    title: j.title,
    company: j.companies?.name ?? j.company_slug,
    companySlug: j.company_slug,
    type: j.type as Job["type"],
    discipline: j.discipline,
    location: j.location,
    remote: j.remote as Job["remote"],
    salaryRange: j.salary_range ?? undefined,
    description: j.description,
    requirements: j.requirements,
    benefits: j.benefits,
    postedAt: j.posted_at,
    featured: j.featured,
  };
}

export async function getJobs(): Promise<Job[]> {
  const supabase = getPublicSupabase();
  if (!supabase) return [];

  const { data } = await supabase
    .from("jobs")
    .select("*, companies(name)")
    .eq("published", true)
    .order("featured", { ascending: false })
    .order("posted_at", { ascending: false });

  return (data ?? []).map((j) => toJob(j as DbJob & { companies?: { name: string } }));
}

export async function getJobBySlug(slug: string): Promise<Job | null> {
  const supabase = getPublicSupabase();
  if (!supabase) return null;

  const { data } = await supabase
    .from("jobs")
    .select("*, companies(name)")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  return data ? toJob(data as DbJob & { companies?: { name: string } }) : null;
}

export async function getJobsByCompanySlug(companySlug: string): Promise<Job[]> {
  const jobs = await getJobs();
  return jobs.filter((j) => j.companySlug === companySlug);
}
