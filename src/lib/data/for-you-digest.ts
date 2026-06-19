import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getForumPostsByDiscipline } from "@/lib/data/forum";
import { getLiveSessions } from "@/lib/data/live";
import { getApprovedMentors } from "@/lib/data/mentors";
import { getJobs } from "@/lib/data/jobs";
import { getCertifications } from "@/lib/data/certifications";
import { getPortfolioByUserId } from "@/lib/data/portfolios";
import { matchMentorsForStudent } from "@/lib/match-mentors";
import { goals as defaultGoals } from "@/data/goals";
import type { Certification, ForumPost, Job, LiveStream, Mentor } from "@/types";

export type ForYouDigest = {
  discipline: string;
  goals: string[];
  newMentors: Mentor[];
  forumThreads: ForumPost[];
  liveThisWeek: LiveStream[];
  jobs: Job[];
  certMilestones: Certification[];
};

const WEEK_MS = 7 * 86_400_000;

function isWithinWeek(iso: string): boolean {
  return Date.now() - new Date(iso).getTime() < WEEK_MS;
}

function isUpcomingThisWeek(iso: string): boolean {
  const t = new Date(iso).getTime();
  return t > Date.now() && t - Date.now() < WEEK_MS;
}

async function loadUserContext(userId: string) {
  const defaultGoalLabels = defaultGoals.slice(0, 2).map((g) => g.label);

  if (!isSupabaseConfigured()) {
    return { goals: defaultGoalLabels, discipline: "Mechanical" };
  }

  const supabase = await createClient();
  const [{ data: profile }, portfolio] = await Promise.all([
    supabase.from("profiles").select("career_goals").eq("id", userId).single(),
    getPortfolioByUserId(userId),
  ]);

  return {
    goals: profile?.career_goals?.length ? profile.career_goals : defaultGoalLabels,
    discipline: portfolio?.discipline ?? "Mechanical",
  };
}

export async function getForYouDigest(userId: string): Promise<ForYouDigest> {
  const { goals, discipline } = await loadUserContext(userId);

  const [allMentors, forumThreads, sessions, allJobs, certs] = await Promise.all([
    getApprovedMentors(),
    getForumPostsByDiscipline(discipline, 8),
    getLiveSessions(),
    getJobs(),
    getCertifications(),
  ]);

  const matched = matchMentorsForStudent(discipline, goals[0] ?? "", allMentors, 6);
  const disciplineMentors = allMentors.filter((m) => m.discipline === discipline).slice(0, 3);
  const picks = matched.length ? matched.slice(0, 3) : disciplineMentors.length ? disciplineMentors : allMentors.slice(0, 3);

  const liveThisWeek = sessions.filter(
    (s) => s.discipline === discipline && (s.status === "live" || isUpcomingThisWeek(s.scheduledAt)),
  );

  const jobs = allJobs
    .filter((j) => j.discipline === discipline)
    .slice(0, 4);

  const certMilestones = certs
    .filter((c) => c.discipline === discipline)
    .slice(0, 3);

  const threads = forumThreads
    .filter((p) => isWithinWeek(p.lastReplyAt ?? p.createdAt) || goals.some((g: string) => p.title.toLowerCase().includes(g.toLowerCase().slice(0, 8))))
    .slice(0, 5);

  return {
    discipline,
    goals,
    newMentors: picks,
    forumThreads: threads.length ? threads : forumThreads.slice(0, 3),
    liveThisWeek: liveThisWeek.length ? liveThisWeek : sessions.filter((s) => s.status !== "ended").slice(0, 3),
    jobs: jobs.length ? jobs : allJobs.slice(0, 4),
    certMilestones: certMilestones.length ? certMilestones : certs.slice(0, 3),
  };
}
