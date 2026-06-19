"use client";

import Link from "next/link";
import { ArrowRight, BadgeCheck } from "lucide-react";
import type { Mentor } from "@/types";
import type { BentoVariant } from "@/lib/bento-layout";
import { getDisciplineColors } from "@/lib/discipline-colors";
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

export function MentorCard({ mentor, showPrice = true, variant = "default" }: MentorCardProps) {
  const stripe = getDisciplineColors(mentor.discipline).stripe;
  const isHero = variant === "hero";
  const isWide = variant === "wide";
  const isTall = variant === "tall";
  const avatarSize = isHero ? "lg" : isTall ? "lg" : "md";

  return (
    <Link
      href={`/mentors/${mentor.slug}`}
      className={cn(
        "card-interactive group relative flex h-full overflow-hidden rounded-xl",
        isHero && "min-h-[18rem]",
        isTall && "min-h-[16rem] flex-col",
        isWide && "min-h-[11rem]",
      )}
    >
      <div className={cn("absolute left-0 top-0 h-full w-1", stripe)} />
      <div
        className={cn(
          "absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100",
          isHero && "bg-gradient-to-br from-primary/[0.06] to-transparent opacity-100",
        )}
      />

      <div
        className={cn(
          "relative flex flex-1 flex-col p-5 pl-6",
          isWide && "sm:flex-row sm:items-stretch sm:gap-6",
          isTall && "items-center text-center",
          isHero && "justify-between",
        )}
      >
        <div
          className={cn(
            "flex gap-4",
            isWide && "sm:min-w-0 sm:flex-1 sm:items-start",
            isTall && "flex-col items-center",
            isHero && "items-start",
          )}
        >
          <div className={cn("relative shrink-0", isTall && "mx-auto")}>
            <Avatar
              name={mentor.name}
              discipline={mentor.discipline}
              size={avatarSize}
              src={mentor.avatarUrl}
              className={isHero ? "ring-2 ring-primary/20" : undefined}
            />
            {mentor.featured && (
              <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                <BadgeCheck className="h-3 w-3" />
              </span>
            )}
          </div>

          <div className={cn("min-w-0 flex-1", isTall && "w-full")}>
            <MentorRating rating={mentor.rating} reviewCount={mentor.reviewCount} size="sm" />
            <h3 className={cn("mt-0.5 font-semibold", isHero ? "text-xl" : "truncate")}>{mentor.name}</h3>
            <p className={cn("text-sm text-muted-foreground", !isHero && !isWide && "truncate", isWide && "line-clamp-2")}>
              {mentor.headline}
            </p>
            <div className={cn("mt-1 flex items-center gap-1.5", isTall && "justify-center")}>
              <CompanyLogo company={mentor.company} size="sm" />
              <p className="truncate text-xs text-muted-foreground">{mentor.company}</p>
            </div>
            {(isHero || isWide) && mentor.bio && (
              <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground sm:line-clamp-3">
                {mentor.bio}
              </p>
            )}
          </div>
        </div>

        <div className={cn("mt-4 flex flex-wrap gap-1.5", isTall && "justify-center", isWide && "sm:mt-0 sm:max-w-xs sm:content-end")}>
          <DisciplineBadge discipline={mentor.discipline} />
          {mentor.verified && (
            <span className="inline-flex rounded-md bg-blue-500/12 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300">
              Verified
            </span>
          )}
          {mentor.credentials.slice(0, isHero ? 4 : isTall ? 3 : 2).map((c) => (
            <span key={c} className="inline-flex rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              {c}
            </span>
          ))}
        </div>

        {showPrice && (
          <div
            className={cn(
              "mt-auto flex items-end justify-between pt-4",
              isTall && "w-full",
              isHero && "border-t border-border/60 pt-5",
            )}
          >
            <p className="text-sm text-muted-foreground">
              From <span className={cn("font-semibold text-foreground", isHero && "text-lg")}>${mentor.monthlyRate}</span>/mo
            </p>
            <ArrowRight className="h-4 w-4 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary" />
          </div>
        )}
      </div>
    </Link>
  );
}
