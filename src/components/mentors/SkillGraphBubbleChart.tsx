"use client";

import type { SkillNode } from "@/lib/skills-graph";
import { cn } from "@/lib/utils";

type Props = {
  nodes: SkillNode[];
  selectedSkill: string;
  onSkillChange: (id: string) => void;
  className?: string;
};

function bubbleSize(count: number, max: number): number {
  if (max <= 0) return 56;
  const min = 44;
  const maxSize = 88;
  return min + ((count / max) * (maxSize - min));
}

export function SkillGraphBubbleChart({ nodes, selectedSkill, onSkillChange, className }: Props) {
  const top = nodes.slice(0, 12);
  const maxCount = Math.max(...top.map((n) => n.mentorCount), 1);

  if (!top.length) {
    return <p className="text-sm text-muted-foreground">No skill data yet.</p>;
  }

  return (
    <div className={cn("flex flex-wrap items-center justify-center gap-3", className)}>
      {top.map((node) => {
        const size = bubbleSize(node.mentorCount, maxCount);
        const active = selectedSkill === node.id;
        return (
          <button
            key={node.id}
            type="button"
            onClick={() => onSkillChange(active ? "" : node.id)}
            title={`${node.label} — ${node.mentorCount} mentors`}
            className={cn(
              "flex flex-col items-center justify-center rounded-full border-2 text-center transition-all hover:scale-105",
              active
                ? "border-primary bg-primary/15 text-primary shadow-md"
                : "border-border bg-card text-foreground hover:border-primary/40",
            )}
            style={{ width: size, height: size, fontSize: size < 56 ? "0.65rem" : "0.75rem" }}
          >
            <span className="line-clamp-2 px-1 font-medium leading-tight">{node.label}</span>
            {node.mentorCount > 0 && (
              <span className="mt-0.5 text-[10px] text-muted-foreground">{node.mentorCount}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
