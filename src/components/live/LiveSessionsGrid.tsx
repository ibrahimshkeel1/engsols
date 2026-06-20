"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Radio } from "lucide-react";
import { videoThumbnail } from "@/lib/placeholders";
import { getDisciplineColors } from "@/lib/discipline-colors";
import { SessionCountdown } from "@/components/shared/SessionCountdown";
import { Avatar } from "@/components/ui/Avatar";
import { DisciplineBadge } from "@/components/ui/DisciplineBadge";
import { EmptyStateClient } from "@/components/shared/EmptyStateClient";
import { cn } from "@/lib/utils";
import Image from "next/image";

type Session = {
  slug: string;
  title: string;
  description?: string;
  discipline: string;
  scheduledAt: string;
  status: "upcoming" | "live" | "ended";
  viewerCount?: number;
  hostName?: string;
  hostSlug?: string;
  hostDiscipline?: string;
  callType?: string;
};

export function LiveSessionsGrid({ sessions }: { sessions: Session[] }) {
  const [tab, setTab] = useState<"all" | "upcoming" | "live" | "ended">("all");

  const filtered = useMemo(() => {
    if (tab === "all") return sessions;
    return sessions.filter((s) => s.status === tab);
  }, [sessions, tab]);

  const liveCount = sessions.filter((s) => s.status === "live").length;

  return (
    <>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter sessions by status">
        {(["all", "upcoming", "live", "ended"] as const).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={cn(
              "rounded-xl px-4 py-2.5 text-sm font-medium capitalize transition min-h-[44px]",
              tab === t ? "bg-zone-live text-white shadow-zone-live dark:text-bg-main" : "bg-muted text-muted-foreground hover:text-foreground",
            )}
          >
            {t}
          </button>
        ))}
      </div>
      {liveCount > 0 && (
        <p className="mt-4 text-sm">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-zone-live/15 px-3 py-1 font-medium text-zone-live shadow-zone-live">
            <span className="live-dot h-2 w-2 rounded-full bg-zone-live" />
            {liveCount} live now
          </span>
        </p>
      )}
      {sessions.length === 0 ? (
        <div className="mt-8">
          <EmptyStateClient
            icon={Radio}
            title="No live sessions yet"
            description="Mentors can host Q&As, workshops, and study groups on EngSols video."
            action={{ href: "/live/new", label: "Schedule a session" }}
          />
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-8">
          <EmptyStateClient
            icon={Radio}
            title="No sessions in this category"
            description="Try another tab or schedule a new session."
            action={{ href: "/live/new", label: "Schedule a session" }}
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" role="tabpanel">
          {filtered.map((stream) => {
            const stripe = getDisciplineColors(stream.discipline).stripe;
            return (
              <Link key={stream.slug} href={`/live/${stream.slug}`} className="card-interactive group overflow-hidden rounded-2xl">
                <div className="relative aspect-video bg-muted">
                  <Image src={videoThumbnail(stream.title.slice(0, 20))} alt="" fill className="object-cover opacity-90 transition group-hover:opacity-100 dark:opacity-75" unoptimized />
                  <div className={cn("absolute left-0 top-0 h-1 w-full", stripe)} />
                  {stream.status === "live" && (
                    <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-lg bg-zone-live px-2.5 py-1 text-xs font-bold text-white shadow-zone-live dark:text-bg-main">
                      <span className="live-dot h-1.5 w-1.5 rounded-full bg-bg-surface dark:bg-bg-main" />
                      LIVE
                    </span>
                  )}
                  {"callType" in stream && stream.callType === "forum_instant" && (
                    <span className="absolute right-3 top-3 rounded-lg bg-black/60 px-2 py-1 text-xs text-white">
                      Forum
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <DisciplineBadge discipline={stream.discipline} />
                  <h3 className="mt-3 font-semibold group-hover:text-zone-live">{stream.title}</h3>
                  {stream.hostName && (
                    <div className="mt-3 flex items-center gap-2">
                      <Avatar name={stream.hostName} discipline={stream.hostDiscipline ?? stream.discipline} size="sm" />
                      <span className="text-sm text-muted-foreground">{stream.hostName}</span>
                    </div>
                  )}
                  <p className="mt-3 text-xs text-muted-foreground">
                    {stream.status === "upcoming" && <SessionCountdown scheduledAt={stream.scheduledAt} className="mr-2" />}
                    {format(new Date(stream.scheduledAt), "MMM d, yyyy h:mm a")}
                    {stream.status === "live" && stream.viewerCount != null && ` · ${stream.viewerCount} watching`}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
