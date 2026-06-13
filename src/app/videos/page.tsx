"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { videos } from "@/data/videos";
import { mentors } from "@/data/mentors";
import { videoThumbnail } from "@/lib/placeholders";
import { disciplines } from "@/data/disciplines";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function VideosPage() {
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
  }, [search, discipline]);

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-foreground">Engineering Videos</h1>
        <p className="mt-2 text-muted-foreground">Tutorials, career talks, and technical deep-dives from industry engineers.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Input placeholder="Search videos..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
          <select value={discipline} onChange={(e) => setDiscipline(e.target.value)} className="h-10 rounded-lg border border-border px-3 text-sm">
            <option value="">All disciplines</option>
            {disciplines.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((video) => {
            const author = mentors.find((m) => m.slug === video.authorSlug);
            return (
              <Card key={video.slug} className="overflow-hidden">
                <div className="relative aspect-video">
                  <Image src={videoThumbnail(video.title.slice(0, 18))} alt="" fill className="object-cover" unoptimized />
                  <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-0.5 text-xs text-white">{video.duration}</span>
                </div>
                <CardContent>
                  <Link href={`/videos/${video.slug}`} className="font-semibold text-foreground hover:text-primary">
                    {video.title}
                  </Link>
                  <p className="mt-1 text-sm text-muted-foreground">{author?.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{video.views.toLocaleString()} views</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {video.tags.slice(0, 2).map((t) => <Badge key={t}>{t}</Badge>)}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
