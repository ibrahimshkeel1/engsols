"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import type { MilestoneStatus } from "@/types/database";

const createRoadmapSchema = z.object({
  studentId: z.string().uuid("Valid student user ID required"),
  title: z.string().trim().min(3).max(200),
  deadline: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Deadline must be YYYY-MM-DD"),
});

const milestoneStatusSchema = z.enum(["pending", "in_progress", "completed"]);

const DEFAULT_MILESTONES = [
  {
    title: "Kickoff & goal alignment",
    description: "Define success metrics and weekly cadence with your mentor.",
    resource_links: [
      { title: "SMART goals worksheet", url: "https://www.mindtools.com/pages/article/smart-goals.htm" },
    ],
  },
  {
    title: "Core competency review",
    description: "Complete technical drills and submit work samples for feedback.",
    resource_links: [
      { title: "NCEES exam specifications", url: "https://ncees.org/exams/" },
    ],
  },
  {
    title: "Capstone milestone",
    description: "Final review session and readiness checklist before your target date.",
    resource_links: [],
  },
] as const;

function staggerMilestoneDates(deadline: string): (string | null)[] {
  const end = new Date(deadline);
  if (Number.isNaN(end.getTime())) return [null, null, null];

  const dates: (string | null)[] = [];
  for (let i = 0; i < DEFAULT_MILESTONES.length; i++) {
    const offset = DEFAULT_MILESTONES.length - i;
    const d = new Date(end);
    d.setDate(d.getDate() - offset * 14);
    dates.push(d.toISOString().slice(0, 10));
  }
  return dates;
}

export async function createMentorshipRoadmap(studentId: string, title: string, deadline: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in" };

  const parsed = createRoadmapSchema.safeParse({ studentId, title, deadline });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Invalid input" };
  }

  const { data: mentorProfile } = await supabase
    .from("mentor_profiles")
    .select("id, status")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!mentorProfile || mentorProfile.status !== "approved") {
    return { error: "Only approved mentors can create roadmaps" };
  }

  const { data: student } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", parsed.data.studentId)
    .maybeSingle();

  if (!student) return { error: "Student not found" };
  if (student.id === user.id) return { error: "You cannot create a roadmap for yourself" };

  const { data: roadmap, error } = await supabase
    .from("mentorship_roadmaps")
    .insert({
      mentor_user_id: user.id,
      student_user_id: parsed.data.studentId,
      mentor_profile_id: mentorProfile.id,
      title: parsed.data.title,
      target_deadline: parsed.data.deadline,
      status: "active",
    })
    .select("id")
    .single();

  if (error || !roadmap) return { error: error?.message ?? "Could not create roadmap" };

  const targetDates = staggerMilestoneDates(parsed.data.deadline);
  const milestoneRows = DEFAULT_MILESTONES.map((m, index) => ({
    roadmap_id: roadmap.id,
    title: m.title,
    description: m.description,
    status: index === 0 ? "in_progress" : "pending",
    target_date: targetDates[index],
    resource_links: m.resource_links,
    sort_order: index,
  }));

  const { error: milestoneError } = await supabase.from("roadmap_milestones").insert(milestoneRows);
  if (milestoneError) return { error: milestoneError.message };

  revalidatePath("/mentor/roadmaps");
  revalidatePath("/settings");
  revalidatePath("/for-you");
  return { success: true, roadmapId: roadmap.id };
}

export async function updateMilestoneStatus(
  milestoneId: string,
  status: MilestoneStatus,
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "You must be logged in" };

  const parsed = milestoneStatusSchema.safeParse(status);
  if (!parsed.success) return { error: "Invalid milestone status" };

  const { data: milestone } = await supabase
    .from("roadmap_milestones")
    .select("id, status, roadmap_id")
    .eq("id", milestoneId)
    .maybeSingle();

  if (!milestone) return { error: "Milestone not found" };

  const { data: roadmap } = await supabase
    .from("mentorship_roadmaps")
    .select("mentor_user_id, student_user_id")
    .eq("id", milestone.roadmap_id)
    .single();

  if (!roadmap) return { error: "Roadmap not found" };

  const isParticipant =
    roadmap.mentor_user_id === user.id || roadmap.student_user_id === user.id;

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const isAdmin = profile?.role === "admin";

  if (!isParticipant && !isAdmin) return { error: "Unauthorized" };

  const completedAt =
    parsed.data === "completed"
      ? new Date().toISOString()
      : parsed.data === "pending"
        ? null
        : undefined;

  const updatePayload: Record<string, unknown> = {
    status: parsed.data,
    updated_at: new Date().toISOString(),
  };

  if (completedAt !== undefined) {
    updatePayload.completed_at = completedAt;
  }

  const { error } = await supabase
    .from("roadmap_milestones")
    .update(updatePayload)
    .eq("id", milestoneId);

  if (error) return { error: error.message };

  revalidatePath("/mentor/roadmaps");
  revalidatePath("/settings");
  revalidatePath("/for-you");
  return { success: true };
}
