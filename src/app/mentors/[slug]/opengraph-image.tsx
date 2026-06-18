import { ImageResponse } from "next/og";
import { getMentorBySlug } from "@/lib/data/mentors";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ slug: string }> };

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const mentor = await getMentorBySlug(slug);

  const title = mentor?.name ?? "EngSols Mentor";
  const subtitle = mentor?.headline ?? "Engineering mentorship";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)",
          color: "white",
        }}
      >
        <div style={{ fontSize: 28, opacity: 0.8 }}>EngSols</div>
        <div style={{ fontSize: 64, fontWeight: 700, marginTop: 16 }}>{title}</div>
        <div style={{ fontSize: 32, marginTop: 12, opacity: 0.85 }}>{subtitle}</div>
      </div>
    ),
    { ...size },
  );
}
