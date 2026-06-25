"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Star } from "lucide-react";
import type { Mentor } from "@/types";
import { PixelTransition } from "@/components/motion/pixel-transition";
import { ProfilePassportPhoto } from "@/components/ui/ProfilePassportPhoto";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { introBadgeLabel } from "@/lib/mentor-display";
import { MOTION_COLORS } from "@/lib/motion-colors";
import { cn } from "@/lib/utils";

type MentorCardProps = {
  mentor: Mentor;
  showPrice?: boolean;
};

const hoverPanelClass =
  "flex h-full flex-col overflow-y-auto bg-background p-4 text-start shadow-[inset_0_0_0_1px_hsl(var(--border))]";

const pillClass =
  "inline-flex items-center gap-1 rounded-lg border border-zone-mentorship/20 bg-zone-mentorship/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zone-mentorship";

function CardRating({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  if (reviewCount === 0) {
    return null;
  }

  return (
    <span className="flex shrink-0 items-center gap-1 text-[10px] font-semibold text-text-muted">
      <Star className="h-3 w-3 fill-zone-mentorship text-zone-mentorship" />
      <span className="text-text-main">{rating.toFixed(1)}</span>
      <span className="font-normal">({reviewCount})</span>
    </span>
  );
}

function CardTrustBadge({ mentor }: { mentor: Mentor }) {
  if (mentor.reviewCount > 0) {
    return <CardRating rating={mentor.rating} reviewCount={mentor.reviewCount} />;
  }

  return (
    <span className="inline-flex shrink-0 rounded-lg border border-zone-mentorship/25 bg-zone-mentorship/10 px-2 py-0.5 text-[10px] font-semibold text-zone-mentorship">
      {introBadgeLabel(mentor.introCallRate)}
    </span>
  );
}

function MentorCardPreview({ mentor, showPrice }: { mentor: Mentor; showPrice: boolean }) {
  const previewSkills = mentor.skills.slice(0, 2);

  return (
    <div className="grid h-full min-h-0 grid-rows-[minmax(0,1fr)_auto] overflow-hidden bg-bg-surface">
      <div className="relative min-h-0 overflow-hidden border-b border-border-custom/60">
        <ProfilePassportPhoto name={mentor.name} discipline={mentor.discipline} src={mentor.avatarUrl} />
        <div className="absolute start-2 top-2">
          <CardTrustBadge mentor={mentor} />
        </div>
      </div>
      <div className="px-3 py-3 text-center">
        <h3 className="capitalize font-semibold leading-tight text-text-main">{mentor.name}</h3>
        <p className="mt-1 line-clamp-2 text-xs font-medium text-text-muted">{mentor.headline}</p>
        {previewSkills.length > 0 && (
          <p className="mt-1.5 line-clamp-1 text-[10px] font-medium uppercase tracking-wide text-text-muted lg:hidden">
            {previewSkills.join(" · ")}
          </p>
        )}
        {showPrice && (
          <p className="mt-1.5 text-sm text-text-muted">
            From <span className="font-extrabold text-text-main">${mentor.monthlyRate}</span>/mo
          </p>
        )}
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
    <div className={hoverPanelClass}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="text-base font-bold capitalize text-text-main">{mentor.name}</h3>
          <p className="mt-0.5 text-xs font-medium tracking-wide text-text-muted">{mentor.headline}</p>
        </div>
        <CardTrustBadge mentor={mentor} />
      </div>

      {showPrice && (
        <p className="mt-2 text-sm text-text-muted">
          From <span className="font-extrabold text-text-main">${mentor.monthlyRate}</span>/mo
        </p>
      )}

      <div className="my-3 flex min-h-[40px] items-center rounded-r-xl border-l-2 border-zone-mentorship/30 bg-muted/60 py-2 pl-3 text-xs text-text-muted line-clamp-3">
        {bioText}
      </div>

      <div className="flex flex-wrap gap-1.5">
        {badgeItems.map((item) => (
          <span key={item.key} className={cn(pillClass, !item.uppercase && "normal-case tracking-normal")}>
            {item.icon}
            {item.label}
          </span>
        ))}
        {mentor.reviewCount === 0 && (
          <span className={pillClass}>New mentor</span>
        )}
        {mentor.verified && <span className={pillClass}>Verified</span>}
        {mentor.featured && <span className={pillClass}>Featured</span>}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-border-custom/60 pt-3">
        <p className="text-xs text-text-muted">View full profile</p>
        <span className="rounded-lg bg-zone-mentorship/10 p-1.5 text-zone-mentorship" aria-hidden>
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  );
}

export function MentorCard({ mentor, showPrice = true }: MentorCardProps) {
  return (
    <Link
      href={`/mentors/${mentor.slug}`}
      data-transition-title={mentor.name}
      data-transition-subtitle={mentor.headline}
      className="group block h-full overflow-hidden rounded-2xl border border-border-custom bg-bg-surface shadow-premium-card transition-all duration-300 hover:-translate-y-1 hover:shadow-zone-mentorship/5"
    >
      <PixelTransition
        fill
        gridSize={12}
        pixelColor={MOTION_COLORS.pixelReveal.primary}
        pixelColorAlt={MOTION_COLORS.pixelReveal.alternate}
        animationStepDuration={0.4}
        className="h-full w-full overflow-hidden rounded-2xl"
        firstContent={<MentorCardPreview mentor={mentor} showPrice={showPrice} />}
        secondContent={<MentorCardDetails mentor={mentor} showPrice={showPrice} />}
      />
    </Link>
  );
}
