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
      : { value: "—", label: "Vetted mentors" },
    { value: String(stats.disciplineCount), label: "Engineering disciplines" },
    { value: "Free", label: "Intro calls" },
    stats.avgRating
      ? { value: stats.avgRating.toFixed(1), label: "Avg. mentor rating" }
      : { value: "—", label: "Avg. mentor rating" },
  ];

  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-border sm:grid-cols-4 sm:divide-y-0">
        {items.map((s, i) => (
          <AnimateIn key={s.label} delay={i * 0.08} y={16}>
            <div className="px-6 py-8 text-center sm:py-10">
              <p className="font-display text-3xl sm:text-4xl">{s.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          </AnimateIn>
        ))}
      </div>
    </section>
  );
}
