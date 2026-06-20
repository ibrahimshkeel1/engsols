import { cn } from "@/lib/utils";
import { zoneTokens, type ZoneKey } from "@/lib/zone-tokens";

type ZoneCardProps = {
  zone: ZoneKey;
  className?: string;
  children: React.ReactNode;
  stripe?: boolean;
  as?: "div" | "article";
  interactive?: boolean;
};

export function ZoneCard({
  zone,
  className,
  children,
  stripe = false,
  as: Tag = "div",
  interactive = true,
}: ZoneCardProps) {
  const t = zoneTokens[zone];
  return (
    <Tag
      className={cn(
        "rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-200",
        interactive && "hover:-translate-y-px hover:shadow-card-hover",
        stripe && t.stripe,
        interactive && t.cardHover,
        className,
      )}
    >
      {children}
    </Tag>
  );
}
