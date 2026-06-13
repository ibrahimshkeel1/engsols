"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { avatarUrl } from "@/lib/utils";
import { videoThumbnail } from "@/lib/placeholders";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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
      <div className="flex flex-wrap gap-2">
        {(["all", "upcoming", "live", "ended"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-xl px-4 py-2 text-sm font-medium capitalize transition ${
              tab === t ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      {liveCount > 0 && (
        <p className="mt-4 text-sm">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 px-3 py-1 font-medium text-red-600 dark:text-red-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
            {liveCount} live now
          </span>
        </p>
      )}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((stream) => (
          <Card key={stream.slug} className="card-elevated overflow-hidden transition hover:border-primary/30">
            <div className="relative aspect-video bg-muted">
              <Image src={videoThumbnail(stream.title.slice(0, 20))} alt="" fill className="object-cover" unoptimized />
              {stream.status === "live" && (
                <span className="absolute left-3 top-3 rounded-lg bg-red-600 px-2.5 py-1 text-xs font-bold text-white">LIVE</span>
              )}
            </div>
            <CardContent className="p-5">
              <Badge>{stream.discipline}</Badge>
              <Link href={`/live/${stream.slug}`} className="mt-3 block font-semibold hover:text-primary">
                {stream.title}
              </Link>
              {stream.hostName && (
                <div className="mt-3 flex items-center gap-2">
                  <Image src={avatarUrl(stream.hostName)} alt="" width={28} height={28} className="rounded-full" unoptimized />
                  <span className="text-sm text-muted-foreground">{stream.hostName}</span>
                </div>
              )}
              <p className="mt-3 text-xs text-muted-foreground">
                {format(new Date(stream.scheduledAt), "MMM d, yyyy h:mm a")}
                {stream.status === "live" && stream.viewerCount != null && ` · ${stream.viewerCount} watching`}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="py-16 text-center text-muted-foreground">No sessions in this category.</p>
      )}
    </>
  );
}
