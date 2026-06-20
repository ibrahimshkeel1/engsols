import type { FieldZone } from "@/lib/input-styles";

export type PanelZone = FieldZone | "default";

export const panelZoneStyles: Record<
  PanelZone,
  { brand: string; active: string; shell: string }
> = {
  default: {
    brand: "text-primary",
    active: "bg-primary/15 text-primary",
    shell: "border-border bg-card",
  },
  mentorship: {
    brand: "text-zone-mentorship",
    active: "bg-zone-mentorship/15 text-zone-mentorship",
    shell: "border-zone-mentorship/20 bg-zone-mentorship/5",
  },
  exams: {
    brand: "text-zone-exams",
    active: "bg-zone-exams/15 text-zone-exams",
    shell: "border-zone-exams/25 bg-zone-exams/5",
  },
  news: {
    brand: "text-zone-news",
    active: "bg-zone-news/15 text-zone-news",
    shell: "border-zone-news/25 bg-zone-news/5",
  },
  recruiter: {
    brand: "text-zone-recruiter",
    active: "bg-zone-recruiter/15 text-zone-recruiter",
    shell: "border-zone-recruiter/25 bg-zone-recruiter/5",
  },
};
