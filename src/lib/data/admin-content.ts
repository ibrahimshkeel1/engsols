import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type { DbCertification, DbCompany, DbSeller, DbVideo } from "@/types/database";

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

export type AdminSeller = DbSeller & { owner_id?: string | null };
export type AdminListing = {
  id: string;
  slug: string;
  title: string;
  seller_slug: string;
  price: number;
  published: boolean;
  created_at: string;
};

export type AdminJobApplication = {
  id: string;
  job_slug: string;
  job_id: string;
  applicant_name: string;
  applicant_email: string;
  message: string;
  status: string;
  created_at: string;
  jobs?: { title: string; posted_by: string | null } | null;
};

export async function getSellersForAdmin(): Promise<AdminSeller[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase.from("sellers").select("*").order("created_at", { ascending: false });
  return (data ?? []) as AdminSeller[];
}

export async function getListingsForAdmin(): Promise<AdminListing[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("marketplace_listings")
    .select("id, slug, title, seller_slug, price, published, created_at")
    .order("created_at", { ascending: false });
  return (data ?? []) as AdminListing[];
}

export async function getJobApplicationsForAdmin(): Promise<AdminJobApplication[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("job_applications")
    .select("*, jobs(title, posted_by)")
    .order("created_at", { ascending: false });
  return (data ?? []) as AdminJobApplication[];
}

export async function getJobApplicationsForPoster(userId: string): Promise<AdminJobApplication[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data: jobs } = await supabase.from("jobs").select("id").eq("posted_by", userId);
  if (!jobs?.length) return [];

  const jobIds = jobs.map((j) => j.id);
  const { data } = await supabase
    .from("job_applications")
    .select("*, jobs(title, posted_by)")
    .in("job_id", jobIds)
    .order("created_at", { ascending: false });
  return (data ?? []) as AdminJobApplication[];
}

export async function getReportContentLink(contentType: string, contentId: string): Promise<string | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();

  if (contentType === "forum_post") {
    const { data } = await supabase.from("forum_posts").select("slug").eq("id", contentId).maybeSingle();
    return data ? `/forum/${data.slug}` : null;
  }
  if (contentType === "forum_reply") {
    const { data } = await supabase.from("forum_replies").select("post_id").eq("id", contentId).maybeSingle();
    if (!data?.post_id) return null;
    const { data: post } = await supabase.from("forum_posts").select("slug").eq("id", data.post_id).maybeSingle();
    return post ? `/forum/${post.slug}` : null;
  }
  return null;
}

export async function getNewsArticleForAdmin(id: string) {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data } = await supabase.from("news_articles").select("*").eq("id", id).single();
  return data;
}

export async function getCertificationForAdmin(id: string) {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data } = await supabase.from("certifications").select("*").eq("id", id).single();
  return data;
}

export async function getVideoForAdmin(id: string) {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const { data } = await supabase.from("videos").select("*").eq("id", id).single();
  return data;
}

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
  const { data } = await supabase.from("companies").select("*").order("name");
  return (data ?? []) as DbCompany[];
}

export async function getCertificationsForAdmin(): Promise<DbCertification[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase.from("certifications").select("*").order("name");
  return (data ?? []) as DbCertification[];
}

export async function getVideosForAdmin(): Promise<DbVideo[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase.from("videos").select("*").order("created_at", { ascending: false });
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

export type AdminMarketplaceInquiry = {
  id: string;
  listing_slug: string | null;
  listing_title: string;
  seller_slug: string | null;
  requester_name: string;
  requester_email: string;
  message: string;
  request_type: string;
  status: string;
  created_at: string;
};

export async function getMarketplaceInquiriesForAdmin(): Promise<AdminMarketplaceInquiry[]> {
  if (!isSupabaseConfigured()) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("booking_requests")
    .select("*")
    .like("request_type", "marketplace_%")
    .order("created_at", { ascending: false })
    .limit(100);

  return (data ?? []).map((row) => ({
    id: row.id as string,
    listing_slug: row.listing_slug as string | null,
    listing_title: row.mentor_name as string,
    seller_slug: row.seller_slug as string | null,
    requester_name: row.requester_name as string,
    requester_email: row.requester_email as string,
    message: row.message as string,
    request_type: row.request_type as string,
    status: row.status as string,
    created_at: row.created_at as string,
  }));
}
