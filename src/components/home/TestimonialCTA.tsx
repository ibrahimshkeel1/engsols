import type { FeaturedTestimonial } from "@/types";
import { ButtonLink } from "@/components/ui/button";

type TestimonialCTAProps = {
  testimonials: FeaturedTestimonial[];
  variant?: "social" | "closing";
};

export function TestimonialCTA({ testimonials, variant = "social" }: TestimonialCTAProps) {
  if (variant === "closing") {
    return (
      <section className="bg-background py-20 lg:py-28">
        <div className="page-container mx-auto max-w-xl text-center">
          <p className="text-display-lg text-balance">
            Your next career move starts with one conversation.
          </p>
          <ButtonLink href="/mentors" size="lg" className="mt-8">
            Find a Mentor
          </ButtonLink>
        </div>
      </section>
    );
  }

  const featured = testimonials.slice(0, 3);
  if (featured.length === 0) return null;

  return (
    <section className="border-b border-border/60 py-16 lg:py-20">
      <div className="page-container-wide mx-auto max-w-3xl">
        <h2 className="section-heading text-center sm:text-start">What engineers say</h2>
        <ul className="mt-8 flex flex-col gap-8">
          {featured.map((t) => (
            <li key={t.quote.slice(0, 48)}>
              <blockquote className="text-body-lg border-s-2 border-border-custom ps-4 text-pretty text-text-muted">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <p className="text-caption mt-3 text-muted-foreground">
                {t.name} — {t.role}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
