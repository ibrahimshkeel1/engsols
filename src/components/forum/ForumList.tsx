"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Award, MessageSquare } from "lucide-react";
import type { ForumPost } from "@/types";
import { disciplines } from "@/data/disciplines";
import { getDisciplineColors } from "@/lib/discipline-colors";
import { formatRelativeTime } from "@/lib/format-relative-time";
import { DisciplineBadge } from "@/components/ui/DisciplineBadge";
import { Avatar } from "@/components/ui/Avatar";
import { EmptyStateClient } from "@/components/shared/EmptyStateClient";
import { Input, Select } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function activityTimestamp(post: ForumPost): string {
  return post.lastReplyAt ?? post.createdAt;
}

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
    else result.sort((a, b) => activityTimestamp(b).localeCompare(activityTimestamp(a)));
    return result;
  }, [posts, search, discipline, sort]);

  const hasFilters = Boolean(search || discipline);

  function clearFilters() {
    setSearch("");
    setDiscipline("");
    setSort("recent");
  }

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Input placeholder="Search discussions..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" aria-label="Search forum discussions" />
        <Select value={discipline} onChange={(e) => setDiscipline(e.target.value)} aria-label="Filter by discipline">
          <option value="">All disciplines</option>
          {disciplines.map((d) => <option key={d} value={d}>{d}</option>)}
        </Select>
        <Select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort discussions">
          <option value="recent">Most recent</option>
          <option value="replies">Most replies</option>
        </Select>
      </div>
      <div className="mt-8 space-y-3">
        {posts.length === 0 ? (
          <EmptyStateClient
            icon={MessageSquare}
            title="No discussions yet"
            description="Be the first to ask a question or share knowledge with the community."
            action={{ href: "/forum/new", label: "Start a discussion" }}
          />
        ) : filtered.length === 0 ? (
          <EmptyStateClient
            icon={MessageSquare}
            title="No discussions match your filters"
            description="Try a different search or discipline."
            onClearFilters={hasFilters ? clearFilters : undefined}
          />
        ) : (
          filtered.map((post) => {
            const stripe = getDisciplineColors(post.discipline).stripe;
            const lastActive = formatRelativeTime(activityTimestamp(post));

            return (
              <Link
                key={post.slug}
                href={`/forum/${post.slug}`}
                className="card-interactive group relative flex overflow-hidden rounded-2xl"
              >
                <div className={cn("w-1 shrink-0", stripe)} />
                <div className="flex min-w-0 flex-1 gap-4 p-5 pl-4">
                  <Avatar
                    name={post.author}
                    discipline={post.discipline}
                    size="md"
                    src={post.authorAvatarUrl}
                    className="hidden shrink-0 sm:flex"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <DisciplineBadge discipline={post.discipline} />
                      {post.isSolved && (
                        <span className="inline-flex rounded-md bg-green-500/12 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
                          Solved
                        </span>
                      )}
                      {(post.authorReputation ?? 0) > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                          <Award className="h-3 w-3" />
                          {post.authorReputation} rep
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 text-lg font-semibold group-hover:text-primary">{post.title}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{post.body}</p>
                    {post.topReplyPreview && (
                      <div className="mt-3 rounded-lg border border-border/80 bg-muted/30 px-3 py-2">
                        <p className="text-xs font-medium text-muted-foreground">
                          Top reply · {post.topReplyPreview.author}
                          {post.topReplyPreview.isMentor && (
                            <span className="ml-1.5 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                              Mentor
                            </span>
                          )}
                        </p>
                        <p className="mt-1 line-clamp-2 text-sm text-foreground/80">{post.topReplyPreview.body}</p>
                      </div>
                    )}
                    <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5 sm:hidden">
                        <Avatar name={post.author} discipline={post.discipline} size="sm" src={post.authorAvatarUrl} />
                        {post.author}
                      </span>
                      <span className="hidden sm:inline">{post.author}</span>
                      <span>·</span>
                      <span>{post.replyCount} replies</span>
                      <span>·</span>
                      <span>{post.viewCount} views</span>
                      <span>·</span>
                      <span>Active {lastActive}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </>
  );
}
