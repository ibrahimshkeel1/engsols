export function SocialProof() {
  const stats = [
    { value: "22+", label: "Vetted mentors" },
    { value: "16", label: "Engineering disciplines" },
    { value: "Free", label: "Intro calls" },
    { value: "4.9", label: "Avg. mentor rating" },
  ];

  return (
    <section className="border-b border-border bg-surface">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-border sm:grid-cols-4 sm:divide-y-0">
        {stats.map((s) => (
          <div key={s.label} className="px-6 py-8 text-center sm:py-10">
            <p className="font-display text-3xl text-primary sm:text-4xl">{s.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
