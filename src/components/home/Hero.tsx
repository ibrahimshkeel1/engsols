"use client";

import { motion } from "framer-motion";
import { ArrowRight, Users } from "lucide-react";
import type { Mentor } from "@/types";
import { disciplines } from "@/data/disciplines";
import { usePrefersReducedMotion } from "@/lib/motion";
import { MentorCard } from "@/components/mentors/MentorCard";
import { ButtonLink } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

function MotionWrap({
  children,
  custom,
  reducedMotion,
  className,
}: {
  children: React.ReactNode;
  custom: number;
  reducedMotion: boolean;
  className?: string;
}) {
  if (reducedMotion) return <div className={className}>{children}</div>;
  return (
    <motion.div custom={custom} initial="hidden" animate="visible" variants={fadeUp} className={className}>
      {children}
    </motion.div>
  );
}

export function Hero({ mentorCount, featuredMentors }: { mentorCount: number; featuredMentors: Mentor[] }) {
  const reducedMotion = usePrefersReducedMotion();

  return (
    <section className="hero-zone-mentorship relative overflow-hidden">
      <div className="bg-grid absolute inset-0 opacity-20" />

      <div className="page-container-wide relative py-20 lg:py-28">
        <div className="grid items-start gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:gap-20">
          <div className="max-w-xl">
            <MotionWrap custom={0} reducedMotion={reducedMotion} className="section-label opacity-80">
              Engineering mentorship
            </MotionWrap>
            <MotionWrap custom={1} reducedMotion={reducedMotion} className="text-display-xl mt-5">
              Learn from engineers who&apos;ve <span className="accent-underline">done it</span>
            </MotionWrap>
            <MotionWrap custom={2} reducedMotion={reducedMotion} className="text-body-lg mt-5 max-w-md">
              1-on-1 guidance from professionals who&apos;ve built real careers in applied engineering.
            </MotionWrap>

            <MotionWrap custom={3} reducedMotion={reducedMotion} className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <ButtonLink href="/mentors" size="lg" className="group w-full sm:w-auto">
                Find a mentor
                <ArrowRight className="h-4 w-4 transition-transform duration-150 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5" />
              </ButtonLink>
              <ButtonLink href="/apply" variant="ghost" size="lg" className="w-full sm:w-auto">
                Become a mentor
              </ButtonLink>
            </MotionWrap>
          </div>

          {featuredMentors.length > 0 ? (
            <div className="hidden border-s border-border/50 ps-8 lg:block">
              <MotionWrap custom={4} reducedMotion={reducedMotion} className="section-label opacity-60">
                Featured mentors
              </MotionWrap>
              <MotionWrap custom={5} reducedMotion={reducedMotion} className="mt-4 space-y-2.5 opacity-90">
                {featuredMentors.slice(0, 3).map((m) => (
                  <MentorCard key={m.slug} mentor={m} variant="default" showPrice={false} />
                ))}
              </MotionWrap>
              <MotionWrap custom={6} reducedMotion={reducedMotion} className="text-caption mt-4 opacity-70">
                {mentorCount > 0 ? `${mentorCount}+ vetted mentors` : "Vetted mentors"} across {disciplines.length} disciplines
              </MotionWrap>
            </div>
          ) : (
            <div className="hidden lg:block">
              <div className="card-elevated rounded-xl p-8 text-center opacity-90">
                <Users className="mx-auto h-9 w-9 text-muted-foreground/70" aria-hidden />
                <p className="mt-4 font-medium">Mentors are joining EngSols</p>
                <p className="text-caption mt-2">
                  Browse disciplines or apply to be among the first mentors on the platform.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <ButtonLink href="/mentors">Browse mentors</ButtonLink>
                  <ButtonLink href="/apply" variant="secondary">
                    Become a mentor
                  </ButtonLink>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
