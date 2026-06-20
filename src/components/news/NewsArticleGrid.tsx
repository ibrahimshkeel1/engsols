import Link from "next/link";
import { format } from "date-fns";
import { ArrowRight, Eye } from "lucide-react";
import type { NewsArticle } from "@/lib/news-utils";
import { estimateReadingTimeMinutes } from "@/lib/news-utils";
import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function NewsHeroBanner({ article }: { article: NewsArticle }) {
  const readingTime = estimateReadingTimeMinutes(article.content);

  return (
    <Link
      href={`/news/${article.slug}`}
      className="card-interactive group block overflow-hidden rounded-2xl border border-zone-news-border bg-zone-news-surface shadow-premium-card"
    >
      {article.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={article.imageUrl}
          alt={article.title}
          className="aspect-[21/9] w-full object-cover transition duration-300 group-hover:scale-[1.01]"
        />
      )}
      <div className="p-6 sm:p-10">
        <div className="flex flex-wrap items-center gap-3">
          <Badge className="bg-zone-news/10 text-zone-news">{article.discipline}</Badge>
          {article.featured && <Badge className="border border-zone-news/30 bg-zone-news/10 text-zone-news">Featured</Badge>}
        </div>
        <h2 className="font-display mt-4 text-3xl leading-tight tracking-tight text-text-main group-hover:text-zone-news sm:text-4xl lg:text-5xl">
          {article.title}
        </h2>
        <p className="mt-4 line-clamp-3 text-lg text-text-muted">{article.summary}</p>
        <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-text-muted">
          {article.publishedAt && (
            <span>{format(new Date(article.publishedAt), "MMMM d, yyyy")}</span>
          )}
          <span>{readingTime} min read</span>
          <span className="inline-flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" aria-hidden />
            {article.viewCount.toLocaleString()} views
          </span>
        </div>
      </div>
    </Link>
  );
}

export function NewsArticleGrid({ articles, className }: { articles: NewsArticle[]; className?: string }) {
  if (articles.length === 0) return null;

  return (
    <div className={cn("grid gap-5 sm:grid-cols-2 xl:grid-cols-3", className)}>
      {articles.map((article) => (
        <NewsArticleCard key={article.id} article={article} />
      ))}
    </div>
  );
}

function NewsArticleCard({ article }: { article: NewsArticle }) {
  const readingTime = estimateReadingTimeMinutes(article.content);

  return (
    <Link href={`/news/${article.slug}`} className="card-interactive group flex h-full flex-col overflow-hidden rounded-xl border border-zone-news-border bg-card">
      {article.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={article.imageUrl} alt={article.title} className="aspect-video w-full object-cover" />
      ) : (
        <div className="aspect-video w-full bg-gradient-to-br from-zone-news-surface via-zone-news/10 to-muted/40" />
      )}
      <CardContent className="flex flex-1 flex-col p-5">
        <Badge className="w-fit bg-zone-news/10 text-zone-news">{article.discipline}</Badge>
        <h3 className="mt-3 font-semibold leading-snug text-text-main group-hover:text-zone-news">{article.title}</h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm text-text-muted">{article.summary}</p>
        <div className="mt-4 flex items-center justify-between gap-3 text-xs text-text-muted">
          <span>
            {article.publishedAt && format(new Date(article.publishedAt), "MMM d, yyyy")} · {readingTime} min
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-1 group-hover:text-zone-news" aria-hidden />
        </div>
        {article.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {article.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="rounded-full bg-zone-news/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zone-news">
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
    </Link>
  );
}
