import { getListingBySlug } from "@/lib/data/marketplace";
import { buildOgImage } from "@/lib/og-image";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ slug: string }> };

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const listing = await getListingBySlug(slug);

  return buildOgImage({
    title: listing?.title ?? "Marketplace listing",
    subtitle: listing?.category ?? "Engineering marketplace",
    label: "EngSols Marketplace",
  });
}
