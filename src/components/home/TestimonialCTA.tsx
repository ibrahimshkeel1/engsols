import Link from "next/link";
import type { FeaturedTestimonial } from "@/types";
import { ButtonLink } from "@/components/ui/button";
import { MentorPortrait } from "@/components/ui/MentorPortrait";
import { resolvePortraitUrl } from "@/lib/mentor-portrait";

type TestimonialCTAProps = {
  testimonials: FeaturedTestimonial[];
  variant?: "social" | "closing";
};

function TestimonialCard({ testimonial }: { testimonial: FeaturedTestimonial }) {
  const menteePhoto = resolvePortraitUrl(testimonial.name, testimonial.avatarUrl, "mentee", 256);

  return (
    <article className="flex gap-4 rounded-2xl border border-border-custom bg-bg-surface p-5 shadow-premium-card">
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={menteePhoto} alt={testimonial.name} className="h-full w-full object-cover object-top" />
      </div>
      <div className="min-w-0">
        <blockquote className="text-body text-pretty text-text-muted">&ldquo;{testimonial.quote}&rdquo;</blockquote>
        <p className="text-caption mt-3 font-medium text-foreground">
          {testimonial.name}
          <span className="font-normal text-muted-foreground"> — {testimonial.role}</span>
        </p>
        {testimonial.mentorSlug && (
          <Link href={`/mentors/${testimonial.mentorSlug}`} className="text-caption mt-1 inline-block text-zone-mentorship hover:underline">
            View their mentor →
          </Link>
        )}
      </div>
    </article>
  );
}

export function TestimonialCTA({ testimonials, variant = "social" }: TestimonialCTAProps) {
  if (variant === "closing") {
    const featured = testimonials[0];
    return (
      <section className="bg-background py-20 lg:py-28">
        <div className="page-container mx-auto max-w-xl text-center">
          {featured && (
            <div className="mx-auto max-w-lg text-start">
              <TestimonialCard testimonial={featured} />
            </div>
          )}
          <p className="text-display-lg mt-10 text-balance">
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
    <section className="py-16 lg:py-20">
      <div className="page-container-wide mx-auto max-w-5xl">
        <h2 className="section-heading text-center sm:text-start">What engineers say</h2>
        <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((t, index) => (
            <li key={`${t.name}-${index}`} className={featured.length === 3 ? "last:md:col-span-2 last:lg:col-span-1" : ""}>
              <TestimonialCard testimonial={t} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
