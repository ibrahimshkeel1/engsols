"use client";

import Link from "next/link";
import { useState } from "react";
import { Users } from "lucide-react";
import type { Mentor } from "@/types";
import { filterMentors } from "@/lib/filter-mentors";
import { MentorCard } from "@/components/mentors/MentorCard";
import { EmptyStateClient } from "@/components/shared/EmptyStateClient";
import { Input } from "@/components/ui/input";
import { ProfileBentoGrid } from "@/components/ui/ProfileBentoGrid";
import { AnimateIn } from "@/components/motion/AnimateIn";

export function FeaturedMentors({ mentors }: { mentors: Mentor[] }) {
  const [search, setSearch] = useState("");
  const filtered = filterMentors(mentors, { search: search || undefined }).items.slice(0, 6);

  return (
    <section className="border-t border-border bg-muted/30 py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <AnimateIn>
            <p className="section-label">Mentor directory</p>
            <h2 className="font-display mt-2 text-3xl tracking-tight sm:text-4xl">Explore mentors</h2>
          </AnimateIn>
          <AnimateIn delay={0.1}>
            <Input
              placeholder="Search by name, skill, company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
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
          <Link
            href="/mentors"
            className="inline-flex h-11 items-center rounded-lg border border-border bg-card px-6 text-sm font-medium transition-colors hover:bg-muted"
          >
            View all mentors
          </Link>
        </AnimateIn>
        )}
      </div>
    </section>
  );
}
