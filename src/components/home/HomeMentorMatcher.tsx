"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import type { Mentor } from "@/types";
import { goals } from "@/data/goals";
import { matchMentorsByGoals } from "@/lib/match-mentors";
import { introBadgeLabel } from "@/lib/mentor-display";
import { MentorPortrait } from "@/components/ui/MentorPortrait";
import { ButtonLink } from "@/components/ui/button";
import { mentorGoalChipClass } from "@/components/mentors/MentorGoalChips";

const MATCHER_GOALS = goals.filter((g) =>
  ["fe-pe", "oil-gas", "ace-interviews", "first-job", "switch-discipline", "reservoir-drilling"].includes(g.id),
);

type Props = {
  mentors: Mentor[];
};

function MatchResult({ mentor }: { mentor: Mentor }) {
  return (
    <div className="flex min-w-[min(100%,18rem)] flex-col overflow-hidden rounded-2xl border border-border-custom bg-bg-surface shadow-premium-card sm:min-w-0">
      <MentorPortrait
        name={mentor.name}
        src={mentor.avatarUrl}
        className="aspect-[16/10] w-full sm:aspect-[3/2]"
        sizes="(max-width: 640px) 80vw, 320px"
      />
      <div className="flex flex-1 flex-col p-4">
        <p className="truncate font-semibold capitalize text-text-main">{mentor.name}</p>
        <p className="line-clamp-2 text-xs text-text-muted">{mentor.headline}</p>
        <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-zone-mentorship">
          {mentor.discipline}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-text-muted">
        <span className="rounded-lg bg-zone-mentorship/10 px-2 py-0.5 font-semibold text-zone-mentorship">
          {introBadgeLabel(mentor.introCallRate)}
        </span>
        {mentor.reviewCount > 0 && (
          <span>
            {mentor.rating.toFixed(1)} ({mentor.reviewCount})
          </span>
        )}
        <span>From ${mentor.monthlyRate}/mo</span>
      </div>
      <div className="mt-4 flex gap-2">
        <ButtonLink href={`/mentors/${mentor.slug}`} size="sm" variant="secondary" className="flex-1">
          Profile
        </ButtonLink>
        <ButtonLink href={`/mentors/${mentor.slug}?session=intro#booking-options`} size="sm" className="flex-1">
          Book intro
        </ButtonLink>
      </div>
      </div>
    </div>
  );
}

export function HomeMentorMatcher({ mentors }: Props) {
  const [selectedGoal, setSelectedGoal] = useState(MATCHER_GOALS[0]?.id ?? "fe-pe");

  const matches = useMemo(() => {
    const goal = goals.find((g) => g.id === selectedGoal);
    if (!goal || mentors.length === 0) return [];
    return matchMentorsByGoals([goal.label, goal.id], mentors, 3);
  }, [mentors, selectedGoal]);

  if (mentors.length === 0) return null;

  const selectedLabel = goals.find((g) => g.id === selectedGoal)?.label ?? "your goal";

  return (
    <section className="border-b border-border/60 bg-muted/20 py-16 lg:py-20" aria-labelledby="mentor-matcher-heading">
      <div className="page-container-wide">
        <div className="mx-auto max-w-2xl text-center">
          <p className="inline-flex items-center gap-1.5 text-caption font-medium text-zone-mentorship">
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Instant match — no account needed
          </p>
          <h2 id="mentor-matcher-heading" className="text-display-lg mt-2">
            Find mentors for your goal in seconds
          </h2>
          <p className="text-body-lg mx-auto mt-3 max-w-lg text-muted-foreground">
            Generic mentorship sites match broadly. EngSols matches by engineering discipline, exam prep, and career goal.
          </p>
        </div>

        <div className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-2">
          {MATCHER_GOALS.map((goal) => (
            <button
              key={goal.id}
              type="button"
              aria-pressed={selectedGoal === goal.id}
              onClick={() => setSelectedGoal(goal.id)}
              className={mentorGoalChipClass(selectedGoal === goal.id)}
            >
              {goal.label}
            </button>
          ))}
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map((mentor) => (
            <MatchResult key={mentor.slug} mentor={mentor} />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href={`/mentors?goal=${selectedGoal}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-zone-mentorship hover:underline"
          >
            See all mentors for {selectedLabel}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
