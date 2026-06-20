import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-muted/70 ring-1 ring-border/40 transition-colors duration-300",
        className,
      )}
      aria-hidden
    />
  );
}
