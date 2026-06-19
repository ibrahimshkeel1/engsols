"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";

export async function resolveContentReport(reportId: string, status: "resolved" | "dismissed") {
  const admin = await requireRole(["admin"]);
  if (!admin) return { error: "Unauthorized" };

  const supabase = await createClient();
  const { error } = await supabase
    .from("content_reports")
    .update({ status })
    .eq("id", reportId);

  if (error) return { error: error.message };
  revalidatePath("/admin/reports");
  return { success: true };
}

export async function deleteReportedContent(reportId: string) {
  const admin = await requireRole(["admin"]);
  if (!admin) return { error: "Unauthorized" };

  const supabase = await createClient();
  const { data: report } = await supabase
    .from("content_reports")
    .select("content_type, content_id")
    .eq("id", reportId)
    .single();

  if (!report) return { error: "Report not found" };

  if (report.content_type === "forum_post") {
    await supabase.from("forum_posts").delete().eq("id", report.content_id);
  } else if (report.content_type === "forum_reply") {
    await supabase.from("forum_replies").delete().eq("id", report.content_id);
  }

  await supabase.from("content_reports").update({ status: "resolved" }).eq("id", reportId);

  revalidatePath("/admin/reports");
  revalidatePath("/forum");
  return { success: true };
}

export async function publishSeller(sellerId: string, published: boolean) {
  const admin = await requireRole(["admin"]);
  if (!admin) return { error: "Unauthorized" };

  const supabase = await createClient();
  const { data: seller } = await supabase.from("sellers").select("name, owner_id").eq("id", sellerId).single();
  const { error } = await supabase.from("sellers").update({ published }).eq("id", sellerId);
  if (error) return { error: error.message };

  if (published && seller?.owner_id) {
    const { data: prof } = await supabase.from("profiles").select("email").eq("id", seller.owner_id).single();
    if (prof?.email) {
      const { sendEmail, sellerApprovedEmail } = await import("@/lib/email");
      const mail = sellerApprovedEmail({ sellerName: seller.name });
      await sendEmail({ to: prof.email, ...mail });
    }
    const { sendPushToUser } = await import("@/lib/push");
    await sendPushToUser({
      userId: seller.owner_id,
      title: "Seller profile approved",
      body: `${seller.name} is now live on the marketplace.`,
      url: "/marketplace/sell",
    });
  }

  revalidatePath("/admin/sellers");
  revalidatePath("/marketplace");
  return { success: true };
}

export async function verifySeller(sellerId: string, verified: boolean) {
  const admin = await requireRole(["admin"]);
  if (!admin) return { error: "Unauthorized" };

  const supabase = await createClient();
  const { error } = await supabase.from("sellers").update({ verified }).eq("id", sellerId);
  if (error) return { error: error.message };

  revalidatePath("/admin/sellers");
  revalidatePath("/marketplace");
  return { success: true };
}

export async function publishMarketplaceListing(listingId: string, published: boolean) {
  const admin = await requireRole(["admin"]);
  if (!admin) return { error: "Unauthorized" };

  const supabase = await createClient();
  const { error } = await supabase.from("marketplace_listings").update({ published }).eq("id", listingId);
  if (error) return { error: error.message };

  revalidatePath("/admin/marketplace");
  revalidatePath("/marketplace");
  return { success: true };
}

export async function updateJobApplicationStatus(applicationId: string, status: "pending" | "reviewed" | "rejected") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: app } = await supabase
    .from("job_applications")
    .select("job_id, applicant_id, applicant_name, applicant_email, jobs(title)")
    .eq("id", applicationId)
    .single();

  if (!app) return { error: "Not found" };

  const { data: job } = await supabase.from("jobs").select("posted_by").eq("id", app.job_id).single();
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();

  if (job?.posted_by !== user.id && profile?.role !== "admin") {
    return { error: "Unauthorized" };
  }

  const { error } = await supabase.from("job_applications").update({ status }).eq("id", applicationId);
  if (error) return { error: error.message };

  if (app.applicant_id && (status === "reviewed" || status === "rejected")) {
    const jobs = app.jobs as { title: string } | { title: string }[] | null;
    const jobTitle = (Array.isArray(jobs) ? jobs[0] : jobs)?.title ?? "your job application";

    const { jobApplicationStatusEmail, sendEmail } = await import("@/lib/email");
    const mail = jobApplicationStatusEmail({
      applicantName: app.applicant_name,
      jobTitle,
      status,
    });
    await sendEmail({ to: app.applicant_email, ...mail });

    const { createNotification } = await import("@/lib/notifications");
    await createNotification({
      userId: app.applicant_id,
      title: `Application ${status}`,
      body: `Your application for ${jobTitle} was ${status}.`,
      url: "/settings",
    });

    const { sendPushToUser } = await import("@/lib/push");
    await sendPushToUser({
      userId: app.applicant_id,
      title: `Application ${status}`,
      body: `Update on ${jobTitle}`,
      url: "/settings",
    });
  }

  revalidatePath("/jobs/inbox");
  revalidatePath("/admin/applications");
  revalidatePath("/settings");
  return { success: true };
}

export async function toggleJobPublished(jobId: string, published: boolean) {
  const admin = await requireRole(["admin"]);
  if (!admin) return { error: "Unauthorized" };

  const supabase = await createClient();
  const { error } = await supabase.from("jobs").update({ published }).eq("id", jobId);
  if (error) return { error: error.message };

  revalidatePath("/admin/jobs");
  revalidatePath("/jobs");
  return { success: true };
}

export async function updateCertification(certId: string, formData: FormData) {
  const admin = await requireRole(["admin"]);
  if (!admin) return { error: "Unauthorized" };

  const supabase = await createClient();
  const { error } = await supabase.from("certifications").update({
    name: formData.get("name") as string,
    short_name: formData.get("shortName") as string,
    discipline: formData.get("discipline") as string,
    description: formData.get("description") as string,
    eligibility: formData.get("eligibility") as string,
    exam_format: formData.get("examFormat") as string,
    avg_prep_months: parseInt(formData.get("avgPrepMonths") as string, 10) || 6,
    pass_rate: (formData.get("passRate") as string) || null,
    related_mentor_slugs: (formData.get("mentorSlugs") as string || "").split(",").map((s) => s.trim()).filter(Boolean),
    prep_steps: JSON.parse((formData.get("prepSteps") as string) || "[]"),
    published: formData.get("published") === "true",
  }).eq("id", certId);

  if (error) return { error: error.message };
  revalidatePath("/admin/certifications");
  revalidatePath("/certifications");
  return { success: true };
}

export async function updateVideo(videoId: string, formData: FormData) {
  const admin = await requireRole(["admin"]);
  if (!admin) return { error: "Unauthorized" };

  const supabase = await createClient();
  const { error } = await supabase.from("videos").update({
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    author_mentor_slug: formData.get("authorSlug") as string,
    discipline: formData.get("discipline") as string,
    duration: formData.get("duration") as string,
    video_url: formData.get("videoUrl") as string,
    thumbnail_url: (formData.get("thumbnailUrl") as string) || null,
    tags: (formData.get("tags") as string || "").split(",").map((s) => s.trim()).filter(Boolean),
    published: formData.get("published") === "true",
  }).eq("id", videoId);

  if (error) return { error: error.message };
  revalidatePath("/admin/videos");
  revalidatePath("/videos");
  return { success: true };
}
