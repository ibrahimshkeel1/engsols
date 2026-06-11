"use client";

import { useState } from "react";
import Link from "next/link";
import { mentors } from "@/data/mentors";
import { filterMentors } from "@/lib/filter-mentors";
import { MentorCard } from "@/components/mentors/MentorCard";
import { Input } from "@/components/ui/input";

export function MentorGrid() {
  const [search, setSearch] = useState("");
  const filtered = filterMentors(mentors, { search }).slice(0, 12);

  return (
    <section className="bg-slate-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="text-3xl font-bold text-slate-900">Explore 650+ available mentors</h2>
          <Input
            placeholder="Find mentors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((mentor) => (
            <MentorCard key={mentor.slug} mentor={mentor} />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/mentors"
            className="inline-flex rounded-lg bg-slate-900 px-6 py-3 text-sm font-medium text-white hover:bg-slate-800"
          >
            View all mentors
          </Link>
        </div>
      </div>
    </section>
  );
}
