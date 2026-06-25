import type { Mentor } from "@/types";
import type { PlatformStats } from "@/lib/data/stats";
import { Avatar } from "@/components/ui/Avatar";

type Props = {
  mentors: Mentor[];
  stats: PlatformStats;
};

export function HeroSocialProof({ mentors, stats }: Props) {
  const faces = mentors
    .filter((m) => m.avatarUrl || m.name)
    .slice(0, 5);

  if (faces.length === 0 && stats.mentorCount === 0) return null;

  const proofLine =
    stats.totalReviews > 0 && stats.avgRating
      ? `${stats.avgRating.toFixed(1)} avg rating across ${stats.totalReviews} review${stats.totalReviews === 1 ? "" : "s"}`
      : stats.mentorCount > 0
        ? `${stats.mentorCount}+ vetted engineer${stats.mentorCount === 1 ? "" : "s"} · ${stats.disciplineCount} disciplines`
        : null;

  return (
    <div className="mt-8 flex flex-col items-center gap-3">
      {faces.length > 0 && (
        <div className="flex items-center -space-x-2 rtl:space-x-reverse">
          {faces.map((mentor) => (
            <Avatar
              key={mentor.slug}
              name={mentor.name}
              discipline={mentor.discipline}
              src={mentor.avatarUrl}
              size="sm"
              className="ring-2 ring-oil-gas-navy"
            />
          ))}
        </div>
      )}
      {proofLine && (
        <p className="text-caption text-oil-gas-white">{proofLine}</p>
      )}
    </div>
  );
}
