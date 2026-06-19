import { NextResponse } from "next/server";
import { getForumPosts } from "@/lib/data/forum";
import { getLiveSessions } from "@/lib/data/live";
import { getApprovedMentors } from "@/lib/data/mentors";

export const dynamic = "force-dynamic";

export async function GET() {
  const [posts, sessions, mentors] = await Promise.all([
    getForumPosts(),
    getLiveSessions(),
    getApprovedMentors(),
  ]);

  const liveSessions = sessions
    .filter((s) => s.status === "live")
    .slice(0, 3)
    .map((s) => ({
      slug: s.slug,
      title: s.title,
      discipline: s.discipline,
      viewerCount: s.viewerCount,
      status: s.status,
      hostName: s.hostName,
    }));

  const upcomingLive = sessions
    .filter((s) => s.status === "upcoming")
    .slice(0, 2)
    .map((s) => ({
      slug: s.slug,
      title: s.title,
      discipline: s.discipline,
      scheduledAt: s.scheduledAt,
      status: s.status,
    }));

  const hotPost = [...posts].sort((a, b) => b.replyCount - a.replyCount)[0] ?? null;
  const recentPosts = posts.slice(0, 3).map((p) => ({
    slug: p.slug,
    title: p.title,
    discipline: p.discipline,
    replyCount: p.replyCount,
    author: p.author,
    authorAvatarUrl: p.authorAvatarUrl,
    createdAt: p.createdAt,
    isSolved: p.isSolved,
  }));

  return NextResponse.json({
    mentorCount: mentors.length,
    postCount: posts.length,
    liveCount: liveSessions.length,
    liveSessions,
    upcomingLive,
    hotPost: hotPost
      ? {
          slug: hotPost.slug,
          title: hotPost.title,
          discipline: hotPost.discipline,
          replyCount: hotPost.replyCount,
          author: hotPost.author,
          authorAvatarUrl: hotPost.authorAvatarUrl,
          createdAt: hotPost.createdAt,
          isSolved: hotPost.isSolved,
        }
      : null,
    recentPosts,
  });
}
