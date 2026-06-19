import type { Mentor } from "@/types";

/** Rule-based mentor matching for career assist preview and /assist fallback. */
export function matchMentorsByGoals(goals: string[], mentors: Mentor[], limit = 3): Mentor[] {
  const goalKeywords = goals.join(" ").toLowerCase();
  const scored = mentors
    .map((m) => {
      let score = 0;
      if (m.verified) score += 1;
      if (m.reviewCount > 0) score += m.rating * 0.5;
      for (const g of m.goals) {
        if (goalKeywords.includes(g.replace(/-/g, " "))) score += 2;
        if (goals.some((goal) => g === goal || goal.includes(g))) score += 2;
      }
      for (const s of m.skills) {
        if (goalKeywords.includes(s.toLowerCase())) score += 1;
      }
      return { mentor: m, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  const picks = scored.length
    ? scored
    : mentors
        .filter((m) => m.reviewCount > 0)
        .sort((a, b) => b.rating - a.rating)
        .map((mentor) => ({ mentor, score: 0 }));

  return picks.slice(0, limit).map((p) => p.mentor);
}

/** Match mentors for a student by discipline + career goal label. */
export function matchMentorsForStudent(
  discipline: string,
  goal: string,
  mentors: Mentor[],
  limit = 3,
): Mentor[] {
  const goalLower = goal.toLowerCase();
  const scored = mentors
    .map((m) => {
      let score = 0;
      if (m.discipline === discipline) score += 4;
      if (m.verified) score += 1;
      if (m.reviewCount > 0) score += m.rating * 0.5;
      for (const g of m.goals) {
        const label = g.replace(/-/g, " ");
        if (goalLower.includes(label) || label.includes(goalLower)) score += 3;
      }
      for (const s of m.skills) {
        if (goalLower.includes(s.toLowerCase())) score += 1;
      }
      return { mentor: m, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  const disciplineMatches = mentors.filter((m) => m.discipline === discipline);
  const picks = scored.length
    ? scored
    : disciplineMatches.length
      ? disciplineMatches.map((mentor) => ({ mentor, score: 0 }))
      : mentors
          .filter((m) => m.reviewCount > 0)
          .sort((a, b) => b.rating - a.rating)
          .map((mentor) => ({ mentor, score: 0 }));

  return picks.slice(0, limit).map((p) => p.mentor);
}
