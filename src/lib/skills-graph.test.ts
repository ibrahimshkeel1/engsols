import { describe, expect, it } from "vitest";
import { buildSkillGraph } from "@/lib/skills-graph";
import type { Mentor } from "@/types";

const mentor: Mentor = {
  slug: "a",
  name: "A",
  headline: "H",
  company: "C",
  discipline: "Oil & Gas",
  subFields: [],
  skills: ["Reservoir simulation", "Python"],
  goals: [],
  rating: 5,
  reviewCount: 1,
  monthlyRate: 100,
  introCallRate: 0,
  yearsExperience: 5,
  bio: "bio",
  credentials: [],
  featured: false,
  reviews: [],
};

describe("buildSkillGraph", () => {
  it("includes mentor skills with counts", () => {
    const graph = buildSkillGraph([mentor]);
    const python = graph.find((g) => g.label.toLowerCase().includes("python"));
    expect(python?.mentorCount).toBeGreaterThan(0);
  });
});
