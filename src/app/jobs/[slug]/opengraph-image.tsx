import { ImageResponse } from "next/og";
import { getJobBySlug } from "@/lib/data/jobs";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ slug: string }> };

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);
  const title = job?.title ?? "Engineering Job";
  const company = job?.company ?? "EngSols";

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
          background: "linear-gradient(135deg, #0f172a 0%, #14532d 100%)",
          color: "white",
        }}
      >
        <div style={{ fontSize: 28, opacity: 0.8 }}>{company}</div>
        <div style={{ fontSize: 52, fontWeight: 700, marginTop: 16 }}>{title.slice(0, 100)}</div>
      </div>
    ),
    { ...size },
  );
}
