"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Users } from "lucide-react";
import type { Mentor } from "@/types";
import { filterMentors } from "@/lib/filter-mentors";
import { MentorCard } from "@/components/mentors/MentorCard";
import { MentorFilters } from "@/components/mentors/MentorFilters";
import { EmptyStateClient } from "@/components/shared/EmptyStateClient";
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

  const hasFilters = Boolean(search || discipline || goal);

  function clearFilters() {
    setSearch("");
    setDiscipline("");
    setGoal("");
    setSort("rating");
  }

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
        {mentors.length === 0 ? (
          <EmptyStateClient
            icon={Users}
            title="No mentors yet"
            description="Mentors appear here after applying and being approved by the team."
            action={{ href: "/apply", label: "Become a mentor" }}
          />
        ) : filtered.length === 0 ? (
          <EmptyStateClient
            icon={Users}
            title="No mentors match your filters"
            description={goal ? "Try a different goal or clear filters — mentors must list matching goals on their profile." : "Try adjusting your search or filters."}
            onClearFilters={hasFilters ? clearFilters : undefined}
            action={{ href: "/apply", label: "Apply as a mentor" }}
          />
        ) : (
          <Stagger className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3" stagger={0.06}>
            {filtered.map((mentor) => (
              <StaggerItem key={mentor.slug}>
                <MentorCard mentor={mentor} />
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </div>
  );
}
