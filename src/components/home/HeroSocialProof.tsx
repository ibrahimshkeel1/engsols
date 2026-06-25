import Link from "next/link";
import type { Mentor } from "@/types";
import type { PlatformStats } from "@/lib/data/stats";
import { MentorPortrait } from "@/components/ui/MentorPortrait";
import { pickMentorsForShowcase } from "@/lib/mentor-portrait";
import { cn } from "@/lib/utils";

type Props = {
  mentors: Mentor[];
  stats: PlatformStats;
  className?: string;
};

export function HeroSocialProof({ mentors, stats, className }: Props) {
  const faces = pickMentorsForShowcase(mentors, 5);

  if (faces.length === 0 && stats.mentorCount === 0) return null;

  const proofLine =
    stats.totalReviews > 0 && stats.avgRating
      ? `${stats.avgRating.toFixed(1)} avg rating across ${stats.totalReviews} review${stats.totalReviews === 1 ? "" : "s"}`
      : stats.mentorCount > 0
        ? `${stats.mentorCount}+ vetted engineer${stats.mentorCount === 1 ? "" : "s"} · ${stats.disciplineCount} disciplines`
        : null;

  return (
    <div className={cn("mt-8 flex flex-col items-center gap-3", className)}>
      {faces.length > 0 && (
        <div className="flex items-center -space-x-3 rtl:space-x-reverse">
          {faces.map((mentor) => (
            <Link
              key={mentor.slug}
              href={`/mentors/${mentor.slug}`}
              className="relative block h-11 w-11 overflow-hidden rounded-full ring-2 ring-oil-gas-ice transition-transform hover:z-10 hover:scale-110"
              title={mentor.name}
            >
              <MentorPortrait
                name={mentor.name}
                src={mentor.avatarUrl}
                className="h-full w-full rounded-full"
                sizes="44px"
              />
            </Link>
          ))}
        </div>
      )}
      {proofLine && <p className="text-caption text-oil-gas-navy-muted">{proofLine}</p>}
    </div>
  );
}
