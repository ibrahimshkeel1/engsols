"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { mentors } from "@/data/mentors";
import { filterMentors } from "@/lib/filter-mentors";
import { MentorCard } from "@/components/mentors/MentorCard";
import { MentorFilters } from "@/components/mentors/MentorFilters";

export default function MentorsPage() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [discipline, setDiscipline] = useState(searchParams.get("discipline") ?? "");
  const [goal, setGoal] = useState(searchParams.get("goal") ?? "");
  const [sort, setSort] = useState("rating");

  const filtered = useMemo(
    () =>
      filterMentors(mentors, {
        search: search || undefined,
        discipline: discipline || undefined,
        goal: goal || undefined,
        sort: sort as "rating" | "price-asc" | "price-desc",
      }),
    [search, discipline, goal, sort],
  );

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-slate-900">Find your engineering mentor</h1>
        <p className="mt-2 text-slate-600">
          Browse {mentors.length}+ vetted mentors across oil & gas, drilling, reservoir, and applied engineering.
        </p>
        <div className="mt-8">
          <MentorFilters
            search={search}
            discipline={discipline}
            goal={goal}
            sort={sort}
            onSearchChange={setSearch}
            onDisciplineChange={setDiscipline}
            onGoalChange={setGoal}
            onSortChange={setSort}
          />
        </div>
        <p className="mt-6 text-sm text-slate-500">{filtered.length} mentors found</p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((mentor) => (
            <MentorCard key={mentor.slug} mentor={mentor} />
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="mt-12 text-center text-slate-500">No mentors match your filters. Try adjusting your search.</p>
        )}
      </div>
    </div>
  );
}
