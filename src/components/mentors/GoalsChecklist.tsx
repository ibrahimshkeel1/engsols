"use client";

import { goals } from "@/data/goals";
import { cn } from "@/lib/utils";

export function GoalsChecklist() {
  return (
    <fieldset>
      <legend className="text-sm font-medium">Goals you can help with</legend>
      <p className="mt-1 text-xs text-muted-foreground">Select all that apply so students can find you by goal.</p>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {goals.map((g) => (
          <label
            key={g.id}
            className={cn(
              "flex cursor-pointer items-start gap-2 rounded-xl border border-border px-3 py-2.5 text-sm transition hover:border-primary/40",
            )}
          >
            <input type="checkbox" name="goals" value={g.id} className="mt-0.5 rounded" />
            <span>{g.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
