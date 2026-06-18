import { getPublicSupabase } from "@/lib/data/helpers";
import type { DbCertification } from "@/types/database";
import type { Certification, CertificationResource } from "@/types";

function toCertification(c: DbCertification): Certification {
  return {
    slug: c.slug,
    name: c.name,
    shortName: c.short_name,
    discipline: c.discipline,
    description: c.description,
    eligibility: c.eligibility,
    examFormat: c.exam_format,
    avgPrepMonths: c.avg_prep_months,
    passRate: c.pass_rate ?? undefined,
    resources: (c.resources as CertificationResource[]) ?? [],
    relatedMentorSlugs: c.related_mentor_slugs,
    prepSteps: ((c as DbCertification & { prep_steps?: { phase: string; description: string; week?: number }[] }).prep_steps) ?? [],
  };
}

export async function getCertifications(): Promise<Certification[]> {
  const supabase = getPublicSupabase();
  if (!supabase) return [];

  const { data } = await supabase
    .from("certifications")
    .select("*")
    .eq("published", true)
    .order("name");

  return (data ?? []).map((c) => toCertification(c as DbCertification));
}

export async function getCertificationBySlug(slug: string): Promise<Certification | null> {
  const supabase = getPublicSupabase();
  if (!supabase) return null;

  const { data } = await supabase
    .from("certifications")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  return data ? toCertification(data as DbCertification) : null;
}
