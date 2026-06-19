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

const paths = [
  {
    href: "/mentors",
    label: "Find a mentor",
    description: "Browse vetted engineers by discipline and goal",
    icon: Users,
  },
  {
    href: "/mentors?goal=fe-pe",
    label: "Prep for FE / PE",
    description: "Mentors who've passed the exams",
    icon: GraduationCap,
  },
  {
    href: "/forum",
    label: "Ask the forum",
    description: "Get answers from mentors and peers",
    icon: MessageSquare,
  },
  {
    href: "/live",
    label: "Watch live",
    description: "Q&As, workshops, and deep dives",
    icon: Radio,
  },
  {
    href: "/signup?next=/portfolios/build",
    label: "Build portfolio",
    description: "Showcase projects and get discovered",
    icon: Briefcase,
  },
];

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
          {paths.map((path, i) => (
            <AnimateIn key={path.href} delay={i * 0.05}>
              <Link
                href={path.href}
                className="group flex h-full flex-col rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/35 hover:bg-muted/30"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <path.icon className="h-5 w-5" aria-hidden />
                </div>
                <p className="mt-4 font-semibold leading-tight">{path.label}</p>
                <p className="mt-1 flex-1 text-xs leading-relaxed text-muted-foreground">{path.description}</p>
                <ArrowRight className="mt-3 h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </Link>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
