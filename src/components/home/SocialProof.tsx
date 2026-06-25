import type { PlatformStats } from "@/lib/data/stats";

type SocialProofItem = {
  id: string;
  value: string;
  label: string;
};

export function buildSocialProofItems(stats: PlatformStats): SocialProofItem[] {
  const items: SocialProofItem[] = [
    {
      id: "mentor-count",
      value: stats.mentorCount > 0 ? `${stats.mentorCount}+` : "—",
      label: "Mentors",
    },
    {
      id: "disciplines",
      value: String(stats.disciplineCount),
      label: "Disciplines",
    },
  ];

  if (stats.avgRating && stats.totalReviews > 0) {
    items.push({
      id: "rating",
      value: stats.avgRating.toFixed(1),
      label: `Rating (${stats.totalReviews})`,
    });
  } else {
    items.push({ id: "intro-calls", value: "Free", label: "Intro calls" });
  }

  if (stats.freeIntroCount > 0) {
    items.push({
      id: "free-intros",
      value: String(stats.freeIntroCount),
      label: "Free intros",
    });
  }

  if (stats.verifiedMentorCount > 0) {
    items.push({
      id: "verified",
      value: String(stats.verifiedMentorCount),
      label: "Verified",
    });
  } else if (stats.mentorCount >= 2) {
    items.push({ id: "compare", value: "↔", label: "Compare mentors" });
  }

  return items;
}

export function SocialProof({ stats }: { stats: PlatformStats }) {
  const items = buildSocialProofItems(stats);

  return (
    <section aria-label="Platform metadata" className="border-b border-border/60">
      <div className="page-container-wide min-w-0 py-4 sm:py-5">
        <div className="grid min-w-0 grid-cols-2 gap-x-3 gap-y-2.5 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-8 sm:gap-y-2">
          {items.map((s) => (
            <div key={s.id} className="min-w-0 text-center text-caption text-muted-foreground">
              <span className="tabular-nums font-medium text-foreground/90">{s.value}</span>{" "}
              <span className="break-words">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
