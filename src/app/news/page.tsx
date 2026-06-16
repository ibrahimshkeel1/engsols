import Link from "next/link";
import { format } from "date-fns";
import { getPublishedNews } from "@/lib/data/news";
import { PageHero } from "@/components/shared/PageHero";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const revalidate = 120;

export default async function NewsPage() {
  const articles = await getPublishedNews();
  const featured = articles.filter((a) => a.featured);
  const rest = articles.filter((a) => !a.featured);

  return (
    <>
      <PageHero
        variant="editorial"
        title="Engineering News"
        description="Industry updates, career insights, and certification news for applied engineers."
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {articles.length === 0 ? (
          <p className="text-muted-foreground">No articles published yet. Check back soon.</p>
        ) : (
          <>
        {featured.length > 0 && (
          <section>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">Featured</h2>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              {featured.map((a) => (
                <Link key={a.id} href={`/news/${a.slug}`}>
                  <Card className="card-elevated h-full overflow-hidden transition hover:border-primary/40 hover:shadow-lg">
                    {a.cover_image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={a.cover_image_url} alt="" className="aspect-[16/9] w-full object-cover" />
                    )}
                    <CardContent className="p-8">
                      <Badge>{a.category}</Badge>
                      <h3 className="mt-4 text-2xl font-bold leading-tight">{a.title}</h3>
                      <p className="mt-3 line-clamp-3 text-muted-foreground">{a.excerpt}</p>
                      <p className="mt-4 text-sm text-muted-foreground">
                        {a.published_at && format(new Date(a.published_at), "MMMM d, yyyy")}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
        <section className="mt-14">
          <h2 className="text-xl font-bold">Latest articles</h2>
          <div className="mt-6 space-y-4">
            {rest.map((a) => (
              <Link key={a.id} href={`/news/${a.slug}`}>
                <Card className="card-elevated overflow-hidden transition hover:border-primary/30">
                  <CardContent className="flex flex-col gap-3 p-0 sm:flex-row sm:items-stretch">
                    {a.cover_image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={a.cover_image_url} alt="" className="aspect-[16/10] w-full object-cover sm:max-w-[220px]" />
                    )}
                    <div className="flex flex-1 flex-col justify-center gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <Badge>{a.category}</Badge>
                      <h3 className="mt-2 text-lg font-semibold">{a.title}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{a.excerpt}</p>
                    </div>
                    <p className="shrink-0 text-sm text-muted-foreground">
                      {a.published_at && format(new Date(a.published_at), "MMM d, yyyy")}
                    </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>
          </>
        )}
      </div>
    </>
  );
}
