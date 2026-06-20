import { Suspense } from "react";
import { Newspaper } from "lucide-react";
import { getPublishedArticles } from "@/lib/data/news";
import { PageHero } from "@/components/shared/PageHero";
import { EmptyState } from "@/components/shared/EmptyState";
import { NewsDisciplineFilter } from "@/components/news/NewsDisciplineFilter";
import { NewsArticleGrid, NewsHeroBanner } from "@/components/news/NewsArticleGrid";

export const revalidate = 120;

type Props = {
  searchParams: Promise<{ discipline?: string }>;
};

export default async function NewsPage({ searchParams }: Props) {
  const { discipline: disciplineParam } = await searchParams;
  const activeDiscipline = disciplineParam?.trim() || "All";
  const articles = await getPublishedArticles(activeDiscipline === "All" ? undefined : activeDiscipline);

  const hero = articles.find((a) => a.featured) ?? articles[0];
  const gridArticles = hero ? articles.filter((a) => a.id !== hero.id) : articles;

  return (
    <>
      <PageHero
        variant="editorial"
        title="Engineering Insights"
        description="Technical articles, project breakdowns, and industry updates from the EngSols editorial desk."
      />
      <div className="mx-auto max-w-7xl bg-bg-main px-4 pb-16 sm:px-6">
        <Suspense fallback={<div className="h-12 animate-pulse rounded-xl bg-muted" aria-hidden />}>
          <NewsDisciplineFilter active={activeDiscipline} />
        </Suspense>

        <div className="mt-8">
          {articles.length === 0 ? (
            <EmptyState
              icon={Newspaper}
              title="No articles in this discipline"
              description={
                activeDiscipline === "All"
                  ? "Industry news and engineering insights will appear here as admins publish."
                  : `No published stories for ${activeDiscipline} yet. Try another discipline filter.`
              }
              action={{ href: "/mentors", label: "Find mentors" }}
              promptChips={[
                { label: "Certifications", href: "/certifications" },
                { label: "Forum", href: "/forum" },
              ]}
            />
          ) : (
            <div className="space-y-10">
              {hero && <NewsHeroBanner article={hero} />}
              {gridArticles.length > 0 && (
                <section>
                  <div className="mb-6 flex items-end justify-between gap-4">
                    <div>
                      <h2 className="text-xl font-bold text-text-main">Latest stories</h2>
                      <p className="mt-1 text-sm text-text-muted">
                        {activeDiscipline === "All"
                          ? "Across all engineering disciplines"
                          : `Filtered to ${activeDiscipline}`}
                      </p>
                    </div>
                  </div>
                  <NewsArticleGrid articles={gridArticles} />
                </section>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
