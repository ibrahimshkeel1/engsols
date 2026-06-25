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
        "rounded-xl bg-card p-6 transition-colors duration-150",
        stripe && t.stripe,
        interactive && t.cardHover,
        className,
      )}
    >
      {children}
    </Tag>
  );
}
