"use client";

import Link from "next/link";
import { engineeringSkills, getRelatedSkills } from "@/data/engineering-skills";
import { buildSkillGraph, getRelatedFromGraph } from "@/lib/skills-graph";
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
    <div className="mt-4 space-y-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Skill graph</p>
      <select
        value={selectedSkill}
        onChange={(e) => onSkillChange(e.target.value)}
        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
      >
        <option value="">All skills</option>
        {skillOptions.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label}{s.mentorCount > 0 ? ` (${s.mentorCount})` : ""}
          </option>
        ))}
      </select>
      {related.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {related.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onSkillChange(s.id)}
              className="rounded-lg bg-muted px-2.5 py-1 text-xs hover:bg-primary/10"
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
      <Link href="/assist" className="inline-block text-xs text-primary hover:underline">
        Get mentor suggestions →
      </Link>
    </div>
  );
}
