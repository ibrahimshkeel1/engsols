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
import { Button } from "@/components/ui/button";
import { ProfileBentoGrid } from "@/components/ui/ProfileBentoGrid";

const heroDisciplines = ["Oil & Gas", "Drilling Engineering", "Reservoir Engineering", "Mechanical", "Civil"];

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
    <section className="hero-dark relative overflow-hidden">
      <div className="bg-grid absolute inset-0 opacity-60" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <MotionWrap custom={0} reducedMotion={reducedMotion} className="section-label">
              Engineering mentorship
            </MotionWrap>
            <MotionWrap custom={1} reducedMotion={reducedMotion} className="font-display mt-4 text-4xl leading-[1.1] sm:text-5xl lg:text-[3.25rem]">
              Learn from engineers who&apos;ve <span className="accent-underline">done it</span>
            </MotionWrap>
            <MotionWrap custom={2} reducedMotion={reducedMotion} className="text-muted-hero mt-5 max-w-lg text-lg leading-relaxed">
              1-on-1 guidance from reservoir, drilling, and applied engineering professionals — built for your career goals.
            </MotionWrap>

            <MotionWrap custom={3} reducedMotion={reducedMotion}>
              <form onSubmit={handleSearch} className="mt-8 flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search mentors, skills, companies..."
                    className="h-11 border-border bg-card pl-10 shadow-sm"
                  />
                </div>
                <Button type="submit" variant="accent" size="lg" className="shrink-0">
                  Search
                </Button>
              </form>
            </MotionWrap>

            <MotionWrap custom={4} reducedMotion={reducedMotion} className="mt-5 flex flex-wrap gap-2">
              {heroDisciplines.map((d) => (
                <Link
                  key={d}
                  href={`/mentors?discipline=${encodeURIComponent(d)}`}
                  className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                >
                  {d}
                </Link>
              ))}
            </MotionWrap>

            <MotionWrap custom={5} reducedMotion={reducedMotion} className="mt-10 flex flex-wrap items-center gap-6">
              <Link
                href="/mentors"
                className="group inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Find a mentor
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link href="/apply" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Become a mentor →
              </Link>
            </MotionWrap>
          </div>

          {featuredMentors.length > 0 ? (
            <div>
              <MotionWrap custom={3} reducedMotion={reducedMotion} className="section-label">
                Featured mentors
              </MotionWrap>
              <MotionWrap custom={4} reducedMotion={reducedMotion} className="mt-3">
                <ProfileBentoGrid
                  className="sm:grid-cols-2 lg:grid-cols-2"
                  items={featuredMentors.slice(0, 3)}
                  getKey={(m) => m.slug}
                  isFeatured={(m) => m.featured}
                  renderCard={(m, variant) => <MentorCard mentor={m} variant={variant} showPrice={false} />}
                />
              </MotionWrap>
              <MotionWrap custom={7} reducedMotion={reducedMotion} className="pt-3 text-center text-sm text-muted-foreground">
                {mentorCount > 0 ? `${mentorCount}+ vetted mentors` : "Vetted mentors"} across {disciplines.length} disciplines
              </MotionWrap>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card p-8 text-center shadow-sm">
              <Users className="mx-auto h-10 w-10 text-muted-foreground" aria-hidden />
              <p className="mt-4 font-semibold">Mentors are joining EngSols</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Browse disciplines or apply to be among the first mentors on the platform.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <Link
                  href="/mentors"
                  className="inline-flex h-11 items-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground"
                >
                  Browse mentors
                </Link>
                <Link
                  href="/apply"
                  className="inline-flex h-11 items-center rounded-lg border border-border px-5 text-sm font-medium hover:bg-muted"
                >
                  Become a mentor
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
