import { describe, expect, it } from "vitest";
import {
  computeCanvasLayout,
  isNormalizedSegment,
  normalizePoint,
  toNormalizedSegment,
  toPixelSegment,
  toPixelSegmentCompat,
  WHITEBOARD_ASPECT,
} from "@/lib/whiteboard-coords";

describe("whiteboard-coords", () => {
  it("letterboxes wide containers to the shared aspect ratio", () => {
    const layout = computeCanvasLayout(1600, 900);
    expect(layout.height).toBe(900);
    expect(layout.width / layout.height).toBeCloseTo(WHITEBOARD_ASPECT, 5);
    expect(layout.offsetX).toBeGreaterThan(0);
    expect(layout.offsetY).toBe(0);
  });

  it("letterboxes tall containers to the shared aspect ratio", () => {
    const layout = computeCanvasLayout(390, 700);
    expect(layout.width).toBe(390);
    expect(layout.height).toBeCloseTo(390 / WHITEBOARD_ASPECT, 5);
    expect(layout.offsetY).toBeGreaterThan(0);
  });

  it("round-trips normalized stroke coordinates", () => {
    const layout = computeCanvasLayout(800, 500);
    const point = normalizePoint({ x: 400, y: 250 }, layout);
    const segment = toNormalizedSegment(
      {
        x0: 100,
        y0: 50,
        x1: point.x * layout.width,
        y1: point.y * layout.height,
        color: "#000",
        thickness: 4,
        tool: "pencil",
      },
      layout,
    );

    expect(isNormalizedSegment(segment)).toBe(true);

    const pixels = toPixelSegment(segment, layout);
    expect(pixels.x0).toBeCloseTo(100, 5);
    expect(pixels.y0).toBeCloseTo(50, 5);
    expect(pixels.x1).toBeCloseTo(400, 5);
    expect(pixels.y1).toBeCloseTo(250, 5);
  });

  it("scales legacy pixel strokes for older sessions", () => {
    const layout = computeCanvasLayout(400, 250);
    const legacy = {
      type: "DRAW_STROKE" as const,
      x0: 400,
      y0: 250,
      x1: 800,
      y1: 500,
      color: "#000",
      thickness: 4,
      tool: "line" as const,
    };

    expect(isNormalizedSegment(legacy)).toBe(false);
    const scaled = toPixelSegmentCompat(legacy, layout);
    expect(scaled.x0).toBeCloseTo(200, 5);
    expect(scaled.y0).toBeCloseTo(125, 5);
  });
});
