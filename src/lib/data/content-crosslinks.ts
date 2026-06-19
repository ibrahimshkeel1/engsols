import { disciplines } from "@/data/disciplines";
import { getForumPostsByDiscipline } from "@/lib/data/forum";
import { getLiveSessions } from "@/lib/data/live";
import { getMentorsByDiscipline } from "@/lib/data/mentors";
import type { ForumPost, LiveStream, Mentor } from "@/types";

export type ContentCrossLinksData = {
  mentors: Mentor[];
  forumPosts: ForumPost[];
  liveSessions: LiveStream[];
};

/** Map a news category string to the closest engineering discipline for cross-linking. */
export function categoryToDiscipline(category: string): string | null {
  const lower = category.toLowerCase();
  for (const d of disciplines) {
    const token = d.toLowerCase().split(" ")[0];
    if (lower.includes(token) || d.toLowerCase().includes(lower)) return d;
  }
  if (lower.includes("oil") || lower.includes("gas") || lower.includes("energy")) return "Oil & Gas";
  if (lower.includes("drill")) return "Drilling Engineering";
  if (lower.includes("reservoir")) return "Reservoir Engineering";
  if (lower.includes("production")) return "Production Engineering";
  return null;
}

export async function getContentCrossLinks(
  discipline: string,
  options?: { excludeForumSlug?: string; mentorLimit?: number },
): Promise<ContentCrossLinksData> {
  const mentorLimit = options?.mentorLimit ?? 3;
  const [mentors, forumPosts, sessions] = await Promise.all([
    getMentorsByDiscipline(discipline, mentorLimit),
    getForumPostsByDiscipline(discipline, 4),
    getLiveSessions(),
  ]);

  const liveSessions = sessions
    .filter((s) => s.discipline === discipline && (s.status === "upcoming" || s.status === "live"))
    .slice(0, 3);

  const filteredPosts = options?.excludeForumSlug
    ? forumPosts.filter((p) => p.slug !== options.excludeForumSlug)
    : forumPosts;

  return {
    mentors,
    forumPosts: filteredPosts.slice(0, 3),
    liveSessions,
  };
}
