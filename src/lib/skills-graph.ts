import type { Mentor } from "@/types";
import { engineeringSkills, getRelatedSkills } from "@/data/engineering-skills";

export type SkillNode = {
  id: string;
  label: string;
  mentorCount: number;
};

/** Merge static skill graph with live mentor skills from the database. */
export function buildSkillGraph(mentors: Mentor[]): SkillNode[] {
  const counts = new Map<string, number>();

  for (const mentor of mentors) {
    for (const skill of mentor.skills) {
      const key = skill.toLowerCase().trim();
      if (key) counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }

  const fromMentors: SkillNode[] = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map(([label, mentorCount]) => ({
      id: label.replace(/\s+/g, "-"),
      label: label.charAt(0).toUpperCase() + label.slice(1),
      mentorCount,
    }));

  const staticNodes: SkillNode[] = engineeringSkills.map((s) => ({
    id: s.id,
    label: s.label,
    mentorCount: mentors.filter(
      (m) =>
        m.discipline === s.discipline ||
        m.skills.some((sk) => sk.toLowerCase().includes(s.label.toLowerCase())),
    ).length,
  }));

  const seen = new Set<string>();
  const merged: SkillNode[] = [];

  for (const node of [...fromMentors, ...staticNodes]) {
    const key = node.label.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(node);
  }

  return merged.sort((a, b) => b.mentorCount - a.mentorCount).slice(0, 24);
}

export function getRelatedFromGraph(skillId: string, graph: SkillNode[]): SkillNode[] {
  const staticRelated = getRelatedSkills(skillId);
  if (staticRelated.length) {
    return staticRelated.map((s) => ({
      id: s.id,
      label: s.label,
      mentorCount: graph.find((g) => g.id === s.id)?.mentorCount ?? 0,
    }));
  }
  const base = graph.find((g) => g.id === skillId);
  if (!base) return [];
  return graph.filter((g) => g.id !== skillId && g.label.split(" ")[0] === base.label.split(" ")[0]).slice(0, 5);
}
