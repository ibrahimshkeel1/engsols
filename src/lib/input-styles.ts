import { cn } from "@/lib/utils";

export type FieldZone = "mentorship" | "exams" | "news" | "recruiter";

const zoneFocusClasses: Record<FieldZone, string> = {
  mentorship:
    "focus-visible:border-oil-gas-orange focus-visible:ring-oil-gas-orange/30",
  exams: "focus-visible:border-oil-gas-orange focus-visible:ring-oil-gas-orange/30",
  news: "focus-visible:border-oil-gas-navy-muted focus-visible:ring-oil-gas-navy-muted/30",
  recruiter:
    "focus-visible:border-oil-gas-navy focus-visible:ring-oil-gas-navy/30",
};

type FieldControlOptions = {
  className?: string;
  invalid?: boolean;
  multiline?: boolean;
  zone?: FieldZone;
  /** Filled navy/orange search fields with white text */
  tone?: "default" | "search" | "searchAccent" | "searchNav";
};

const searchToneClasses = {
  search:
    "border-oil-gas-navy bg-oil-gas-navy text-oil-gas-white placeholder:text-oil-gas-white caret-oil-gas-white focus-visible:border-oil-gas-orange focus-visible:ring-oil-gas-orange/40",
  searchAccent:
    "border-oil-gas-orange bg-oil-gas-orange text-oil-gas-white placeholder:text-oil-gas-white caret-oil-gas-white focus-visible:border-white focus-visible:ring-white/35",
  searchNav:
    "border-oil-gas-white bg-oil-gas-white text-oil-gas-orange placeholder:text-oil-gas-orange caret-oil-gas-orange focus-visible:border-oil-gas-orange focus-visible:ring-oil-gas-orange/40",
} as const;

export function searchFieldClassName(
  className?: string,
  tone: "search" | "searchAccent" | "searchNav" = "search",
) {
  return cn(
    "w-full rounded-lg border text-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-0",
    tone === "searchAccent"
      ? searchToneClasses.searchAccent
      : tone === "searchNav"
        ? searchToneClasses.searchNav
        : searchToneClasses.search,
    "flex h-10 px-3 py-2",
    className,
  );
}

export function fieldControlClassName({
  className,
  invalid,
  multiline,
  zone,
  tone = "default",
}: FieldControlOptions = {}) {
  if (tone === "search" || tone === "searchAccent" || tone === "searchNav") {
    return cn(
      searchFieldClassName(className, tone),
      multiline && "min-h-[100px] py-3",
      invalid &&
        "border-oil-gas-orange-hover focus-visible:border-oil-gas-orange-hover focus-visible:ring-oil-gas-orange-hover/45",
    );
  }

  const focusClasses = zone
    ? zoneFocusClasses[zone]
    : "focus-visible:border-oil-gas-orange focus-visible:ring-oil-gas-orange/30";

  return cn(
    "w-full rounded-lg border text-sm transition-all duration-200 placeholder:text-text-muted focus-visible:outline-none",
    multiline ? "flex min-h-[100px] px-3 py-3" : "flex h-10 px-3 py-2",
    invalid
      ? "border-oil-gas-orange-hover/70 focus-visible:border-oil-gas-orange-hover focus-visible:ring-2 focus-visible:ring-oil-gas-orange-hover/35"
      : cn(
          "border-border-custom bg-bg-surface text-text-main focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-offset-bg-main",
          focusClasses,
        ),
    className,
  );
}
