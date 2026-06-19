import { getVideoBySlug } from "@/lib/data/videos";
import { buildOgImage } from "@/lib/og-image";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ slug: string }> };

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const video = await getVideoBySlug(slug);

  return buildOgImage({
    title: video?.title ?? "Engineering Video",
    subtitle: video?.discipline ?? "Learn with EngSols",
    label: "EngSols Videos",
  });
}
