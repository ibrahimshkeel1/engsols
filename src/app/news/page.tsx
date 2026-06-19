import Link from "next/link";
import { format } from "date-fns";
import { getPublishedNews } from "@/lib/data/news";
import { categoryToDiscipline } from "@/lib/data/content-crosslinks";
import { PageHero } from "@/components/shared/PageHero";
import { ContentCrossLinks } from "@/components/shared/ContentCrossLinks";
import { EmptyState } from "@/components/shared/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Newspaper } from "lucide-react";

export const revalidate = 120;

export default async function NewsPage() {
  const articles = await getPublishedNews();
  const hero = articles.find((a) => a.featured) ?? articles[0];
  const rest = articles.filter((a) => a.slug !== hero?.slug);
  const sidebarDiscipline = hero ? categoryToDiscipline(hero.category) : null;

  return (
    <>
      <PageHero
        variant="editorial"
        title="Engineering News"
        description="Industry updates, career insights, and certification news for applied engineers."
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        {articles.length === 0 ? (
          <EmptyState
            icon={Newspaper}
            title="No articles yet"
            description="Industry news and career insights will appear here."
            action={{ href: "/forum", label: "Join the forum" }}
            promptChips={[
              { label: "Find mentors", href: "/mentors" },
              { label: "Certifications", href: "/certifications" },
            ]}
          />
        ) : (
          <div className="grid gap-10 lg:grid-cols-3 lg:items-start">
            <div className="space-y-10 lg:col-span-2">
              {hero && (
                <Link href={`/news/${hero.slug}`} className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:border-primary/30">
                  {hero.cover_image_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={hero.cover_image_url} alt={hero.title} className="aspect-[21/9] w-full object-cover transition group-hover:opacity-95" />
                  )}
                  <div className="p-8">
                    <Badge>{hero.category}</Badge>
                    <h2 className="font-display mt-4 text-3xl leading-tight group-hover:text-primary sm:text-4xl">{hero.title}</h2>
                    <p className="mt-4 line-clamp-3 text-lg text-muted-foreground">{hero.excerpt}</p>
                    <p className="mt-4 text-sm text-muted-foreground">
                      {hero.published_at && format(new Date(hero.published_at), "MMMM d, yyyy")}
                    </p>
                  </div>
                </Link>
              )}

              <section>
                <h2 className="text-xl font-bold">Latest</h2>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  {rest.slice(0, 4).map((a) => (
                    <Link key={a.id} href={`/news/${a.slug}`} className="card-interactive overflow-hidden rounded-xl border border-border bg-card">
                      {a.cover_image_url && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={a.cover_image_url} alt={a.title} className="aspect-video w-full object-cover" />
                      )}
                      <CardContent className="p-5">
                        <Badge>{a.category}</Badge>
                        <h3 className="mt-2 font-semibold leading-snug">{a.title}</h3>
                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{a.excerpt}</p>
                      </CardContent>
                    </Link>
                  ))}
                </div>
              </section>

              {rest.length > 4 && (
                <section>
                  <h2 className="text-lg font-semibold">More stories</h2>
                  <div className="mt-4 space-y-3">
                    {rest.slice(4).map((a) => (
                      <Link key={a.id} href={`/news/${a.slug}`}>
                        <Card className="card-interactive">
                          <CardContent className="flex items-center justify-between gap-4 p-4">
                            <div>
                              <p className="font-medium">{a.title}</p>
                              <p className="text-xs text-muted-foreground">{a.category}</p>
                            </div>
                            <p className="shrink-0 text-xs text-muted-foreground">
                              {a.published_at && format(new Date(a.published_at), "MMM d")}
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {sidebarDiscipline && (
              <div className="lg:sticky lg:top-24 lg:self-start">
                <ContentCrossLinks discipline={sidebarDiscipline} />
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
