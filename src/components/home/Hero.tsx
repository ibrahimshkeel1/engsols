"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ArrowRight, Users } from "lucide-react";
import type { Mentor } from "@/types";
import { disciplines } from "@/data/disciplines";
import { usePrefersReducedMotion } from "@/lib/motion";
import { MentorCard } from "@/components/mentors/MentorCard";
import { Input } from "@/components/ui/input";
import { Button, ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const heroDisciplines = ["Oil & Gas", "Drilling Engineering", "Reservoir Engineering", "Mechanical"];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
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
  const router = useRouter();
  const [search, setSearch] = useState("");
  const reducedMotion = usePrefersReducedMotion();

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = search.trim();
    router.push(q ? `/mentors?search=${encodeURIComponent(q)}` : "/mentors");
  }

  return (
    <section className="hero-zone-mentorship relative overflow-hidden">
      <div className="bg-grid absolute inset-0 opacity-30" />

      <div className="page-container-wide relative py-16 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <MotionWrap custom={0} reducedMotion={reducedMotion} className={cn("section-label", "section-label-zone-mentorship")}>
              Engineering mentorship
            </MotionWrap>
            <MotionWrap custom={1} reducedMotion={reducedMotion} className="text-display-xl mt-4">
              Learn from engineers who&apos;ve <span className="accent-underline">done it</span>
            </MotionWrap>
            <MotionWrap custom={2} reducedMotion={reducedMotion} className="text-body-lg mt-5 max-w-lg">
              1-on-1 guidance from reservoir, drilling, and applied engineering professionals — built for your career goals.
            </MotionWrap>

            <MotionWrap custom={3} reducedMotion={reducedMotion}>
              <form onSubmit={handleSearch} className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search mentors, skills, companies..."
                    className="h-11 border-border bg-card pl-10"
                  />
                </div>
                <Button type="submit" size="lg" className="w-full shrink-0 sm:w-auto">
                  Search
                </Button>
              </form>
            </MotionWrap>

            <MotionWrap custom={4} reducedMotion={reducedMotion} className="mt-4 flex flex-wrap gap-2">
              {heroDisciplines.map((d) => (
                <Link
                  key={d}
                  href={`/mentors?discipline=${encodeURIComponent(d)}`}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
                >
                  {d}
                </Link>
              ))}
            </MotionWrap>

            <MotionWrap custom={5} reducedMotion={reducedMotion} className="mt-10 flex flex-wrap items-center gap-4">
              <ButtonLink href="/mentors" size="lg" className="group">
                Find a mentor
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </ButtonLink>
              <ButtonLink href="/apply" variant="ghost" size="lg">
                Become a mentor →
              </ButtonLink>
            </MotionWrap>
          </div>

          {featuredMentors.length > 0 ? (
            <div>
              <MotionWrap custom={3} reducedMotion={reducedMotion} className="section-label section-label-zone-mentorship">
                Featured mentors
              </MotionWrap>
              <MotionWrap custom={4} reducedMotion={reducedMotion} className="mt-4 space-y-3">
                {featuredMentors.slice(0, 3).map((m) => (
                  <MentorCard key={m.slug} mentor={m} variant="default" showPrice={false} />
                ))}
              </MotionWrap>
              <MotionWrap custom={7} reducedMotion={reducedMotion} className="pt-4 text-center text-caption">
                {mentorCount > 0 ? `${mentorCount}+ vetted mentors` : "Vetted mentors"} across {disciplines.length} disciplines
              </MotionWrap>
            </div>
          ) : (
            <div className="card-elevated rounded-xl p-8 text-center">
              <Users className="mx-auto h-10 w-10 text-muted-foreground" aria-hidden />
              <p className="mt-4 text-lg font-medium">Mentors are joining EngSols</p>
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
          )}
        </div>
      </div>
    </section>
  );
}
