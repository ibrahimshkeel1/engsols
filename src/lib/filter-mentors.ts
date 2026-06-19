import type { Mentor } from "@/types";
import { getSkillById } from "@/data/engineering-skills";

export type MentorFilters = {
  search?: string;
  discipline?: string;
  goal?: string;
  skill?: string;
  company?: string;
  session?: string;
  sort?: "rating" | "price-asc" | "price-desc";
};

export function filterMentors(mentors: Mentor[], filters: MentorFilters): Mentor[] {
  let result = [...mentors];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.headline.toLowerCase().includes(q) ||
        m.company.toLowerCase().includes(q) ||
        m.skills.some((s) => s.toLowerCase().includes(q)) ||
        m.discipline.toLowerCase().includes(q),
    );
  }

  if (filters.discipline) {
    result = result.filter((m) => m.discipline === filters.discipline);
  }

  if (filters.company) {
    const company = filters.company.toLowerCase();
    result = result.filter((m) => m.company.toLowerCase().includes(company));
  }

  if (filters.goal) {
    result = result.filter((m) => m.goals.includes(filters.goal!));
  }

  if (filters.session === "study-plan") {
    result = result.filter(
      (m) => m.studyPlanCalendlyUrl || m.calendlyUrl || m.goals.includes("fe-pe"),
    );
  } else if (filters.session === "interview-prep") {
    result = result.filter(
      (m) => m.interviewCalendlyUrl || m.calendlyUrl || m.goals.includes("ace-interviews"),
    );
  }

  if (filters.skill) {
    const skill = getSkillById(filters.skill);
    if (skill) {
      const label = skill.label.toLowerCase();
      result = result.filter(
        (m) =>
          m.discipline === skill.discipline ||
          m.skills.some((s) => s.toLowerCase().includes(label) || label.includes(s.toLowerCase())),
      );
    }
  }

  switch (filters.sort) {
    case "price-asc":
      result.sort((a, b) => a.monthlyRate - b.monthlyRate);
      break;
    case "price-desc":
      result.sort((a, b) => b.monthlyRate - a.monthlyRate);
      break;
    case "rating":
    default:
      result.sort((a, b) => b.rating - a.rating);
      break;
  }

  return result;
}

export function getMentorBySlug(mentors: Mentor[], slug: string) {
  return mentors.find((m) => m.slug === slug);
}

export function getSimilarMentors(mentors: Mentor[], mentor: Mentor, limit = 4) {
  return mentors
    .filter((m) => m.slug !== mentor.slug && m.discipline === mentor.discipline)
    .slice(0, limit);
}
