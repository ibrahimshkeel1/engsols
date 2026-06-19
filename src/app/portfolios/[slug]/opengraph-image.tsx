import { getPortfolio } from "@/lib/data/portfolios";
import { buildOgImage } from "@/lib/og-image";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ slug: string }> };

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const portfolio = await getPortfolio(slug);

  return buildOgImage({
    title: portfolio?.name ?? "Student Portfolio",
    subtitle: portfolio?.headline ?? "Engineering talent on EngSols",
    label: "EngSols Portfolio",
  });
}
