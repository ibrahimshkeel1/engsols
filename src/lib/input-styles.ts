import { cn } from "@/lib/utils";

export type FieldZone = "mentorship" | "exams" | "news" | "recruiter";

const zoneFocusClasses: Record<FieldZone, string> = {
  mentorship:
    "focus-visible:border-zone-mentorship focus-visible:ring-zone-mentorship/30",
  exams: "focus-visible:border-zone-exams focus-visible:ring-zone-exams/30",
  news: "focus-visible:border-zone-news focus-visible:ring-zone-news/30",
  recruiter:
    "focus-visible:border-zone-recruiter focus-visible:ring-zone-recruiter/30",
};

type FieldControlOptions = {
  className?: string;
  invalid?: boolean;
  multiline?: boolean;
  zone?: FieldZone;
};

export function fieldControlClassName({
  className,
  invalid,
  multiline,
  zone,
}: FieldControlOptions = {}) {
  const focusClasses = zone
    ? zoneFocusClasses[zone]
    : "focus-visible:border-accent focus-visible:ring-accent/30";

  return cn(
    "w-full rounded-lg border text-sm transition-all duration-200 placeholder:text-text-muted focus-visible:outline-none",
    multiline ? "flex min-h-[100px] px-3 py-3" : "flex h-10 px-3 py-2",
    invalid
      ? "border-red-500/70 focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/35"
      : cn(
          "border-border-custom bg-bg-surface text-text-main focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-bg-main",
          focusClasses,
        ),
    className,
  );
}
