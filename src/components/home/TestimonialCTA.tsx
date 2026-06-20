import Link from "next/link";
import { ArrowRight, Quote } from "lucide-react";
import type { FeaturedTestimonial } from "@/types";
import { getDisciplineColors } from "@/lib/discipline-colors";
import { Avatar } from "@/components/ui/Avatar";
import { DisciplineBadge } from "@/components/ui/DisciplineBadge";
import { AnimateIn, Stagger, StaggerItem } from "@/components/motion/AnimateIn";
import { ButtonLink } from "@/components/ui/button";
import { zoneTokens } from "@/lib/zone-tokens";
import { cn } from "@/lib/utils";

export function TestimonialCTA({ testimonials }: { testimonials: FeaturedTestimonial[] }) {
  return (
    <section className="section-spacing bg-surface">
      <div className="page-container-wide">
        <AnimateIn>
          <p className={zoneTokens.mentorship.sectionLabel}>Real outcomes</p>
          <h2 className="section-heading mt-3">Engineers who found their path</h2>
          <p className="text-body-lg mt-2 max-w-xl">
            Mentorship that leads somewhere — not generic career advice.
          </p>
        </AnimateIn>

        {testimonials.length > 0 && (
          <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => {
              const stripe = getDisciplineColors(t.discipline).stripe;
              const profileHref = t.mentorSlug
                ? `/mentors/${t.mentorSlug}`
                : t.portfolioSlug
                  ? `/portfolios/${t.portfolioSlug}`
                  : null;

              return (
                <StaggerItem key={t.quote.slice(0, 40)}>
                  <article className="card-elevated group relative flex h-full flex-col overflow-hidden rounded-xl bg-card">
                    <div className={cn("h-1 w-full", stripe)} />
                    <div className="flex flex-1 flex-col p-6">
                      <Quote className="h-5 w-5 text-zone-mentorship/40" aria-hidden />
                      <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-text-main">
                        &ldquo;{t.quote}&rdquo;
                      </blockquote>
                      <div className="mt-5 flex items-center gap-3 border-t border-border pt-5">
                        <Avatar name={t.name} discipline={t.discipline} size="md" src={t.avatarUrl} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-semibold text-text-main">{t.name}</p>
                          <p className="truncate text-xs text-text-muted">{t.role}</p>
                          <DisciplineBadge discipline={t.discipline} className="mt-1.5" />
                        </div>
                      </div>
                      {profileHref && (
                        <Link
                          href={profileHref}
                          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-zone-mentorship hover:underline"
                        >
                          {t.mentorSlug ? "Meet their mentor" : "View portfolio"}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      )}
                    </div>
                  </article>
                </StaggerItem>
              );
            })}
          </Stagger>
        )}

        <AnimateIn delay={0.15}>
          <div className="mt-12 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="flex flex-col items-start justify-center gap-6 p-8 sm:p-12 lg:max-w-2xl">
              <div>
                <h3 className="section-heading">Ready to start?</h3>
                <p className="text-body-lg mt-3">
                  Join engineers getting real guidance from professionals who have done the work.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <ButtonLink href="/mentors" size="lg">
                  Find a mentor
                </ButtonLink>
                <ButtonLink href="/apply" variant="secondary" size="lg">
                  Become a mentor
                </ButtonLink>
              </div>
            </div>
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
