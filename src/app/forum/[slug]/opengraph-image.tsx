import { ImageResponse } from "next/og";
import { getForumPost } from "@/lib/data/forum";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

type Props = { params: Promise<{ slug: string }> };

export default async function Image({ params }: Props) {
  const { slug } = await params;
  const data = await getForumPost(slug);
  const title = data?.post.title ?? "EngSols Forum";

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
        <div style={{ fontSize: 28, opacity: 0.8 }}>EngSols Forum</div>
        <div style={{ fontSize: 48, fontWeight: 700, marginTop: 16, lineHeight: 1.2 }}>{title.slice(0, 120)}</div>
      </div>
    ),
    { ...size },
  );
}
