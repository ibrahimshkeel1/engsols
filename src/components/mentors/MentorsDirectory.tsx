"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { GitCompareArrows, Users } from "lucide-react";
import type { Mentor } from "@/types";
import { filterMentors } from "@/lib/filter-mentors";
import { MentorCard } from "@/components/mentors/MentorCard";
import { MentorFilters } from "@/components/mentors/MentorFilters";
import { SkillGraphFilter } from "@/components/mentors/SkillGraphFilter";
import { EmptyStateClient } from "@/components/shared/EmptyStateClient";
import { ProfileBentoGrid } from "@/components/ui/ProfileBentoGrid";

export function MentorsDirectory({ mentors, savedSlugs = [] }: { mentors: Mentor[]; savedSlugs?: string[] }) {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [discipline, setDiscipline] = useState(searchParams.get("discipline") ?? "");
  const [goal, setGoal] = useState(searchParams.get("goal") ?? "");
  const [company] = useState(searchParams.get("company") ?? "");
  const [sessionFilter] = useState(searchParams.get("session") ?? "");
  const [skill, setSkill] = useState("");
  const [sort, setSort] = useState("rating");

  const filtered = useMemo(
    () =>
      filterMentors(mentors, {
        search: search || undefined,
        discipline: discipline || undefined,
        goal: goal || undefined,
        company: company || undefined,
        session: sessionFilter || undefined,
        skill: skill || undefined,
        sort: sort as "rating" | "price-asc" | "price-desc",
      }),
    [mentors, search, discipline, goal, company, sessionFilter, skill, sort],
  );

  const hasFilters = Boolean(search || discipline || goal || skill);

  function clearFilters() {
    setSearch("");
    setDiscipline("");
    setGoal("");
    setSkill("");
    setSort("rating");
  }

  return (
    <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-10">
      {company && (
        <div className="mb-6 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm lg:col-span-2">
          Showing mentors at <strong>{company}</strong>.{" "}
          <Link href="/mentors" className="text-primary hover:underline">Clear filter</Link>
        </div>
      )}
      {sessionFilter && (
        <div className="mb-6 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm lg:col-span-2">
          Browsing mentors for <strong className="capitalize">{sessionFilter.replace(/-/g, " ")}</strong> sessions.
          Select a mentor and use the One-off tab to book.
        </div>
      )}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <MentorFilters
          layout="sidebar"
          search={search}
          discipline={discipline}
          goal={goal}
          sort={sort}
          onSearchChange={setSearch}
          onDisciplineChange={setDiscipline}
          onGoalChange={setGoal}
          onSortChange={setSort}
        />
        <SkillGraphFilter selectedSkill={skill} onSkillChange={setSkill} mentors={mentors} />
        <p className="mt-4 hidden text-sm text-muted-foreground lg:block">
          {filtered.length} mentors match your filters
        </p>
      </aside>
      <div>
        {savedSlugs.length >= 2 && (
          <Link
            href={`/mentors/compare?slugs=${encodeURIComponent(savedSlugs.slice(0, 3).join(","))}`}
            className="mb-6 inline-flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-medium text-primary hover:bg-primary/10"
          >
            <GitCompareArrows className="h-4 w-4" />
            Compare {Math.min(savedSlugs.length, 3)} saved mentors
          </Link>
        )}
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
          <ProfileBentoGrid
            items={filtered}
            getKey={(mentor) => mentor.slug}
            isFeatured={(mentor) => mentor.featured}
            renderCard={(mentor, variant) => <MentorCard mentor={mentor} variant={variant} />}
          />
        )}
      </div>
    </div>
  );
}
