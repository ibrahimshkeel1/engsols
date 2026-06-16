import { AdminNewsForm } from "@/components/admin/AdminNewsForm";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminNewNewsPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold">Publish article</h1>
      <p className="mt-1 text-muted-foreground">Create a new news article for the community.</p>
      <Card className="card-elevated mt-8">
        <CardContent className="p-6">
          <AdminNewsForm />
        </CardContent>
      </Card>
    </div>
  );
}
