const disciplineMap: Record<string, { bg: string; text: string; stripe: string }> = {
  "Oil & Gas": {
    bg: "bg-zone-recruiter/12",
    text: "text-zone-recruiter-on",
    stripe: "bg-zone-recruiter",
  },
  "Drilling Engineering": {
    bg: "bg-zone-exams/12",
    text: "text-zone-exams-on",
    stripe: "bg-zone-exams",
  },
  "Reservoir Engineering": {
    bg: "bg-zone-mentorship/12",
    text: "text-zone-mentorship-on",
    stripe: "bg-zone-mentorship",
  },
  "Production Engineering": {
    bg: "bg-zone-live/12",
    text: "text-zone-live-on",
    stripe: "bg-zone-live",
  },
  Mechanical: {
    bg: "bg-muted",
    text: "text-text-muted",
    stripe: "bg-text-muted",
  },
  Civil: {
    bg: "bg-zone-mentorship/12",
    text: "text-zone-mentorship-on",
    stripe: "bg-zone-mentorship",
  },
  Electrical: {
    bg: "bg-zone-exams/12",
    text: "text-zone-exams-on",
    stripe: "bg-zone-exams",
  },
  Chemical: {
    bg: "bg-zone-news/12",
    text: "text-zone-news-on",
    stripe: "bg-zone-news",
  },
  default: {
    bg: "bg-zone-recruiter/10",
    text: "text-zone-recruiter-on",
    stripe: "bg-zone-recruiter",
  },
};

export function getDisciplineColors(discipline: string) {
  return disciplineMap[discipline] ?? disciplineMap.default;
}
