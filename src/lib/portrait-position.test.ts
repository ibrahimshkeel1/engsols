import { describe, expect, it } from "vitest";
import { portraitObjectPosition } from "./portrait-position";

describe("portraitObjectPosition", () => {
  it("maps top and bottom anchors", () => {
    expect(portraitObjectPosition(0)).toBe("center top");
    expect(portraitObjectPosition(1)).toBe("center bottom");
    expect(portraitObjectPosition(0.5)).toBe("center 50%");
  });
});
