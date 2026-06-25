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
    <div className="mt-8 min-w-0 space-y-4">
      <form action="/mentors" method="get" className="mx-auto flex min-w-0 max-w-md gap-2">
        <label htmlFor="hero-mentor-search" className="sr-only">
          Search mentors
        </label>
        <input
          id="hero-mentor-search"
          name="search"
          type="search"
          placeholder="e.g. reservoir simulation, drilling engineer"
          className="h-11 min-w-0 flex-1 rounded-xl border border-oil-gas-navy bg-oil-gas-navy px-4 text-sm text-oil-gas-white placeholder:text-oil-gas-white caret-oil-gas-white outline-none focus:border-oil-gas-orange focus:ring-2 focus:ring-oil-gas-orange/35"
        />
        <button
          type="submit"
          className="shrink-0 rounded-xl bg-oil-gas-orange px-4 text-sm font-semibold text-oil-gas-white hover:bg-oil-gas-navy"
        >
          Search
        </button>
      </form>

      <div className="flex flex-wrap items-center justify-center gap-2">
        {GOAL_CHIPS.map((chip) => (
          <Link
            key={chip.id}
            href={`/mentors?goal=${chip.id}`}
            className="hero-chip rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors"
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
            className="hero-chip rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors"
          >
            {discipline}
          </Link>
        ))}
      </div>
    </div>
  );
}
