import { cn } from "@/lib/utils";
import { zoneTokens, type ZoneKey } from "@/lib/zone-tokens";

type ZoneCardProps = {
  zone: ZoneKey;
  className?: string;
  children: React.ReactNode;
  stripe?: boolean;
  as?: "div" | "article";
};

export function ZoneCard({ zone, className, children, stripe = true, as: Tag = "div" }: ZoneCardProps) {
  const t = zoneTokens[zone];
  return (
    <Tag
      className={cn(
        "rounded-xl border bg-card shadow-sm transition-colors",
        t.border,
        stripe && t.stripe,
        t.cardHover,
        className,
      )}
    >
      {children}
    </Tag>
  );
}
