export type ProductZone = "mentorship" | "live" | "exams" | "recruiter" | "news" | "default";

const zonePrefixes: { prefix: string; zone: ProductZone }[] = [
  { prefix: "/mentor", zone: "mentorship" },
  { prefix: "/mentors", zone: "mentorship" },
  { prefix: "/live", zone: "live" },
  { prefix: "/certifications", zone: "exams" },
  { prefix: "/exams", zone: "exams" },
  { prefix: "/news", zone: "news" },
  { prefix: "/forum", zone: "recruiter" },
  { prefix: "/companies", zone: "recruiter" },
  { prefix: "/jobs", zone: "recruiter" },
  { prefix: "/portfolios", zone: "recruiter" },
];

export function zoneFromPath(pathname: string): ProductZone {
  const match = zonePrefixes.find(({ prefix }) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  return match?.zone ?? "default";
}

export const zoneAccentBar: Record<ProductZone, string> = {
  mentorship: "bg-zone-mentorship",
  live: "bg-zone-live",
  exams: "bg-zone-exams",
  recruiter: "bg-zone-recruiter",
  news: "bg-zone-news",
  default: "",
};

export const zoneNavActive: Record<string, string> = {
  "/mentors": "text-zone-mentorship",
  "/portfolios": "text-zone-recruiter",
  "/forum": "text-zone-recruiter",
  "/live": "text-zone-live",
  "/news": "text-zone-news",
  "/certifications": "text-zone-exams",
  "/companies": "text-zone-recruiter",
  "/jobs": "text-zone-recruiter",
};

export const zoneNavHover: Record<string, string> = {
  "/mentors": "hover:text-zone-mentorship",
  "/portfolios": "hover:text-zone-recruiter",
  "/forum": "hover:text-zone-recruiter",
  "/live": "hover:text-zone-live",
  "/news": "hover:text-zone-news",
};
