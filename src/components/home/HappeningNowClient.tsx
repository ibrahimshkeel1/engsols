"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MessageSquare, Radio, Users } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { RelativeTime } from "@/components/shared/RelativeTime";
import { AnimateIn } from "@/components/motion/AnimateIn";

type ActivityPayload = {
  mentorCount: number;
  postCount: number;
  liveCount: number;
  liveSessions: {
    slug: string;
    title: string;
    discipline: string;
    viewerCount: number;
    status: string;
    hostName?: string;
  }[];
  upcomingLive: {
    slug: string;
    title: string;
    discipline: string;
    scheduledAt: string;
    status: string;
  }[];
  hotPost: {
    slug: string;
    title: string;
    discipline: string;
    replyCount: number;
    author: string;
    authorAvatarUrl?: string | null;
    createdAt: string;
    isSolved: boolean;
  } | null;
  recentPosts: {
    slug: string;
    title: string;
    discipline: string;
    replyCount: number;
    author: string;
    authorAvatarUrl?: string | null;
    createdAt: string;
    isSolved: boolean;
  }[];
};

type HappeningNowProps = {
  initial: ActivityPayload;
};

function LiveColumn({ data }: { data: ActivityPayload }) {
  if (data.liveSessions.length > 0) {
    return (
      <div className="space-y-3">
        {data.liveSessions.map((session) => (
          <Link
            key={session.slug}
            href={`/live/${session.slug}/room`}
            className="card-interactive flex flex-col rounded-xl border border-red-500/20 bg-card p-5"
          >
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-red-600 dark:text-red-400">
              <span className="live-dot h-2 w-2 rounded-full bg-red-500" />
              Live now
            </div>
            <p className="mt-2 font-semibold leading-snug">{session.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{session.discipline}</p>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {session.viewerCount} watching
                {session.hostName ? ` · ${session.hostName}` : ""}
              </span>
              <span className="font-medium text-primary">Join →</span>
            </div>
          </Link>
        ))}
      </div>
    );
  }

  if (data.upcomingLive.length > 0) {
    return (
      <div className="space-y-3">
        {data.upcomingLive.map((session) => (
          <Link
            key={session.slug}
            href={`/live/${session.slug}`}
            className="card-interactive flex flex-col rounded-xl bg-card p-5"
          >
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
              <Radio className="h-3.5 w-3.5" />
              Upcoming
            </div>
            <p className="mt-2 font-semibold leading-snug">{session.title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{session.discipline}</p>
            <p className="mt-4 text-sm text-muted-foreground">
              {new Date(session.scheduledAt).toLocaleString("en-US", {
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
                timeZone: "UTC",
              })}
            </p>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col rounded-xl border border-dashed border-border bg-card/50 p-5">
      <Radio className="h-5 w-5 text-muted-foreground" />
      <p className="mt-2 font-medium">No live sessions right now</p>
      <Link href="/live" className="mt-2 inline-block text-sm text-primary hover:underline">
        Browse upcoming sessions →
      </Link>
    </div>
  );
}

export function HappeningNowClient({ initial }: HappeningNowProps) {
  const [data, setData] = useState(initial);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/home/activity");
        if (res.ok) setData(await res.json());
      } catch {
        /* keep last good data */
      }
    }, 45_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="border-y border-border bg-muted/30 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <AnimateIn>
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="section-label">Live platform</p>
              <h2 className="font-display mt-1 text-2xl sm:text-3xl">Happening now</h2>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 shadow-sm">
                <Users className="h-4 w-4 text-primary" />
                <strong>{data.mentorCount}</strong>
                <span className="text-muted-foreground">mentors</span>
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 shadow-sm">
                <MessageSquare className="h-4 w-4 text-primary" />
                <strong>{data.postCount}</strong>
                <span className="text-muted-foreground">discussions</span>
              </span>
              {data.liveCount > 0 && (
                <span className="inline-flex items-center gap-2 rounded-full bg-red-500/10 px-4 py-2 text-red-600 dark:text-red-400">
                  <span className="live-dot inline-block h-2 w-2 rounded-full bg-red-500" />
                  <strong>{data.liveCount}</strong> live now
                </span>
              )}
            </div>
          </div>
        </AnimateIn>

        <div className="mt-8 grid gap-4 lg:grid-cols-3 lg:items-start">
          <div className="min-w-0">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Live</p>
            <LiveColumn data={data} />
          </div>

          <div className="min-w-0">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Hot discussion</p>
            {data.hotPost ? (
              <Link
                href={`/forum/${data.hotPost.slug}`}
                className="card-interactive block rounded-xl bg-card p-5"
              >
                <div className="flex items-start gap-3">
                  <Avatar name={data.hotPost.author} size="sm" src={data.hotPost.authorAvatarUrl} />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-3 font-semibold leading-snug">{data.hotPost.title}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {data.hotPost.author} · {data.hotPost.replyCount} replies · <RelativeTime date={data.hotPost.createdAt} />
                    </p>
                  </div>
                </div>
                {data.hotPost.isSolved && (
                  <span className="mt-3 inline-flex rounded-md bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
                    Solved
                  </span>
                )}
              </Link>
            ) : (
              <p className="rounded-xl border border-dashed border-border bg-card/50 p-5 text-sm text-muted-foreground">
                No discussions yet.{" "}
                <Link href="/forum/new" className="text-primary hover:underline">
                  Start one →
                </Link>
              </p>
            )}
          </div>

          <div className="min-w-0">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Recent threads</p>
            {data.recentPosts.length > 0 ? (
              <div className="space-y-3">
                {data.recentPosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/forum/${post.slug}`}
                    className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/30"
                  >
                    <Avatar name={post.author} size="sm" src={post.authorAvatarUrl} />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 font-medium leading-snug">{post.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {post.discipline} · {post.replyCount} replies · <RelativeTime date={post.createdAt} />
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-border bg-card/50 p-5 text-sm text-muted-foreground">
                Forum activity will show up here.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
