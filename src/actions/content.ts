"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { jobPostSchema } from "@/lib/validation";

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60);
}

export async function createJobListing(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/jobs/post");

  const parsed = jobPostSchema.safeParse({
    title: formData.get("title"),
    companySlug: formData.get("companySlug"),
    discipline: formData.get("discipline"),
    location: formData.get("location"),
    description: formData.get("description"),
    type: formData.get("type"),
    remote: formData.get("remote"),
  });

  if (!parsed.success) {
    redirect("/jobs/post?error=" + encodeURIComponent(parsed.error.issues[0]?.message || "Invalid input"));
  }

  const d = parsed.data;
  const slug = `${slugify(d.title)}-${Date.now().toString(36)}`;
  const requirements = (formData.get("requirements") as string || "")
    .split("\n").map((s) => s.trim()).filter(Boolean);
  const benefits = (formData.get("benefits") as string || "")
    .split("\n").map((s) => s.trim()).filter(Boolean);

  const { error } = await supabase.from("jobs").insert({
    slug,
    title: d.title,
    company_slug: d.companySlug,
    type: d.type,
    discipline: d.discipline,
    location: d.location,
    remote: d.remote,
    description: d.description,
    requirements,
    benefits,
    salary_range: (formData.get("salaryRange") as string) || null,
    posted_by: user.id,
    employer_verified: false,
    published: true,
  });

  if (error) redirect("/jobs/post?error=" + encodeURIComponent(error.message));
  revalidatePath("/jobs");
  redirect(`/jobs/${slug}`);
}

export async function createCompanyListing(formData: FormData) {
  const admin = await requireRole(["admin"]);
  if (!admin) redirect("/login?next=/admin/companies/new");

  const supabase = await createClient();
  const name = (formData.get("name") as string).trim();
  const slug = slugify(name);

  const { error } = await supabase.from("companies").insert({
    slug,
    name,
    type: formData.get("type") as string,
    headquarters: formData.get("headquarters") as string,
    country: formData.get("country") as string,
    description: formData.get("description") as string,
    disciplines: (formData.get("disciplines") as string || "").split(",").map((s) => s.trim()).filter(Boolean),
    website: formData.get("website") as string,
    verified: formData.get("verified") === "true",
    published: true,
  });

  if (error) redirect("/admin/companies/new?error=" + encodeURIComponent(error.message));
  revalidatePath("/companies");
  revalidatePath("/admin/companies");
  redirect("/admin/companies");
}

export async function updateCompany(companyId: string, formData: FormData) {
  const admin = await requireRole(["admin"]);
  if (!admin) redirect("/login?next=/admin/companies");

  const supabase = await createClient();
  const name = (formData.get("name") as string).trim();

  const { error } = await supabase.from("companies").update({
    name,
    type: formData.get("type") as string,
    headquarters: formData.get("headquarters") as string,
    country: formData.get("country") as string,
    description: formData.get("description") as string,
    disciplines: (formData.get("disciplines") as string || "").split(",").map((s) => s.trim()).filter(Boolean),
    website: formData.get("website") as string,
    verified: formData.get("verified") === "true",
    published: formData.get("published") === "true",
  }).eq("id", companyId);

  if (error) redirect(`/admin/companies/${companyId}/edit?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/companies");
  revalidatePath("/admin/companies");
  redirect("/admin/companies");
}

export async function deleteCompany(companyId: string) {
  const admin = await requireRole(["admin"]);
  if (!admin) return { error: "Unauthorized" };

  const supabase = await createClient();
  const { error } = await supabase.from("companies").delete().eq("id", companyId);
  if (error) return { error: error.message };
  revalidatePath("/admin/companies");
  revalidatePath("/companies");
  return { success: true };
}

export async function createMarketplaceListing(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/marketplace/sell");

  const title = (formData.get("title") as string).trim();
  const slug = `${slugify(title)}-${Date.now().toString(36)}`;
  const sellerSlug = (formData.get("sellerSlug") as string).trim();

  const { error } = await supabase.from("marketplace_listings").insert({
    slug,
    title,
    description: formData.get("description") as string,
    category: formData.get("category") as string,
    subcategory: formData.get("subcategory") as string,
    price: parseFloat(formData.get("price") as string) || 0,
    price_unit: formData.get("priceUnit") as string || "per unit",
    seller_slug: sellerSlug,
    discipline: formData.get("discipline") as string,
    condition: formData.get("condition") as string || "new",
    location: formData.get("location") as string || "",
    image_url: (formData.get("imageUrl") as string) || null,
    published: false,
  });

  if (error) redirect("/marketplace/sell?error=" + encodeURIComponent(error.message));
  revalidatePath("/marketplace");
  redirect("/marketplace?message=Listing submitted for review");
}

export async function createCertification(formData: FormData) {
  const admin = await requireRole(["admin"]);
  if (!admin) redirect("/login?next=/admin/certifications/new");

  const supabase = await createClient();
  const name = (formData.get("name") as string).trim();
  const slug = slugify(name);

  const { error } = await supabase.from("certifications").insert({
    slug,
    name,
    short_name: formData.get("shortName") as string,
    discipline: formData.get("discipline") as string,
    description: formData.get("description") as string,
    eligibility: formData.get("eligibility") as string,
    exam_format: formData.get("examFormat") as string,
    avg_prep_months: parseInt(formData.get("avgPrepMonths") as string, 10) || 6,
    pass_rate: (formData.get("passRate") as string) || null,
    related_mentor_slugs: (formData.get("mentorSlugs") as string || "").split(",").map((s) => s.trim()).filter(Boolean),
    published: true,
  });

  if (error) redirect("/admin/certifications/new?error=" + encodeURIComponent(error.message));
  revalidatePath("/certifications");
  redirect("/admin/certifications");
}

export async function createVideoListing(formData: FormData) {
  const admin = await requireRole(["admin"]);
  if (!admin) redirect("/login?next=/admin/videos/new");

  const supabase = await createClient();
  const title = (formData.get("title") as string).trim();
  const slug = slugify(title);

  const { error } = await supabase.from("videos").insert({
    slug,
    title,
    description: formData.get("description") as string,
    author_mentor_slug: formData.get("authorSlug") as string,
    discipline: formData.get("discipline") as string,
    duration: formData.get("duration") as string,
    video_url: formData.get("videoUrl") as string,
    tags: (formData.get("tags") as string || "").split(",").map((s) => s.trim()).filter(Boolean),
    published: formData.get("published") === "true",
  });

  if (error) redirect("/admin/videos/new?error=" + encodeURIComponent(error.message));
  revalidatePath("/videos");
  redirect("/admin/videos");
}

export async function verifyJobEmployer(jobId: string, verified: boolean) {
  const admin = await requireRole(["admin"]);
  if (!admin) return { error: "Unauthorized" };

  const supabase = await createClient();
  const { error } = await supabase.from("jobs").update({ employer_verified: verified }).eq("id", jobId);
  if (error) return { error: error.message };
  revalidatePath("/admin/jobs");
  return { success: true };
}

export async function updateNewsArticle(articleId: string, formData: FormData) {
  const admin = await requireRole(["admin"]);
  if (!admin) redirect("/login");

  const supabase = await createClient();
  const publish = formData.get("publish") === "true";

  const { error } = await supabase.from("news_articles").update({
    title: formData.get("title") as string,
    excerpt: formData.get("excerpt") as string,
    body: formData.get("body") as string,
    category: formData.get("category") as string,
    published: publish,
    published_at: publish ? new Date().toISOString() : null,
    cover_image_url: (formData.get("coverImageUrl") as string) || null,
  }).eq("id", articleId);

  if (error) redirect(`/admin/news/${articleId}/edit?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/news");
  revalidatePath("/admin/news");
  redirect("/admin/news");
}

export async function deleteNewsArticle(articleId: string) {
  const admin = await requireRole(["admin"]);
  if (!admin) return { error: "Unauthorized" };

  const supabase = await createClient();
  const { error } = await supabase.from("news_articles").delete().eq("id", articleId);
  if (error) return { error: error.message };
  revalidatePath("/admin/news");
  revalidatePath("/news");
  return { success: true };
}
