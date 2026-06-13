import Link from "next/link";
import { certifications } from "@/data/certifications";
import { ListPageLayout } from "@/components/shared/ListPageLayout";
import { DisciplineBadge } from "@/components/ui/DisciplineBadge";

export default function CertificationsPage() {
  return (
    <ListPageLayout
      label="Credentials"
      title="Certifications & Exams"
      description="FE, PE, IWCF, and industry credentials — resources and mentors to help you prepare."
      preview
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {certifications.map((cert) => {
          const mentorCount = cert.relatedMentorSlugs.length;
          return (
            <Link key={cert.slug} href={`/certifications/${cert.slug}`} className="card-interactive rounded-2xl p-5">
              <DisciplineBadge discipline={cert.discipline} />
              <h3 className="mt-3 text-lg font-semibold">{cert.shortName}</h3>
              <p className="text-sm font-medium text-foreground/90">{cert.name}</p>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{cert.description}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                ~{cert.avgPrepMonths} months prep
                {cert.passRate && ` · ${cert.passRate} pass rate`}
              </p>
              <p className="mt-1 text-xs text-primary">{mentorCount} mentors available</p>
            </Link>
          );
        })}
      </div>
    </ListPageLayout>
  );
}
