import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { getNewsArticle, getPublishedNews } from "@/lib/data/news";
import { categoryToDiscipline } from "@/lib/data/content-crosslinks";
import { MarkdownBody } from "@/components/shared/MarkdownBody";
import { ContentCrossLinks } from "@/components/shared/ContentCrossLinks";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 300;

export async function generateStaticParams() {
  const articles = await getPublishedNews();
  return articles.map((a) => ({ slug: a.slug }));
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getNewsArticle(slug);
  if (!article) notFound();

  const discipline = categoryToDiscipline(article.category);

  return (
    <div className="mx-auto max-w-7xl px-4 py-0 sm:px-6">
      <div className="grid gap-10 lg:grid-cols-3 lg:gap-12">
        <article className="lg:col-span-2">
          <header className="border-b border-border">
            {article.cover_image_url && (
              <div className="pt-8">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.cover_image_url}
                  alt=""
                  className="aspect-[21/9] w-full rounded-2xl object-cover"
                />
              </div>
            )}
            <div className="py-16">
              <Link href="/news" className="text-sm font-medium text-primary hover:underline">← Back to news</Link>
              <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-primary">{article.category}</p>
              <h1 className="font-display mt-3 text-4xl leading-tight tracking-tight sm:text-5xl">{article.title}</h1>
              <p className="mt-5 text-lg leading-relaxed text-muted-foreground">{article.excerpt}</p>
              <p className="mt-6 text-sm text-muted-foreground">
                {article.published_at && format(new Date(article.published_at), "MMMM d, yyyy")}
              </p>
            </div>
          </header>
          <div className="py-12">
            <MarkdownBody content={article.body} className="prose prose-lg dark:prose-invert max-w-none leading-relaxed text-foreground/90" />
          </div>
        </article>
        {discipline && (
          <div className="py-12 lg:sticky lg:top-24 lg:self-start">
            <ContentCrossLinks discipline={discipline} />
          </div>
        )}
      </div>
    </div>
  );
}
