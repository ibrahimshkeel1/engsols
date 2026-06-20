import Link from "next/link";
import { format } from "date-fns";
import { Newspaper } from "lucide-react";
import { getAllNewsForAdmin } from "@/lib/data/news";
import { mapNewsArticle } from "@/lib/news-utils";
import { AdminNewsEditorForm } from "@/components/admin/AdminNewsEditorForm";
import { DeleteNewsButton } from "@/components/admin/DeleteNewsButton";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default async function AdminNewsPage() {
  const rows = await getAllNewsForAdmin();
  const articles = rows.map((row) => mapNewsArticle(row));

  return (
    <div className="space-y-10">
      <div>
        <p className="section-label text-zone-news">Insights CMS</p>
        <h1 className="mt-1 text-2xl font-bold">News articles</h1>
        <p className="mt-1 text-muted-foreground">
          Publish technical articles, project breakdowns, and industry updates for the insights hub.
        </p>
      </div>

      <Card className="card-elevated border-zone-news/25" id="create">
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold text-zone-news">Create article</h2>
          <p className="mt-1 text-sm text-muted-foreground">Draft or publish directly to `/news`.</p>
          <div className="mt-6">
            <AdminNewsEditorForm />
          </div>
        </CardContent>
      </Card>

      <section>
        <h2 className="text-lg font-semibold text-zone-news">All articles ({articles.length})</h2>
        <div className="mt-6 space-y-4">
          {articles.length === 0 ? (
            <EmptyState
              icon={Newspaper}
              title="No articles yet"
              description="Use the editor above to publish your first engineering insight."
            />
          ) : (
            articles.map((article) => (
              <Card key={article.id} className="card-elevated border-zone-news/15">
                <CardContent className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-zone-news/10 text-zone-news">{article.discipline}</Badge>
                      {!article.published && <Badge className="bg-muted text-muted-foreground">Draft</Badge>}
                      {article.featured && <Badge className="bg-zone-news/15 text-zone-news">Featured</Badge>}
                    </div>
                    <h3 className="mt-2 font-semibold">{article.title}</h3>
                    <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">{article.summary}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      {article.publishedAt
                        ? format(new Date(article.publishedAt), "MMM d, yyyy")
                        : "Not published"}{" "}
                      · {article.viewCount} views
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-3">
                    <Link href={`/admin/news/${article.id}/edit`} className="text-sm font-medium text-zone-news hover:underline">
                      Edit
                    </Link>
                    {article.published && (
                      <Link href={`/news/${article.slug}`} className="text-sm font-medium text-zone-news hover:underline">
                        View →
                      </Link>
                    )}
                    <DeleteNewsButton articleId={article.id} title={article.title} />
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
