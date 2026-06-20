"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import type { Mentor } from "@/types";
import { matchMentorsByGoals } from "@/lib/match-mentors";
import { Avatar } from "@/components/ui/Avatar";
import { AnimateIn } from "@/components/motion/AnimateIn";
import { ZoneSection } from "@/components/ui/ZoneSection";
import { ZoneCard } from "@/components/ui/ZoneCard";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { zoneTokens } from "@/lib/zone-tokens";

const PREVIEW_GOALS = [
  { id: "first-job", label: "Land my first job" },
  { id: "fe-pe", label: "Pass FE / PE" },
  { id: "ace-interviews", label: "Ace interviews" },
] as const;

export function CareerAssistPreview({ mentors }: { mentors: Mentor[] }) {
  const [selectedGoal, setSelectedGoal] = useState<string>(PREVIEW_GOALS[0].id);

  const matches = useMemo(
    () => matchMentorsByGoals([selectedGoal], mentors, 3),
    [selectedGoal, mentors],
  );

  const t = zoneTokens.recruiter;

  return (
    <ZoneSection zone="recruiter" alt accent>
      <div className="page-container-wide">
        <AnimateIn>
          <p className={t.sectionLabel}>Career assist</p>
          <h2 className="text-display-lg mt-2">Find mentors for your goal</h2>
          <p className="text-caption mt-2 max-w-xl">
            No account needed — pick a goal and see who can help in seconds.
          </p>
        </AnimateIn>

        <div className="mt-8 flex flex-wrap gap-2">
          {PREVIEW_GOALS.map((goal) => (
            <button
              key={goal.id}
              type="button"
              onClick={() => setSelectedGoal(goal.id)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-colors",
                selectedGoal === goal.id
                  ? "border-transparent bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-border hover:text-foreground",
              )}
            >
              {goal.label}
            </button>
          ))}
        </div>

        {matches.length > 0 ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {matches.map((mentor) => (
              <Link key={mentor.slug} href={`/mentors/${mentor.slug}`} className="group block">
                <ZoneCard zone="recruiter" className="flex items-center gap-4 !p-5">
                  <Avatar name={mentor.name} discipline={mentor.discipline} size="lg" src={mentor.avatarUrl} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-text-main">{mentor.name}</p>
                    <p className="text-caption truncate">{mentor.headline}</p>
                    <p className="text-caption truncate">{mentor.company}</p>
                  </div>
                  <ArrowRight className={cn("h-4 w-4 shrink-0 text-muted-foreground", t.arrowHover)} />
                </ZoneCard>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-caption mt-8">
            No matches yet for this goal.{" "}
            <Link href="/mentors" className="font-medium text-primary hover:underline">
              Browse all mentors
            </Link>
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <ButtonLink href={`/signup?next=${encodeURIComponent("/assist")}`}>
            Sign up to save matches & book intro
          </ButtonLink>
          <ButtonLink href="/mentors" variant="ghost">
            Browse all mentors →
          </ButtonLink>
        </div>
      </div>
    </ZoneSection>
  );
}
