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
        "rounded-xl border border-border/75 bg-card p-6 shadow-sm transition-[border-color,box-shadow,transform] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)]",
        interactive && "hover:-translate-y-0.5 hover:shadow-card-hover active:scale-[0.99] active:translate-y-0",
        stripe && t.stripe,
        interactive && t.cardHover,
        className,
      )}
    >
      {children}
    </Tag>
  );
}
