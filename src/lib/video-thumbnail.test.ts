import { describe, expect, it } from "vitest";
import { resolveVideoThumbnail } from "@/lib/video-thumbnail";

describe("resolveVideoThumbnail", () => {
  it("uses explicit thumbnail URL when provided", () => {
    expect(resolveVideoThumbnail("Test", null, "https://cdn.example.com/thumb.jpg")).toBe(
      "https://cdn.example.com/thumb.jpg",
    );
  });

  it("derives YouTube thumbnail from video URL", () => {
    expect(resolveVideoThumbnail("Test", "https://www.youtube.com/watch?v=dQw4w9WgXcQ", null)).toBe(
      "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    );
  });

  it("falls back to generated placeholder", () => {
    const url = resolveVideoThumbnail("Reservoir simulation", null, null);
    expect(url).toMatch(/^data:image\/svg\+xml/);
  });
});
