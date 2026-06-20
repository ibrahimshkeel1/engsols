import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AnimateIn } from "@/components/motion/AnimateIn";
import { ZoneSection } from "@/components/ui/ZoneSection";
import { ZoneCard } from "@/components/ui/ZoneCard";
import { cn } from "@/lib/utils";
import { zoneTokens, type ZoneKey } from "@/lib/zone-tokens";

const paths: {
  href: string;
  label: string;
  zone: ZoneKey;
}[] = [
  { href: "/mentors?goal=fe-pe", label: "Prep for FE / PE", zone: "exams" },
  { href: "/forum", label: "Ask the forum", zone: "recruiter" },
  { href: "/live", label: "Watch live", zone: "live" },
  { href: "/signup?next=/portfolios/build", label: "Build portfolio", zone: "recruiter" },
  { href: "/certifications", label: "Certifications", zone: "exams" },
];

export function StartHereJourney() {
  return (
    <ZoneSection alt accent={false} className="!py-12 lg:!py-16">
      <div className="page-container-wide opacity-90">
        <AnimateIn>
          <p className="section-label opacity-50">Also on EngSols</p>
          <h2 className="text-caption mt-2 font-medium text-muted-foreground">Explore when you are ready</h2>
        </AnimateIn>
        <div className="mt-6 flex flex-wrap gap-2">
          {paths.map((path, i) => {
            const t = zoneTokens[path.zone];
            return (
              <AnimateIn key={path.href} delay={i * 0.03}>
                <Link href={path.href} className="group inline-flex">
                  <ZoneCard zone={path.zone} className="!flex-row !items-center !gap-2 !px-3 !py-2" interactive>
                    <span className="text-xs text-foreground/85">{path.label}</span>
                    <ArrowRight className={cn("h-3 w-3 text-muted-foreground", t.arrowHover)} />
                  </ZoneCard>
                </Link>
              </AnimateIn>
            );
          })}
        </div>
      </div>
    </ZoneSection>
  );
}
