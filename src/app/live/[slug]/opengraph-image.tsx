import { getLiveSession } from "@/lib/data/live";
import { buildOgImage } from "@/lib/og-image";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ slug: string }> };

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const session = await getLiveSession(slug);

  return buildOgImage({
    title: session?.title ?? "Live Session",
    subtitle: session?.discipline ?? "Engineering live on EngSols",
    label: session?.status === "live" ? "Live now" : "EngSols Live",
  });
}
