"use client";

import { ButtonLink } from "@/components/ui/button";
import { useState } from "react";
import { ArrowRight, Users } from "lucide-react";
import type { Mentor } from "@/types";
import { filterMentors } from "@/lib/filter-mentors";
import { MentorCard } from "@/components/mentors/MentorCard";
import { EmptyStateClient } from "@/components/shared/EmptyStateClient";
import { Input } from "@/components/ui/input";
import { ProfileBentoGrid } from "@/components/ui/ProfileBentoGrid";
import { AnimateIn } from "@/components/motion/AnimateIn";
import { ZoneSection } from "@/components/ui/ZoneSection";
import { cn } from "@/lib/utils";

type FeaturedMentorsProps = {
  mentors: Mentor[];
  emphasis?: "primary" | "supporting";
};

export function FeaturedMentors({ mentors, emphasis = "primary" }: FeaturedMentorsProps) {
  const [search, setSearch] = useState("");
  const filtered = filterMentors(mentors, { search: search || undefined }).items.slice(0, emphasis === "primary" ? 6 : 4);
  const isPrimary = emphasis === "primary";

  return (
    <ZoneSection
      id={isPrimary ? "find-mentor" : undefined}
      zone="mentorship"
      alt={!isPrimary}
      accent={false}
      className={cn(isPrimary && "!py-24 lg:!py-32")}
    >
      <div className="page-container-wide">
        <AnimateIn className={cn(isPrimary ? "max-w-2xl" : "max-w-xl opacity-90")}>
          <p className={cn("section-label", isPrimary ? "opacity-70" : "opacity-50")}>
            {isPrimary ? "Start here" : "Mentors"}
          </p>
          <h2 className={cn(isPrimary ? "text-display-xl mt-4" : "section-heading mt-3")}>
            {isPrimary ? "Find a mentor who has done your path" : "Featured mentors"}
          </h2>
          <p className={cn("mt-3 text-pretty", isPrimary ? "text-body-lg max-w-lg" : "text-caption max-w-md")}>
            {isPrimary
              ? "Browse vetted reservoir, drilling, and applied engineering professionals — book a free intro and see if it is the right fit."
              : "Engineers open to mentoring across disciplines and career stages."}
          </p>
        </AnimateIn>

        {isPrimary && (
          <AnimateIn delay={0.08} className="mt-8 max-w-md">
            <Input
              placeholder="Search by name, skill, or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-border/75 bg-card"
              aria-label="Search mentors"
            />
          </AnimateIn>
        )}

        {filtered.length === 0 ? (
          <div className="mt-10">
            <EmptyStateClient
              icon={Users}
              title={search ? "No mentors match your search" : "No mentors yet"}
              description={search ? "Try a different search term." : "Be among the first mentors on EngSols."}
              action={{ href: search ? "/mentors" : "/apply", label: search ? "Browse all mentors" : "Become a mentor" }}
              onClearFilters={search ? () => setSearch("") : undefined}
            />
          </div>
        ) : (
          <ProfileBentoGrid
            className={cn("mt-10", !isPrimary && "opacity-90")}
            items={filtered}
            getKey={(mentor) => mentor.slug}
            isFeatured={(mentor) => mentor.featured}
            renderCard={(mentor, variant) => <MentorCard mentor={mentor} variant={variant} />}
          />
        )}

        {filtered.length > 0 && isPrimary && (
          <AnimateIn delay={0.15} className="mt-14 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <ButtonLink href="/mentors" size="lg" className="group w-full sm:w-auto">
              Browse all mentors
              <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
            </ButtonLink>
          </AnimateIn>
        )}
      </div>
    </ZoneSection>
  );
}
