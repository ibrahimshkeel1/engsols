"use client";

import Link from "next/link";
import { useState } from "react";
import type { Mentor } from "@/types";
import { filterMentors } from "@/lib/filter-mentors";
import { MentorCard } from "@/components/mentors/MentorCard";
import { Input } from "@/components/ui/input";

export function FeaturedMentors({ mentors }: { mentors: Mentor[] }) {
  const [search, setSearch] = useState("");
  const filtered = filterMentors(mentors, { search: search || undefined }).slice(0, 6);

  return (
    <section className="border-t border-border bg-muted/40 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary">Mentor directory</p>
            <h2 className="font-display mt-2 text-3xl tracking-tight sm:text-4xl">Explore mentors</h2>
          </div>
          <Input
            placeholder="Search by name, skill, company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((mentor) => (
            <MentorCard key={mentor.slug} mentor={mentor} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link
            href="/mentors"
            className="inline-flex h-12 items-center rounded-xl border border-border bg-card px-8 text-sm font-semibold transition hover:bg-muted"
          >
            View all mentors
          </Link>
        </div>
      </div>
    </section>
  );
}
