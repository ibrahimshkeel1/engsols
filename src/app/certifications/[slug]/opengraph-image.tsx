import { getCertificationBySlug } from "@/lib/data/certifications";
import { buildOgImage } from "@/lib/og-image";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ slug: string }> };

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const cert = await getCertificationBySlug(slug);

  return buildOgImage({
    title: cert?.name ?? "Certification",
    subtitle: cert?.discipline ?? "Exam prep on EngSols",
    label: "EngSols Certifications",
  });
}
