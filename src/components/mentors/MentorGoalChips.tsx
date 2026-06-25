import { goals } from "@/data/goals";
import { cn } from "@/lib/utils";

export const MENTOR_GOAL_FILTER_IDS = [
  "first-job",
  "ace-interviews",
  "switch-discipline",
  "fe-pe",
  "oil-gas",
  "reservoir-drilling",
] as const;

const CHIP_GOALS = goals.filter((g) =>
  (MENTOR_GOAL_FILTER_IDS as readonly string[]).includes(g.id),
);

type Props = {
  selected: string;
  onSelect: (goalId: string) => void;
  showAll?: boolean;
  allowClear?: boolean;
  className?: string;
};

export function mentorGoalChipClass(active: boolean) {
  return cn(
    "rounded-full px-4 py-2 text-sm font-medium transition-colors",
    active
      ? "bg-oil-gas-orange text-oil-gas-white font-semibold"
      : "border border-border-custom bg-bg-surface text-text-muted hover:border-oil-gas-orange/50 hover:text-oil-gas-navy",
  );
}

export function MentorGoalChips({
  selected,
  onSelect,
  showAll = true,
  allowClear = true,
  className,
}: Props) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {showAll && (
        <button
          type="button"
          onClick={() => onSelect("")}
          className={mentorGoalChipClass(!selected)}
        >
          All goals
        </button>
      )}
      {CHIP_GOALS.map((goal) => (
        <button
          key={goal.id}
          type="button"
          aria-pressed={selected === goal.id}
          onClick={() => onSelect(allowClear && selected === goal.id ? "" : goal.id)}
          className={mentorGoalChipClass(selected === goal.id)}
        >
          {goal.label}
        </button>
      ))}
    </div>
  );
}
