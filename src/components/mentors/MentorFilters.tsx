"use client";

import { disciplines } from "@/data/disciplines";
import { goals } from "@/data/goals";
import { Input } from "@/components/ui/input";

type MentorFiltersProps = {
  search: string;
  discipline: string;
  goal: string;
  sort: string;
  onSearchChange: (v: string) => void;
  onDisciplineChange: (v: string) => void;
  onGoalChange: (v: string) => void;
  onSortChange: (v: string) => void;
};

export function MentorFilters({
  search,
  discipline,
  goal,
  sort,
  onSearchChange,
  onDisciplineChange,
  onGoalChange,
  onSortChange,
}: MentorFiltersProps) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:flex-wrap sm:items-center">
      <Input
        placeholder="Search mentors..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="sm:max-w-xs"
      />
      <select
        value={discipline}
        onChange={(e) => onDisciplineChange(e.target.value)}
        className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm"
      >
        <option value="">All disciplines</option>
        {disciplines.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>
      <select
        value={goal}
        onChange={(e) => onGoalChange(e.target.value)}
        className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm"
      >
        <option value="">All goals</option>
        {goals.map((g) => (
          <option key={g.id} value={g.id}>{g.label}</option>
        ))}
      </select>
      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        className="h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm"
      >
        <option value="rating">Highest rated</option>
        <option value="price-asc">Price: low to high</option>
        <option value="price-desc">Price: high to low</option>
      </select>
    </div>
  );
}
