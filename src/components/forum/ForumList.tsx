"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ForumPost } from "@/types";
import { disciplines } from "@/data/disciplines";
import { Badge } from "@/components/ui/badge";
import { Input, Select } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export function ForumList({ posts }: { posts: ForumPost[] }) {
  const [search, setSearch] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [sort, setSort] = useState("recent");

  const filtered = useMemo(() => {
    let result = [...posts];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.body.toLowerCase().includes(q) ||
          p.tags.some((t) => t.includes(q)),
      );
    }
    if (discipline) result = result.filter((p) => p.discipline === discipline);
    if (sort === "replies") result.sort((a, b) => b.replyCount - a.replyCount);
    else result.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return result;
  }, [posts, search, discipline, sort]);

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Input placeholder="Search discussions..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
        <Select value={discipline} onChange={(e) => setDiscipline(e.target.value)}>
          <option value="">All disciplines</option>
          {disciplines.map((d) => <option key={d} value={d}>{d}</option>)}
        </Select>
        <Select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="recent">Most recent</option>
          <option value="replies">Most replies</option>
        </Select>
      </div>
      <div className="mt-8 space-y-3">
        {filtered.map((post) => (
          <Card key={post.slug} className="card-elevated transition hover:border-primary/30">
            <CardContent className="py-5">
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-primary/10 text-primary">{post.discipline}</Badge>
                {post.isSolved && <Badge className="bg-green-500/15 text-green-700 dark:text-green-400">Solved</Badge>}
              </div>
              <Link href={`/forum/${post.slug}`} className="mt-3 block text-lg font-semibold hover:text-primary">
                {post.title}
              </Link>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.body}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                {post.author} · {post.replyCount} replies · {post.viewCount} views
              </p>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">No discussions match your filters.</p>
        )}
      </div>
    </>
  );
}
