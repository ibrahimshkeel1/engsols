"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";
import type { Mentor } from "@/types";
import type { BentoVariant } from "@/lib/bento-layout";
import { getDisciplineColors } from "@/lib/discipline-colors";
import { MentorAvailabilityBadges } from "@/components/mentors/MentorAvailabilityBadges";
import { Avatar } from "@/components/ui/Avatar";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { DisciplineBadge } from "@/components/ui/DisciplineBadge";
import { MentorRating } from "@/components/mentors/MentorRating";
import { cn } from "@/lib/utils";

type MentorCardProps = {
  mentor: Mentor;
  showPrice?: boolean;
  variant?: BentoVariant;
};

function avatarSizeForVariant(variant: BentoVariant): "md" | "lg" | "xl" {
  if (variant === "hero") return "xl";
  if (variant === "wide" || variant === "tall") return "lg";
  return "md";
}

export function MentorCard({ mentor, showPrice = true, variant = "default" }: MentorCardProps) {
  const stripe = getDisciplineColors(mentor.discipline).stripe;
  const isHero = variant === "hero";
  const isWide = variant === "wide";
  const showBio = isHero || isWide || variant === "tall";
  const credentialLimit = isHero ? 4 : variant === "tall" ? 3 : 2;

  return (
    <Link
      href={`/mentors/${mentor.slug}`}
      className={cn(
        "card-interactive group relative flex h-full min-h-[9rem] overflow-hidden rounded-xl border border-border hover:border-zone-mentorship-border",
        isHero && "min-h-[16rem]",
        variant === "tall" && "min-h-[14rem]",
      )}
    >
      <div className={cn("absolute start-0 top-0 h-full w-1", stripe)} />
      {isHero && (
        <div className="absolute inset-0 bg-gradient-to-br from-zone-mentorship/10 to-transparent" />
      )}

      <div className="relative flex min-w-0 flex-1 flex-col p-4 ps-5 sm:p-5 sm:ps-6">
        <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
          <div className="relative shrink-0">
            <Avatar
              name={mentor.name}
              discipline={mentor.discipline}
              size={avatarSizeForVariant(variant)}
              src={mentor.avatarUrl}
              className={cn("rounded-2xl ring-2 ring-border", isHero && "ring-primary/20")}
            />
            {mentor.featured && (
              <span className="absolute -bottom-1 -end-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                <BadgeCheck className="h-3 w-3" />
              </span>
            )}
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <MentorRating rating={mentor.rating} reviewCount={mentor.reviewCount} size="sm" />
            <h3 className={cn("font-semibold leading-tight", isHero ? "text-lg sm:text-xl" : "text-base")}>
              {mentor.name}
            </h3>
            <p className={cn("text-sm text-muted-foreground", !showBio && "line-clamp-2")}>
              {mentor.headline}
            </p>
            <div className="flex min-w-0 items-center gap-1.5">
              <CompanyLogo company={mentor.company} size="sm" />
              <p className="truncate text-xs text-muted-foreground">{mentor.company}</p>
            </div>
            {showBio && mentor.bio && (
              <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                {mentor.bio}
              </p>
            )}
            <div className="mt-2 flex flex-wrap gap-1.5">
              <DisciplineBadge discipline={mentor.discipline} />
              <MentorAvailabilityBadges mentor={mentor} />
              {mentor.verified && (
                <span className="inline-flex rounded-md bg-zone-mentorship/12 px-2 py-0.5 text-xs font-medium text-zone-mentorship">
                  Verified
                </span>
              )}
              {mentor.credentials.slice(0, credentialLimit).map((c) => (
                <span key={c} className="inline-flex rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>

        {showPrice && (
          <div
            className={cn(
              "mt-3 flex items-center justify-between border-t border-border/60 pt-3 sm:mt-4 sm:pt-4",
              isHero && "sm:pt-5",
            )}
          >
            <p className="text-sm text-muted-foreground">
              From <span className={cn("font-semibold text-foreground", isHero && "text-lg")}>${mentor.monthlyRate}</span>/mo
            </p>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-zone-mentorship rtl:group-hover:-translate-x-1" />
          </div>
        )}
      </div>
    </Link>
  );
}
