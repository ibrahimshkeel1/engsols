import type { Mentor } from "@/types";
import { goals } from "@/data/goals";

export function isFreeIntro(introCallRate: number): boolean {
  return introCallRate <= 0;
}

export function formatIntroCallPrice(introCallRate: number): string {
  return isFreeIntro(introCallRate) ? "Free" : `$${introCallRate}`;
}

export function introBadgeLabel(introCallRate: number): string {
  return isFreeIntro(introCallRate) ? "Free intro" : `$${introCallRate} intro`;
}

export function mentorValueBullets(mentor: Mentor): string[] {
  const bullets: string[] = [];
  const goalText = mentor.goals.join(" ").toLowerCase();
  const skillText = mentor.skills.join(" ").toLowerCase();

  if (/fe|pe|exam|certif|study/.test(goalText) || /fe|pe|exam/.test(skillText)) {
    bullets.push("Helped engineers pass FE/PE exams and professional certifications");
  }

  if (mentor.discipline) {
    const fields = mentor.subFields.slice(0, 2).join(" and ");
    bullets.push(
      fields
        ? `${mentor.discipline} — ${fields} expertise`
        : `${mentor.discipline} and applied engineering expertise`,
    );
  }

  if (/portfolio|career|roadmap|hire/.test(goalText)) {
    bullets.push("Portfolio and career roadmap guidance");
  }

  for (const goal of mentor.goals) {
    if (bullets.length >= 4) break;
    const label = goal.replace(/-/g, " ");
    if (!bullets.some((b) => b.toLowerCase().includes(label))) {
      bullets.push(`Practical mentorship for ${label}`);
    }
  }

  if (bullets.length < 3 && mentor.skills.length > 0) {
    bullets.push(`Hands-on guidance in ${mentor.skills.slice(0, 2).join(" and ")}`);
  }

  return bullets.slice(0, 4);
}

export function mentorOutcomes(mentor: Mentor): string[] {
  const fromGoals = mentor.goals
    .map((id) => goals.find((g) => g.id === id)?.label)
    .filter((label): label is string => Boolean(label));

  if (fromGoals.length >= 2) {
    return fromGoals.slice(0, 4);
  }

  return mentorValueBullets(mentor);
}

export function availabilityUrgency(mentor: Mentor): string {
  if (mentor.introSlotsThisWeek && mentor.introSlotsThisWeek > 0) {
    return `Next available slots: ${mentor.introSlotsThisWeek} intro opening${mentor.introSlotsThisWeek === 1 ? "" : "s"} this week`;
  }
  if (mentor.respondsWithinHours && mentor.respondsWithinHours <= 24) {
    return "Next available slots: Today / Tomorrow";
  }
  return "Limited weekly mentorship slots available";
}
