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
    <section className="bg-gradient-to-b from-slate-50 to-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <Badge className="mb-4 bg-amber-100 text-amber-800">1-on-1 Mentorship</Badge>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            What do you want to achieve next?
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Get practical guidance from a mentor who has already done it.
          </p>
          <p className="mt-6 min-h-[2rem] text-xl font-medium text-amber-600 transition-opacity">
            {goals[goalIndex].heroText}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {heroGoals.map((goal) => (
              <Link
                key={goal.id}
                href={`/mentors?goal=${goal.id}`}
                className="rounded-full border border-slate-300 bg-white px-4 py-1.5 text-sm text-slate-700 hover:border-amber-400 hover:bg-amber-50"
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
