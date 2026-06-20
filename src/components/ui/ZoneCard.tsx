import { cn } from "@/lib/utils";
import { zoneTokens, type ZoneKey } from "@/lib/zone-tokens";

type ZoneCardProps = {
  zone: ZoneKey;
  className?: string;
  children: React.ReactNode;
  stripe?: boolean;
  as?: "div" | "article";
};

export function ZoneCard({ zone, className, children, stripe = false, as: Tag = "div" }: ZoneCardProps) {
  const t = zoneTokens[zone];
  return (
    <Tag
      className={cn(
        "rounded-xl border border-border bg-card shadow-sm transition-all duration-200",
        stripe && t.stripe,
        t.cardHover,
        "hover:shadow-premium-card",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
