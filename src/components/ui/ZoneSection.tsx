import { cn } from "@/lib/utils";
import { zoneTokens, type ZoneKey } from "@/lib/zone-tokens";

type ZoneSectionProps = {
  zone: ZoneKey;
  className?: string;
  children: React.ReactNode;
  id?: string;
};

export function ZoneSection({ zone, className, children, id }: ZoneSectionProps) {
  const t = zoneTokens[zone];
  return (
    <section id={id} className={cn(t.sectionBand, "py-12 sm:py-16 lg:py-20", className)}>
      {children}
    </section>
  );
}
