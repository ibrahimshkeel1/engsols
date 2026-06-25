"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AlertTriangle, GitCompareArrows, Users } from "lucide-react";
import type { Mentor } from "@/types";
import { filterMentors, type MentorFilters as MentorFilterState } from "@/lib/filter-mentors";
import { getSkillById } from "@/data/engineering-skills";
import { MentorCard } from "@/components/mentors/MentorCard";
import { MentorFilters } from "@/components/mentors/MentorFilters";
import { SkillGraphFilter } from "@/components/mentors/SkillGraphFilter";
import { SpecialistRequestTrigger } from "@/components/mentors/SpecialistRequestModal";
import { EmptyStateClient } from "@/components/shared/EmptyStateClient";
import { ProfileBentoGrid } from "@/components/ui/ProfileBentoGrid";

export function MentorsDirectory({ mentors, savedSlugs = [] }: { mentors: Mentor[]; savedSlugs?: string[] }) {
  const searchParams = useSearchParams();
  const hasAvailabilityData = mentors.some((m) => (m.introSlotsThisWeek ?? 0) > 0 || (m.respondsWithinHours ?? 0) > 0);
  const defaultSort = hasAvailabilityData ? "availability" : "rating";
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [discipline, setDiscipline] = useState(searchParams.get("discipline") ?? "");
  const [goal, setGoal] = useState(searchParams.get("goal") ?? "");
  const [company] = useState(searchParams.get("company") ?? "");
  const [sessionFilter] = useState(searchParams.get("session") ?? "");
  const [subField] = useState(searchParams.get("sub_field") ?? "");
  const [skill, setSkill] = useState("");
  const [sort, setSort] = useState(searchParams.get("sort") ?? defaultSort);

  const activeFilters: MentorFilterState = useMemo(
    () => ({
      search: search || undefined,
      discipline: discipline || undefined,
      subField: subField || undefined,
      goal: goal || undefined,
      company: company || undefined,
      session: sessionFilter || undefined,
      skill: skill || undefined,
      sort: sort as MentorFilterState["sort"],
    }),
    [search, discipline, subField, goal, company, sessionFilter, skill, sort],
  );

  const filterResult = useMemo(() => filterMentors(mentors, activeFilters), [mentors, activeFilters]);

  const { items: filtered, isFallback, fallbackReason } = filterResult;
  const hasFilters = Boolean(search || discipline || goal || skill || subField);
  const showSpecialistEmpty = mentors.length > 0 && filtered.length === 0;

  const specialistContext = useMemo(
    () => ({
      discipline: discipline || getSkillById(skill)?.discipline || search || "",
      subField: subField || getSkillById(skill)?.label || "",
      searchQuery: search,
      filtersSnapshot: activeFilters,
    }),
    [discipline, subField, search, skill, activeFilters],
  );

  function clearFilters() {
    setSearch("");
    setDiscipline("");
    setGoal("");
    setSkill("");
    setSort(defaultSort);
  }

  return (
    <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-10">
      {company && (
        <div className="mb-6 rounded-xl border border-zone-mentorship/30 bg-zone-mentorship/5 px-4 py-3 text-sm lg:col-span-2">
          Showing mentors at <strong>{company}</strong>.{" "}
          <Link href="/mentors" className="text-zone-mentorship hover:underline">Clear filter</Link>
        </div>
      )}
      {sessionFilter && (
        <div className="mb-6 rounded-xl border border-zone-mentorship/30 bg-zone-mentorship/5 px-4 py-3 text-sm lg:col-span-2">
          Browsing mentors for <strong className="capitalize">{sessionFilter.replace(/-/g, " ")}</strong> sessions.
          Select a mentor and use the One-off tab to book.
        </div>
      )}
      <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
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
          {isFallback ? " (recommendations)" : ""}
        </p>
        <p className="mt-3 hidden text-xs text-muted-foreground lg:block">
          Not sure?{" "}
          <Link href="/mentors/compare" className="font-medium text-zone-mentorship hover:underline">
            Save 2–3 mentors and compare
          </Link>
        </p>
      </aside>
      <div>
        {savedSlugs.length >= 2 && (
          <Link
            href={`/mentors/compare?slugs=${encodeURIComponent(savedSlugs.slice(0, 3).join(","))}`}
            className="mb-6 inline-flex items-center gap-2 rounded-xl border border-zone-mentorship/30 bg-zone-mentorship/5 px-4 py-2 text-sm font-medium text-zone-mentorship hover:bg-zone-mentorship/10"
          >
            <GitCompareArrows className="h-4 w-4" />
            Compare {Math.min(savedSlugs.length, 3)} saved mentors
          </Link>
        )}
        <p className="mb-6 text-sm text-muted-foreground lg:hidden">
          {filtered.length} mentors found{isFallback ? " (recommendations)" : ""}
        </p>

        {isFallback && filtered.length > 0 && (
          <div
            role="status"
            className="mb-6 flex flex-col gap-2 rounded-xl border border-zone-exams/30 bg-zone-exams/5 px-4 py-3 text-sm text-text-main sm:flex-row sm:items-start sm:gap-3"
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-zone-exams" aria-hidden />
            <p>
              {fallbackReason ?? "We couldn't find an exact match for your active filters, so we are showing top recommendations in related fields."}{" "}
              Can&apos;t find what you need?{" "}
              <SpecialistRequestTrigger
                variant="link"
                triggerLabel="Request a Specialist Mentor"
                context={specialistContext}
              />
            </p>
          </div>
        )}

        {mentors.length === 0 ? (
          <EmptyStateClient
            icon={Users}
            title="No mentors yet"
            description="Mentors appear here after applying and being approved by the team."
            action={{ href: "/apply", label: "Become a mentor" }}
          />
        ) : showSpecialistEmpty ? (
          <EmptyStateClient
            icon={Users}
            title="No mentors match your filters"
            description="We couldn't find anyone for this niche — not even in related disciplines. Tell us what you need and we'll work to match you."
            onClearFilters={hasFilters ? clearFilters : undefined}
            specialistRequest={specialistContext}
            action={{ href: "/apply", label: "Apply as a mentor" }}
          />
        ) : (
          <ProfileBentoGrid
            items={filtered}
            getKey={(mentor) => mentor.slug}
            isFeatured={(mentor) => mentor.featured}
            renderCard={(mentor) => <MentorCard mentor={mentor} />}
          />
        )}
      </div>
    </div>
  );
}
