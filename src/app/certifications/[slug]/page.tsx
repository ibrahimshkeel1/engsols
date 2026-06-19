import Link from "next/link";
import { notFound } from "next/navigation";
import { getCertificationBySlug, getCertifications } from "@/lib/data/certifications";
import { getApprovedMentors } from "@/lib/data/mentors";
import { DisciplineBadge } from "@/components/ui/DisciplineBadge";
import { Card, CardContent } from "@/components/ui/card";
import { MentorCard } from "@/components/mentors/MentorCard";
import { ProfileBentoGrid } from "@/components/ui/ProfileBentoGrid";
import { CertificationPrepPath } from "@/components/certifications/CertificationPrepPath";
import { ContentCrossLinks } from "@/components/shared/ContentCrossLinks";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const certifications = await getCertifications();
  return certifications.map((c) => ({ slug: c.slug }));
}

export default async function CertificationPage({ params }: Props) {
  const { slug } = await params;
  const cert = await getCertificationBySlug(slug);
  if (!cert) notFound();

  const mentors = await getApprovedMentors();
  const relatedMentors = mentors.filter((m) => cert.relatedMentorSlugs.includes(m.slug));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 pb-24 sm:px-6 lg:pb-12">
      <div className="grid gap-10 lg:grid-cols-3 lg:items-start">
        <div className="lg:col-span-2">
      <DisciplineBadge discipline={cert.discipline} />
      <h1 className="mt-3 font-display text-3xl tracking-tight">{cert.name}</h1>
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
        className="mt-8 inline-flex h-11 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground hover:brightness-110"
      >
        Browse all exam mentors
      </Link>
        </div>
        <ContentCrossLinks discipline={cert.discipline} className="lg:sticky lg:top-24 lg:self-start" />
      </div>
    </div>
  );
}
