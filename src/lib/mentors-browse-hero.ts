import { goals } from "@/data/goals";
import { slugToDiscipline } from "@/lib/discipline-slug";

const GOAL_COPY: Record<string, { title: string; description: string }> = {
  "fe-pe": {
    title: "Mentors for FE / PE exam prep",
    description: "Engineers who've passed professional exams and can map your study plan.",
  },
  "oil-gas": {
    title: "Mentors to break into oil & gas",
    description: "Industry veterans who've navigated O&G hiring, roles, and career paths.",
  },
  "ace-interviews": {
    title: "Mentors for interview preparation",
    description: "Hiring managers and senior engineers who run realistic technical interviews.",
  },
  "first-job": {
    title: "Mentors for your first engineering role",
    description: "Guidance on portfolios, applications, and standing out as a new grad.",
  },
  "switch-discipline": {
    title: "Mentors for career transitions",
    description: "Engineers who've switched disciplines and can show you transferable skills.",
  },
  "reservoir-drilling": {
    title: "Reservoir & drilling mentors",
    description: "Specialists in simulation, drilling ops, and upstream engineering.",
  },
};

export function getMentorsBrowseHero(params: {
  goal?: string;
  discipline?: string;
  search?: string;
}): { title: string; description: string } {
  if (params.goal) {
    const copy = GOAL_COPY[params.goal];
    const goalLabel = goals.find((g) => g.id === params.goal)?.label;
    if (copy) return copy;
    if (goalLabel) {
      return {
        title: `Mentors for ${goalLabel.toLowerCase()}`,
        description: "Vetted engineers matched to your career goal — book a free intro to start.",
      };
    }
  }

  if (params.discipline) {
    const name = slugToDiscipline(params.discipline) ?? params.discipline.replace(/-/g, " ");
    return {
      title: `${name} mentors`,
      description: `Browse vetted ${name.toLowerCase()} engineers open to mentorship and one-off sessions.`,
    };
  }

  if (params.search?.trim()) {
    return {
      title: `Mentors matching “${params.search.trim()}”`,
      description: "Refine with discipline or goal filters, or book a free intro with anyone who fits.",
    };
  }

  return {
    title: "Find your mentor",
    description: "Browse vetted engineers — book a free intro and get matched to your goals.",
  };
}
