"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Mentor } from "@/types";
import { filterMentors } from "@/lib/filter-mentors";
import { MentorCard } from "@/components/mentors/MentorCard";
import { MentorFilters } from "@/components/mentors/MentorFilters";
import { Stagger, StaggerItem } from "@/components/motion/AnimateIn";

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
    <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-10">
      <aside className="lg:sticky lg:top-24 lg:self-start">
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
        <p className="mt-4 hidden text-sm text-muted-foreground lg:block">
          {filtered.length} mentors match your filters
        </p>
      </aside>
      <div>
        <p className="mb-6 text-sm text-muted-foreground lg:hidden">{filtered.length} mentors found</p>
        <Stagger className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3" stagger={0.06}>
          {filtered.map((mentor) => (
            <StaggerItem key={mentor.slug}>
              <MentorCard mentor={mentor} />
            </StaggerItem>
          ))}
        </Stagger>
        {filtered.length === 0 && (
          <p className="py-16 text-center text-muted-foreground">No mentors match your filters.</p>
        )}
      </div>
    </div>
  );
}
