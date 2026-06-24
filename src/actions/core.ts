"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { ensureUserProfile } from "@/lib/supabase/profile";
import { requireRole } from "@/lib/auth";
import { slugify } from "@/lib/slugify";

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
    goals: formData.getAll("goals").map(String).filter(Boolean),
    credentials: [],
  };

  const { error } = existing
    ? await supabase.from("mentor_profiles").update(payload).eq("user_id", user.id)
    : await supabase.from("mentor_profiles").insert(payload);

  if (error) redirect(`/apply?error=${encodeURIComponent(error.message)}`);
  revalidatePath("/admin");
  redirect("/apply?submitted=1");
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
  revalidatePath("/admin/mentors");
}

export async function updateBookingStatus(bookingId: string, status: "pending" | "contacted" | "closed") {
  const admin = await requireRole(["admin"]);
  if (!admin) return { error: "Unauthorized" };
  const supabase = await createClient();
  const { error } = await supabase
    .from("booking_requests")
    .update({ status })
    .eq("id", bookingId);

  if (error) return { error: error.message };
  revalidatePath("/admin/bookings");
  return { success: true };
}

async function insertContactRequest(fields: {
  refSlug: string;
  refName: string;
  requesterName: string;
  requesterEmail: string;
  message: string;
  requestType: string;
}) {
  if (!isSupabaseConfigured()) return { error: "Database not configured" };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in to submit a request" };

  const { checkRateLimit } = await import("@/lib/rate-limit");
  const limited = await checkRateLimit(user.id, "booking");
  if (!limited.ok) return { error: limited.error };

  const { contactSchema } = await import("@/lib/validation");
  const parsed = contactSchema.safeParse({
    name: fields.requesterName,
    email: fields.requesterEmail,
    message: fields.message,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid input" };
  }

  let mentorUserId: string | null = null;
  let mentorEmail: string | null = null;
  let monthlyRate = 0;
  let sellerSlug: string | null = null;
  let listingSlug: string | null = null;
  const mentorTypes = ["intro", "monthly", "study-plan", "interview-prep"];

  if (mentorTypes.includes(fields.requestType)) {
    const { data: mp } = await supabase
      .from("mentor_profiles")
      .select("user_id, monthly_rate")
      .eq("slug", fields.refSlug)
      .maybeSingle();
    mentorUserId = mp?.user_id ?? null;
    monthlyRate = mp?.monthly_rate ?? 0;
    if (mentorUserId) {
      const { data: prof } = await supabase.from("profiles").select("email").eq("id", mentorUserId).single();
      mentorEmail = prof?.email ?? null;
    }
  }

  if (fields.requestType.startsWith("marketplace_")) {
    listingSlug = fields.refSlug;
    const { data: listing } = await supabase
      .from("marketplace_listings")
      .select("seller_slug")
      .eq("slug", listingSlug)
      .maybeSingle();
    if (listing?.seller_slug) {
      sellerSlug = listing.seller_slug;
      const { data: seller } = await supabase
        .from("sellers")
        .select("owner_id, name")
        .eq("slug", sellerSlug)
        .maybeSingle();
      if (seller?.owner_id) {
        mentorUserId = seller.owner_id;
        const { data: prof } = await supabase.from("profiles").select("email").eq("id", seller.owner_id).single();
        mentorEmail = prof?.email ?? null;
      }
    }
  }

  const requiresPayment = fields.requestType === "monthly" && monthlyRate > 0;

  const { data: booking, error } = await supabase.from("booking_requests").insert({
    mentor_slug: fields.refSlug,
    mentor_name: fields.refName,
    requester_name: parsed.data.name,
    requester_email: parsed.data.email,
    message: parsed.data.message,
    request_type: fields.requestType,
    user_id: user.id,
    mentor_user_id: mentorUserId,
    seller_slug: sellerSlug,
    listing_slug: listingSlug,
  }).select("id").single();

  if (error || !booking) return { error: error?.message ?? "Could not create booking request" };

  if (mentorEmail && mentorTypes.includes(fields.requestType) && !requiresPayment) {
    const { notifyMentorOfBooking } = await import("@/actions/mentor");
    await notifyMentorOfBooking({
      mentorEmail,
      mentorName: fields.refName,
      requesterName: parsed.data.name,
      requesterEmail: parsed.data.email,
      message: parsed.data.message,
      type: fields.requestType,
    });
    if (mentorUserId) {
      const { createNotification } = await import("@/lib/notifications");
      await createNotification({
        userId: mentorUserId,
        title: "New booking request",
        body: `${parsed.data.name} requested a ${fields.requestType.replace(/-/g, " ")} session.`,
        url: "/mentor/bookings",
      });
      const { sendPushToUser } = await import("@/lib/push");
      await sendPushToUser({
        userId: mentorUserId,
        title: "New booking request",
        body: `${parsed.data.name} sent a request.`,
        url: "/mentor/bookings",
      });
    }
  }

  if (fields.requestType.startsWith("marketplace_") && mentorUserId && mentorEmail) {
    const { marketplaceInquiryEmail, sendEmail } = await import("@/lib/email");
    const mail = marketplaceInquiryEmail({
      sellerName: fields.refName,
      listingTitle: fields.refName,
      requesterName: parsed.data.name,
      requesterEmail: parsed.data.email,
      message: parsed.data.message,
    });
    await sendEmail({ to: mentorEmail, ...mail });
    const { createNotification } = await import("@/lib/notifications");
    await createNotification({
      userId: mentorUserId,
      title: "New marketplace inquiry",
      body: `${parsed.data.name} inquired about ${fields.refName}.`,
      url: "/marketplace/seller",
    });
    const { sendPushToUser } = await import("@/lib/push");
    await sendPushToUser({
      userId: mentorUserId,
      title: "New marketplace inquiry",
      body: `${parsed.data.name} sent an inquiry.`,
      url: "/marketplace/seller",
    });
  }

  if (fields.requestType === "portfolio") {
    const { data: portfolio } = await supabase
      .from("portfolios")
      .select("user_id, profiles(full_name)")
      .eq("slug", fields.refSlug)
      .maybeSingle();
    if (portfolio?.user_id) {
      const studentName = (portfolio.profiles as { full_name?: string } | null)?.full_name ?? fields.refName;
      const { data: prof } = await supabase.from("profiles").select("email").eq("id", portfolio.user_id).single();
      if (prof?.email) {
        const { portfolioContactEmail, sendEmail } = await import("@/lib/email");
        const mail = portfolioContactEmail({
          studentName,
          requesterName: parsed.data.name,
          requesterEmail: parsed.data.email,
          message: parsed.data.message,
        });
        await sendEmail({ to: prof.email, ...mail });
      }
      const { createNotification } = await import("@/lib/notifications");
      await createNotification({
        userId: portfolio.user_id,
        title: "Portfolio contact",
        body: `${parsed.data.name} reached out via your portfolio.`,
        url: `/portfolios/${fields.refSlug}`,
      });
    }
  }

  return {
    success: true,
    bookingRequestId: booking.id,
    requiresPayment,
  };
}

export async function submitBookingRequest(formData: FormData) {
  const result = await insertContactRequest({
    refSlug: formData.get("mentorSlug") as string,
    refName: formData.get("mentorName") as string,
    requesterName: formData.get("name") as string,
    requesterEmail: formData.get("email") as string,
    message: formData.get("message") as string,
    requestType: formData.get("type") as string,
  });
  if (result?.error) throw new Error(result.error);
  return {
    success: true,
    bookingRequestId: result.bookingRequestId,
    requiresPayment: result.requiresPayment ?? false,
  };
}

export async function submitPortfolioContact(formData: FormData) {
  const result = await insertContactRequest({
    refSlug: formData.get("portfolioSlug") as string,
    refName: formData.get("studentName") as string,
    requesterName: formData.get("name") as string,
    requesterEmail: formData.get("email") as string,
    message: formData.get("message") as string,
    requestType: "portfolio",
  });
  if (result?.error) throw new Error(result.error);
  return { success: true };
}

export async function submitJobApplication(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in" };

  const { checkRateLimit } = await import("@/lib/rate-limit");
  const limited = await checkRateLimit(user.id, "job_application");
  if (!limited.ok) return { error: limited.error };

  const jobSlug = formData.get("jobSlug") as string;
  const { data: job } = await supabase.from("jobs").select("id, title").eq("slug", jobSlug).single();
  if (!job) return { error: "Job not found" };

  const name = (formData.get("name") as string).trim();
  const email = (formData.get("email") as string).trim();
  const message = (formData.get("message") as string).trim();

  const { error } = await supabase.from("job_applications").insert({
    job_id: job.id,
    job_slug: jobSlug,
    applicant_id: user.id,
    applicant_name: name,
    applicant_email: email,
    message,
  });

  if (error) return { error: error.message };

  const { sendEmail, jobApplicationEmail, jobApplicationConfirmationEmail } = await import("@/lib/email");
  const confirmMail = jobApplicationConfirmationEmail({ applicantName: name, jobTitle: job.title });
  await sendEmail({ to: email, ...confirmMail });

  const { createNotification } = await import("@/lib/notifications");
  await createNotification({
    userId: user.id,
    title: "Application submitted",
    body: `You applied to ${job.title}.`,
    url: "/settings",
  });

  if (job.id) {
    const { data: poster } = await supabase.from("jobs").select("posted_by").eq("id", job.id).single();
    if (poster?.posted_by) {
      const { data: prof } = await supabase.from("profiles").select("email").eq("id", poster.posted_by).single();
      if (prof?.email) {
        const mail = jobApplicationEmail({ jobTitle: job.title, applicantName: name, applicantEmail: email, message });
        await sendEmail({ to: prof.email, ...mail });
      }
      const { sendPushToUser } = await import("@/lib/push");
      await sendPushToUser({
        userId: poster.posted_by,
        title: "New job application",
        body: `${name} applied to ${job.title}`,
        url: "/jobs/inbox",
      });
    }
  }

  revalidatePath("/jobs/inbox");
  revalidatePath("/admin/applications");
  return { success: true };
}

export async function submitMarketplaceInquiry(formData: FormData) {
  const listingTitle = formData.get("listingTitle") as string;
  const result = await insertContactRequest({
    refSlug: formData.get("listingSlug") as string,
    refName: listingTitle,
    requesterName: formData.get("name") as string,
    requesterEmail: formData.get("email") as string,
    message: formData.get("message") as string,
    requestType: formData.get("type") as string === "contact" ? "marketplace_contact" : "marketplace_quote",
  });
  if (result?.error) throw new Error(result.error);
  return { success: true };
}

export async function saveStudentOnboardingStep1(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/onboarding/student");

  try {
    await ensureUserProfile(supabase, user);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create profile";
    redirect(`/onboarding/student?error=${encodeURIComponent(message)}`);
  }

  const discipline = formData.get("discipline") as string;
  const goal = formData.get("goal") as string;

  await supabase.from("profiles").update({
    full_name: formData.get("fullName") as string || undefined,
    career_goals: [goal],
  }).eq("id", user.id);

  const slug = `${slugify(goal || discipline || user.id)}-${user.id.slice(0, 8)}`;

  const { data: existing } = await supabase
    .from("portfolios")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  const payload = {
    user_id: user.id,
    slug,
    headline: goal || `Student in ${discipline}`,
    university: "",
    discipline,
    bio: `Looking for mentorship in ${discipline}. Goal: ${goal}.`,
    skills: [] as string[],
    published: false,
    open_to_work: true,
    seeking: "full-time",
    location: "",
    credentials: [] as string[],
  };

  const { error } = existing
    ? await supabase.from("portfolios").update(payload).eq("user_id", user.id)
    : await supabase.from("portfolios").insert(payload);

  if (error) {
    redirect(`/onboarding/student?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/onboarding/student/matches");
}

/** @deprecated Use saveStudentOnboardingStep1 — kept for any stale form references. */
export async function completeStudentOnboarding(formData: FormData) {
  return saveStudentOnboardingStep1(formData);
}

export async function skipPortfolioOnboarding() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/onboarding/student");
  redirect("/");
}

export async function completeMentorOnboarding() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/onboarding/mentor");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role === "admin") redirect("/admin");
  if (profile?.role !== "mentor") redirect("/onboarding/student");

  redirect("/apply");
}
