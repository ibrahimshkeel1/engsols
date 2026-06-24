"use client";

import { useState } from "react";
import type { Mentor } from "@/types";
import { filterMentors } from "@/lib/filter-mentors";
import { MentorRating } from "@/components/mentors/MentorRating";
import { EmptyStateClient } from "@/components/shared/EmptyStateClient";
import { HomeBentoStaticGrid } from "@/components/home/HomeBentoGrid";
import { Input } from "@/components/ui/input";
import { ButtonLink } from "@/components/ui/button";
import { Users } from "lucide-react";

type FeaturedMentorsProps = {
  mentors: Mentor[];
};

export function FeaturedMentors({ mentors }: FeaturedMentorsProps) {
  const [search, setSearch] = useState("");
  const filtered = filterMentors(mentors, { search: search || undefined }).items.slice(0, 6);

  return (
    <section id="find-mentor" className="border-b border-border/60 bg-muted/25 py-20 lg:py-28">
      <div className="page-container-wide">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-display-lg">Featured mentors</h2>
          <p className="text-body-lg mx-auto mt-3 max-w-lg">
            Vetted engineers open to mentorship — book a free intro to see if it is the right fit.
          </p>
        </div>

        <div className="mx-auto mt-8 max-w-md">
          <Input
            placeholder="Search by name, skill, or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-border/75 bg-card"
            aria-label="Search mentors"
          />
        </div>

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
          <HomeBentoStaticGrid className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-3 lg:gap-6">
            {filtered.map((mentor) => (
              <article
                key={mentor.slug}
                className="flex h-full w-[min(100%,20rem)] shrink-0 snap-start flex-col rounded-xl border border-border-custom bg-card p-6 shadow-premium-card transition-all duration-200 ease-out hover:-translate-y-0.5 sm:w-auto"
              >
                <h3 className="text-lg font-bold text-text-main">{mentor.name}</h3>
                <p className="mt-1 text-sm font-medium text-text-muted">{mentor.headline}</p>
                <p className="text-caption mt-2">
                  {mentor.yearsExperience}+ years experience
                </p>
                <div className="mt-3">
                  <MentorRating rating={mentor.rating} reviewCount={mentor.reviewCount} size="sm" />
                </div>
                <ButtonLink href={`/mentors/${mentor.slug}`} size="default" className="mt-6 w-full">
                  Book session
                </ButtonLink>
              </article>
            ))}
          </HomeBentoStaticGrid>
        )}
      </div>
    </section>
  );
}
