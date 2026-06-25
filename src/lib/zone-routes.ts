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

/** Thin route hairlines — orange / navy only */
export const zoneAccentBar: Record<ProductZone, string> = {
  mentorship: "bg-oil-gas-orange",
  live: "bg-oil-gas-navy-muted",
  exams: "bg-oil-gas-orange",
  recruiter: "bg-oil-gas-navy",
  news: "bg-oil-gas-orange-hover",
  default: "",
};

export const zoneNavActive: Record<string, string> = {
  "/mentors": "text-oil-gas-orange",
  "/portfolios": "text-oil-gas-navy",
  "/forum": "text-oil-gas-navy",
  "/live": "text-oil-gas-navy-muted",
  "/news": "text-oil-gas-orange",
  "/certifications": "text-oil-gas-orange",
  "/companies": "text-oil-gas-navy",
  "/jobs": "text-oil-gas-navy",
};

export const zoneNavHover: Record<string, string> = {
  "/mentors": "hover:text-oil-gas-orange",
  "/portfolios": "hover:text-oil-gas-navy",
  "/forum": "hover:text-oil-gas-navy",
  "/live": "hover:text-oil-gas-navy-muted",
  "/news": "hover:text-oil-gas-orange",
};
