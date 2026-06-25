import Link from "next/link";
import { disciplineToSlug } from "@/lib/discipline-slug";

const GOAL_CHIPS = [
  { id: "fe-pe", label: "FE / PE prep" },
  { id: "oil-gas", label: "Break into O&G" },
  { id: "ace-interviews", label: "Interview prep" },
  { id: "switch-discipline", label: "Career change" },
] as const;

const DISCIPLINE_CHIPS = ["Oil & Gas", "Drilling Engineering", "Reservoir Engineering", "Mechanical"] as const;

export function HeroGoalChips() {
  return (
    <div className="mt-8 space-y-4">
      <form action="/mentors" method="get" className="mx-auto flex max-w-md gap-2">
        <label htmlFor="hero-mentor-search" className="sr-only">
          Search mentors
        </label>
        <input
          id="hero-mentor-search"
          name="search"
          type="search"
          placeholder="e.g. reservoir simulation, drilling engineer"
          className="h-11 min-w-0 flex-1 rounded-xl border border-border/60 bg-background/80 px-4 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-zone-mentorship focus:ring-2 focus:ring-zone-mentorship/20"
        />
        <button
          type="submit"
          className="shrink-0 rounded-xl bg-zone-mentorship px-4 text-sm font-semibold text-white hover:brightness-110 dark:text-bg-main"
        >
          Search
        </button>
      </form>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {GOAL_CHIPS.map((chip) => (
          <Link
            key={chip.id}
            href={`/mentors?goal=${chip.id}`}
            className="rounded-full border border-zone-mentorship/25 bg-zone-mentorship/10 px-3.5 py-1.5 text-sm font-medium text-zone-mentorship transition-colors hover:bg-zone-mentorship/20"
          >
            {chip.label}
          </Link>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {DISCIPLINE_CHIPS.map((discipline) => (
          <Link
            key={discipline}
            href={`/disciplines/${disciplineToSlug(discipline)}`}
            className="rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-border hover:text-foreground"
          >
            {discipline}
          </Link>
        ))}
      </div>
    </div>
  );
}
