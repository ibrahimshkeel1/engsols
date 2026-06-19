import Link from "next/link";
import {
  ArrowRight,
  Bell,
  Briefcase,
  Bookmark,
  ClipboardList,
} from "lucide-react";
import type { HomeJourneyState } from "@/lib/data/home-journey";
import { Avatar } from "@/components/ui/Avatar";
import { AnimateIn } from "@/components/motion/AnimateIn";

type ContinueJourneyHeroProps = {
  userName: string | null;
  journey: HomeJourneyState;
};

export function ContinueJourneyHero({ userName, journey }: ContinueJourneyHeroProps) {
  const firstName = userName?.split(" ")[0] || "there";

  const actions = [
    journey.savedCount > 0 && {
      href: "/settings#saved-mentors",
      icon: Bookmark,
      label: `${journey.savedCount} saved mentor${journey.savedCount === 1 ? "" : "s"}`,
      cta: "View saved",
    },
    journey.portfolioIncomplete && {
      href: journey.portfolioHref,
      icon: Briefcase,
      label: "Finish your portfolio",
      cta: "Continue building",
    },
    journey.pendingBookings > 0 && {
      href: "/settings#my-bookings",
      icon: ClipboardList,
      label: `${journey.pendingBookings} pending booking${journey.pendingBookings === 1 ? "" : "s"}`,
      cta: "Track requests",
    },
    journey.pendingJobApplications > 0 && {
      href: "/settings#job-applications",
      icon: ClipboardList,
      label: `${journey.pendingJobApplications} job application${journey.pendingJobApplications === 1 ? "" : "s"} in progress`,
      cta: "View status",
    },
    journey.unreadNotifications > 0 && {
      href: "/notifications",
      icon: Bell,
      label: `${journey.unreadNotifications} unread notification${journey.unreadNotifications === 1 ? "" : "s"}`,
      cta: "Open inbox",
    },
  ].filter(Boolean) as { href: string; icon: typeof Bell; label: string; cta: string }[];

  const fallbackActions = [
    { href: "/mentors", label: "Find a mentor", cta: "Browse directory" },
    { href: "/forum", label: "Join a discussion", cta: "Go to forum" },
    { href: "/assist", label: "Career assist", cta: "Get matches" },
  ];

  return (
    <section className="hero-dark relative overflow-hidden">
      <div className="bg-grid absolute inset-0 opacity-60" />
      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-20">
        <AnimateIn>
          <p className="section-label">Welcome back</p>
          <h1 className="font-display mt-2 text-3xl sm:text-4xl">
            Continue your journey, {firstName}
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            Pick up where you left off — your mentors, portfolio, and applications are one click away.
          </p>
        </AnimateIn>

        {actions.length > 0 ? (
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {actions.map((action, i) => (
              <AnimateIn key={action.href + action.label} delay={i * 0.06}>
                <Link
                  href={action.href}
                  className="group flex items-start gap-4 rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/35"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">{action.label}</p>
                    <p className="mt-1 text-sm text-primary group-hover:underline">{action.cta} →</p>
                  </div>
                </Link>
              </AnimateIn>
            ))}
          </div>
        ) : (
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {fallbackActions.map((action, i) => (
              <AnimateIn key={action.href} delay={i * 0.06}>
                <Link
                  href={action.href}
                  className="group rounded-xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/35"
                >
                  <p className="font-medium">{action.label}</p>
                  <p className="mt-1 text-sm text-primary">{action.cta} →</p>
                </Link>
              </AnimateIn>
            ))}
          </div>
        )}

        {journey.savedMentors.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-medium text-muted-foreground">Your saved mentors</p>
              <Link href="/mentors" className="text-sm text-primary hover:underline">
                Browse more
              </Link>
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              {journey.savedMentors.map((mentor) => (
                <Link
                  key={mentor.slug}
                  href={`/mentors/${mentor.slug}`}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2 shadow-sm transition-colors hover:border-primary/35"
                >
                  <Avatar name={mentor.name} discipline={mentor.discipline} size="sm" src={mentor.avatarUrl} />
                  <span className="text-sm font-medium">{mentor.name}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
