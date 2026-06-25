import { GitCompareArrows, GraduationCap, Layers, ShieldCheck } from "lucide-react";
import Link from "next/link";

const PILLARS = [
  {
    icon: GraduationCap,
    title: "Built for engineers",
    body: "FE/PE prep, reservoir simulation, drilling ops — not generic career coaching.",
    href: "/disciplines/oil-and-gas",
  },
  {
    icon: GitCompareArrows,
    title: "Compare before you commit",
    body: "Save 2–3 mentors and compare side by side. No other mentorship marketplace does this.",
    href: "/mentors/compare",
  },
  {
    icon: Layers,
    title: "One career system",
    body: "Mentorship plus certifications, jobs, portfolios, and forum — not scattered tools.",
    href: "/how-it-works",
  },
  {
    icon: ShieldCheck,
    title: "Free intro, no lock-in",
    body: "Meet mentors before you pay. Cancel monthly plans anytime.",
    href: "/mentors?session=intro",
  },
] as const;

export function WhyEngSolsWins() {
  return (
    <section className="bg-bg-main/80 py-20 lg:py-28" aria-labelledby="why-engsols-heading">
      <div className="page-container-wide">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="why-engsols-heading" className="section-heading">
            Why engineers choose EngSols over generic mentorship
          </h2>
          <p className="text-body-lg mt-4 text-muted-foreground">
            Purpose-built for applied engineering careers — not generic coaching.
          </p>
        </div>

        <ul className="mx-auto mt-12 grid max-w-5xl gap-6 sm:grid-cols-2">
          {PILLARS.map((pillar) => (
            <li key={pillar.title}>
              <Link
                href={pillar.href}
                className="card-interactive group flex h-full flex-col rounded-2xl border border-border-custom bg-bg-surface p-6"
              >
                <pillar.icon className="h-6 w-6 text-zone-mentorship" aria-hidden />
                <h3 className="mt-4 text-lg font-semibold text-text-main group-hover:text-zone-mentorship">
                  {pillar.title}
                </h3>
                <p className="mt-2 flex-1 text-sm text-text-muted">{pillar.body}</p>
                <span className="mt-4 text-sm font-medium text-zone-mentorship">Learn more →</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
