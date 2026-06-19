"use client";

import { disciplines } from "@/data/disciplines";
import { goals } from "@/data/goals";
import { Input, Select } from "@/components/ui/input";

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
      className={
        layout === "sidebar"
          ? "flex flex-col gap-4 rounded-2xl border border-border bg-card p-5"
          : "flex flex-col gap-4 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:flex-wrap sm:items-center"
      }
    >
      <Input
        placeholder="Search mentors..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="sm:max-w-xs"
      />
      <Select value={discipline} onChange={(e) => onDisciplineChange(e.target.value)}>
        <option value="">All disciplines</option>
        {disciplines.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </Select>
      <Select value={goal} onChange={(e) => onGoalChange(e.target.value)}>
        <option value="">All goals</option>
        {goals.map((g) => (
          <option key={g.id} value={g.id}>{g.label}</option>
        ))}
      </Select>
      <Select value={sort} onChange={(e) => onSortChange(e.target.value)}>
        <option value="rating">Highest rated</option>
        <option value="price-asc">Price: low to high</option>
        <option value="price-desc">Price: high to low</option>
      </Select>
    </div>
  );
}
