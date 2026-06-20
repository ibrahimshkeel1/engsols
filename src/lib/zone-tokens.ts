export type ZoneKey = "mentorship" | "live" | "exams" | "recruiter" | "news";

export const zoneTokens: Record<
  ZoneKey,
  {
    surface: string;
    on: string;
    border: string;
    accent: string;
    accentBg: string;
    stripe: string;
    iconWell: string;
    sectionBand: string;
    sectionAccent: string;
    sectionLabel: string;
    hero: string;
    cardHover: string;
    arrowHover: string;
  }
> = {
  mentorship: {
    surface: "bg-zone-mentorship-surface",
    on: "text-zone-mentorship-on",
    border: "border-zone-mentorship-border",
    accent: "text-zone-mentorship",
    accentBg: "bg-zone-mentorship",
    stripe: "border-l-4 border-zone-mentorship",
    iconWell: "bg-zone-mentorship/10 text-zone-mentorship",
    sectionBand: "section-shell",
    sectionAccent: "section-accent-mentorship",
    sectionLabel: "section-label-zone-mentorship",
    hero: "hero-zone-mentorship",
    cardHover: "hover:border-zone-mentorship",
    arrowHover: "group-hover:text-zone-mentorship",
  },
  live: {
    surface: "bg-zone-live-surface",
    on: "text-zone-live-on",
    border: "border-zone-live-border",
    accent: "text-zone-live",
    accentBg: "bg-zone-live",
    stripe: "border-l-4 border-zone-live",
    iconWell: "bg-zone-live/10 text-zone-live",
    sectionBand: "section-shell",
    sectionAccent: "section-accent-live",
    sectionLabel: "section-label-zone-live",
    hero: "hero-zone-live",
    cardHover: "hover:border-zone-live",
    arrowHover: "group-hover:text-zone-live",
  },
  exams: {
    surface: "bg-zone-exams-surface",
    on: "text-zone-exams-on",
    border: "border-zone-exams-border",
    accent: "text-zone-exams",
    accentBg: "bg-zone-exams",
    stripe: "border-l-4 border-zone-exams",
    iconWell: "bg-zone-exams/10 text-zone-exams",
    sectionBand: "section-shell",
    sectionAccent: "section-accent-exams",
    sectionLabel: "section-label-zone-exams",
    hero: "hero-zone-exams",
    cardHover: "hover:border-zone-exams",
    arrowHover: "group-hover:text-zone-exams",
  },
  recruiter: {
    surface: "bg-zone-recruiter-surface",
    on: "text-zone-recruiter-on",
    border: "border-zone-recruiter-border",
    accent: "text-zone-recruiter",
    accentBg: "bg-zone-recruiter",
    stripe: "border-l-4 border-zone-recruiter",
    iconWell: "bg-zone-recruiter/10 text-zone-recruiter",
    sectionBand: "section-shell",
    sectionAccent: "section-accent-recruiter",
    sectionLabel: "section-label-zone-recruiter",
    hero: "hero-zone-recruiter",
    cardHover: "hover:border-zone-recruiter",
    arrowHover: "group-hover:text-zone-recruiter",
  },
  news: {
    surface: "bg-zone-news-surface",
    on: "text-zone-news-on",
    border: "border-zone-news-border",
    accent: "text-zone-news",
    accentBg: "bg-zone-news",
    stripe: "border-l-4 border-zone-news",
    iconWell: "bg-zone-news/10 text-zone-news",
    sectionBand: "section-shell",
    sectionAccent: "section-accent-news",
    sectionLabel: "section-label-zone-news",
    hero: "hero-zone-news",
    cardHover: "hover:border-zone-news",
    arrowHover: "group-hover:text-zone-news",
  },
};

export function zoneCta() {
  return "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-sm";
}
