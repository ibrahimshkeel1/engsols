import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import { getArticleBySlug, getPublishedArticles } from "@/lib/data/news";
import { estimateReadingTimeMinutes } from "@/lib/news-utils";
import { buildDetailMetadata } from "@/lib/page-metadata";
import { MarkdownBody } from "@/components/shared/MarkdownBody";
import { RelatedOpportunitiesSidebar } from "@/components/news/RelatedOpportunitiesSidebar";
import { ShareButton } from "@/components/shared/ShareButton";
import { Badge } from "@/components/ui/badge";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 300;

export async function generateStaticParams() {
  const articles = await getPublishedArticles();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug, { incrementViews: false });
  if (!article) return { title: "Article not found" };
  return buildDetailMetadata({
    title: `${article.title} | EngSols News`,
    description: article.summary.slice(0, 160),
    path: `/news/${slug}`,
  });
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const readingTime = estimateReadingTimeMinutes(article.content);

  return (
    <div className="mx-auto max-w-7xl bg-bg-main px-4 py-0 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
        <article className="lg:col-span-2">
          <header className="border-b border-border-custom">
            {article.imageUrl && (
              <div className="pt-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="aspect-[21/9] w-full rounded-2xl object-cover"
                />
              </div>
            )}
            <div className="py-12 sm:py-16">
              <Link href="/news" className="text-sm font-medium text-zone-news transition-colors hover:underline">
                ← Back to insights
              </Link>
              <div className="mt-6 flex flex-wrap items-center gap-2">
                <Badge className="bg-zone-news/10 text-zone-news">{article.discipline}</Badge>
                {article.tags.map((tag) => (
                  <Badge key={tag} className="border border-zone-news/25 bg-zone-news/5 text-xs text-zone-news">
                    {tag}
                  </Badge>
                ))}
              </div>
              <h1 className="font-display mt-4 text-4xl leading-tight tracking-tight text-text-main sm:text-5xl">{article.title}</h1>
              <p className="mt-5 text-lg leading-relaxed text-text-muted">{article.summary}</p>
              <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-text-muted">
                {article.publishedAt && (
                  <span>{format(new Date(article.publishedAt), "MMMM d, yyyy")}</span>
                )}
                <span>{readingTime} min read</span>
                <span className="inline-flex items-center gap-1">
                  <Eye className="h-4 w-4" aria-hidden />
                  {article.viewCount.toLocaleString()} views
                </span>
                <ShareButton title={article.title} text={article.summary} />
              </div>
            </div>
          </header>
          <div className="py-12">
            <MarkdownBody
              content={article.content}
              className="prose prose-lg dark:prose-invert max-w-none leading-relaxed text-text-main/90"
            />
          </div>
        </article>

        <div className="py-8 lg:sticky lg:top-24 lg:self-start lg:py-12">
          <RelatedOpportunitiesSidebar discipline={article.discipline} />
        </div>
      </div>
    </div>
  );
}
