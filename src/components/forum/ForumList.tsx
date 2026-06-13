"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ForumPost } from "@/types";
import { disciplines } from "@/data/disciplines";
import { getDisciplineColors } from "@/lib/discipline-colors";
import { DisciplineBadge } from "@/components/ui/DisciplineBadge";
import { Input, Select } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
        {filtered.map((post) => {
          const stripe = getDisciplineColors(post.discipline).stripe;
          return (
            <Link
              key={post.slug}
              href={`/forum/${post.slug}`}
              className="card-interactive group relative flex overflow-hidden rounded-2xl"
            >
              <div className={cn("w-1 shrink-0", stripe)} />
              <div className="flex-1 p-5 pl-4">
                <div className="flex flex-wrap items-center gap-2">
                  <DisciplineBadge discipline={post.discipline} />
                  {post.isSolved && (
                    <span className="inline-flex rounded-md bg-green-500/12 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
                      Solved
                    </span>
                  )}
                </div>
                <h3 className="mt-2 text-lg font-semibold group-hover:text-primary">{post.title}</h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.body}</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  {post.author} · {post.replyCount} replies · {post.viewCount} views
                </p>
              </div>
            </Link>
          );
        })}
        {filtered.length === 0 && (
          <p className="py-12 text-center text-muted-foreground">No discussions match your filters.</p>
        )}
      </div>
    </>
  );
}
