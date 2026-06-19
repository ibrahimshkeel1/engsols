import { ImageResponse } from "next/og";

type OgProps = { title: string; subtitle: string; label?: string };

export function buildOgImage({ title, subtitle, label = "EngSols" }: OgProps) {
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
        <div style={{ fontSize: 28, opacity: 0.8 }}>{label}</div>
        <div style={{ fontSize: 56, fontWeight: 700, marginTop: 16, lineHeight: 1.1 }}>{title}</div>
        <div style={{ fontSize: 28, marginTop: 16, opacity: 0.85 }}>{subtitle}</div>
      </div>
    ),
    { ...{ width: 1200, height: 630 } },
  );
}
