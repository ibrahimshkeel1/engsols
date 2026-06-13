import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { featuredMentors } from "@/data/mentors";
import { Carousel, CarouselSlide } from "@/components/ui/carousel";
import { avatarUrl } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export function PricingCarousel() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="text-center text-3xl font-bold text-foreground">
          Industry veterans and mentoring packages at a flexible price
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-muted-foreground">
          Pick from a curated collection of mentors. Try them with no obligation. Move to a
          low-cost monthly subscription when you&apos;re ready — no lock-ins, no hidden fees.
        </p>
        <div className="mt-10 px-8">
          <Carousel autoplay autoplayDelay={6000}>
            {featuredMentors.map((mentor) => (
              <CarouselSlide key={mentor.slug} className="px-2">
                <Card className="h-full">
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <Image
                        src={avatarUrl(mentor.name)}
                        alt={mentor.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                        unoptimized
                      />
                      <div>
                        <p className="font-semibold text-foreground">{mentor.name}</p>
                        <p className="text-sm text-muted-foreground">{mentor.headline} at {mentor.company}</p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {mentor.skills.slice(0, 3).map((s) => (
                        <Badge key={s}>{s}</Badge>
                      ))}
                    </div>
                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground">Starting from</p>
                        <p className="text-xl font-bold text-foreground">${mentor.monthlyRate}<span className="text-sm font-normal">/month</span></p>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-sm font-medium">{mentor.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <Link href={`/mentors/${mentor.slug}`} className="mt-3 inline-block text-sm font-medium text-primary">
                      View profile →
                    </Link>
                  </CardContent>
                </Card>
              </CarouselSlide>
            ))}
          </Carousel>
        </div>
      </div>
    </section>
  );
}
