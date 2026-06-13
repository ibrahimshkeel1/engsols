import { featuredTestimonial } from "@/data/testimonials";
import { stats } from "@/data/stats";

export function StatsQuote() {
  return (
    <section className="bg-foreground py-16 text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-3xl font-bold text-amber-400">{stats.mentors}</p>
              <p className="mt-1 text-sm text-muted-foreground">Available mentors</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-amber-400">{stats.matches}</p>
              <p className="mt-1 text-sm text-muted-foreground">Matches made</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-amber-400">{stats.countries}</p>
              <p className="mt-1 text-sm text-muted-foreground">Countries represented</p>
            </div>
          </div>
          <blockquote className="rounded-xl border border-border bg-card p-6">
            <p className="text-lg leading-relaxed text-slate-100">
              &ldquo;{featuredTestimonial.quote}&rdquo;
            </p>
            <footer className="mt-4 text-sm text-muted-foreground">
              — {featuredTestimonial.menteeName}, {featuredTestimonial.menteeRole} at{" "}
              {featuredTestimonial.menteeCompany}
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
