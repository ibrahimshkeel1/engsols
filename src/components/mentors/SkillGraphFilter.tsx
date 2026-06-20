"use client";

import Link from "next/link";
import { engineeringSkills, getRelatedSkills } from "@/data/engineering-skills";
import { buildSkillGraph, getRelatedFromGraph } from "@/lib/skills-graph";
import { SkillGraphBubbleChart } from "@/components/mentors/SkillGraphBubbleChart";
import type { Mentor } from "@/types";

type Props = {
  selectedSkill: string;
  onSkillChange: (id: string) => void;
  mentorSkills?: string[];
  mentors?: Mentor[];
};

export function SkillGraphFilter({ selectedSkill, onSkillChange, mentorSkills = [], mentors = [] }: Props) {
  const graph = mentors.length
    ? buildSkillGraph(mentors)
    : mentorSkills.map((s, i) => ({ id: `skill-${i}`, label: s, mentorCount: 1 }));

  const skillOptions = graph.length
    ? graph
    : engineeringSkills.map((s) => ({ id: s.id, label: s.label, mentorCount: 0 }));

  const related = selectedSkill
    ? graph.length
      ? getRelatedFromGraph(selectedSkill, graph)
      : getRelatedSkills(selectedSkill).map((s) => ({ id: s.id, label: s.label, mentorCount: 0 }))
    : [];

  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-border/75 bg-card p-4">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Skill graph</p>
      <SkillGraphBubbleChart
        className="mt-3"
        nodes={skillOptions}
        selectedSkill={selectedSkill}
        onSkillChange={onSkillChange}
      />
      {related.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2 border-t border-border/60 pt-3">
          {related.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onSkillChange(s.id)}
              className="max-w-full rounded-lg border border-border/75 bg-muted/40 px-2.5 py-1 text-xs leading-snug break-words hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
      <Link href="/assist" className="mt-3 inline-block text-xs text-primary hover:underline">
        Get mentor suggestions →
      </Link>
    </div>
  );
}
