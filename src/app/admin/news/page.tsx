import Link from "next/link";
import { format } from "date-fns";
import { Newspaper } from "lucide-react";
import { getAllNewsForAdmin } from "@/lib/data/news";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/EmptyState";
import { DeleteNewsButton } from "@/components/admin/DeleteNewsButton";

export default async function AdminNewsPage() {
  const articles = await getAllNewsForAdmin();

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">News articles</h1>
          <p className="mt-1 text-muted-foreground">Manage industry news and platform updates.</p>
        </div>
        <Link href="/admin/news/new" className="inline-flex h-10 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:brightness-110">
          New article
        </Link>
      </div>
      <div className="mt-8 space-y-4">
        {articles.length === 0 ? (
          <EmptyState
            icon={Newspaper}
            title="No articles yet"
            description="Create your first news article to publish industry updates."
            action={{ href: "/admin/news/new", label: "Write an article" }}
          />
        ) : (
          articles.map((a) => (
          <Card key={a.id} className="card-elevated">
            <CardContent className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="flex flex-wrap gap-2">
                  <Badge>{a.category}</Badge>
                  {!a.published && <Badge className="bg-muted text-muted-foreground">Draft</Badge>}
                  {a.featured && <Badge className="bg-primary/15 text-primary">Featured</Badge>}
                </div>
                <h2 className="mt-2 font-semibold">{a.title}</h2>
                <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{a.excerpt}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {a.published_at ? format(new Date(a.published_at), "MMM d, yyyy") : "Not published"}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-3">
                <Link href={`/admin/news/${a.id}/edit`} className="text-sm font-medium text-primary hover:underline">
                  Edit
                </Link>
                {a.published && (
                  <Link href={`/news/${a.slug}`} className="text-sm font-medium text-primary hover:underline">
                    View →
                  </Link>
                )}
                <DeleteNewsButton articleId={a.id} title={a.title} />
              </div>
            </CardContent>
          </Card>
          ))
        )}
      </div>
    </div>
  );
}
