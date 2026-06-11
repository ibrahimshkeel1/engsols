import Image from "next/image";
import { notFound } from "next/navigation";
import { Star } from "lucide-react";
import { mentors } from "@/data/mentors";
import { sessionTypes } from "@/data/sessionTypes";
import { getMentorBySlug, getSimilarMentors } from "@/lib/filter-mentors";
import { avatarUrl } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ComingSoonButton } from "@/components/shared/ComingSoonButton";
import { SimilarMentors } from "@/components/mentors/SimilarMentors";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return mentors.map((m) => ({ slug: m.slug }));
}

export default async function MentorProfilePage({ params }: PageProps) {
  const { slug } = await params;
  const mentor = getMentorBySlug(mentors, slug);

  if (!mentor) notFound();

  const similar = getSimilarMentors(mentors, mentor);

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="flex items-start gap-6">
              <Image
                src={avatarUrl(mentor.name)}
                alt={mentor.name}
                width={96}
                height={96}
                className="rounded-full bg-slate-100"
                unoptimized
              />
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span className="font-medium">{mentor.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-sm text-slate-500">({mentor.reviewCount} reviews)</span>
                </div>
                <h1 className="mt-1 text-3xl font-bold text-slate-900">{mentor.name}</h1>
                <p className="text-lg text-slate-600">{mentor.headline}</p>
                <p className="text-slate-500">{mentor.company} · {mentor.yearsExperience} years experience</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge className="bg-amber-50 text-amber-800">{mentor.discipline}</Badge>
                  {mentor.credentials.map((c) => (
                    <Badge key={c}>{c}</Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-slate-900">About</h2>
              <p className="mt-2 leading-relaxed text-slate-600">{mentor.bio}</p>
            </div>
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-slate-900">Skills & expertise</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {mentor.skills.map((skill) => (
                  <Badge key={skill}>{skill}</Badge>
                ))}
              </div>
            </div>
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-slate-900">Reviews</h2>
              <div className="mt-4 space-y-4">
                {mentor.reviews.map((review) => (
                  <Card key={review.author}>
                    <CardContent>
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: review.rating }).map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-current" />
                        ))}
                      </div>
                      <p className="mt-2 text-slate-700">&ldquo;{review.text}&rdquo;</p>
                      <p className="mt-2 text-sm text-slate-500">— {review.author}, {review.role}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
          <div>
            <Card className="sticky top-24">
              <CardContent>
                <Badge className="bg-green-50 text-green-700">Free trial on first call</Badge>
                <div className="mt-4">
                  <p className="text-sm text-slate-500">Monthly mentorship</p>
                  <p className="text-3xl font-bold text-slate-900">${mentor.monthlyRate}<span className="text-base font-normal">/mo</span></p>
                </div>
                <div className="mt-4 border-t border-slate-200 pt-4">
                  <p className="text-sm text-slate-500">Introductory call</p>
                  <p className="font-semibold text-slate-900">Free</p>
                </div>
                <ComingSoonButton variant="accent" className="mt-6 w-full">
                  Book free intro call
                </ComingSoonButton>
                <ComingSoonButton variant="outline" className="mt-2 w-full">
                  Start monthly mentorship
                </ComingSoonButton>
                <div className="mt-6 space-y-3 border-t border-slate-200 pt-4">
                  <p className="text-sm font-medium text-slate-900">One-off sessions</p>
                  {sessionTypes.map((s) => (
                    <div key={s.id} className="flex justify-between text-sm">
                      <span className="text-slate-600">{s.title}</span>
                      <span className="font-medium">${s.price}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <SimilarMentors mentors={similar} />
      </div>
    </div>
  );
}
