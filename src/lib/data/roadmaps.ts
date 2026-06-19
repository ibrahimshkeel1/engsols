import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import type {
  DbMentorshipRoadmap,
  DbRoadmapMilestone,
  MilestoneStatus,
  RoadmapResourceLink,
  RoadmapStatus,
} from "@/types/database";

export type RoadmapMilestone = {
  id: string;
  roadmapId: string;
  title: string;
  description: string;
  status: MilestoneStatus;
  targetDate: string | null;
  resourceLinks: RoadmapResourceLink[];
  sortOrder: number;
  completedAt: string | null;
};

export type MentorshipRoadmap = {
  id: string;
  title: string;
  description: string;
  status: RoadmapStatus;
  targetDeadline: string | null;
  mentorUserId: string;
  studentUserId: string;
  mentorName?: string;
  studentName?: string;
  milestones: RoadmapMilestone[];
  createdAt: string;
  updatedAt: string;
};

function toMilestone(row: DbRoadmapMilestone): RoadmapMilestone {
  return {
    id: row.id,
    roadmapId: row.roadmap_id,
    title: row.title,
    description: row.description,
    status: row.status,
    targetDate: row.target_date,
    resourceLinks: Array.isArray(row.resource_links) ? row.resource_links : [],
    sortOrder: row.sort_order,
    completedAt: row.completed_at,
  };
}

function toRoadmap(row: DbMentorshipRoadmap): MentorshipRoadmap {
  const milestones = (row.roadmap_milestones ?? [])
    .map((m) => toMilestone(m as DbRoadmapMilestone))
    .sort((a, b) => a.sortOrder - b.sortOrder);

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    targetDeadline: row.target_deadline,
    mentorUserId: row.mentor_user_id,
    studentUserId: row.student_user_id,
    milestones,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const ROADMAP_SELECT = `*, roadmap_milestones (*)`;

async function attachProfileNames(
  supabase: Awaited<ReturnType<typeof createClient>>,
  rows: DbMentorshipRoadmap[],
): Promise<MentorshipRoadmap[]> {
  const userIds = new Set<string>();
  for (const row of rows) {
    userIds.add(row.mentor_user_id);
    userIds.add(row.student_user_id);
  }

  const names = new Map<string, string>();
  if (userIds.size > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, full_name")
      .in("id", [...userIds]);
    for (const p of profiles ?? []) {
      names.set(p.id as string, p.full_name as string);
    }
  }

  return rows.map((row) => {
    const roadmap = toRoadmap(row);
    roadmap.mentorName = names.get(row.mentor_user_id);
    roadmap.studentName = names.get(row.student_user_id);
    return roadmap;
  });
}

export async function getRoadmapsForMentor(mentorUserId: string): Promise<MentorshipRoadmap[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("mentorship_roadmaps")
    .select(ROADMAP_SELECT)
    .eq("mentor_user_id", mentorUserId)
    .neq("status", "archived")
    .order("updated_at", { ascending: false });

  return attachProfileNames(supabase, (data ?? []) as DbMentorshipRoadmap[]);
}

export async function getRoadmapsForStudent(studentUserId: string): Promise<MentorshipRoadmap[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data } = await supabase
    .from("mentorship_roadmaps")
    .select(ROADMAP_SELECT)
    .eq("student_user_id", studentUserId)
    .neq("status", "archived")
    .order("updated_at", { ascending: false });

  return attachProfileNames(supabase, (data ?? []) as DbMentorshipRoadmap[]);
}

export type RoadmapStudentOption = {
  userId: string;
  name: string;
  email: string;
};

export async function getMentorRoadmapStudentOptions(mentorUserId: string): Promise<RoadmapStudentOption[]> {
  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  const { data: mentor } = await supabase
    .from("mentor_profiles")
    .select("slug")
    .eq("user_id", mentorUserId)
    .maybeSingle();

  if (!mentor) return [];

  const { data } = await supabase
    .from("booking_requests")
    .select("user_id, requester_name, requester_email")
    .or(`mentor_slug.eq.${mentor.slug},mentor_user_id.eq.${mentorUserId}`)
    .not("user_id", "is", null)
    .order("created_at", { ascending: false })
    .limit(50);

  const seen = new Set<string>();
  const options: RoadmapStudentOption[] = [];

  for (const row of data ?? []) {
    const userId = row.user_id as string;
    if (!userId || seen.has(userId)) continue;
    seen.add(userId);
    options.push({
      userId,
      name: row.requester_name as string,
      email: row.requester_email as string,
    });
  }

  return options;
}
