"use client";

import { disciplines } from "@/data/disciplines";
import { goals } from "@/data/goals";
import { Input, Select } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type MentorFiltersProps = {
  search: string;
  discipline: string;
  goal: string;
  sort: string;
  onSearchChange: (v: string) => void;
  onDisciplineChange: (v: string) => void;
  onGoalChange: (v: string) => void;
  onSortChange: (v: string) => void;
  layout?: "sidebar" | "inline";
};

const fieldClass =
  "w-full !h-auto min-h-[42px] rounded-xl border border-border-custom bg-bg-main px-3.5 py-2.5 text-sm text-text-main outline-none transition-all duration-200 focus:border-zone-mentorship focus:ring-2 focus:ring-zone-mentorship/20";

export function MentorFilters({
  search,
  discipline,
  goal,
  sort,
  onSearchChange,
  onDisciplineChange,
  onGoalChange,
  onSortChange,
  layout = "inline",
}: MentorFiltersProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-2xl border border-border-custom bg-bg-surface p-5 shadow-premium-card",
        layout === "inline" && "sm:flex-row sm:flex-wrap sm:items-center",
      )}
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="mentor-search" className="text-caption font-medium text-text-muted">
          Search
        </label>
        <Input
          id="mentor-search"
          placeholder="Search mentors..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          zone="mentorship"
          className={cn(fieldClass, layout === "inline" && "sm:max-w-xs")}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="mentor-discipline" className="text-caption font-medium text-text-muted">
          Discipline
        </label>
        <Select
          id="mentor-discipline"
          value={discipline}
          onChange={(e) => onDisciplineChange(e.target.value)}
          zone="mentorship"
          className={fieldClass}
        >
          <option value="">All disciplines</option>
          {disciplines.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="mentor-goal" className="text-caption font-medium text-text-muted">
          Goal
        </label>
        <Select
          id="mentor-goal"
          value={goal}
          onChange={(e) => onGoalChange(e.target.value)}
          zone="mentorship"
          className={fieldClass}
        >
          <option value="">All goals</option>
          {goals.map((g) => (
            <option key={g.id} value={g.id}>
              {g.label}
            </option>
          ))}
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="mentor-sort" className="text-caption font-medium text-text-muted">
          Sort by
        </label>
        <Select
          id="mentor-sort"
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          zone="mentorship"
          className={fieldClass}
        >
          <option value="availability">Available this week</option>
          <option value="rating">Highest rated</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </Select>
      </div>
    </div>
  );
}
