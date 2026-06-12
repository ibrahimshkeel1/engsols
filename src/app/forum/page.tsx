"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { forumPosts } from "@/data/forumPosts";
import { disciplines } from "@/data/disciplines";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function ForumPage() {
  const [search, setSearch] = useState("");
  const [discipline, setDiscipline] = useState("");
  const [sort, setSort] = useState("recent");

  const filtered = useMemo(() => {
    let result = [...forumPosts];
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
  }, [search, discipline, sort]);

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Engineering Forum</h1>
            <p className="mt-2 text-slate-600">Ask questions, share knowledge, and learn from the community.</p>
          </div>
          <Link href="/forum/new" className="inline-flex rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-amber-400">
            Ask a question
          </Link>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Input placeholder="Search discussions..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
          <select value={discipline} onChange={(e) => setDiscipline(e.target.value)} className="h-10 rounded-lg border border-slate-300 px-3 text-sm">
            <option value="">All disciplines</option>
            {disciplines.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="h-10 rounded-lg border border-slate-300 px-3 text-sm">
            <option value="recent">Most recent</option>
            <option value="replies">Most replies</option>
          </select>
        </div>
        <div className="mt-8 space-y-3">
          {filtered.map((post) => (
            <Card key={post.slug}>
              <CardContent className="py-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-amber-50 text-amber-800">{post.discipline}</Badge>
                      {post.isSolved && <Badge className="bg-green-50 text-green-700">Solved</Badge>}
                    </div>
                    <Link href={`/forum/${post.slug}`} className="mt-2 block text-lg font-semibold text-slate-900 hover:text-amber-600">
                      {post.title}
                    </Link>
                    <p className="mt-1 line-clamp-2 text-sm text-slate-600">{post.body}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      {post.author} · {post.replyCount} replies · {post.viewCount} views
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
