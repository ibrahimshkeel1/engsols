"use client";

import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateMilestoneStatus } from "@/actions/roadmap";
import type { RoadmapMilestone } from "@/lib/data/roadmaps";
import { isMilestoneOverdue } from "@/lib/roadmap-utils";
import type { MilestoneStatus } from "@/types/database";
import { cn } from "@/lib/utils";

type Props = {
  milestone: RoadmapMilestone;
};

const STATUS_OPTIONS: { value: MilestoneStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
];

export function MilestoneItem({ milestone }: Props) {
  const [pending, startTransition] = useTransition();
  const overdue = isMilestoneOverdue(milestone);

  function handleStatusChange(next: MilestoneStatus) {
    if (next === milestone.status) return;
    startTransition(async () => {
      const result = await updateMilestoneStatus(milestone.id, next);
      if (result?.error) toast.error(result.error);
      else toast.success("Milestone updated");
    });
  }

  return (
    <li
      className={cn(
        "rounded-xl border border-border bg-surface p-4 shadow-premium-card transition-colors duration-300",
        milestone.status === "completed" && "border-green-500/30 bg-green-500/5",
        overdue && "border-red-500/40",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={milestone.status === "completed"}
              disabled={pending}
              onChange={(e) =>
                handleStatusChange(e.target.checked ? "completed" : "pending")
              }
              className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              aria-label={`Mark ${milestone.title} complete`}
            />
            <h4
              className={cn(
                "font-medium",
                milestone.status === "completed" && "text-muted-foreground line-through",
              )}
            >
              {milestone.title}
            </h4>
            {pending && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-hidden />}
          </div>
          {milestone.description && (
            <p className="mt-2 text-sm text-muted-foreground">{milestone.description}</p>
          )}
          {milestone.targetDate && (
            <p
              className={cn(
                "mt-2 text-xs font-medium",
                overdue ? "text-red-600 dark:text-red-400" : "text-muted-foreground",
              )}
            >
              Target: {new Date(milestone.targetDate).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
              {overdue && " · Overdue"}
            </p>
          )}
        </div>

        <label className="sr-only" htmlFor={`milestone-status-${milestone.id}`}>
          Milestone status
        </label>
        <select
          id={`milestone-status-${milestone.id}`}
          value={milestone.status}
          disabled={pending}
          onChange={(e) => handleStatusChange(e.target.value as MilestoneStatus)}
          className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {milestone.resourceLinks.length > 0 && (
        <ul className="mt-3 flex flex-wrap gap-2">
          {milestone.resourceLinks.map((link) => (
            <li key={link.url}>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-primary hover:border-primary/40"
              >
                {link.title} ↗
              </a>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
