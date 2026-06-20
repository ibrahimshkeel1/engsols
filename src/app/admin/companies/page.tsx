import Link from "next/link";
import { Building2 } from "lucide-react";
import { getCompaniesForAdmin } from "@/lib/data/admin-content";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/EmptyState";

export default async function AdminCompaniesPage() {
  const companies = await getCompaniesForAdmin();

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Companies</h1>
          <p className="mt-1 text-muted-foreground">Manage employer and vendor company profiles.</p>
        </div>
        <Link
          href="/admin/companies/new"
          className="inline-flex h-10 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:brightness-110"
        >
          Add company
        </Link>
      </div>
      <div className="mt-8 space-y-4">
        {companies.length === 0 ? (
          <EmptyState
            icon={Building2}
            title="No companies yet"
            description="Add company profiles for jobs, marketplace listings, and mentor affiliations."
            action={{ href: "/admin/companies/new", label: "Add a company" }}
          />
        ) : (
          companies.map((company) => (
            <Card key={company.id} className="card-elevated">
              <CardContent className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold">{company.name}</h2>
                    {company.verified && (
                      <Badge className="bg-zone-mentorship/15 text-zone-mentorship-on">Verified</Badge>
                    )}
                    {!company.published && (
                      <Badge className="bg-muted text-muted-foreground">Unpublished</Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm capitalize text-muted-foreground">
                    {company.type.replace("-", " ")} · {company.headquarters}, {company.country}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{company.description}</p>
                </div>
                {company.published && (
                  <Link href={`/companies/${company.slug}`} className="shrink-0 text-sm font-medium text-primary hover:underline">
                    View →
                  </Link>
                )}
                <Link href={`/admin/companies/${company.id}/edit`} className="shrink-0 text-sm font-medium text-muted-foreground hover:text-primary">
                  Edit
                </Link>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
