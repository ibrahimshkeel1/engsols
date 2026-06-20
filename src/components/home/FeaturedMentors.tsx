"use client";

import { ButtonLink } from "@/components/ui/button";
import { useState } from "react";
import { Users } from "lucide-react";
import type { Mentor } from "@/types";
import { filterMentors } from "@/lib/filter-mentors";
import { MentorCard } from "@/components/mentors/MentorCard";
import { EmptyStateClient } from "@/components/shared/EmptyStateClient";
import { Input } from "@/components/ui/input";
import { ProfileBentoGrid } from "@/components/ui/ProfileBentoGrid";
import { AnimateIn } from "@/components/motion/AnimateIn";
import { ZoneSection } from "@/components/ui/ZoneSection";
import { zoneTokens } from "@/lib/zone-tokens";

export function FeaturedMentors({ mentors }: { mentors: Mentor[] }) {
  const [search, setSearch] = useState("");
  const filtered = filterMentors(mentors, { search: search || undefined }).items.slice(0, 6);
  const t = zoneTokens.mentorship;

  return (
    <ZoneSection zone="mentorship" alt accent>
      <div className="page-container-wide">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <AnimateIn>
            <p className={t.sectionLabel}>Mentor directory</p>
            <h2 className="text-display-lg mt-2">Explore mentors</h2>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <Input
              placeholder="Search by name, skill, company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm border-zone-mentorship-border bg-card"
              aria-label="Search featured mentors"
            />
          </AnimateIn>
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
          <ProfileBentoGrid
            className="mt-10"
            items={filtered}
            getKey={(mentor) => mentor.slug}
            isFeatured={(mentor) => mentor.featured}
            renderCard={(mentor, variant) => <MentorCard mentor={mentor} variant={variant} />}
          />
        )}
        {filtered.length > 0 && (
          <AnimateIn delay={0.2} className="mt-12 text-center">
            <ButtonLink href="/mentors" variant="secondary">
              View all mentors
            </ButtonLink>
          </AnimateIn>
        )}
      </div>
    </ZoneSection>
  );
}
