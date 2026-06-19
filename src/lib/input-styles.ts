import { cn } from "@/lib/utils";

type FieldControlOptions = {
  className?: string;
  invalid?: boolean;
  multiline?: boolean;
};

export function fieldControlClassName({ className, invalid, multiline }: FieldControlOptions = {}) {
  return cn(
    "w-full rounded-lg border bg-card text-sm text-foreground transition-all duration-200 placeholder:text-muted-foreground focus-visible:outline-none",
    multiline ? "flex min-h-[100px] px-3 py-3" : "flex h-10 px-3 py-2",
    invalid
      ? "border-red-500/70 focus-visible:border-red-500 focus-visible:ring-2 focus-visible:ring-red-500/35"
      : "border-border focus-visible:border-primary/50 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
    className,
  );
}
