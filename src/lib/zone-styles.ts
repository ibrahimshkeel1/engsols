import type { FieldZone } from "@/lib/input-styles";
import { zoneTokens } from "@/lib/zone-tokens";

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
    brand: zoneTokens.mentorship.on,
    active: "bg-zone-mentorship/15 text-zone-mentorship-on",
    shell: "border-zone-mentorship-border bg-zone-mentorship-surface",
  },
  exams: {
    brand: zoneTokens.exams.on,
    active: "bg-zone-exams/15 text-zone-exams-on",
    shell: "border-zone-exams-border bg-zone-exams-surface",
  },
  news: {
    brand: zoneTokens.news.on,
    active: "bg-zone-news/15 text-zone-news-on",
    shell: "border-zone-news-border bg-zone-news-surface",
  },
  recruiter: {
    brand: zoneTokens.recruiter.on,
    active: "bg-zone-recruiter/15 text-zone-recruiter-on",
    shell: "border-zone-recruiter-border bg-zone-recruiter-surface",
  },
};
