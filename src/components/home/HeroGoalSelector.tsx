"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { goals } from "@/data/goals";
import { featuredMentors } from "@/data/mentors";
import { Carousel, CarouselSlide } from "@/components/ui/carousel";
import { MentorCard } from "@/components/mentors/MentorCard";
import { Badge } from "@/components/ui/badge";

const heroGoals = goals.filter((g) =>
  ["first-job", "ace-interviews", "switch-discipline", "lead-teams", "fe-pe", "oil-gas"].includes(g.id),
);

export function HeroGoalSelector() {
  const [goalIndex, setGoalIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setGoalIndex((i) => (i + 1) % goals.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="gradient-hero py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <Badge className="mb-4 bg-primary/15 text-primary">1-on-1 Mentorship</Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            What do you want to achieve next?
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Get practical guidance from a mentor who has already done it.
          </p>
          <p className="mt-6 min-h-[2rem] text-xl font-medium text-primary transition-opacity">
            {goals[goalIndex].heroText}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {heroGoals.map((goal) => (
              <Link
                key={goal.id}
                href={`/mentors?goal=${goal.id}`}
                className="rounded-full border border-border bg-card px-4 py-1.5 text-sm text-foreground transition hover:border-primary hover:bg-primary/10"
              >
                {goal.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-12 px-8">
          <Carousel autoplay autoplayDelay={5000}>
            {featuredMentors.map((mentor) => (
              <CarouselSlide key={mentor.slug} className="px-2">
                <MentorCard mentor={mentor} />
              </CarouselSlide>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
}
