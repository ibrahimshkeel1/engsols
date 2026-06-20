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
    return <p className="text-sm text-muted-foreground">No skill data yet.</p>;
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
              "max-w-full rounded-lg border px-2.5 py-1.5 text-left text-xs font-medium leading-snug transition-[border-color,background-color,color,box-shadow] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]",
              active
                ? "border-primary bg-primary/10 text-primary shadow-sm"
                : "border-border/75 bg-muted/40 text-foreground hover:border-primary/30 hover:bg-muted/70",
            )}
          >
            <span className="block break-words">{node.label}</span>
            {node.mentorCount > 0 && (
              <span className="mt-0.5 block text-[10px] font-normal text-muted-foreground">
                {node.mentorCount} mentor{node.mentorCount === 1 ? "" : "s"}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
