import { getCompanyBySlug } from "@/lib/data/companies";
import { buildOgImage } from "@/lib/og-image";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ slug: string }> };

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const company = await getCompanyBySlug(slug);

  return buildOgImage({
    title: company?.name ?? "Company",
    subtitle: company?.headquarters ?? "Engineering employers on EngSols",
    label: "EngSols Companies",
  });
}
