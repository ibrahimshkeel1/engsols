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
import { zoneTokens } from "@/lib/zone-tokens";

const PREVIEW_GOALS = [
  { id: "first-job", label: "Land my first job" },
  { id: "fe-pe", label: "Pass FE / PE" },
  { id: "ace-interviews", label: "Ace interviews" },
] as const;

export function CareerAssistPreview({ mentors }: { mentors: Mentor[] }) {
  const [selectedGoal, setSelectedGoal] = useState<string>(PREVIEW_GOALS[0].id);

  const matches = useMemo(
    () => matchMentorsByGoals([selectedGoal], mentors, 2),
    [selectedGoal, mentors],
  );

  const t = zoneTokens.recruiter;

  return (
    <ZoneSection zone="recruiter" alt accent={false} className="!py-12 lg:!py-16">
      <div className="page-container-wide opacity-90">
        <AnimateIn>
          <p className={cn(t.sectionLabel, "opacity-50")}>Career assist</p>
          <h2 className="text-caption mt-2 font-medium text-muted-foreground">Match mentors to your goal</h2>
        </AnimateIn>

        <div className="mt-5 flex flex-wrap gap-2">
          {PREVIEW_GOALS.map((goal) => (
            <button
              key={goal.id}
              type="button"
              onClick={() => setSelectedGoal(goal.id)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs transition-colors",
                selectedGoal === goal.id
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-border/75 bg-card text-muted-foreground hover:text-foreground",
              )}
            >
              {goal.label}
            </button>
          ))}
        </div>

        {matches.length > 0 && (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {matches.map((mentor) => (
              <Link key={mentor.slug} href={`/mentors/${mentor.slug}`} className="group block">
                <ZoneCard zone="recruiter" className="flex items-center gap-3 !p-4">
                  <Avatar name={mentor.name} discipline={mentor.discipline} size="md" src={mentor.avatarUrl} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{mentor.name}</p>
                    <p className="text-caption truncate">{mentor.headline}</p>
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                </ZoneCard>
              </Link>
            ))}
          </div>
        )}

        <Link href="/assist" className="text-caption mt-5 inline-block text-primary hover:underline">
          Open career assist →
        </Link>
      </div>
    </ZoneSection>
  );
}
