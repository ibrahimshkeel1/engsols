"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { liveStreams } from "@/data/liveStreams";
import { mentors } from "@/data/mentors";
import { avatarUrl } from "@/lib/utils";
import { videoThumbnail } from "@/lib/placeholders";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function LivePage() {
  const [tab, setTab] = useState<"all" | "upcoming" | "live" | "ended">("all");

  const filtered = useMemo(() => {
    if (tab === "all") return liveStreams;
    return liveStreams.filter((s) => s.status === tab);
  }, [tab]);

  const liveCount = liveStreams.filter((s) => s.status === "live").length;

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-slate-900">Live Streams</h1>
        <p className="mt-2 text-slate-600">
          Watch engineers and mentors live. {liveCount > 0 && <span className="font-medium text-red-600">{liveCount} live now</span>}
        </p>
        <div className="mt-6 flex gap-2">
          {(["all", "upcoming", "live", "ended"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-lg px-4 py-2 text-sm font-medium capitalize ${tab === t ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"}`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((stream) => {
            const host = mentors.find((m) => m.slug === stream.hostSlug);
            return (
              <Card key={stream.slug} className="overflow-hidden">
                <div className="relative aspect-video">
                  <Image src={videoThumbnail(stream.title.slice(0, 20))} alt="" fill className="object-cover" unoptimized />
                  {stream.status === "live" && (
                    <span className="absolute left-2 top-2 rounded bg-red-600 px-2 py-0.5 text-xs font-medium text-white">LIVE</span>
                  )}
                </div>
                <CardContent>
                  <Badge>{stream.discipline}</Badge>
                  <Link href={`/live/${stream.slug}`} className="mt-2 block font-semibold text-slate-900 hover:text-amber-600">
                    {stream.title}
                  </Link>
                  {host && (
                    <div className="mt-2 flex items-center gap-2">
                      <Image src={avatarUrl(host.name)} alt="" width={24} height={24} className="rounded-full" unoptimized />
                      <span className="text-sm text-slate-600">{host.name}</span>
                    </div>
                  )}
                  <p className="mt-2 text-xs text-slate-500">
                    {new Date(stream.scheduledAt).toLocaleString()}
                    {stream.status === "live" && ` · ${stream.viewerCount} watching`}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
