import { cn } from "@/lib/utils";
import { zoneTokens, type ZoneKey } from "@/lib/zone-tokens";

type ZoneSectionProps = {
  zone?: ZoneKey;
  alt?: boolean;
  accent?: boolean;
  className?: string;
  children: React.ReactNode;
  id?: string;
};

export function ZoneSection({ zone, alt, accent = true, className, children, id }: ZoneSectionProps) {
  const t = zone ? zoneTokens[zone] : null;
  return (
    <section
      id={id}
      className={cn(
        alt ? "section-shell-alt" : "section-shell",
        accent && t?.sectionAccent,
        "py-12 sm:py-16 lg:py-20",
        className,
      )}
    >
      {children}
    </section>
  );
}
