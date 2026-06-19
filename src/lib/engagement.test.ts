import { describe, expect, it } from "vitest";
import { getEngagementMet } from "@/lib/engagement";

describe("getEngagementMet", () => {
  it("returns false during SSR (no window)", () => {
    expect(getEngagementMet()).toBe(false);
  });
});
