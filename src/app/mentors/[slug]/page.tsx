import { notFound } from "next/navigation";
import { Award } from "lucide-react";
import { getMentorBySlug } from "@/lib/data/mentors";
import { getCurrentUser } from "@/lib/auth";
import { Avatar } from "@/components/ui/Avatar";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { MentorBookingCard } from "@/components/mentors/MentorBookingCard";
import { MentorRating } from "@/components/mentors/MentorRating";
import { MentorTrustBar } from "@/components/mentors/MentorTrustBar";
import { MentorMobileBookBar } from "@/components/mentors/MentorMobileBookBar";
import { ButtonLink } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JsonLd } from "@/components/seo/JsonLd";
import { mentorJsonLd } from "@/lib/seo/json-ld";
import {
  availabilityUrgency,
  formatIntroCallPrice,
  introBadgeLabel,
  mentorOutcomes,
  mentorValueBullets,
} from "@/lib/mentor-display";

type PageProps = { params: Promise<{ slug: string }>; searchParams: Promise<{ session?: string }> };

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const mentor = await getMentorBySlug(slug);
  if (!mentor) return { title: "Mentor not found" };
  return {
    title: `${mentor.name} — ${mentor.headline} | EngSols`,
    description: mentor.bio.slice(0, 160),
    openGraph: {
      title: mentor.name,
      description: mentor.headline,
      type: "profile",
    },
    twitter: { card: "summary_large_image", title: mentor.name, description: mentor.headline },
  };
}

export default async function MentorProfilePage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { session } = await searchParams;
  const mentor = await getMentorBySlug(slug);
  if (!mentor) notFound();

  const user = await getCurrentUser();
  const valueBullets = mentorValueBullets(mentor);
  const outcomes = mentorOutcomes(mentor);
  const testimonials = mentor.reviews.slice(0, 3);
  const introPrice = formatIntroCallPrice(mentor.introCallRate);

  return (
    <div className="pb-24 lg:pb-12">
      <JsonLd
        data={mentorJsonLd({
          name: mentor.name,
          slug: mentor.slug,
          headline: mentor.headline,
          bio: mentor.bio,
          company: mentor.company,
          discipline: mentor.discipline,
          rating: mentor.rating,
          reviewCount: mentor.reviewCount,
        })}
      />

      <section className="border-b border-border/60 bg-background">
        <div className="page-container-wide py-8 sm:py-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-zone-mentorship/10 text-zone-mentorship">
                  {introBadgeLabel(mentor.introCallRate)}
                </Badge>
                {mentor.reviewCount === 0 && (
                  <Badge className="border border-border bg-transparent text-muted-foreground">
                    New mentor
                  </Badge>
                )}
              </div>
              <h1 className="text-display-lg mt-3">{mentor.name}</h1>
              <p className="text-body-lg mt-1 text-muted-foreground">{mentor.headline}</p>
              <div className="mt-4">
                <MentorRating rating={mentor.rating} reviewCount={mentor.reviewCount} />
              </div>
              <p className="text-body mt-3 text-muted-foreground">
                {mentor.yearsExperience}+ years · {mentor.discipline}
                {mentor.reviewCount > 0 ? ` · ${mentor.reviewCount} reviews` : ""}
              </p>
              <p className="text-body mt-2 font-semibold text-foreground">
                From ${mentor.monthlyRate}/mo · Intro {introPrice}
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 lg:shrink-0 lg:items-end">
              <Avatar
                name={mentor.name}
                discipline={mentor.discipline}
                size="2xl"
                className="rounded-2xl ring-2 ring-border"
                src={mentor.avatarUrl}
              />
              <div className="flex w-full flex-col gap-2 sm:flex-row lg:w-56 lg:flex-col">
                <ButtonLink href="#booking-options" size="lg" className="w-full">
                  Book Session
                </ButtonLink>
                <ButtonLink href="#booking-monthly" variant="secondary" size="lg" className="w-full">
                  Start Monthly Mentorship
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="page-container-wide py-12 sm:py-16">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-12">
          <div className="min-w-0 space-y-16 sm:space-y-20">
            <section>
              <h2 className="section-heading">What you get</h2>
              <ul className="mt-4 list-disc space-y-2 ps-5 text-body text-muted-foreground">
                {valueBullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            </section>

            <section className="lg:hidden">
              <MentorBookingCard
                mentor={mentor}
                defaultName={user?.full_name ?? ""}
                defaultEmail={user?.email ?? ""}
                initialSession={session}
                isLoggedIn={!!user}
              />
            </section>

            <section>
              <h2 className="section-heading">About {mentor.name.split(" ")[0]}</h2>
              <p className="text-body mt-4 whitespace-pre-line text-muted-foreground">{mentor.bio}</p>
            </section>

            <section>
              <h2 className="section-heading">Outcomes</h2>
              <ul className="mt-4 list-disc space-y-2 ps-5 text-body text-muted-foreground">
                {outcomes.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="section-heading">Background</h2>
              <ul className="mt-4 space-y-3 text-body text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CompanyLogo company={mentor.company} size="sm" />
                  <span>
                    {mentor.company} · {mentor.yearsExperience} years in {mentor.discipline}
                  </span>
                </li>
                <li>{mentor.headline}</li>
                {mentor.credentials.length > 0 && (
                  <li className="flex flex-wrap gap-2 pt-1">
                    {mentor.credentials.slice(0, 4).map((c) => (
                      <span
                        key={c}
                        className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-medium"
                      >
                        <Award className="h-3 w-3" aria-hidden />
                        {c}
                      </span>
                    ))}
                  </li>
                )}
              </ul>
            </section>

            {testimonials.length > 0 && (
              <section>
                <h2 className="section-heading">What engineers say</h2>
                <ul className="mt-6 flex flex-col gap-6">
                  {testimonials.map((review) => (
                    <li key={review.author + review.text.slice(0, 24)}>
                      <blockquote className="text-body border-s-2 border-border-custom ps-4 text-muted-foreground">
                        &ldquo;{review.text}&rdquo;
                      </blockquote>
                      <p className="text-caption mt-2 text-muted-foreground">
                        — {review.author}, {review.role}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <section className="rounded-lg border border-border/75 bg-muted/20 px-4 py-3 text-center">
              <p className="text-sm text-muted-foreground">{availabilityUrgency(mentor)}</p>
            </section>

            <section className="border-t border-border/60 pt-12 text-center lg:text-start">
              <p className="text-display-lg text-balance">
                Move your career forward with {mentor.name.split(" ")[0]}.
              </p>
              <ButtonLink href="#booking-monthly" size="lg" className="mt-6">
                Book Mentorship
              </ButtonLink>
            </section>
          </div>

          <aside className="hidden lg:sticky lg:top-24 lg:block">
            <MentorTrustBar compact />
            <MentorBookingCard
              mentor={mentor}
              defaultName={user?.full_name ?? ""}
              defaultEmail={user?.email ?? ""}
              initialSession={session}
              isLoggedIn={!!user}
              variant="sidebar"
            />
          </aside>
        </div>
      </div>

      <MentorMobileBookBar />
    </div>
  );
}
