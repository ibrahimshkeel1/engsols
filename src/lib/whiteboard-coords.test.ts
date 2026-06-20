import { describe, expect, it } from "vitest";
import {
  WHITEBOARD_VIRTUAL_HEIGHT,
  WHITEBOARD_VIRTUAL_WIDTH,
  computeFitTransform,
  isNormalizedStroke,
  normalizeThickness,
  screenToVirtual,
  toNormalizedStroke,
  toVirtualStroke,
  denormalizeThickness,
} from "@/lib/whiteboard-coords";

describe("whiteboard-coords", () => {
  it("fits the virtual canvas inside wide and tall containers", () => {
    const wide = computeFitTransform(1600, 900);
    expect(wide.displayHeight).toBe(900);
    expect(wide.displayWidth / wide.displayHeight).toBeCloseTo(
      WHITEBOARD_VIRTUAL_WIDTH / WHITEBOARD_VIRTUAL_HEIGHT,
      5,
    );
    expect(wide.offsetX).toBeGreaterThan(0);

    const tall = computeFitTransform(390, 700);
    expect(tall.displayWidth).toBe(390);
    expect(tall.displayHeight).toBeCloseTo(390 / (WHITEBOARD_VIRTUAL_WIDTH / WHITEBOARD_VIRTUAL_HEIGHT), 5);
    expect(tall.offsetY).toBeGreaterThan(0);
  });

  it("uses a fixed virtual reference for stroke thickness", () => {
    const normalized = normalizeThickness(4);
    expect(denormalizeThickness(normalized)).toBeCloseTo(4, 5);
  });

  it("round-trips normalized stroke coordinates on the virtual canvas", () => {
    const segment = toNormalizedStroke({
      x0: 100,
      y0: 50,
      x1: 800,
      y1: 500,
      color: "#000",
      thickness: 4,
      tool: "pencil",
    });

    expect(isNormalizedStroke(segment)).toBe(true);

    const pixels = toVirtualStroke(segment);
    expect(pixels.x0).toBeCloseTo(100, 5);
    expect(pixels.y0).toBeCloseTo(50, 5);
    expect(pixels.x1).toBeCloseTo(800, 5);
    expect(pixels.y1).toBeCloseTo(500, 5);
    expect(pixels.thickness).toBeCloseTo(4, 5);
  });

  it("maps screen coordinates through fit and zoom transforms", () => {
    const fit = computeFitTransform(800, 500);
    const rect = { left: 0, top: 0, width: 800, height: 500, right: 800, bottom: 500 } as DOMRect;
    const point = screenToVirtual(400, 250, rect, fit, { zoom: 1, panX: 0, panY: 0 });
    expect(point?.x).toBeCloseTo(WHITEBOARD_VIRTUAL_WIDTH / 2, 0);
    expect(point?.y).toBeCloseTo(WHITEBOARD_VIRTUAL_HEIGHT / 2, 0);
  });
});
