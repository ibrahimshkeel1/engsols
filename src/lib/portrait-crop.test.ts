import { describe, expect, it } from "vitest";
import { getObjectCoverCrop } from "./portrait-crop";

describe("getObjectCoverCrop", () => {
  it("crops sides on a wide landscape photo", () => {
    const crop = getObjectCoverCrop(1600, 900, 3 / 4);
    expect(crop.y).toBe(0);
    expect(crop.height).toBe(1);
    expect(crop.width).toBeLessThan(1);
    expect(crop.x).toBeGreaterThan(0);
  });

  it("crops bottom on a tall portrait photo", () => {
    const crop = getObjectCoverCrop(900, 1600, 1);
    expect(crop.x).toBe(0);
    expect(crop.width).toBe(1);
    expect(crop.height).toBeLessThan(1);
    expect(crop.y).toBe(0);
  });

  it("shows full square image in a square frame", () => {
    const crop = getObjectCoverCrop(800, 800, 1);
    expect(crop).toEqual({ x: 0, y: 0, width: 1, height: 1 });
  });

  it("shifts crop with focusY on tall images", () => {
    const top = getObjectCoverCrop(900, 1600, 1, 0);
    const mid = getObjectCoverCrop(900, 1600, 1, 0.5);
    expect(top.y).toBe(0);
    expect(mid.y).toBeGreaterThan(top.y);
  });
});
