"use client";

import Link from "next/link";
import { engineeringSkills, getRelatedSkills } from "@/data/engineering-skills";
import { buildSkillGraph, getRelatedFromGraph } from "@/lib/skills-graph";
import { SkillGraphBubbleChart } from "@/components/mentors/SkillGraphBubbleChart";
import { cn } from "@/lib/utils";
import type { Mentor } from "@/types";

type Props = {
  selectedSkill: string;
  onSkillChange: (id: string) => void;
  mentorSkills?: string[];
  mentors?: Mentor[];
};

const relatedPillClass =
  "max-w-full rounded-xl border px-2.5 py-1.5 text-xs font-semibold leading-snug break-words transition-all duration-200 ease-out";

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
    <div className="mt-6 overflow-hidden rounded-2xl border border-border-custom bg-bg-surface p-5 shadow-premium-card">
      <p className="text-caption font-semibold uppercase tracking-wide text-text-muted">Skill graph</p>
      <p className="mt-1 text-xs text-text-muted">Filter mentors by technical focus</p>
      <SkillGraphBubbleChart
        className="mt-4"
        nodes={skillOptions}
        selectedSkill={selectedSkill}
        onSkillChange={onSkillChange}
      />
      {related.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-border-custom/60 pt-4">
          <p className="mb-1 w-full text-[10px] font-semibold uppercase tracking-wide text-text-muted">
            Related skills
          </p>
          {related.map((s) => {
            const active = selectedSkill === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => onSkillChange(s.id)}
                className={cn(
                  relatedPillClass,
                  active
                    ? "border-zone-mentorship bg-zone-mentorship/15 text-zone-mentorship ring-1 ring-zone-mentorship/25"
                    : "border-border-custom bg-bg-main/60 text-text-main hover:border-zone-mentorship/50 hover:bg-zone-mentorship/10 hover:text-zone-mentorship",
                )}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      )}
      <Link
        href="/assist"
        className="mt-4 inline-flex text-xs font-medium text-zone-mentorship transition-colors duration-200 hover:text-zone-mentorship/80"
      >
        Get mentor suggestions →
      </Link>
    </div>
  );
}
