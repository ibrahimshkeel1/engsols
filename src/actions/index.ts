"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { requireRole } from "@/lib/auth";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

export async function signUp(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = formData.get("fullName") as string;
  const role = formData.get("role") as string;

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, role },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
    },
  });

  if (error) redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  redirect("/login?message=Check your email to confirm your account, then complete onboarding");
}

export async function signIn(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role === "admin") redirect("/admin");

  if (profile?.role === "mentor") {
    const { data: mentorProfile } = await supabase
      .from("mentor_profiles")
      .select("status")
      .eq("user_id", user.id)
      .single();
    if (!mentorProfile) redirect("/onboarding/mentor");
    if (mentorProfile.status === "approved") redirect("/mentor");
    redirect("/apply");
  }

  const { data: portfolio } = await supabase
    .from("portfolios")
    .select("id")
    .eq("user_id", user.id)
    .single();
  if (!portfolio) redirect("/onboarding/student");
  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}

export async function createForumPost(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/forum/new");

  const title = formData.get("title") as string;
  const body = formData.get("body") as string;
  const discipline = formData.get("discipline") as string;
  const slug = `${slugify(title)}-${Date.now().toString(36)}`;

  const { error } = await supabase.from("forum_posts").insert({
    slug,
    author_id: user.id,
    title,
    body,
    discipline,
    tags: [],
  });

  if (error) redirect(`/forum/new?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/forum");
  redirect(`/forum/${slug}`);
}

export async function createForumReply(postId: string, body: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in" };

  const { error } = await supabase.from("forum_replies").insert({
    post_id: postId,
    author_id: user.id,
    body,
  });

  if (error) return { error: error.message };
  revalidatePath("/forum");
  return { success: true };
}

export async function savePortfolio(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/portfolios/build");

  const headline = formData.get("headline") as string;
  const university = formData.get("university") as string;
  const discipline = formData.get("discipline") as string;
  const bio = formData.get("bio") as string;
  const skills = (formData.get("skills") as string).split(",").map((s) => s.trim()).filter(Boolean);
  const publish = formData.get("publish") === "true";

  const { data: existing } = await supabase
    .from("portfolios")
    .select("id, slug")
    .eq("user_id", user.id)
    .single();

  const slug = existing?.slug ?? `${slugify(headline || user.id)}-${user.id.slice(0, 8)}`;

  const payload = {
    user_id: user.id,
    slug,
    headline,
    university,
    discipline,
    bio,
    skills,
    published: publish,
    open_to_work: true,
    seeking: "full-time",
    location: "",
    credentials: [],
  };

  const { error } = existing
    ? await supabase.from("portfolios").update(payload).eq("user_id", user.id)
    : await supabase.from("portfolios").insert(payload);

  if (error) redirect(`/portfolios/build?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/portfolios");
  redirect(`/portfolios/${slug}`);
}

export async function submitMentorApplication(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/apply");

  await supabase.from("profiles").update({ role: "mentor" }).eq("id", user.id);

  const headline = formData.get("headline") as string;
  const company = formData.get("company") as string;
  const discipline = formData.get("discipline") as string;
  const bio = formData.get("bio") as string;
  const years = parseInt(formData.get("yearsExperience") as string, 10) || 0;
  const monthlyRate = parseInt(formData.get("monthlyRate") as string, 10) || 150;
  const slug = `${slugify(headline || user.id)}-${user.id.slice(0, 8)}`;

  const { data: existing } = await supabase
    .from("mentor_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  const payload = {
    user_id: user.id,
    slug,
    headline,
    company,
    discipline,
    bio,
    years_experience: years,
    monthly_rate: monthlyRate,
    status: "pending" as const,
    sub_fields: [],
    skills: (formData.get("skills") as string || "").split(",").map((s) => s.trim()).filter(Boolean),
    goals: [],
    credentials: [],
  };

  const { error } = existing
    ? await supabase.from("mentor_profiles").update(payload).eq("user_id", user.id)
    : await supabase.from("mentor_profiles").insert(payload);

  if (error) redirect(`/apply?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin");
  redirect("/mentor?message=Application submitted for review");
}

async function updateMentorStatus(mentorId: string, status: "approved" | "rejected") {
  const admin = await requireRole(["admin"]);
  if (!admin) return;

  const supabase = await createClient();
  await supabase.from("mentor_profiles").update({ status }).eq("id", mentorId);
  revalidatePath("/admin");
  revalidatePath("/mentors");
}

export async function approveMentor(formData: FormData) {
  const id = formData.get("id") as string;
  await updateMentorStatus(id, "approved");
}

export async function rejectMentor(formData: FormData) {
  const id = formData.get("id") as string;
  await updateMentorStatus(id, "rejected");
}

export async function createLiveSession(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/mentor/live/new");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const discipline = formData.get("discipline") as string;
  const scheduledAt = formData.get("scheduledAt") as string;
  const streamUrl = formData.get("streamUrl") as string;
  const slug = `${slugify(title)}-${Date.now().toString(36)}`;

  const { data: mentor } = await supabase
    .from("mentor_profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  const { error } = await supabase.from("live_sessions").insert({
    slug,
    host_id: user.id,
    mentor_profile_id: mentor?.id ?? null,
    title,
    description,
    discipline,
    scheduled_at: scheduledAt,
    stream_url: streamUrl || null,
    status: "upcoming",
  });

  if (error) redirect(`/mentor/live/new?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/live");
  revalidatePath("/mentor");
  redirect("/mentor/live");
}

export async function createNewsArticle(formData: FormData) {
  const admin = await requireRole(["admin"]);
  if (!admin) redirect("/login?next=/admin/news/new");

  const supabase = await createClient();
  const title = formData.get("title") as string;
  const excerpt = formData.get("excerpt") as string;
  const body = formData.get("body") as string;
  const category = formData.get("category") as string;
  const publish = formData.get("publish") === "true";
  const slug = slugify(title);

  const { error } = await supabase.from("news_articles").insert({
    slug,
    title,
    excerpt,
    body,
    category,
    author_id: admin.id,
    published: publish,
    published_at: publish ? new Date().toISOString() : null,
    featured: false,
  });

  if (error) redirect(`/admin/news/new?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/news");
  revalidatePath("/admin");
  redirect("/admin/news");
}

async function insertContactRequest(fields: {
  refSlug: string;
  refName: string;
  requesterName: string;
  requesterEmail: string;
  message: string;
  requestType: string;
}) {
  if (!isSupabaseConfigured()) return;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  await supabase.from("booking_requests").insert({
    mentor_slug: fields.refSlug,
    mentor_name: fields.refName,
    requester_name: fields.requesterName,
    requester_email: fields.requesterEmail,
    message: fields.message,
    request_type: fields.requestType,
    user_id: user?.id ?? null,
  });
}

export async function submitBookingRequest(formData: FormData) {
  const mentorSlug = formData.get("mentorSlug") as string;
  const mentorName = formData.get("mentorName") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;
  const type = formData.get("type") as string;

  await insertContactRequest({
    refSlug: mentorSlug,
    refName: mentorName,
    requesterName: name,
    requesterEmail: email,
    message,
    requestType: type,
  });
  return { success: true };
}

export async function submitPortfolioContact(formData: FormData) {
  await insertContactRequest({
    refSlug: formData.get("portfolioSlug") as string,
    refName: formData.get("studentName") as string,
    requesterName: formData.get("name") as string,
    requesterEmail: formData.get("email") as string,
    message: formData.get("message") as string,
    requestType: "portfolio",
  });
  return { success: true };
}

export async function submitJobApplication(formData: FormData) {
  const jobTitle = formData.get("jobTitle") as string;
  const company = formData.get("company") as string;
  await insertContactRequest({
    refSlug: formData.get("jobSlug") as string,
    refName: `${jobTitle} @ ${company}`,
    requesterName: formData.get("name") as string,
    requesterEmail: formData.get("email") as string,
    message: formData.get("message") as string,
    requestType: "job_application",
  });
  return { success: true };
}

export async function submitMarketplaceInquiry(formData: FormData) {
  const listingTitle = formData.get("listingTitle") as string;
  await insertContactRequest({
    refSlug: formData.get("listingSlug") as string,
    refName: listingTitle,
    requesterName: formData.get("name") as string,
    requesterEmail: formData.get("email") as string,
    message: formData.get("message") as string,
    requestType: formData.get("type") as string === "contact" ? "marketplace_contact" : "marketplace_quote",
  });
  return { success: true };
}

export async function completeStudentOnboarding(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/onboarding/student");

  const discipline = formData.get("discipline") as string;
  const goal = formData.get("goal") as string;
  const university = formData.get("university") as string;

  await supabase.from("profiles").update({
    full_name: formData.get("fullName") as string || undefined,
  }).eq("id", user.id);

  const headline = formData.get("headline") as string;
  const slug = `${slugify(headline || user.id)}-${user.id.slice(0, 8)}`;

  const { data: existing } = await supabase
    .from("portfolios")
    .select("id")
    .eq("user_id", user.id)
    .single();

  const payload = {
    user_id: user.id,
    slug,
    headline: headline || goal,
    university: university || "",
    discipline,
    bio: `Looking for mentorship in ${discipline}. Goal: ${goal}.`,
    skills: [] as string[],
    published: false,
    open_to_work: true,
    seeking: "full-time",
    location: "",
    credentials: [] as string[],
  };

  if (existing) {
    await supabase.from("portfolios").update(payload).eq("user_id", user.id);
  } else {
    await supabase.from("portfolios").insert(payload);
  }

  redirect("/portfolios/build");
}

export async function completeMentorOnboarding(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/onboarding/mentor");

  await supabase.from("profiles").update({ role: "mentor" }).eq("id", user.id);
  redirect("/apply");
}
