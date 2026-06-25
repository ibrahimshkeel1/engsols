type PlatformStats = {
  mentorCount: number;
  disciplineCount: number;
  avgRating: number | null;
};

export function SocialProof({ stats }: { stats: PlatformStats }) {
  const items = [
    stats.mentorCount > 0 ? { value: `${stats.mentorCount}+`, label: "Mentors" } : { value: "—", label: "Mentors" },
    { value: String(stats.disciplineCount), label: "Disciplines" },
    { value: stats.avgRating ? stats.avgRating.toFixed(1) : "—", label: "Rating" },
    { value: "Free", label: "Intro calls" },
  ];

  return (
    <section aria-label="Platform metadata">
      <div className="page-container-wide py-5">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-center sm:gap-x-12">
          {items.map((s) => (
            <div key={s.label} className="text-caption text-muted-foreground">
              <span className="tabular-nums text-foreground/80">{s.value}</span> {s.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
