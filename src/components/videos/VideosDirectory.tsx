"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { resolveVideoThumbnail } from "@/lib/video-thumbnail";
import { disciplines } from "@/data/disciplines";
import { ListPageLayout } from "@/components/shared/ListPageLayout";
import { EmptyStateClient } from "@/components/shared/EmptyStateClient";
import { videoPromptChips } from "@/data/empty-state-prompts";
import { Avatar } from "@/components/ui/Avatar";
import { Input } from "@/components/ui/input";
import type { Mentor, Video } from "@/types";

type Props = {
  videos: Video[];
  mentors: Mentor[];
};

export function VideosDirectory({ videos, mentors }: Props) {
  const [search, setSearch] = useState("");
  const [discipline, setDiscipline] = useState("");

  const filtered = useMemo(() => {
    let result = [...videos];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((v) => v.title.toLowerCase().includes(q) || v.tags.some((t) => t.toLowerCase().includes(q)));
    }
    if (discipline) result = result.filter((v) => v.discipline === discipline);
    return result;
  }, [videos, search, discipline]);

  return (
    <ListPageLayout
      label="Learning"
      title="Engineering Videos"
      description="Tutorials, career talks, and technical deep-dives from industry engineers. Full library launches with mentor content partnerships."
    >
      <div className="flex flex-wrap gap-3">
        <Input placeholder="Search videos..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
        <select value={discipline} onChange={(e) => setDiscipline(e.target.value)} className="h-10 rounded-xl border border-border bg-background px-3 text-sm">
          <option value="">All disciplines</option>
          {disciplines.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      {filtered.length === 0 ? (
        <EmptyStateClient
          title="No videos published yet"
          description="Tutorials and career talks from mentors will appear here as content partnerships launch."
          action={{ href: "/live", label: "Join live sessions" }}
          promptChips={videoPromptChips}
        />
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((video) => {
            const author = mentors.find((m) => m.slug === video.authorSlug);
            return (
              <Link key={video.slug} href={`/videos/${video.slug}`} className="card-interactive overflow-hidden rounded-2xl">
                <div className="relative aspect-video bg-muted">
                  <Image src={resolveVideoThumbnail(video.title, video.videoUrl, video.thumbnailUrl)} alt={video.title} fill className="object-cover" unoptimized />
                  <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-0.5 text-xs text-white">{video.duration}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold">{video.title}</h3>
                  {author && (
                    <div className="mt-2 flex items-center gap-2">
                      <Avatar name={author.name} discipline={author.discipline} size="sm" src={author.avatarUrl} />
                      <span className="text-sm text-muted-foreground">{author.name}</span>
                    </div>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground">{video.views.toLocaleString()} views</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </ListPageLayout>
  );
}
