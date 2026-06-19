"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth";
import { mentorProfileSchema, mentorReviewSchema, specialistRequestSchema } from "@/lib/validation";
import type { MentorFilters } from "@/lib/filter-mentors";
import { bookingNotificationEmail, sendEmail } from "@/lib/email";
import { z } from "zod";

const adminMentorExtrasSchema = z.object({
  mentorId: z.string().uuid(),
  respondsWithinHours: z.number().int().min(1).max(168).optional().nullable(),
  introSlotsThisWeek: z.number().int().min(0).max(20).optional().nullable(),
  introVideoUrl: z.string().url().optional().or(z.literal("")),
});

export async function updateMentorProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in" };

  const parsed = mentorProfileSchema.safeParse({
    headline: formData.get("headline"),
    company: formData.get("company"),
    discipline: formData.get("discipline"),
    bio: formData.get("bio"),
    monthlyRate: parseInt(formData.get("monthlyRate") as string, 10) || 0,
    yearsExperience: parseInt(formData.get("yearsExperience") as string, 10) || 0,
    skills: (formData.get("skills") as string || "").split(",").map((s) => s.trim()).filter(Boolean),
    calendlyUrl: (formData.get("calendlyUrl") as string) || "",
    introCalendlyUrl: (formData.get("introCalendlyUrl") as string) || "",
    studyPlanCalendlyUrl: (formData.get("studyPlanCalendlyUrl") as string) || "",
    interviewCalendlyUrl: (formData.get("interviewCalendlyUrl") as string) || "",
    introVideoUrl: (formData.get("introVideoUrl") as string) || "",
    respondsWithinHours: (() => {
      const raw = formData.get("respondsWithinHours") as string;
      if (!raw?.trim()) return null;
      const n = parseInt(raw, 10);
      return Number.isFinite(n) ? n : null;
    })(),
    introSlotsThisWeek: (() => {
      const raw = formData.get("introSlotsThisWeek") as string;
      if (!raw?.trim()) return null;
      const n = parseInt(raw, 10);
      return Number.isFinite(n) ? n : null;
    })(),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid input" };
  }

  const d = parsed.data;
  const { error } = await supabase
    .from("mentor_profiles")
    .update({
      headline: d.headline,
      company: d.company,
      discipline: d.discipline,
      bio: d.bio,
      monthly_rate: d.monthlyRate,
      years_experience: d.yearsExperience,
      skills: d.skills,
      calendly_url: d.calendlyUrl || null,
      intro_calendly_url: d.introCalendlyUrl || null,
      study_plan_calendly_url: d.studyPlanCalendlyUrl || null,
      interview_calendly_url: d.interviewCalendlyUrl || null,
      intro_video_url: d.introVideoUrl || null,
      responds_within_hours: d.respondsWithinHours ?? null,
      intro_slots_this_week: d.introSlotsThisWeek ?? null,
    })
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/mentor/profile");
  revalidatePath("/mentors");
  return { success: true };
}

export async function submitMentorReview(mentorSlug: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in" };

  const parsed = mentorReviewSchema.safeParse({
    rating: parseInt(formData.get("rating") as string, 10),
    text: formData.get("text"),
    authorRole: formData.get("authorRole"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid review" };
  }

  const { data: mentor } = await supabase
    .from("mentor_profiles")
    .select("id, user_id")
    .eq("slug", mentorSlug)
    .eq("status", "approved")
    .single();

  if (!mentor) return { error: "Mentor not found" };
  if (mentor.user_id === user.id) return { error: "You cannot review yourself" };

  const { error } = await supabase.from("mentor_reviews").upsert({
    mentor_profile_id: mentor.id,
    author_id: user.id,
    rating: parsed.data.rating,
    text: parsed.data.text,
    author_role: parsed.data.authorRole || "Student",
  }, { onConflict: "mentor_profile_id,author_id" });

  if (error) return { error: error.message };

  revalidatePath(`/mentors/${mentorSlug}`);
  revalidatePath("/mentors");
  return { success: true };
}

export async function toggleSavedMentor(mentorSlug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in" };

  const { data: existing } = await supabase
    .from("saved_mentors")
    .select("mentor_slug")
    .eq("user_id", user.id)
    .eq("mentor_slug", mentorSlug)
    .maybeSingle();

  if (existing) {
    await supabase.from("saved_mentors").delete().eq("user_id", user.id).eq("mentor_slug", mentorSlug);
    revalidatePath("/settings");
    return { saved: false };
  }

  await supabase.from("saved_mentors").insert({ user_id: user.id, mentor_slug: mentorSlug });
  revalidatePath("/settings");
  return { saved: true };
}

export async function updateMentorBookingStatus(bookingId: string, status: "pending" | "contacted" | "closed") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const { data: booking } = await supabase
    .from("booking_requests")
    .select("id, mentor_slug, mentor_user_id, requester_name, requester_email, request_type, user_id")
    .eq("id", bookingId)
    .single();

  if (!booking) return { error: "Not found" };

  const { data: mentor } = await supabase
    .from("mentor_profiles")
    .select("user_id, slug")
    .eq("user_id", user.id)
    .maybeSingle();

  const isMentorOwner = mentor && (mentor.slug === booking.mentor_slug || booking.mentor_user_id === user.id);
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const isAdmin = profile?.role === "admin";

  if (!isMentorOwner && !isAdmin) return { error: "Unauthorized" };

  const { error } = await supabase.from("booking_requests").update({ status }).eq("id", bookingId);
  if (error) return { error: error.message };

  if (booking.user_id && (status === "contacted" || status === "closed")) {
    const { data: mentorProfile } = await supabase
      .from("mentor_profiles")
      .select("profiles(full_name)")
      .eq("slug", booking.mentor_slug)
      .maybeSingle();
    const mentorName =
      (mentorProfile?.profiles as { full_name?: string } | null)?.full_name ?? booking.mentor_slug;

    const { bookingStatusEmail, sendEmail } = await import("@/lib/email");
    const mail = bookingStatusEmail({
      studentName: booking.requester_name,
      mentorName,
      status,
      requestType: booking.request_type,
    });
    await sendEmail({ to: booking.requester_email, ...mail });

    const { createNotification } = await import("@/lib/notifications");
    await createNotification({
      userId: booking.user_id,
      title: `Booking ${status}`,
      body: `${mentorName} updated your ${booking.request_type.replace(/_/g, " ")} request.`,
      url: "/settings",
    });

    const { sendPushToUser } = await import("@/lib/push");
    await sendPushToUser({
      userId: booking.user_id,
      title: `Booking ${status}`,
      body: `${mentorName} updated your request.`,
      url: "/settings",
    });
  }

  revalidatePath("/mentor/bookings");
  revalidatePath("/admin/bookings");
  return { success: true };
}

export async function saveSessionNote(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in" };

  const mentorSlug = formData.get("mentorSlug") as string;
  const note = (formData.get("note") as string || "").trim();
  const noteId = formData.get("noteId") as string | null;

  if (!note) return { error: "Note cannot be empty" };

  if (noteId) {
    const { error } = await supabase
      .from("session_notes")
      .update({ note, updated_at: new Date().toISOString() })
      .eq("id", noteId)
      .eq("user_id", user.id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("session_notes").insert({
      user_id: user.id,
      mentor_slug: mentorSlug,
      note,
      booking_request_id: (formData.get("bookingId") as string) || null,
    });
    if (error) return { error: error.message };
  }

  revalidatePath("/settings");
  return { success: true };
}

export async function toggleMentorFeatured(mentorId: string, featured: boolean) {
  const admin = await requireRole(["admin"]);
  if (!admin) return { error: "Unauthorized" };

  const supabase = await createClient();
  const { error } = await supabase.from("mentor_profiles").update({ featured }).eq("id", mentorId);
  if (error) return { error: error.message };

  revalidatePath("/admin/mentors");
  revalidatePath("/mentors");
  revalidatePath("/");
  return { success: true };
}

export async function toggleMentorVerified(mentorId: string, verified: boolean) {
  const admin = await requireRole(["admin"]);
  if (!admin) return { error: "Unauthorized" };

  const supabase = await createClient();
  const { error } = await supabase.from("mentor_profiles").update({ verified }).eq("id", mentorId);
  if (error) return { error: error.message };

  revalidatePath("/admin/mentors");
  revalidatePath("/mentors");
  return { success: true };
}

export async function notifyMentorOfBooking(opts: {
  mentorEmail: string;
  mentorName: string;
  requesterName: string;
  requesterEmail: string;
  message: string;
  type: string;
}) {
  const { subject, html } = bookingNotificationEmail({
    mentorName: opts.mentorName,
    requesterName: opts.requesterName,
    requesterEmail: opts.requesterEmail,
    message: opts.message,
    type: opts.type,
  });
  await sendEmail({ to: opts.mentorEmail, subject, html });
}

export async function updateGoalProgress(goal: string, completed: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in" };

  const { data: profile } = await supabase
    .from("profiles")
    .select("career_goals, goals_completed")
    .eq("id", user.id)
    .single();

  const goals = profile?.career_goals ?? [];
  let completedGoals = profile?.goals_completed ?? [];

  if (completed) {
    if (!completedGoals.includes(goal)) completedGoals = [...completedGoals, goal];
  } else {
    completedGoals = completedGoals.filter((g: string) => g !== goal);
  }

  const { error } = await supabase
    .from("profiles")
    .update({ career_goals: goals.length ? goals : [goal], goals_completed: completedGoals })
    .eq("id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/settings");
  return { success: true };
}

export async function submitSpecialistRequest(input: {
  requesterName: string;
  requesterEmail: string;
  discipline: string;
  subField?: string;
  skillsRequested?: string[];
  careerRequirements: string;
  searchQuery?: string;
  filtersSnapshot?: MentorFilters;
}) {
  const supabase = await createClient();

  const parsed = specialistRequestSchema.safeParse({
    requesterName: input.requesterName,
    requesterEmail: input.requesterEmail,
    discipline: input.discipline,
    subField: input.subField ?? "",
    skillsRequested: input.skillsRequested ?? [],
    careerRequirements: input.careerRequirements,
    searchQuery: input.searchQuery ?? "",
    filtersSnapshot: input.filtersSnapshot ?? {},
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid request" };
  }

  const d = parsed.data;

  const { data, error } = await supabase.rpc("submit_specialist_mentor_request", {
    p_requester_name: d.requesterName,
    p_requester_email: d.requesterEmail,
    p_discipline: d.discipline,
    p_sub_field: d.subField,
    p_skills_requested: d.skillsRequested,
    p_career_requirements: d.careerRequirements,
    p_search_query: d.searchQuery,
    p_filters_snapshot: d.filtersSnapshot,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true, id: data as string };
}

export async function updateMentorExtrasByAdmin(formData: FormData) {
  await requireRole(["admin"]);
  const supabase = await createClient();

  const parsed = adminMentorExtrasSchema.safeParse({
    mentorId: formData.get("mentorId"),
    respondsWithinHours: (() => {
      const raw = formData.get("respondsWithinHours") as string;
      if (!raw?.trim()) return null;
      const n = parseInt(raw, 10);
      return Number.isFinite(n) ? n : null;
    })(),
    introSlotsThisWeek: (() => {
      const raw = formData.get("introSlotsThisWeek") as string;
      if (!raw?.trim()) return null;
      const n = parseInt(raw, 10);
      return Number.isFinite(n) ? n : null;
    })(),
    introVideoUrl: (formData.get("introVideoUrl") as string) || "",
  });

  if (!parsed.success) return { error: parsed.error.issues[0]?.message || "Invalid input" };

  const d = parsed.data;
  const { data: mentor, error } = await supabase
    .from("mentor_profiles")
    .update({
      responds_within_hours: d.respondsWithinHours ?? null,
      intro_slots_this_week: d.introSlotsThisWeek ?? null,
      intro_video_url: d.introVideoUrl || null,
    })
    .eq("id", d.mentorId)
    .select("slug")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/admin/mentors");
  revalidatePath("/mentors");
  if (mentor?.slug) revalidatePath(`/mentors/${mentor.slug}`);
  return { success: true };
}
