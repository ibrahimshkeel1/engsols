import { notFound } from "next/navigation";
import { Award, BadgeCheck, Calendar } from "lucide-react";
import { getSimilarMentors } from "@/lib/filter-mentors";
import { getApprovedMentors, getMentorBySlug } from "@/lib/data/mentors";
import { getCurrentUser } from "@/lib/auth";
import { isMentorSaved } from "@/lib/data/saved-mentors";
import { getDisciplineColors } from "@/lib/discipline-colors";
import { Avatar } from "@/components/ui/Avatar";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { DisciplineBadge } from "@/components/ui/DisciplineBadge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MentorBookingCard } from "@/components/mentors/MentorBookingCard";
import { MentorIntroVideo } from "@/components/mentors/MentorIntroVideo";
import { MentorRating } from "@/components/mentors/MentorRating";
import { MentorReviewForm } from "@/components/mentor/MentorReviewForm";
import { MentorStudentQuestions } from "@/components/mentors/MentorStudentQuestions";
import { SaveMentorButton } from "@/components/mentor/SaveMentorButton";
import { SimilarMentors } from "@/components/mentors/SimilarMentors";
import { MentorAvailabilityBadges } from "@/components/mentors/MentorAvailabilityBadges";
import { MentorMobileBookBar } from "@/components/mentors/MentorMobileBookBar";
import { ContentCrossLinks } from "@/components/shared/ContentCrossLinks";
import { ShareButton } from "@/components/shared/ShareButton";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

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

  const [allMentors, user] = await Promise.all([getApprovedMentors(), getCurrentUser()]);
  const saved = user ? await isMentorSaved(user.id, slug) : false;
  const similar = getSimilarMentors(allMentors, mentor);
  const stripe = getDisciplineColors(mentor.discipline).stripe;

  return (
    <div>
      <section className="hero-dark relative overflow-hidden">
        <div className={cn("absolute inset-x-0 top-0 h-1", stripe)} />
        <div className="bg-grid absolute inset-0 opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
            <Avatar name={mentor.name} discipline={mentor.discipline} size="2xl" className="shrink-0 rounded-2xl ring-4 ring-border" src={mentor.avatarUrl} />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div className="flex flex-wrap items-center gap-3">
                <MentorRating rating={mentor.rating} reviewCount={mentor.reviewCount} />
                {mentor.featured && <Badge className="bg-primary/10 text-primary">Featured mentor</Badge>}
                {mentor.verified && (
                  <Badge className="bg-blue-500/10 text-blue-700 dark:text-blue-300">
                    <BadgeCheck className="mr-1 h-3 w-3" /> Verified
                  </Badge>
                )}
                {user && <SaveMentorButton mentorSlug={slug} initialSaved={saved} />}
                <ShareButton title={`${mentor.name} on EngSols`} text={mentor.headline} />
              </div>
              <h1 className="font-display text-4xl sm:text-5xl">{mentor.name}</h1>
              <p className="mt-2 text-xl text-muted-foreground">{mentor.headline}</p>
              <MentorAvailabilityBadges mentor={mentor} />
              <div className="mt-2 flex flex-wrap items-center gap-3 text-muted-foreground">
                <CompanyLogo company={mentor.company} />
                <span>{mentor.company}</span>
                <span>·</span>
                <span>{mentor.yearsExperience} years experience</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <DisciplineBadge discipline={mentor.discipline} />
                {mentor.credentials.map((c) => (
                  <span key={c} className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    <Award className="h-3 w-3" />
                    {c}
                  </span>
                ))}
              </div>
              <a
                href="#book-intro"
                className="mt-4 inline-flex w-fit items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground hover:brightness-110"
              >
                <Calendar className="h-4 w-4" />
                Book free intro call
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-3 lg:items-start">
          <div className="space-y-12 lg:col-span-2">
            <SectionReveal>
            <section id="why-mentor">
              <h2 className="text-xl font-semibold">Why mentor with me</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{mentor.bio}</p>
              {mentor.introVideoUrl && (
                <div className="mt-6">
                  <MentorIntroVideo url={mentor.introVideoUrl} name={mentor.name} />
                </div>
              )}
              <div className="mt-6">
                <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Skills & expertise</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {mentor.skills.map((skill) => (
                    <Badge key={skill}>{skill}</Badge>
                  ))}
                </div>
                {mentor.subFields.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {mentor.subFields.map((f) => (
                      <span key={f} className="rounded-lg bg-muted px-3 py-1 text-sm">{f}</span>
                    ))}
                  </div>
                )}
              </div>
            </section>
            </SectionReveal>

            <SectionReveal delay={0.08}>
            <section id="reviews">
              <h2 className="text-xl font-semibold">Reviews</h2>
              <div className="mt-4 space-y-4">
                {mentor.reviews.length === 0 && (
                  <p className="text-sm text-muted-foreground">No reviews yet. Be the first after a session.</p>
                )}
                {mentor.reviews.map((review) => (
                  <Card key={review.author + review.text.slice(0, 20)} className="card-elevated">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-1 text-accent">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-current" />
                        ))}
                      </div>
                      <p className="mt-3 leading-relaxed">&ldquo;{review.text}&rdquo;</p>
                      <p className="mt-3 text-sm text-muted-foreground">— {review.author}, {review.role}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {user && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold">Leave a review</h3>
                  <div className="mt-3">
                    <MentorReviewForm mentorSlug={slug} />
                  </div>
                </div>
              )}
            </section>
            </SectionReveal>

            <SectionReveal delay={0.12}>
            <MentorStudentQuestions mentor={mentor} />
            </SectionReveal>

            <SectionReveal delay={0.14}>
            <section className="scroll-mt-28 rounded-2xl border border-border bg-muted/20 p-6 lg:hidden">
              <h2 className="text-xl font-semibold">Book your intro</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Start with a free 30-minute call — no commitment required.
              </p>
              <a
                href="#book-intro"
                className="mt-4 inline-flex h-11 items-center rounded-xl bg-accent px-6 text-sm font-semibold text-accent-foreground hover:brightness-110"
              >
                See booking options ↑
              </a>
            </section>
            </SectionReveal>
          </div>

          <div id="book-intro" className="scroll-mt-28 space-y-6 lg:sticky lg:top-24 lg:self-start">
            <MentorBookingCard
              mentor={mentor}
              defaultName={user?.full_name ?? ""}
              defaultEmail={user?.email ?? ""}
              initialSession={session}
              isLoggedIn={!!user}
            />
            <ContentCrossLinks discipline={mentor.discipline} />
          </div>
        </div>

        <SimilarMentors mentors={similar} />
      </div>
      <MentorMobileBookBar />
    </div>
  );
}
