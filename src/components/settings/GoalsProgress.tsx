"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateGoalProgress } from "@/actions/mentor";
import { cn } from "@/lib/utils";

export function GoalsProgress({ goals, completed }: { goals: string[]; completed: string[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function toggle(goal: string) {
    const isDone = completed.includes(goal);
    startTransition(async () => {
      await updateGoalProgress(goal, !isDone);
      router.refresh();
    });
  }

  return (
    <ul className="space-y-2">
      {goals.map((goal) => {
        const done = completed.includes(goal);
        return (
          <li key={goal}>
            <button
              type="button"
              disabled={pending}
              onClick={() => toggle(goal)}
              className={cn(
                "flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition",
                done ? "border-zone-mentorship-border bg-zone-mentorship/10" : "border-border hover:bg-muted/50",
              )}
            >
              <span className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs", done && "border-zone-mentorship bg-zone-mentorship text-white dark:text-bg-main")}>
                {done ? "✓" : ""}
              </span>
              {goal}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
