export type PromptChip = { label: string; href: string };

export const forumPromptChips: PromptChip[] = [
  { label: "FE exam help", href: "/forum/new?discipline=Mechanical" },
  { label: "Resume review", href: "/forum/new" },
  { label: "Interview prep", href: "/forum/new" },
  { label: "First job advice", href: "/forum/new" },
];

export const mentorPromptChips: PromptChip[] = [
  { label: "Land first job", href: "/mentors?goal=first-job" },
  { label: "Pass FE / PE", href: "/mentors?goal=fe-pe" },
  { label: "Interview prep", href: "/mentors?session=interview-prep" },
];

export const jobPromptChips: PromptChip[] = [
  { label: "Internships", href: "/jobs?type=internship" },
  { label: "Remote roles", href: "/jobs?remote=remote" },
  { label: "Oil & Gas", href: "/jobs?discipline=Oil%20%26%20Gas" },
];

export const searchTrendingChips: PromptChip[] = [
  { label: "Reservoir mentors", href: "/search?q=reservoir" },
  { label: "FE exam", href: "/search?q=FE+exam" },
  { label: "Drilling jobs", href: "/search?q=drilling" },
  { label: "Open to work", href: "/portfolios?openToWork=1" },
  { label: "Live Q&A", href: "/live" },
];

export const certPromptChips: PromptChip[] = [
  { label: "FE exam prep", href: "/certifications/fe" },
  { label: "PE license", href: "/certifications/pe" },
  { label: "Find a mentor", href: "/mentors?goal=fe-pe" },
];

export const companyPromptChips: PromptChip[] = [
  { label: "Browse jobs", href: "/jobs" },
  { label: "Operators", href: "/companies?type=operator" },
  { label: "Post a role", href: "/jobs/post" },
];

export const marketplacePromptChips: PromptChip[] = [
  { label: "Equipment", href: "/marketplace?category=equipment" },
  { label: "List a product", href: "/marketplace/sell" },
  { label: "Services", href: "/marketplace?category=services" },
];

export const videoPromptChips: PromptChip[] = [
  { label: "Live sessions", href: "/live" },
  { label: "Find mentors", href: "/mentors" },
  { label: "Mechanical", href: "/videos?discipline=Mechanical" },
];
