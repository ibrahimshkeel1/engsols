"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, ArrowRight, Star } from "lucide-react";
import type { Mentor } from "@/types";
import { featuredMentors } from "@/data/mentors";
import { disciplines } from "@/data/disciplines";
import { avatarUrl, cn } from "@/lib/utils";
import { getDisciplineColors } from "@/lib/discipline-colors";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const heroDisciplines = ["Oil & Gas", "Drilling Engineering", "Reservoir Engineering", "Mechanical", "Civil"];

function MiniMentorCard({ mentor }: { mentor: Mentor }) {
  const stripe = getDisciplineColors(mentor.discipline).stripe;
  return (
    <Link href={`/mentors/${mentor.slug}`} className="card-interactive group relative flex gap-4 overflow-hidden rounded-2xl border-white/10 bg-white/5 p-4">
      <div className={cn("absolute left-0 top-0 h-full w-1", stripe)} />
      <Image
        src={avatarUrl(mentor.name)}
        alt={mentor.name}
        width={56}
        height={56}
        className="shrink-0 rounded-xl ring-2 ring-white/20"
        unoptimized
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-primary">
          <Star className="h-3 w-3 fill-current" />
          <span className="text-xs font-semibold">{mentor.rating.toFixed(1)}</span>
        </div>
        <p className="truncate font-semibold text-white">{mentor.name}</p>
        <p className="truncate text-sm text-white/60">{mentor.headline}</p>
        <p className="mt-1 text-xs text-white/40">{mentor.company}</p>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 self-center text-white/40 opacity-0 transition group-hover:opacity-100" />
    </Link>
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
      <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-accent/30 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Engineering mentorship
            </p>
            <h1 className="font-display mt-4 text-4xl leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              Learn from engineers who&apos;ve done it
            </h1>
            <p className="text-muted-hero mt-5 max-w-lg text-lg leading-relaxed">
              1-on-1 guidance from reservoir, drilling, and applied engineering professionals — built for your career goals.
            </p>

            <form onSubmit={handleSearch} className="mt-8 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search mentors, skills, companies..."
                  className="h-12 border-white/10 bg-white/10 pl-11 text-white placeholder:text-white/40 focus-visible:ring-primary"
                />
              </div>
              <Button type="submit" variant="accent" size="lg" className="shrink-0">
                Search
              </Button>
            </form>

            <div className="mt-5 flex flex-wrap gap-2">
              {heroDisciplines.map((d) => (
                <Link
                  key={d}
                  href={`/mentors?discipline=${encodeURIComponent(d)}`}
                  className="rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/80 transition hover:border-primary/50 hover:bg-primary/10 hover:text-white"
                >
                  {d}
                </Link>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link href="/mentors" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                Find a mentor <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/apply" className="text-sm text-white/60 hover:text-white">
                Become a mentor →
              </Link>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/50">Featured mentors</p>
            {featuredMentors.slice(0, 3).map((m) => (
              <MiniMentorCard key={m.slug} mentor={m} />
            ))}
            <p className="pt-2 text-center text-sm text-white/40">
              {mentorCount}+ vetted mentors across {disciplines.length} disciplines
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
