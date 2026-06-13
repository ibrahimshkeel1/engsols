"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Mentor } from "@/types";
import { filterMentors } from "@/lib/filter-mentors";
import { MentorCard } from "@/components/mentors/MentorCard";
import { MentorFilters } from "@/components/mentors/MentorFilters";

export function MentorsDirectory({ mentors }: { mentors: Mentor[] }) {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
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
    [mentors, search, discipline, goal, sort],
  );

  return (
    <>
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
      <p className="mt-6 text-sm text-muted-foreground">{filtered.length} mentors found</p>
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((mentor) => (
          <MentorCard key={mentor.slug} mentor={mentor} />
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="mt-12 text-center text-muted-foreground">No mentors match your filters. Try adjusting your search.</p>
      )}
    </>
  );
}
