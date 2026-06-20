import Link from "next/link";
import { notFound } from "next/navigation";
import { getCertificationBySlug, getCertifications } from "@/lib/data/certifications";
import { getApprovedMentors } from "@/lib/data/mentors";
import { buildDetailMetadata } from "@/lib/page-metadata";
import { DisciplineBadge } from "@/components/ui/DisciplineBadge";
import { Card, CardContent } from "@/components/ui/card";
import { MentorCard } from "@/components/mentors/MentorCard";
import { ProfileBentoGrid } from "@/components/ui/ProfileBentoGrid";
import { CertificationPrepPath } from "@/components/certifications/CertificationPrepPath";
import { getPublishedMockExams } from "@/lib/data/exams";
import { ContentCrossLinks } from "@/components/shared/ContentCrossLinks";
import { ShareButton } from "@/components/shared/ShareButton";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const certifications = await getCertifications();
  return certifications.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const cert = await getCertificationBySlug(slug);
  if (!cert) return { title: "Certification not found" };
  return buildDetailMetadata({
    title: `${cert.name} | EngSols Certifications`,
    description: cert.description.slice(0, 160),
    path: `/certifications/${slug}`,
  });
}

export default async function CertificationPage({ params }: Props) {
  const { slug } = await params;
  const cert = await getCertificationBySlug(slug);
  if (!cert) notFound();

  const mentors = await getApprovedMentors();
  const relatedMentors = mentors.filter((m) => cert.relatedMentorSlugs.includes(m.slug));
  const mockExams = await getPublishedMockExams();
  const relatedExams = mockExams.filter(
    (e) => e.discipline === cert.discipline || e.examType === "FE" || e.examType === "PE",
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 pb-24 sm:px-6 lg:pb-12">
      <div className="grid gap-10 lg:grid-cols-3 lg:items-start">
        <div className="lg:col-span-2">
      <DisciplineBadge discipline={cert.discipline} />
      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <h1 className="font-display text-3xl tracking-tight">{cert.name}</h1>
        <ShareButton title={cert.name} text={cert.description.slice(0, 120)} />
      </div>
      <p className="mt-4 text-foreground/90">{cert.description}</p>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div>
          <h2 className="font-semibold">Eligibility</h2>
          <p className="mt-2 text-muted-foreground">{cert.eligibility}</p>
          <h2 className="mt-6 font-semibold">Exam format</h2>
          <p className="mt-2 text-muted-foreground">{cert.examFormat}</p>
          <p className="mt-4 text-sm text-muted-foreground">
            Average prep: {cert.avgPrepMonths} months
            {cert.passRate && ` · Pass rate: ${cert.passRate}`}
          </p>
        </div>
        <Card className="card-elevated">
          <CardContent className="p-6">
            <h2 className="font-semibold">Study resources</h2>
            {cert.resources.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">No resources listed yet.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {cert.resources.map((r) => (
                  <li key={r.title} className="flex items-center justify-between text-sm">
                    <span>{r.title}</span>
                    <span className="rounded-md bg-muted px-2 py-0.5 text-xs capitalize">{r.type}</span>
                  </li>
                ))}
              </ul>
            )}
            <Link
              href={`/mentors?discipline=${encodeURIComponent(cert.discipline)}`}
              className="mt-6 flex h-11 w-full items-center justify-center rounded-xl bg-accent text-sm font-semibold text-accent-foreground hover:brightness-110"
            >
              Find a prep mentor
            </Link>
          </CardContent>
        </Card>
      </div>
      <CertificationPrepPath cert={cert} />
      {relatedExams.length > 0 && (
        <div className="mt-10 rounded-2xl border border-zone-exams/25 bg-zone-exams/5 p-6">
          <h2 className="font-semibold">Practice exams</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Timed mock exams with a technical scratchpad — no install required.
          </p>
          <ul className="mt-4 space-y-2">
            {relatedExams.map((exam) => (
              <li key={exam.slug}>
                <Link
                  href={`/certifications/exams/${exam.slug}`}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-card px-4 py-3 hover:border-zone-exams/40"
                >
                  <span className="font-medium">{exam.title}</span>
                  <span className="text-xs font-medium text-zone-exams">
                    {exam.durationMinutes} min · {exam.questionCount} questions · Pass {exam.passingScore}%
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {relatedMentors.length > 0 && (
        <>
          <h2 className="mt-12 text-xl font-bold">Mentors who can help</h2>
          <ProfileBentoGrid
            className="mt-6"
            items={relatedMentors}
            getKey={(m) => m.slug}
            isFeatured={(m) => m.featured}
            animated={false}
            renderCard={(m, variant) => <MentorCard mentor={m} variant={variant} />}
          />
        </>
      )}
      <Link
        href={`/mentors?goal=fe-pe`}
        className="mt-8 inline-flex h-11 items-center rounded-xl bg-zone-exams px-5 text-sm font-semibold text-white hover:brightness-110 dark:text-bg-main"
      >
        Browse all exam mentors
      </Link>
        </div>
        <ContentCrossLinks discipline={cert.discipline} className="lg:sticky lg:top-24 lg:self-start" />
      </div>
    </div>
  );
}
