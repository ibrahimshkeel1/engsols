import { getNewsArticle } from "@/lib/data/news";
import { buildOgImage } from "@/lib/og-image";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ slug: string }> };

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const article = await getNewsArticle(slug);

  return buildOgImage({
    title: article?.title ?? "Engineering News",
    subtitle: article?.category ?? "EngSols News",
    label: "EngSols News",
  });
}
