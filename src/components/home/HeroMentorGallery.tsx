import Link from "next/link";
import type { Mentor } from "@/types";
import { MentorPortrait } from "@/components/ui/MentorPortrait";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { MentorRating } from "@/components/mentors/MentorRating";
import { introBadgeLabel } from "@/lib/mentor-display";
import { pickMentorsForShowcase } from "@/lib/mentor-portrait";
import { cn } from "@/lib/utils";

const CARD_OFFSETS = [
  "start-0 top-8 z-10 rotate-[-4deg]",
  "start-24 top-0 z-20 rotate-[2deg]",
  "start-48 top-12 z-30 rotate-[-2deg]",
] as const;

type Props = {
  mentors: Mentor[];
  className?: string;
};

export function HeroMentorMobileStrip({ mentors, className }: Props) {
  const showcase = pickMentorsForShowcase(mentors, 4);
  if (showcase.length === 0) return null;

  return (
    <div className={cn("min-w-0 max-w-full", className)}>
      <p className="text-caption mb-3 font-medium text-oil-gas-navy-muted">Meet our mentors</p>
      <ul className="scrollbar-none -mx-1 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-1 pb-2">
        {showcase.map((mentor) => (
          <li key={mentor.slug} className="w-[9.5rem] shrink-0 snap-start">
            <Link
              href={`/mentors/${mentor.slug}`}
              className="block overflow-hidden rounded-2xl border border-border-custom bg-bg-surface shadow-premium-card"
            >
              <MentorPortrait name={mentor.name} src={mentor.avatarUrl} className="aspect-[3/4] w-full" />
              <p className="truncate px-2 py-2 text-xs font-semibold capitalize">{mentor.name}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HeroMentorGallery({ mentors }: Props) {
  const showcase = pickMentorsForShowcase(mentors, 3);
  if (showcase.length === 0) return null;

  return (
    <div className="relative mx-auto hidden h-[min(28rem,70vh)] w-full max-w-md lg:block">
      <p className="text-caption mb-4 font-medium text-oil-gas-navy-muted">Vetted mentors ready for a free intro</p>
      <div className="relative h-[22rem] w-full">
        {showcase.map((mentor, index) => (
          <Link
            key={mentor.slug}
            href={`/mentors/${mentor.slug}`}
            className={cn(
              "absolute w-[11.5rem] overflow-hidden rounded-2xl border border-border-custom bg-bg-surface shadow-premium-card transition-transform duration-300 hover:z-40 hover:scale-[1.03] hover:shadow-lg",
              CARD_OFFSETS[index] ?? CARD_OFFSETS[0],
            )}
          >
            <MentorPortrait
              name={mentor.name}
              src={mentor.avatarUrl}
              className="aspect-[3/4] w-full"
              priority={index === 1}
            />
            <div className="space-y-1.5 p-3">
              <div className="flex items-start justify-between gap-2">
                <p className="truncate text-sm font-semibold capitalize text-text-main">{mentor.name}</p>
                <CompanyLogo company={mentor.company} size="sm" />
              </div>
              <p className="line-clamp-2 text-[11px] leading-snug text-text-muted">{mentor.headline}</p>
              <div className="flex flex-wrap items-center gap-2 text-[10px] text-text-muted">
                {mentor.reviewCount > 0 ? (
                  <MentorRating rating={mentor.rating} reviewCount={mentor.reviewCount} size="sm" />
                ) : (
                  <span className="font-semibold text-zone-mentorship">
                    {introBadgeLabel(mentor.introCallRate)}
                  </span>
                )}
                <span>From ${mentor.monthlyRate}/mo</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
