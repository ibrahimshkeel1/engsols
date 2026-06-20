import { cn } from "@/lib/utils";
import { zoneTokens, type ZoneKey } from "@/lib/zone-tokens";

type ZoneBadgeProps = {
  zone: ZoneKey;
  className?: string;
  children: React.ReactNode;
};

export function ZoneBadge({ zone, className, children }: ZoneBadgeProps) {
  const t = zoneTokens[zone];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium",
        t.surface,
        t.on,
        "border",
        t.border,
        className,
      )}
    >
      {children}
    </span>
  );
}
