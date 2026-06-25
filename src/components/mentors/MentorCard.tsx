"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, BadgeCheck, Star } from "lucide-react";
import type { Mentor } from "@/types";
import { PixelTransition } from "@/components/motion/pixel-transition";
import { Avatar } from "@/components/ui/Avatar";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { cn } from "@/lib/utils";

type MentorCardProps = {
  mentor: Mentor;
  showPrice?: boolean;
};

const pillClass =
  "inline-flex items-center gap-1 rounded-lg border border-zone-mentorship/20 bg-zone-mentorship/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zone-mentorship";

function CardRating({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  if (reviewCount === 0) {
    return (
      <span className="flex shrink-0 items-center gap-1 text-[10px] font-semibold text-text-muted">
        ⭐ 0.0 (0)
      </span>
    );
  }

  return (
    <span className="flex shrink-0 items-center gap-1 text-[10px] font-semibold text-text-muted">
      <Star className="h-3 w-3 fill-zone-mentorship text-zone-mentorship" />
      <span className="text-text-main">{rating.toFixed(1)}</span>
      <span className="font-normal">({reviewCount})</span>
    </span>
  );
}

function MentorCardPreview({ mentor }: { mentor: Mentor }) {
  return (
    <div className="flex h-full flex-col bg-bg-surface">
      <div className="relative min-h-0 flex-1 overflow-hidden bg-muted">
        <Avatar
          name={mentor.name}
          discipline={mentor.discipline}
          size="2xl"
          src={mentor.avatarUrl}
          className="h-full w-full rounded-none object-cover ring-0"
        />
      </div>
      <div className="shrink-0 p-4 text-center">
        <h3 className="capitalize font-semibold text-text-main">{mentor.name}</h3>
      </div>
    </div>
  );
}

function MentorCardDetails({ mentor, showPrice }: { mentor: Mentor; showPrice: boolean }) {
  const bioText = mentor.bio?.trim() || mentor.headline;

  const badgeItems: { key: string; label: string; uppercase?: boolean; icon?: ReactNode }[] = [
    {
      key: "company",
      label: mentor.company,
      uppercase: false,
      icon: <CompanyLogo company={mentor.company} size="sm" />,
    },
    ...mentor.subFields.slice(0, 2).map((field) => ({
      key: field,
      label: field,
      uppercase: true,
    })),
    ...mentor.skills
      .filter((skill) => !mentor.subFields.includes(skill))
      .slice(0, 2)
      .map((skill) => ({
        key: skill,
        label: skill,
        uppercase: true,
      })),
  ];

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-bg-surface p-4 text-start">
      <div className="flex items-start justify-between gap-2">
        <div className="relative shrink-0">
          <Avatar
            name={mentor.name}
            discipline={mentor.discipline}
            size="md"
            src={mentor.avatarUrl}
            className="rounded-xl ring-2 ring-border-custom"
          />
          {mentor.featured && (
            <span className="absolute -bottom-1 -end-1 flex h-4 w-4 items-center justify-center rounded-full bg-zone-mentorship text-bg-main shadow-sm">
              <BadgeCheck className="h-2.5 w-2.5" />
            </span>
          )}
        </div>
        <CardRating rating={mentor.rating} reviewCount={mentor.reviewCount} />
      </div>

      <div className="mt-3 min-w-0">
        <h3 className="text-base font-bold capitalize text-text-main">{mentor.name}</h3>
        <p className="mt-0.5 text-xs font-medium tracking-wide text-text-muted">{mentor.headline}</p>
      </div>

      <div className="my-3 flex min-h-[40px] items-center rounded-r-xl border-l-2 border-zone-mentorship/30 bg-bg-main/40 py-2 pl-3 text-xs text-text-muted/90 line-clamp-3">
        {bioText}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {badgeItems.map((item) => (
          <span key={item.key} className={cn(pillClass, !item.uppercase && "normal-case tracking-normal")}>
            {item.icon}
            {item.label}
          </span>
        ))}
        {mentor.verified && <span className={pillClass}>Verified</span>}
      </div>

      {showPrice && (
        <div className="mt-auto flex items-center justify-between border-t border-border-custom/60 pt-3">
          <p className="text-xs text-text-muted">
            From <span className="text-sm font-extrabold text-text-main">${mentor.monthlyRate}</span>/mo
          </p>
          <span className="rounded-lg bg-zone-mentorship/10 p-1.5 text-zone-mentorship" aria-hidden>
            <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      )}
    </div>
  );
}

export function MentorCard({ mentor, showPrice = true }: MentorCardProps) {
  return (
    <Link
      href={`/mentors/${mentor.slug}`}
      className="group block h-full rounded-2xl border border-border-custom bg-bg-surface shadow-premium-card transition-all duration-300 hover:-translate-y-1 hover:shadow-zone-mentorship/5"
    >
      <PixelTransition
        fill
        gridSize={12}
        pixelColor="hsl(var(--background))"
        animationStepDuration={0.4}
        className="h-full w-full"
        firstContent={<MentorCardPreview mentor={mentor} />}
        secondContent={<MentorCardDetails mentor={mentor} showPrice={showPrice} />}
      />
    </Link>
  );
}
