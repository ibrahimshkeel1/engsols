import { AnimateIn } from "@/components/motion/AnimateIn";

type PlatformStats = {
  mentorCount: number;
  disciplineCount: number;
  avgRating: number | null;
};

export function SocialProof({ stats }: { stats: PlatformStats }) {
  const items = [
    stats.mentorCount > 0
      ? { value: `${stats.mentorCount}+`, label: "Vetted mentors" }
      : null,
    { value: String(stats.disciplineCount), label: "Disciplines" },
    stats.avgRating ? { value: stats.avgRating.toFixed(1), label: "Avg. rating" } : null,
    { value: "Free", label: "Intro calls" },
  ].filter(Boolean) as { value: string; label: string }[];

  return (
    <section className="border-b border-border/60 bg-muted/20" aria-label="Platform activity">
      <div className="page-container-wide">
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 py-6 sm:justify-start sm:gap-x-14 sm:py-8">
          {items.map((s, i) => (
            <AnimateIn key={s.label} delay={i * 0.05} y={8}>
              <div className="text-center sm:text-start">
                <p className="text-lg font-medium tabular-nums text-foreground sm:text-xl">{s.value}</p>
                <p className="text-caption mt-0.5 opacity-80">{s.label}</p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
