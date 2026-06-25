import type { PlatformStats } from "@/lib/data/stats";

export function SocialProof({ stats }: { stats: PlatformStats }) {
  const items = [
    stats.mentorCount > 0
      ? { value: `${stats.mentorCount}+`, label: "Mentors" }
      : { value: "—", label: "Mentors" },
    { value: String(stats.disciplineCount), label: "Disciplines" },
    stats.avgRating && stats.totalReviews > 0
      ? { value: stats.avgRating.toFixed(1), label: `Rating (${stats.totalReviews})` }
      : { value: "Free", label: "Intro calls" },
    stats.freeIntroCount > 0
      ? { value: String(stats.freeIntroCount), label: "Free intros" }
      : { value: "Free", label: "Intro calls" },
    stats.verifiedMentorCount > 0
      ? { value: String(stats.verifiedMentorCount), label: "Verified" }
      : { value: "Compare", label: "Mentors" },
  ];

  return (
    <section aria-label="Platform metadata" className="border-b border-border/60">
      <div className="page-container-wide py-5">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-center sm:gap-x-12">
          {items.map((s) => (
            <div key={s.label} className="text-caption text-muted-foreground">
              <span className="tabular-nums font-medium text-foreground/90">{s.value}</span> {s.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
