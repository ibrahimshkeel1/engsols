import type { Discipline } from "@/data/disciplines";

export type DisciplineHubContent = {
  headline: string;
  subhead: string;
  outcomes: string[];
  searchPlaceholder: string;
};

const DEFAULT_OUTCOMES = [
  "Book a free intro with a vetted engineer",
  "Prep for FE/PE and role-specific interviews",
  "Get monthly mentorship with cancel-anytime billing",
];

export const DISCIPLINE_HUB: Partial<Record<Discipline, DisciplineHubContent>> = {
  "Oil & Gas": {
    headline: "Oil & gas engineering mentors",
    subhead:
      "Upstream, midstream, and downstream engineers who've passed exams, landed operator roles, and navigated O&G hiring cycles.",
    outcomes: [
      "Break into oil & gas from another discipline",
      "Interview prep for major operators and service companies",
      "FE/PE and IWCF-style career milestones",
    ],
    searchPlaceholder: "e.g. drilling engineer, reservoir simulation",
  },
  "Drilling Engineering": {
    headline: "Drilling engineering mentors",
    subhead:
      "Directional drilling, well planning, and rig operations mentors — from graduate programs to senior well engineer roles.",
    outcomes: [
      "Well planning and drilling optimization",
      "Operator and service-company interview loops",
      "Certifications and field-to-office transitions",
    ],
    searchPlaceholder: "e.g. directional drilling, well control",
  },
  "Reservoir Engineering": {
    headline: "Reservoir engineering mentors",
    subhead:
      "Simulation, field development, and reserves mentors who help you sharpen technical depth and land reservoir roles.",
    outcomes: [
      "Reservoir simulation and type-curve workflows",
      "Graduate and experienced-hire interview prep",
      "Monthly mentorship for long-term growth",
    ],
    searchPlaceholder: "e.g. reservoir simulation, field development",
  },
  "Production Engineering": {
    headline: "Production engineering mentors",
    subhead:
      "Production optimization, artificial lift, and facilities mentors for engineers moving into production roles.",
    outcomes: DEFAULT_OUTCOMES,
    searchPlaceholder: "e.g. artificial lift, production optimization",
  },
  Mechanical: {
    headline: "Mechanical engineering mentors",
    subhead:
      "Design, HVAC, manufacturing, and energy-sector mechanical engineers for FE/PE prep and career moves.",
    outcomes: DEFAULT_OUTCOMES,
    searchPlaceholder: "e.g. FE mechanical, design engineer",
  },
  Civil: {
    headline: "Civil engineering mentors",
    subhead:
      "Structural, transportation, and construction mentors for PE licensure, portfolios, and hiring.",
    outcomes: DEFAULT_OUTCOMES,
    searchPlaceholder: "e.g. structural PE, transportation",
  },
};

export function getDisciplineHubContent(discipline: string): DisciplineHubContent {
  const known = DISCIPLINE_HUB[discipline as Discipline];
  if (known) return known;

  const lower = discipline.toLowerCase();
  return {
    headline: `${discipline} mentors`,
    subhead: `Vetted ${lower} engineers for intro calls, deep sessions, and monthly mentorship — with upfront pricing.`,
    outcomes: DEFAULT_OUTCOMES,
    searchPlaceholder: `e.g. ${lower} interview, FE prep`,
  };
}
