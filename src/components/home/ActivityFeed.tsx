import Link from "next/link";
import { getForumPosts } from "@/lib/data/forum";
import { getLiveSessions } from "@/lib/data/live";
import { getApprovedMentors } from "@/lib/data/mentors";
import { AnimateIn } from "@/components/motion/AnimateIn";

export async function ActivityFeed() {
  const [posts, sessions, mentors] = await Promise.all([
    getForumPosts(),
    getLiveSessions(),
    getApprovedMentors(),
  ]);

  const liveCount = sessions.filter((s) => s.status === "live").length;
  const recentPosts = posts.slice(0, 3);

  return (
    <section className="border-y border-border bg-muted/30 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <AnimateIn>
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="section-label">Live platform</p>
              <h2 className="font-display mt-1 text-2xl tracking-tight">Happening now</h2>
            </div>
            <div className="flex flex-wrap gap-4 text-sm">
              <span className="rounded-full bg-card px-4 py-2 shadow-sm">
                <strong className="text-accent">{mentors.length}</strong>
                <span className="text-muted-foreground"> mentors</span>
              </span>
              <span className="rounded-full bg-card px-4 py-2 shadow-sm">
                <strong className="text-accent">{posts.length}</strong>
                <span className="text-muted-foreground"> discussions</span>
              </span>
              {liveCount > 0 && (
                <span className="rounded-full bg-red-500/10 px-4 py-2 text-red-600">
                  <span className="live-dot mr-1.5 inline-block h-2 w-2 rounded-full bg-red-500" />
                  <strong>{liveCount}</strong> live now
                </span>
              )}
            </div>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {recentPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/forum/${post.slug}`}
                className="card-interactive rounded-xl p-4"
              >
                <p className="text-xs text-muted-foreground">{post.discipline}</p>
                <p className="mt-1 line-clamp-2 font-medium">{post.title}</p>
                <p className="mt-2 text-xs text-muted-foreground">{post.replyCount} replies</p>
              </Link>
            ))}
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
