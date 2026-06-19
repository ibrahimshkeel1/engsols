import { slugToDiscipline } from "@/lib/discipline-slug";
import { buildOgImage } from "@/lib/og-image";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ slug: string }> };

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const discipline = slugToDiscipline(slug);

  return buildOgImage({
    title: discipline ?? "Discipline hub",
    subtitle: "Mentors, forum, jobs & certifications",
    label: "EngSols Disciplines",
  });
}
