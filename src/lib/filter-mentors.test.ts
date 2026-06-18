import { describe, expect, it } from "vitest";
import { filterMentors } from "@/lib/filter-mentors";
import type { Mentor } from "@/types";

const sampleMentors: Mentor[] = [
  {
    slug: "alice",
    name: "Alice",
    headline: "Reservoir engineer",
    company: "Big Oil",
    discipline: "Petroleum Engineering",
    subFields: [],
    skills: ["Reservoir simulation", "Python"],
    goals: ["fe-pe"],
    rating: 4.8,
    reviewCount: 10,
    monthlyRate: 200,
    introCallRate: 0,
    yearsExperience: 12,
    bio: "Experienced mentor",
    credentials: [],
    featured: true,
    reviews: [],
  },
  {
    slug: "bob",
    name: "Bob",
    headline: "Drilling specialist",
    company: "Rig Co",
    discipline: "Drilling Engineering",
    subFields: [],
    skills: ["Well control"],
    goals: ["first-job"],
    rating: 4.2,
    reviewCount: 3,
    monthlyRate: 150,
    introCallRate: 0,
    yearsExperience: 8,
    bio: "Drilling mentor",
    credentials: [],
    featured: false,
    reviews: [],
  },
];

describe("filterMentors", () => {
  it("filters by search query", () => {
    const result = filterMentors(sampleMentors, { search: "reservoir" });
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("alice");
  });

  it("filters by discipline", () => {
    const result = filterMentors(sampleMentors, { discipline: "Drilling Engineering" });
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("bob");
  });

  it("sorts by price ascending", () => {
    const result = filterMentors(sampleMentors, { sort: "price-asc" });
    expect(result[0].monthlyRate).toBeLessThanOrEqual(result[1].monthlyRate);
  });
});
