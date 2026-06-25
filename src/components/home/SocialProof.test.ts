import { describe, expect, it } from "vitest";
import { buildSocialProofItems } from "@/components/home/SocialProof";
import type { PlatformStats } from "@/lib/data/stats";

const emptyStats: PlatformStats = {
  mentorCount: 0,
  disciplineCount: 12,
  avgRating: null,
  totalReviews: 0,
  freeIntroCount: 0,
  verifiedMentorCount: 0,
};

describe("buildSocialProofItems", () => {
  it("uses unique ids for every stat row", () => {
    const items = buildSocialProofItems(emptyStats);
    const ids = items.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("does not duplicate intro-call fallbacks", () => {
    const items = buildSocialProofItems(emptyStats);
    const introRows = items.filter((item) => item.label.toLowerCase().includes("intro"));
    expect(introRows).toHaveLength(1);
  });
});
