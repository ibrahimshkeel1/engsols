import { notFound } from "next/navigation";
import { getCertificationForAdmin } from "@/lib/data/admin-content";
import { AdminCertEditForm } from "@/components/admin/AdminCertEditForm";
import { Card, CardContent } from "@/components/ui/card";

type Props = { params: Promise<{ id: string }> };

export default async function AdminCertEditPage({ params }: Props) {
  const { id } = await params;
  const cert = await getCertificationForAdmin(id);
  if (!cert) notFound();

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold">Edit certification</h1>
      <Card className="card-elevated mt-8">
        <CardContent className="p-6">
          <AdminCertEditForm cert={cert} />
        </CardContent>
      </Card>
    </div>
  );
}
