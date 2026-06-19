import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getForumPostsByDiscipline } from "@/lib/data/forum";
import { getLiveSessions } from "@/lib/data/live";
import { getApprovedMentors } from "@/lib/data/mentors";
import { getJobs } from "@/lib/data/jobs";
import { getCertifications } from "@/lib/data/certifications";
import { getPortfolioByUserId } from "@/lib/data/portfolios";
import { matchMentorsForStudent } from "@/lib/match-mentors";
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

export async function getForYouDigest(userId: string): Promise<ForYouDigest | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const [{ data: profile }, portfolio] = await Promise.all([
    supabase.from("profiles").select("career_goals").eq("id", userId).single(),
    getPortfolioByUserId(userId),
  ]);

  const goals: string[] = profile?.career_goals?.length ? profile.career_goals : [];
  const discipline = portfolio?.discipline ?? "Mechanical";

  const [allMentors, forumThreads, sessions, allJobs, certs] = await Promise.all([
    getApprovedMentors(),
    getForumPostsByDiscipline(discipline, 8),
    getLiveSessions(),
    getJobs(),
    getCertifications(),
  ]);

  const matched = matchMentorsForStudent(discipline, goals[0] ?? "", allMentors, 6);
  const newMentors = allMentors
    .filter((m) => m.discipline === discipline)
    .slice(0, 3);

  const picks = matched.length ? matched.slice(0, 3) : newMentors;

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
    .filter((p) => isWithinWeek(p.lastReplyAt ?? p.createdAt) || goals.some((g) => p.title.toLowerCase().includes(g.toLowerCase().slice(0, 8))))
    .slice(0, 5);

  return {
    discipline,
    goals,
    newMentors: picks,
    forumThreads: threads.length ? threads : forumThreads.slice(0, 3),
    liveThisWeek,
    jobs,
    certMilestones,
  };
}
