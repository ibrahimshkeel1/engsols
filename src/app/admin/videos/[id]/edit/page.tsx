import { notFound } from "next/navigation";
import { getVideoForAdmin } from "@/lib/data/admin-content";
import { AdminVideoEditForm } from "@/components/admin/AdminVideoEditForm";
import { Card, CardContent } from "@/components/ui/card";

type Props = { params: Promise<{ id: string }> };

export default async function AdminVideoEditPage({ params }: Props) {
  const { id } = await params;
  const video = await getVideoForAdmin(id);
  if (!video) notFound();

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold">Edit video</h1>
      <Card className="card-elevated mt-8">
        <CardContent className="p-6">
          <AdminVideoEditForm video={video} />
        </CardContent>
      </Card>
    </div>
  );
}
