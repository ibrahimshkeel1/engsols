import Link from "next/link";
import {
  ArrowRight,
  Bell,
  Briefcase,
  Bookmark,
  ClipboardList,
  Sparkles,
} from "lucide-react";
import type { HomeJourneyState } from "@/lib/data/home-journey";
import { GoalsProgressCompact } from "@/components/home/GoalsProgressCompact";
import { Avatar } from "@/components/ui/Avatar";
import { ButtonLink } from "@/components/ui/button";
import { AnimateIn } from "@/components/motion/AnimateIn";
import { HomeBentoGrid } from "@/components/home/HomeBentoGrid";

type ContinueJourneyHeroProps = {
  userName: string | null;
  journey: HomeJourneyState;
};

const simpleCardClassName =
  "card-interactive group flex h-full min-w-0 flex-col rounded-xl p-5 opacity-90";

const actionCardClassName =
  "card-interactive group flex h-full min-w-0 flex-row items-start gap-4 rounded-xl p-5 opacity-90";

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
    { href: "/for-you", label: "Your weekly digest", cta: "See what's new" },
    { href: "/mentors", label: "Find a mentor", cta: "Browse directory" },
    { href: "/forum", label: "Join a discussion", cta: "Go to forum" },
  ];

  return (
    <section className="hero-dark relative overflow-hidden">
      <div className="bg-grid absolute inset-0 opacity-20" />
      <div className="page-container-wide relative py-20 lg:py-28">
        <AnimateIn className="max-w-xl">
          <p className="section-label opacity-70">Welcome back</p>
          <h1 className="text-display-xl mt-4">Continue your journey, {firstName}</h1>
          <p className="text-body-lg mt-4 max-w-md">{journey.suggestedAction.description}</p>
          <ButtonLink href={journey.suggestedAction.href} size="lg" className="mt-8 group">
            <Sparkles className="h-4 w-4" />
            {journey.suggestedAction.label}
            <ArrowRight className="h-4 w-4 transition-transform duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5" />
          </ButtonLink>
        </AnimateIn>

        <div className="mt-16 border-t border-border/50 pt-12">
          <GoalsProgressCompact goals={journey.careerGoals} completed={journey.goalsCompleted} />

          {actions.length > 0 ? (
            <HomeBentoGrid className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {actions.map((action) => (
                <Link key={action.href + action.label} href={action.href} className={actionCardClassName}>
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <action.icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium leading-snug text-foreground/90">{action.label}</p>
                    <p className="text-caption mt-1 group-hover:text-primary">{action.cta} →</p>
                  </div>
                </Link>
              ))}
            </HomeBentoGrid>
          ) : (
            <HomeBentoGrid className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {fallbackActions.map((action) => (
                <Link key={action.href} href={action.href} className={simpleCardClassName}>
                  <p className="font-medium leading-snug text-foreground/90">{action.label}</p>
                  <p className="text-caption mt-1 group-hover:text-primary">{action.cta} →</p>
                </Link>
              ))}
            </HomeBentoGrid>
          )}

          {journey.savedMentors.length > 0 && (
            <div className="mt-10">
              <div className="flex items-center justify-between gap-4">
                <p className="text-caption">Your saved mentors</p>
                <Link href="/mentors" className="text-caption hover:text-primary">
                  Browse more
                </Link>
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                {journey.savedMentors.map((mentor) => (
                  <Link
                    key={mentor.slug}
                    href={`/mentors/${mentor.slug}`}
                    className="flex items-center gap-3 rounded-xl border border-border/75 bg-card px-3 py-2.5 transition-[border-color,box-shadow,transform] duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-sm"
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
      </div>
    </section>
  );
}
