"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MessageSquare, Radio, Users } from "lucide-react";
import { SessionCountdown } from "@/components/shared/SessionCountdown";
import { Avatar } from "@/components/ui/Avatar";
import { RelativeTime } from "@/components/shared/RelativeTime";
import { AnimateIn } from "@/components/motion/AnimateIn";
import { ZoneSection } from "@/components/ui/ZoneSection";
import { ZoneCard } from "@/components/ui/ZoneCard";
import { ZoneBadge } from "@/components/ui/ZoneBadge";
import { zoneTokens } from "@/lib/zone-tokens";
import { cn } from "@/lib/utils";

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
  const t = zoneTokens.live;
  if (data.liveSessions.length > 0) {
    return (
      <div className="space-y-3">
        {data.liveSessions.map((session) => (
          <Link key={session.slug} href={`/live/${session.slug}/room`} className="block">
            <ZoneCard zone="live" className="flex flex-col p-5">
              <div className={cn("flex items-center gap-2 text-xs font-semibold uppercase tracking-wide", t.sectionLabel)}>
                <span className="live-dot h-2 w-2 rounded-full bg-zone-live" />
                Live now
              </div>
              <p className="mt-2 font-semibold leading-snug text-text-main">{session.title}</p>
              <p className="mt-1 text-sm text-text-muted">{session.discipline}</p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-text-muted">
                  {session.viewerCount} watching
                  {session.hostName ? ` · ${session.hostName}` : ""}
                </span>
                <span className={cn("font-medium", t.accent)}>Join →</span>
              </div>
            </ZoneCard>
          </Link>
        ))}
      </div>
    );
  }

  if (data.upcomingLive.length > 0) {
    return (
      <div className="space-y-3">
        {data.upcomingLive.map((session) => (
          <Link key={session.slug} href={`/live/${session.slug}`} className="block">
            <ZoneCard zone="live" className="flex flex-col p-5">
              <div className={cn("flex items-center gap-2 text-xs font-semibold uppercase tracking-wide", t.sectionLabel)}>
                <Radio className="h-3.5 w-3.5" />
                Upcoming
              </div>
              <p className="mt-2 font-semibold leading-snug text-text-main">{session.title}</p>
              <p className="mt-1 text-sm text-text-muted">{session.discipline}</p>
              <p className="mt-4 text-sm text-text-muted">
                <SessionCountdown scheduledAt={session.scheduledAt} className={cn("mr-2 font-medium", t.accent)} />
                {new Date(session.scheduledAt).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  timeZone: "UTC",
                })}
              </p>
            </ZoneCard>
          </Link>
        ))}
      </div>
    );
  }

  return (
    <ZoneCard zone="live" stripe={false} className="flex h-full flex-col border-dashed p-5">
      <Radio className="h-5 w-5 text-text-muted" />
      <p className="mt-2 font-medium text-text-main">No live sessions right now</p>
      <Link href="/live" className={cn("mt-2 inline-block text-sm hover:underline", t.accent)}>
        Browse upcoming sessions →
      </Link>
    </ZoneCard>
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
    <ZoneSection zone="recruiter" className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <AnimateIn>
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className={zoneTokens.recruiter.sectionLabel}>Live platform</p>
              <h2 className="font-display mt-1 text-2xl text-text-main sm:text-3xl">Happening now</h2>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="inline-flex items-center gap-2 rounded-full border border-zone-mentorship-border bg-card px-4 py-2 shadow-sm">
                <Users className="h-4 w-4 text-zone-mentorship" />
                <strong className="text-text-main">{data.mentorCount}</strong>
                <span className="text-text-muted">mentors</span>
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-zone-recruiter-border bg-card px-4 py-2 shadow-sm">
                <MessageSquare className="h-4 w-4 text-zone-recruiter" />
                <strong className="text-text-main">{data.postCount}</strong>
                <span className="text-text-muted">discussions</span>
              </span>
              {data.liveCount > 0 && (
                <span className="inline-flex items-center gap-2 rounded-full border border-zone-live-border bg-card px-4 py-2 text-zone-live-on">
                  <span className="live-dot inline-block h-2 w-2 rounded-full bg-zone-live" />
                  <strong>{data.liveCount}</strong> live now
                </span>
              )}
            </div>
          </div>
        </AnimateIn>

        <div className="mt-8 grid gap-4 lg:grid-cols-3 lg:items-start">
          <div className="min-w-0">
            <p className={cn("mb-3 text-xs font-semibold uppercase tracking-wide", zoneTokens.live.sectionLabel)}>
              Live
            </p>
            <LiveColumn data={data} />
          </div>

          <div className="min-w-0">
            <p className={cn("mb-3 text-xs font-semibold uppercase tracking-wide", zoneTokens.recruiter.sectionLabel)}>
              Hot discussion
            </p>
            {data.hotPost ? (
              <Link href={`/forum/${data.hotPost.slug}`} className="block">
                <ZoneCard zone="recruiter" className="p-5">
                  <div className="flex items-start gap-3">
                    <Avatar name={data.hotPost.author} size="sm" src={data.hotPost.authorAvatarUrl} />
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-3 font-semibold leading-snug text-text-main">{data.hotPost.title}</p>
                      <p className="mt-2 text-xs text-text-muted">
                        {data.hotPost.author} · {data.hotPost.replyCount} replies ·{" "}
                        <RelativeTime date={data.hotPost.createdAt} />
                      </p>
                    </div>
                  </div>
                  {data.hotPost.isSolved && (
                    <ZoneBadge zone="mentorship" className="mt-3">
                      Solved
                    </ZoneBadge>
                  )}
                </ZoneCard>
              </Link>
            ) : (
              <p className="rounded-xl border border-dashed border-zone-recruiter-border bg-card/80 p-5 text-sm text-text-muted">
                No discussions yet.{" "}
                <Link href="/forum/new" className="text-zone-recruiter hover:underline">
                  Start one →
                </Link>
              </p>
            )}
          </div>

          <div className="min-w-0">
            <p className={cn("mb-3 text-xs font-semibold uppercase tracking-wide", zoneTokens.news.sectionLabel)}>
              Recent threads
            </p>
            {data.recentPosts.length > 0 ? (
              <div className="space-y-3">
                {data.recentPosts.map((post) => (
                  <Link key={post.slug} href={`/forum/${post.slug}`} className="block">
                    <ZoneCard zone="news" stripe={false} className="flex items-start gap-3 p-4">
                      <Avatar name={post.author} size="sm" src={post.authorAvatarUrl} />
                      <div className="min-w-0 flex-1">
                        <p className="line-clamp-2 font-medium leading-snug text-text-main">{post.title}</p>
                        <p className="mt-1 text-xs text-text-muted">
                          {post.discipline} · {post.replyCount} replies · <RelativeTime date={post.createdAt} />
                        </p>
                      </div>
                    </ZoneCard>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-dashed border-zone-news-border bg-card/80 p-5 text-sm text-text-muted">
                Forum activity will show up here.
              </p>
            )}
          </div>
        </div>
      </div>
    </ZoneSection>
  );
}
