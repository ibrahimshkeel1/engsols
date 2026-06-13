import Link from "next/link";
import { certifications } from "@/data/certifications";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function CertificationsPage() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-foreground">Certifications & Exams</h1>
        <p className="mt-2 text-muted-foreground">
          FE, PE, IWCF, and industry credentials — resources and mentors to help you prepare.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert) => {
            const mentorCount = cert.relatedMentorSlugs.length;
            return (
              <Card key={cert.slug}>
                <CardContent>
                  <Badge>{cert.discipline}</Badge>
                  <h3 className="mt-2 text-lg font-semibold text-foreground">{cert.shortName}</h3>
                  <p className="text-sm font-medium text-foreground/90">{cert.name}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{cert.description}</p>
                  <p className="mt-3 text-xs text-muted-foreground">
                    ~{cert.avgPrepMonths} months prep
                    {cert.passRate && ` · ${cert.passRate} pass rate`}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{mentorCount} mentors available</p>
                  <Link href={`/certifications/${cert.slug}`} className="mt-3 inline-block text-sm font-medium text-primary">
                    Learn more →
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
