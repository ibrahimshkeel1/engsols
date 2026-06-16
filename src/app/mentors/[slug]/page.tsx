import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, Award } from "lucide-react";
import { sessionTypes } from "@/data/sessionTypes";
import { getSimilarMentors } from "@/lib/filter-mentors";
import { getApprovedMentors, getMentorBySlug } from "@/lib/data/mentors";
import { getDisciplineColors } from "@/lib/discipline-colors";
import { Avatar } from "@/components/ui/Avatar";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { DisciplineBadge } from "@/components/ui/DisciplineBadge";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MentorBookingCard } from "@/components/mentors/MentorBookingCard";
import { SimilarMentors } from "@/components/mentors/SimilarMentors";
import { cn } from "@/lib/utils";

type PageProps = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export default async function MentorProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const mentor = await getMentorBySlug(slug);
  if (!mentor) notFound();

  const allMentors = await getApprovedMentors();
  const similar = getSimilarMentors(allMentors, mentor);
  const stripe = getDisciplineColors(mentor.discipline).stripe;

  return (
    <div>
      {/* Cover hero */}
      <section className="hero-dark relative overflow-hidden border-b border-white/10">
        <div className={cn("absolute inset-x-0 top-0 h-1", stripe)} />
        <div className="bg-grid absolute inset-0 opacity-20" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
            <Avatar name={mentor.name} discipline={mentor.discipline} size="xl" className="ring-4 ring-white/20" src={mentor.avatarUrl} />
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5 text-primary">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="font-semibold">{mentor.rating.toFixed(1)}</span>
                  <span className="text-sm text-white/50">({mentor.reviewCount} reviews)</span>
                </div>
                {mentor.featured && (
                  <Badge className="bg-primary/20 text-primary">Featured mentor</Badge>
                )}
              </div>
              <h1 className="font-display mt-2 text-4xl tracking-tight sm:text-5xl">{mentor.name}</h1>
              <p className="mt-2 text-xl text-white/80">{mentor.headline}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <CompanyLogo company={mentor.company} />
                <span className="text-white/70">{mentor.company}</span>
                <span className="text-white/40">·</span>
                <span className="text-white/70">{mentor.yearsExperience} years experience</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <DisciplineBadge discipline={mentor.discipline} />
                {mentor.credentials.map((c) => (
                  <span key={c} className="inline-flex items-center gap-1 rounded-md bg-white/10 px-2 py-0.5 text-xs font-medium text-white/80">
                    <Award className="h-3 w-3" />
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="space-y-10 lg:col-span-2">
            <section>
              <h2 className="text-xl font-semibold">About</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{mentor.bio}</p>
            </section>

            <section>
              <h2 className="text-xl font-semibold">Skills & expertise</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {mentor.skills.map((skill) => (
                  <Badge key={skill}>{skill}</Badge>
                ))}
              </div>
              {mentor.subFields.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-muted-foreground">Specializations</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {mentor.subFields.map((f) => (
                      <span key={f} className="rounded-lg bg-muted px-3 py-1 text-sm">{f}</span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            <section>
              <h2 className="text-xl font-semibold">Reviews</h2>
              <div className="mt-4 space-y-4">
                {mentor.reviews.map((review) => (
                  <Card key={review.author} className="card-elevated">
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
            </section>
          </div>

          <div>
            <MentorBookingCard mentor={mentor} />
          </div>
        </div>
        <SimilarMentors mentors={similar} />
      </div>
    </div>
  );
}
