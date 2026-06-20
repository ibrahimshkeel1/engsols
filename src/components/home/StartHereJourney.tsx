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
import { cn } from "@/lib/utils";

const paths = [
  {
    href: "/mentors",
    label: "Find a mentor",
    description: "Browse vetted engineers by discipline and goal",
    icon: Users,
    zone: "mentorship" as const,
  },
  {
    href: "/mentors?goal=fe-pe",
    label: "Prep for FE / PE",
    description: "Mentors who've passed the exams",
    icon: GraduationCap,
    zone: "exams" as const,
  },
  {
    href: "/forum",
    label: "Ask the forum",
    description: "Get answers from mentors and peers",
    icon: MessageSquare,
    zone: "recruiter" as const,
  },
  {
    href: "/live",
    label: "Watch live",
    description: "Q&As, workshops, and deep dives",
    icon: Radio,
    zone: "live" as const,
  },
  {
    href: "/signup?next=/portfolios/build",
    label: "Build portfolio",
    description: "Showcase projects and get discovered",
    icon: Briefcase,
    zone: "recruiter" as const,
  },
];

const zoneCardStyles = {
  mentorship: {
    border: "border-zone-mentorship/30 hover:border-zone-mentorship/55",
    icon: "bg-zone-mentorship/15 text-zone-mentorship",
    arrow: "group-hover:text-zone-mentorship",
  },
  exams: {
    border: "border-zone-exams/30 hover:border-zone-exams/55",
    icon: "bg-zone-exams/15 text-zone-exams",
    arrow: "group-hover:text-zone-exams",
  },
  live: {
    border: "border-zone-live/30 hover:border-zone-live/55",
    icon: "bg-zone-live/15 text-zone-live",
    arrow: "group-hover:text-zone-live",
  },
  recruiter: {
    border: "border-zone-recruiter/30 hover:border-zone-recruiter/55",
    icon: "bg-zone-recruiter/15 text-zone-recruiter",
    arrow: "group-hover:text-zone-recruiter",
  },
};

export function StartHereJourney() {
  return (
    <section className="border-b border-border bg-surface py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <AnimateIn>
          <p className="section-label">Start here</p>
          <h2 className="font-display mt-1 text-2xl sm:text-3xl">What do you want to do today?</h2>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Pick a path — each one takes you straight to the right place on EngSols.
          </p>
        </AnimateIn>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {paths.map((path, i) => {
            const zone = zoneCardStyles[path.zone];
            return (
            <AnimateIn key={path.href} delay={i * 0.05}>
              <Link
                href={path.href}
                className={cn(
                  "group flex h-full flex-col rounded-xl border bg-card p-4 shadow-sm transition-colors hover:bg-muted/30",
                  zone.border,
                )}
              >
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", zone.icon)}>
                  <path.icon className="h-5 w-5" aria-hidden />
                </div>
                <p className="mt-4 font-semibold leading-tight">{path.label}</p>
                <p className="mt-1 flex-1 text-xs leading-relaxed text-muted-foreground">{path.description}</p>
                <ArrowRight className={cn("mt-3 h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5", zone.arrow)} />
              </Link>
            </AnimateIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
