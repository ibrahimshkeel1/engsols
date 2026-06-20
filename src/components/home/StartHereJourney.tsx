import Link from "next/link";
import {
  Users,
  GraduationCap,
  MessageSquare,
  Radio,
  Briefcase,
  ArrowRight,
} from "lucide-react";
import { AnimateIn } from "@/components/motion/AnimateIn";
import { ZoneSection } from "@/components/ui/ZoneSection";
import { ZoneCard } from "@/components/ui/ZoneCard";
import { cn } from "@/lib/utils";
import { zoneTokens, type ZoneKey } from "@/lib/zone-tokens";

const paths: {
  href: string;
  label: string;
  description: string;
  icon: typeof Users;
  zone: ZoneKey;
}[] = [
  {
    href: "/mentors",
    label: "Find a mentor",
    description: "Browse vetted engineers by discipline and goal",
    icon: Users,
    zone: "mentorship",
  },
  {
    href: "/mentors?goal=fe-pe",
    label: "Prep for FE / PE",
    description: "Mentors who've passed the exams",
    icon: GraduationCap,
    zone: "exams",
  },
  {
    href: "/forum",
    label: "Ask the forum",
    description: "Get answers from mentors and peers",
    icon: MessageSquare,
    zone: "recruiter",
  },
  {
    href: "/live",
    label: "Watch live",
    description: "Q&As, workshops, and deep dives",
    icon: Radio,
    zone: "live",
  },
  {
    href: "/signup?next=/portfolios/build",
    label: "Build portfolio",
    description: "Showcase projects and get discovered",
    icon: Briefcase,
    zone: "recruiter",
  },
];

export function StartHereJourney() {
  return (
    <ZoneSection zone="mentorship" className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <AnimateIn>
          <p className={zoneTokens.mentorship.sectionLabel}>Start here</p>
          <h2 className="font-display mt-1 text-2xl text-text-main sm:text-3xl">What do you want to do today?</h2>
          <p className="mt-2 max-w-xl text-sm text-text-muted">
            Pick a path — each one takes you straight to the right place on EngSols.
          </p>
        </AnimateIn>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {paths.map((path, i) => {
            const t = zoneTokens[path.zone];
            return (
              <AnimateIn key={path.href} delay={i * 0.05}>
                <Link href={path.href} className="group block h-full">
                  <ZoneCard zone={path.zone} className="flex h-full flex-col p-4 hover:bg-card/90">
                    <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", t.iconWell)}>
                      <path.icon className="h-5 w-5" aria-hidden />
                    </div>
                    <p className="mt-4 font-semibold leading-tight text-text-main">{path.label}</p>
                    <p className="mt-1 flex-1 text-xs leading-relaxed text-text-muted">{path.description}</p>
                    <ArrowRight className={cn("mt-3 h-4 w-4 text-text-muted transition-transform group-hover:translate-x-0.5", t.arrowHover)} />
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
