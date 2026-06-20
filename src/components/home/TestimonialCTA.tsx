import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";
import type { FeaturedTestimonial } from "@/types";
import { getDisciplineColors } from "@/lib/discipline-colors";
import { Avatar } from "@/components/ui/Avatar";
import { AnimateIn } from "@/components/motion/AnimateIn";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TestimonialCTAProps = {
  testimonials: FeaturedTestimonial[];
  variant?: "social" | "closing";
};

export function TestimonialCTA({ testimonials, variant = "social" }: TestimonialCTAProps) {
  if (variant === "closing") {
    return (
      <section className="border-t border-border/60 bg-surface py-20 lg:py-28">
        <div className="page-container max-w-2xl text-center">
          <AnimateIn>
            <h2 className="text-display-lg">Your next career move starts with one conversation</h2>
            <p className="text-body-lg mx-auto mt-4 max-w-lg">
              Join engineers getting real guidance from professionals who have passed the exams, landed the roles, and
              solved the problems you are facing now.
            </p>
            <ButtonLink href="/mentors" size="lg" className="group mt-10">
              Find a mentor
              <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
            </ButtonLink>
          </AnimateIn>
        </div>
      </section>
    );
  }

  const featured = testimonials.slice(0, 2);

  if (featured.length === 0) return null;

  return (
    <section className="border-t border-border/60 py-16 lg:py-20">
      <div className="page-container-wide">
        <AnimateIn>
          <p className="section-label opacity-50">Outcomes</p>
          <h2 className="section-heading mt-3">Engineers who found their path</h2>
        </AnimateIn>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {featured.map((t) => {
            const stripe = getDisciplineColors(t.discipline).stripe;
            const profileHref = t.mentorSlug
              ? `/mentors/${t.mentorSlug}`
              : t.portfolioSlug
                ? `/portfolios/${t.portfolioSlug}`
                : null;

            return (
              <AnimateIn key={t.quote.slice(0, 40)}>
                <article className="card-elevated relative flex h-full flex-col overflow-hidden rounded-xl bg-card opacity-95">
                  <div className={cn("h-0.5 w-full", stripe)} />
                  <div className="flex flex-1 flex-col p-6">
                    <Quote className="h-4 w-4 text-muted-foreground/40" aria-hidden />
                    <blockquote className="text-body mt-3 flex-1">&ldquo;{t.quote}&rdquo;</blockquote>
                    <div className="mt-5 flex items-center gap-3 border-t border-border/60 pt-5">
                      <Avatar name={t.name} discipline={t.discipline} size="md" src={t.avatarUrl} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">{t.name}</p>
                        <p className="text-caption truncate">{t.role}</p>
                      </div>
                    </div>
                    {profileHref && (
                      <Link
                        href={profileHref}
                        className="text-caption mt-4 inline-flex items-center gap-1 text-primary hover:underline"
                      >
                        {t.mentorSlug ? "Meet their mentor" : "View portfolio"}
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </div>
                </article>
              </AnimateIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}
