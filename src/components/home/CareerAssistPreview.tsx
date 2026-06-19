"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import type { Mentor } from "@/types";
import { matchMentorsByGoals } from "@/lib/match-mentors";
import { Avatar } from "@/components/ui/Avatar";
import { AnimateIn } from "@/components/motion/AnimateIn";
import { cn } from "@/lib/utils";

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

  return (
    <section className="border-b border-border bg-muted/30 py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <AnimateIn>
          <p className="section-label">Career assist</p>
          <h2 className="font-display mt-1 text-2xl sm:text-3xl">Find mentors for your goal</h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
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
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {goal.label}
            </button>
          ))}
        </div>

        {matches.length > 0 ? (
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {matches.map((mentor) => (
              <Link
                key={mentor.slug}
                href={`/mentors/${mentor.slug}`}
                className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/35"
              >
                <Avatar name={mentor.name} discipline={mentor.discipline} size="lg" src={mentor.avatarUrl} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{mentor.name}</p>
                  <p className="truncate text-sm text-muted-foreground">{mentor.headline}</p>
                  <p className="truncate text-xs text-muted-foreground">{mentor.company}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
              </Link>
            ))}
          </div>
        ) : (
          <p className="mt-8 text-sm text-muted-foreground">
            No matches yet for this goal.{" "}
            <Link href="/mentors" className="text-primary hover:underline">Browse all mentors</Link>
          </p>
        )}

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link
            href={`/signup?next=${encodeURIComponent("/assist")}`}
            className="inline-flex h-11 items-center rounded-lg bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Sign up to save matches & book intro
          </Link>
          <Link href="/mentors" className="text-sm font-medium text-primary hover:underline">
            Browse all mentors →
          </Link>
        </div>
      </div>
    </section>
  );
}
