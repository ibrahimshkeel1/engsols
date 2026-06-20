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
import { cn } from "@/lib/utils";
import { zoneCta, zoneTokens } from "@/lib/zone-tokens";

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
    <ZoneSection zone="recruiter" className="py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <AnimateIn>
          <p className={t.sectionLabel}>Career assist</p>
          <h2 className="font-display mt-1 text-2xl text-text-main sm:text-3xl">Find mentors for your goal</h2>
          <p className="mt-2 max-w-xl text-sm text-text-muted">
            No account needed — pick a goal and see who can help in seconds.
          </p>
        </AnimateIn>

        <div className="mt-6 flex flex-wrap gap-2">
          {PREVIEW_GOALS.map((goal) => (
            <button
              key={goal.id}
              type="button"
              onClick={() => setSelectedGoal(goal.id)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                selectedGoal === goal.id
                  ? cn(t.accentBg, "border-transparent text-white dark:text-bg-main")
                  : "border-border bg-card text-text-muted hover:border-zone-recruiter-border hover:text-text-main",
              )}
            >
              {goal.label}
            </button>
          ))}
        </div>

        {matches.length > 0 ? (
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {matches.map((mentor) => (
              <Link key={mentor.slug} href={`/mentors/${mentor.slug}`} className="group block">
                <ZoneCard zone="recruiter" className="flex items-center gap-4 p-4">
                  <Avatar name={mentor.name} discipline={mentor.discipline} size="lg" src={mentor.avatarUrl} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-text-main">{mentor.name}</p>
                    <p className="truncate text-sm text-text-muted">{mentor.headline}</p>
                    <p className="truncate text-xs text-text-muted">{mentor.company}</p>
                  </div>
                  <ArrowRight className={cn("h-4 w-4 shrink-0 text-text-muted", t.arrowHover)} />
                </ZoneCard>
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-8 text-sm text-text-muted">
            No matches yet for this goal.{" "}
            <Link href="/mentors" className={cn(t.accent, "hover:underline")}>
              Browse all mentors
            </Link>
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href={`/signup?next=${encodeURIComponent("/assist")}`}
            className={cn("inline-flex h-11 items-center rounded-lg px-6 text-sm font-medium", zoneCta("recruiter"))}
          >
            Sign up to save matches & book intro
          </Link>
          <Link href="/mentors" className={cn("text-sm font-medium hover:underline", t.accent)}>
            Browse all mentors →
          </Link>
        </div>
      </div>
    </ZoneSection>
  );
}
