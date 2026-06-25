import Link from "next/link";
import { disciplines } from "@/data/disciplines";
import { disciplineToSlug } from "@/lib/discipline-slug";
import { getDisciplineColors } from "@/lib/discipline-colors";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Engineering disciplines | EngSols",
  description: "Browse mentors, forum threads, certifications, and jobs by engineering discipline.",
};

export default function DisciplinesIndexPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <SectionReveal>
        <p className="section-label">Explore by field</p>
        <h1 className="hero-dot-text mt-1 text-balance">Engineering disciplines</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Jump into a discipline hub for mentors, discussions, certifications, jobs, and live sessions.
        </p>
      </SectionReveal>

      <SectionReveal className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" delay={0.08}>
        {disciplines.map((discipline) => {
          const slug = disciplineToSlug(discipline);
          const stripe = getDisciplineColors(discipline).stripe;
          return (
            <Link
              key={slug}
              href={`/disciplines/${slug}`}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/30"
            >
              <div className={cn("absolute inset-x-0 top-0 h-1", stripe)} />
              <p className="font-semibold group-hover:text-primary">{discipline}</p>
              <p className="mt-1 text-sm text-muted-foreground">Mentors · forum · certs · jobs</p>
            </Link>
          );
        })}
      </SectionReveal>
    </div>
  );
}
