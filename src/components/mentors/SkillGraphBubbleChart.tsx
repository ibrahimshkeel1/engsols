"use client";

import type { SkillNode } from "@/lib/skills-graph";
import { cn } from "@/lib/utils";

type Props = {
  nodes: SkillNode[];
  selectedSkill: string;
  onSkillChange: (id: string) => void;
  className?: string;
};

export function SkillGraphBubbleChart({ nodes, selectedSkill, onSkillChange, className }: Props) {
  const top = nodes.slice(0, 12);

  if (!top.length) {
    return <p className="text-sm text-text-muted">No skill data yet.</p>;
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {top.map((node) => {
        const active = selectedSkill === node.id;
        return (
          <button
            key={node.id}
            type="button"
            onClick={() => onSkillChange(active ? "" : node.id)}
            title={`${node.label} — ${node.mentorCount} mentors`}
            className={cn(
              "max-w-full rounded-xl border px-2.5 py-1.5 text-left text-xs font-semibold leading-snug transition-all duration-200 ease-out",
              active
                ? "border-zone-mentorship bg-zone-mentorship/15 text-zone-mentorship shadow-sm shadow-zone-mentorship/10 ring-1 ring-zone-mentorship/25"
                : "border-border-custom bg-bg-main/60 text-text-main hover:border-zone-mentorship/50 hover:bg-zone-mentorship/10 hover:text-zone-mentorship hover:shadow-sm hover:shadow-zone-mentorship/5",
            )}
          >
            <span className="block break-words">{node.label}</span>
            {node.mentorCount > 0 && (
              <span
                className={cn(
                  "mt-0.5 block text-[10px] font-normal",
                  active ? "text-zone-mentorship/80" : "text-text-muted",
                )}
              >
                {node.mentorCount} mentor{node.mentorCount === 1 ? "" : "s"}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
