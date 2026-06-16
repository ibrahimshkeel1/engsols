import { notFound } from "next/navigation";
import { getNewsArticleForAdmin } from "@/lib/data/admin-content";
import { AdminNewsEditForm } from "@/components/admin/AdminNewsEditForm";
import { Card, CardContent } from "@/components/ui/card";

type Props = { params: Promise<{ id: string }> };

export default async function AdminNewsEditPage({ params }: Props) {
  const { id } = await params;
  const article = await getNewsArticleForAdmin(id);
  if (!article) notFound();

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold">Edit article</h1>
      <p className="mt-1 text-muted-foreground">{article.title}</p>
      <Card className="card-elevated mt-8">
        <CardContent className="p-6">
          <AdminNewsEditForm article={article} />
        </CardContent>
      </Card>
    </div>
  );
}
