"use client";

import Image from "next/image";
import Link from "next/link";
import { carouselReviews } from "@/data/mentorReviews";
import { mentors } from "@/data/mentors";
import { stats } from "@/data/stats";
import { Carousel, CarouselSlide } from "@/components/ui/carousel";
import { avatarUrl } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function TestimonialCarousel() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="text-center text-3xl font-bold text-foreground">
          Still not convinced? Don&apos;t just take our word for it
        </h2>
        <p className="mt-4 text-center text-muted-foreground">
          We&apos;ve delivered 1-on-1 mentorship to thousands of engineers. Average mentor rating:{" "}
          <span className="font-semibold text-foreground">{stats.averageRating} out of 5</span>.
        </p>
        <div className="mt-10 px-8">
          <Carousel autoplay autoplayDelay={7000} showDots>
            {carouselReviews.map((review) => {
              const mentor = mentors.find((m) => m.slug === review.mentorSlug);
              return (
                <CarouselSlide key={review.mentorSlug + review.menteeName}>
                  <Card className="mx-auto max-w-2xl">
                    <CardContent className="text-center">
                      <p className="text-lg text-foreground/90">
                        <Link href={`/mentors/${review.mentorSlug}`} className="font-semibold text-primary">
                          {review.mentorName}
                        </Link>{" "}
                        {review.text}
                      </p>
                      <div className="mt-4 flex items-center justify-center gap-3">
                        {mentor && (
                          <Image
                            src={avatarUrl(mentor.name)}
                            alt={mentor.name}
                            width={40}
                            height={40}
                            className="rounded-full"
                            unoptimized
                          />
                        )}
                        <div className="text-left text-sm">
                          <p className="font-medium text-foreground">{review.menteeName}</p>
                          <Badge>{review.category}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselSlide>
              );
            })}
          </Carousel>
        </div>
      </div>
    </section>
  );
}
