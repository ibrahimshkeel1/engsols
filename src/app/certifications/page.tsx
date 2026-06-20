import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { getCertifications } from "@/lib/data/certifications";
import { ListPageLayout } from "@/components/shared/ListPageLayout";
import { EmptyState } from "@/components/shared/EmptyState";
import { certPromptChips } from "@/data/empty-state-prompts";
import { DisciplineBadge } from "@/components/ui/DisciplineBadge";

export default async function CertificationsPage() {
  const certifications = await getCertifications();

  return (
    <ListPageLayout
      zone="exams"
      label="Credentials"
      title="Certifications & Exams"
      description="FE, PE, IWCF, and industry credentials — resources and mentors to help you prepare."
      preview={false}
      className="bg-background"
    >
      {certifications.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No certifications listed yet"
          description="Exam guides and mentor prep paths will appear here as we expand credentials."
          action={{ href: "/mentors?goal=fe-pe", label: "Find exam mentors" }}
          promptChips={certPromptChips}
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert) => {
            const mentorCount = cert.relatedMentorSlugs.length;
            return (
              <Link key={cert.slug} href={`/certifications/${cert.slug}`} className="card-interactive rounded-2xl p-5">
                <DisciplineBadge discipline={cert.discipline} />
                <h3 className="mt-3 text-lg font-semibold">{cert.shortName}</h3>
                <p className="text-sm font-medium text-text-main">{cert.name}</p>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{cert.description}</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  ~{cert.avgPrepMonths} months prep
                  {cert.passRate && ` · ${cert.passRate} pass rate`}
                </p>
                {mentorCount > 0 && (
                  <p className="mt-1 text-xs text-zone-exams">{mentorCount} mentors available</p>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </ListPageLayout>
  );
}
