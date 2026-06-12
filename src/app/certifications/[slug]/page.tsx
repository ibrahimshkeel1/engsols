import Link from "next/link";
import { notFound } from "next/navigation";
import { certifications, getCertificationBySlug } from "@/data/certifications";
import { mentors } from "@/data/mentors";
import { forumPosts } from "@/data/forumPosts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ComingSoonButton } from "@/components/shared/ComingSoonButton";
import { MentorCard } from "@/components/mentors/MentorCard";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return certifications.map((c) => ({ slug: c.slug }));
}

export default async function CertificationPage({ params }: Props) {
  const { slug } = await params;
  const cert = getCertificationBySlug(slug);
  if (!cert) notFound();

  const relatedMentors = mentors.filter((m) => cert.relatedMentorSlugs.includes(m.slug));
  const relatedThreads = forumPosts.filter((p) => cert.forumThreadSlugs?.includes(p.slug));

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <Badge>{cert.discipline}</Badge>
        <h1 className="mt-3 text-3xl font-bold text-slate-900">{cert.name}</h1>
        <p className="mt-4 text-slate-700">{cert.description}</p>
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="font-semibold text-slate-900">Eligibility</h2>
            <p className="mt-2 text-slate-600">{cert.eligibility}</p>
            <h2 className="mt-6 font-semibold text-slate-900">Exam format</h2>
            <p className="mt-2 text-slate-600">{cert.examFormat}</p>
            <p className="mt-4 text-sm text-slate-500">
              Average prep: {cert.avgPrepMonths} months
              {cert.passRate && ` · Pass rate: ${cert.passRate}`}
            </p>
          </div>
          <Card>
            <CardContent>
              <h2 className="font-semibold">Study resources</h2>
              <ul className="mt-3 space-y-2">
                {cert.resources.map((r) => (
                  <li key={r.title} className="flex items-center justify-between text-sm">
                    <span>{r.title}</span>
                    <Badge className="capitalize">{r.type}</Badge>
                  </li>
                ))}
              </ul>
              <ComingSoonButton variant="outline" className="mt-4 w-full">
                Track my progress
              </ComingSoonButton>
            </CardContent>
          </Card>
        </div>
        <h2 className="mt-12 text-xl font-bold">Mentors who can help</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {relatedMentors.map((m) => (
            <MentorCard key={m.slug} mentor={m} />
          ))}
        </div>
        {relatedThreads.length > 0 && (
          <>
            <h2 className="mt-12 text-xl font-bold">Forum discussions</h2>
            <ul className="mt-4 space-y-2">
              {relatedThreads.map((t) => (
                <li key={t.slug}>
                  <Link href={`/forum/${t.slug}`} className="text-amber-600">{t.title}</Link>
                </li>
              ))}
            </ul>
          </>
        )}
        <Link
          href={`/mentors?goal=fe-pe`}
          className="mt-8 inline-flex rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-slate-900"
        >
          Find a mentor for this exam
        </Link>
      </div>
    </div>
  );
}
