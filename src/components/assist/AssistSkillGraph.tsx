"use client";

import { useState } from "react";
import Link from "next/link";
import type { SkillNode } from "@/lib/skills-graph";
import { SkillGraphBubbleChart } from "@/components/mentors/SkillGraphBubbleChart";

export function AssistSkillGraph({ nodes }: { nodes: SkillNode[] }) {
  const [selected, setSelected] = useState("");

  const selectedNode = nodes.find((n) => n.id === selected);

  return (
    <div className="space-y-4">
      <SkillGraphBubbleChart nodes={nodes} selectedSkill={selected} onSkillChange={setSelected} />
      {selectedNode && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-muted/50 px-4 py-3">
          <p className="text-sm">
            <span className="font-medium">{selectedNode.label}</span>
            {" · "}
            {selectedNode.mentorCount} mentor{selectedNode.mentorCount === 1 ? "" : "s"}
          </p>
          <Link
            href={`/mentors?search=${encodeURIComponent(selectedNode.label)}`}
            className="text-sm font-medium text-primary hover:underline"
          >
            View mentors →
          </Link>
        </div>
      )}
    </div>
  );
}
