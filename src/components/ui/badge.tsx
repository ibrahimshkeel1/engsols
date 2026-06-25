import { cn } from "@/lib/utils";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "orange" | "navy" | "muted";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variant === "default" && "bg-oil-gas-ice text-oil-gas-navy",
        variant === "orange" && "bg-oil-gas-orange/12 text-oil-gas-orange-hover",
        variant === "navy" && "bg-oil-gas-navy/10 text-oil-gas-navy",
        variant === "muted" && "bg-muted text-text-muted",
        className,
      )}
      {...props}
    />
  );
}
