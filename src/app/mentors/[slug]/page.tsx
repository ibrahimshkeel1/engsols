import { notFound } from "next/navigation";
import { Award } from "lucide-react";
import { getMentorBySlug } from "@/lib/data/mentors";
import { getCurrentUser } from "@/lib/auth";
import { Avatar } from "@/components/ui/Avatar";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { MentorBookingCard } from "@/components/mentors/MentorBookingCard";
import { MentorRating } from "@/components/mentors/MentorRating";
import { MentorMobileBookBar } from "@/components/mentors/MentorMobileBookBar";
import { ButtonLink } from "@/components/ui/button";
import type { Mentor } from "@/types";

type PageProps = { params: Promise<{ slug: string }>; searchParams: Promise<{ session?: string }> };

export const revalidate = 60;

const OUTCOMES = [
  "Career roadmap clarity",
  "Exam preparation guidance",
  "Portfolio and CV feedback",
  "Weekly direction with monthly mentorship",
];

function mentorValueBullets(mentor: Mentor): string[] {
  const bullets: string[] = [];
  const goalText = mentor.goals.join(" ").toLowerCase();
  const skillText = mentor.skills.join(" ").toLowerCase();

  if (/fe|pe|exam|certif|study/.test(goalText) || /fe|pe|exam/.test(skillText)) {
    bullets.push("Helped engineers pass FE/PE exams and professional certifications");
  }

  if (mentor.discipline) {
    const fields = mentor.subFields.slice(0, 2).join(" and ");
    bullets.push(
      fields
        ? `${mentor.discipline} — ${fields} expertise`
        : `${mentor.discipline} and applied engineering expertise`,
    );
  }

  if (/portfolio|career|roadmap|hire/.test(goalText)) {
    bullets.push("Portfolio and career roadmap guidance");
  }

  for (const goal of mentor.goals) {
    if (bullets.length >= 4) break;
    const label = goal.replace(/-/g, " ");
    if (!bullets.some((b) => b.toLowerCase().includes(label))) {
      bullets.push(`Practical mentorship for ${label}`);
    }
  }

  if (bullets.length < 3 && mentor.skills.length > 0) {
    bullets.push(`Hands-on guidance in ${mentor.skills.slice(0, 2).join(" and ")}`);
  }

  return bullets.slice(0, 4);
}

function availabilityUrgency(mentor: Mentor): string {
  if (mentor.introSlotsThisWeek && mentor.introSlotsThisWeek > 0) {
    return `Next available slots: ${mentor.introSlotsThisWeek} intro opening${mentor.introSlotsThisWeek === 1 ? "" : "s"} this week`;
  }
  if (mentor.respondsWithinHours && mentor.respondsWithinHours <= 24) {
    return "Next available slots: Today / Tomorrow";
  }
  return "Limited weekly mentorship slots available";
}

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
  const testimonials = mentor.reviews.slice(0, 3);

  return (
    <div className="pb-24 lg:pb-12">
      {/* 1. Hero decision strip */}
      <section className="border-b border-border/60 bg-background">
        <div className="page-container-wide py-8 sm:py-10">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0 flex-1">
              <h1 className="text-display-lg">{mentor.name}</h1>
              <p className="text-body-lg mt-1 text-muted-foreground">{mentor.headline}</p>
              <div className="mt-4">
                <MentorRating rating={mentor.rating} reviewCount={mentor.reviewCount} />
              </div>
              <p className="text-body mt-3 text-muted-foreground">
                {mentor.yearsExperience}+ years · {mentor.discipline}
                {mentor.reviewCount > 0 ? ` · ${mentor.reviewCount} reviews` : ""}
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

      <div className="page-container-wide mx-auto max-w-3xl space-y-16 py-12 sm:space-y-20 sm:py-16">
        {/* 2. Value summary */}
        <section>
          <h2 className="section-heading">What you get</h2>
          <ul className="mt-4 list-disc space-y-2 ps-5 text-body text-muted-foreground">
            {valueBullets.map((bullet) => (
              <li key={bullet}>{bullet}</li>
            ))}
          </ul>
        </section>

        {/* 3. Booking options */}
        <section>
          <MentorBookingCard
            mentor={mentor}
            defaultName={user?.full_name ?? ""}
            defaultEmail={user?.email ?? ""}
            initialSession={session}
            isLoggedIn={!!user}
          />
        </section>

        {/* 4. Outcomes */}
        <section>
          <h2 className="section-heading">Outcomes</h2>
          <ul className="mt-4 list-disc space-y-2 ps-5 text-body text-muted-foreground">
            {OUTCOMES.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        {/* 5. Credibility */}
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

        {/* 6. Testimonials */}
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

        {/* 7. Availability / urgency */}
        <section className="rounded-lg border border-border/75 bg-muted/20 px-4 py-3 text-center">
          <p className="text-sm text-muted-foreground">{availabilityUrgency(mentor)}</p>
        </section>

        {/* 8. Final CTA */}
        <section className="border-t border-border/60 pt-12 text-center">
          <p className="text-display-lg text-balance">
            Move your career forward with {mentor.name.split(" ")[0]}.
          </p>
          <ButtonLink href="#booking-monthly" size="lg" className="mt-6">
            Book Mentorship
          </ButtonLink>
        </section>
      </div>

      <MentorMobileBookBar />
    </div>
  );
}
