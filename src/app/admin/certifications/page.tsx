import Link from "next/link";
import { Award } from "lucide-react";
import { getCertificationsForAdmin } from "@/lib/data/admin-content";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/EmptyState";

export default async function AdminCertificationsPage() {
  const certifications = await getCertificationsForAdmin();

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Certifications</h1>
          <p className="mt-1 text-muted-foreground">Manage professional certification guides.</p>
        </div>
        <Link
          href="/admin/certifications/new"
          className="inline-flex h-10 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:brightness-110"
        >
          Add certification
        </Link>
      </div>
      <div className="mt-8 space-y-4">
        {certifications.length === 0 ? (
          <EmptyState
            icon={Award}
            title="No certifications yet"
            description="Add certification guides to help engineers plan their exam prep."
            action={{ href: "/admin/certifications/new", label: "Add a certification" }}
          />
        ) : (
          certifications.map((cert) => (
            <Card key={cert.id} className="card-elevated">
              <CardContent className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold">{cert.name}</h2>
                    <Badge>{cert.short_name}</Badge>
                    {!cert.published && (
                      <Badge className="bg-muted text-muted-foreground">Unpublished</Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{cert.discipline}</p>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{cert.description}</p>
                </div>
                {cert.published && (
                  <Link href={`/certifications/${cert.slug}`} className="shrink-0 text-sm font-medium text-primary hover:underline">
                    View →
                  </Link>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
