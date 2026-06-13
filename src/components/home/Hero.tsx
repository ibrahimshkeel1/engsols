"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Search, ArrowRight, Star } from "lucide-react";
import type { Mentor } from "@/types";
import { featuredMentors } from "@/data/mentors";
import { disciplines } from "@/data/disciplines";
import { cn } from "@/lib/utils";
import { getDisciplineColors } from "@/lib/discipline-colors";
import { Avatar } from "@/components/ui/Avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const heroDisciplines = ["Oil & Gas", "Drilling Engineering", "Reservoir Engineering", "Mechanical", "Civil"];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

function MiniMentorCard({ mentor, index }: { mentor: Mentor; index: number }) {
  const stripe = getDisciplineColors(mentor.discipline).stripe;
  return (
    <motion.div custom={index + 4} initial="hidden" animate="visible" variants={fadeUp}>
      <Link
        href={`/mentors/${mentor.slug}`}
        className="group relative flex gap-4 overflow-hidden rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-white/15"
      >
        <div className={cn("absolute left-0 top-0 h-full w-1", stripe)} />
        <Avatar name={mentor.name} discipline={mentor.discipline} size="md" className="ring-2 ring-white/20" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-primary">
            <Star className="h-3 w-3 fill-current" />
            <span className="text-xs font-semibold">{mentor.rating.toFixed(1)}</span>
          </div>
          <p className="truncate font-semibold text-white">{mentor.name}</p>
          <p className="truncate text-sm text-white/60">{mentor.headline}</p>
          <p className="mt-1 text-xs text-white/40">{mentor.company}</p>
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 self-center text-white/40 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary group-hover:opacity-100" />
      </Link>
    </motion.div>
  );
}

export function Hero({ mentorCount }: { mentorCount: number }) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = search.trim();
    router.push(q ? `/mentors?search=${encodeURIComponent(q)}` : "/mentors");
  }

  return (
    <section className="hero-dark relative overflow-hidden">
      <div className="bg-grid absolute inset-0 opacity-40" />
      <div className="animate-float absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-primary/15 blur-3xl" />
      <div className="animate-float-slow absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-accent/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <motion.p custom={0} initial="hidden" animate="visible" variants={fadeUp} className="section-label">
              Engineering mentorship
            </motion.p>
            <motion.h1 custom={1} initial="hidden" animate="visible" variants={fadeUp} className="font-display mt-4 text-4xl leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.5rem]">
              Learn from engineers who&apos;ve <span className="shimmer-text">done it</span>
            </motion.h1>
            <motion.p custom={2} initial="hidden" animate="visible" variants={fadeUp} className="text-muted-hero mt-5 max-w-lg text-lg leading-relaxed">
              1-on-1 guidance from reservoir, drilling, and applied engineering professionals — built for your career goals.
            </motion.p>

            <motion.form custom={3} initial="hidden" animate="visible" variants={fadeUp} onSubmit={handleSearch} className="mt-8 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search mentors, skills, companies..."
                  className="h-12 border-white/10 bg-white/10 pl-11 text-white backdrop-blur-sm placeholder:text-white/40 focus-visible:ring-primary"
                />
              </div>
              <Button type="submit" variant="accent" size="lg" className="shrink-0 active:scale-95">
                Search
              </Button>
            </motion.form>

            <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp} className="mt-5 flex flex-wrap gap-2">
              {heroDisciplines.map((d) => (
                <Link
                  key={d}
                  href={`/mentors?discipline=${encodeURIComponent(d)}`}
                  className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/80 backdrop-blur-sm transition-all duration-300 hover:border-primary/60 hover:bg-primary/15 hover:text-white"
                >
                  {d}
                </Link>
              ))}
            </motion.div>

            <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-6">
              <Link
                href="/mentors"
                className="group inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:brightness-110 active:scale-95"
              >
                Find a mentor
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/apply" className="text-sm text-white/60 transition-colors hover:text-white">
                Become a mentor →
              </Link>
            </motion.div>
          </div>

          <div className="space-y-3">
            <motion.p custom={3} initial="hidden" animate="visible" variants={fadeUp} className="text-xs font-semibold uppercase tracking-widest text-white/50">
              Featured mentors
            </motion.p>
            {featuredMentors.slice(0, 3).map((m, i) => (
              <MiniMentorCard key={m.slug} mentor={m} index={i} />
            ))}
            <motion.p custom={7} initial="hidden" animate="visible" variants={fadeUp} className="pt-2 text-center text-sm text-white/40">
              {mentorCount}+ vetted mentors across {disciplines.length} disciplines
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
