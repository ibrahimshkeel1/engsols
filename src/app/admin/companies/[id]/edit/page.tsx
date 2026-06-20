import { notFound } from "next/navigation";
import { getCompaniesForAdmin } from "@/lib/data/admin-content";
import { AdminCompanyEditForm } from "@/components/admin/AdminCompanyEditForm";
import { Card, CardContent } from "@/components/ui/card";
import { safeDecodeURIComponent } from "@/lib/utils/safe-decode";

type Props = { params: Promise<{ id: string }>; searchParams: Promise<{ error?: string }> };

export default async function AdminCompanyEditPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { error } = await searchParams;
  const companies = await getCompaniesForAdmin();
  const company = companies.find((c) => c.id === id);
  if (!company) notFound();

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold">Edit company</h1>
      <p className="mt-1 text-muted-foreground">{company.name}</p>
      {error && (
        <p className="mt-4 rounded-xl bg-zone-news/10 px-4 py-3 text-sm text-zone-news-on">{safeDecodeURIComponent(error)}</p>
      )}
      <Card className="card-elevated mt-8">
        <CardContent className="p-6">
          <AdminCompanyEditForm company={company} />
        </CardContent>
      </Card>
    </div>
  );
}
