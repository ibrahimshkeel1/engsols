import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { getNewsArticle, getPublishedNews } from "@/lib/data/news";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  const articles = await getPublishedNews();
  return articles.map((a) => ({ slug: a.slug }));
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getNewsArticle(slug);
  if (!article) notFound();

  return (
    <article>
      <header className="border-b border-border">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <Link href="/news" className="text-sm font-medium text-primary hover:underline">← Back to news</Link>
          <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-primary">{article.category}</p>
          <h1 className="font-display mt-3 text-4xl leading-tight tracking-tight sm:text-5xl">{article.title}</h1>
          <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{article.excerpt}</p>
          <p className="mt-6 text-sm text-muted-foreground">
            {article.published_at && format(new Date(article.published_at), "MMMM d, yyyy")}
          </p>
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <div className="prose prose-lg dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed text-foreground/90">
          {article.body}
        </div>
      </div>
    </article>
  );
}
