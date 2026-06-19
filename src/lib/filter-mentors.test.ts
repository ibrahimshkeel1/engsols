import { describe, expect, it } from "vitest";
import { applyStrictMentorFilters, filterMentors } from "@/lib/filter-mentors";
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
  {
    slug: "carol",
    name: "Carol",
    headline: "Mechanical systems engineer",
    company: "Thermal Works",
    discipline: "Mechanical",
    subFields: ["Thermal hydraulics"],
    skills: ["Thermodynamics", "Heat transfer", "CFD"],
    goals: ["fe-pe"],
    rating: 4.6,
    reviewCount: 8,
    monthlyRate: 180,
    introCallRate: 0,
    yearsExperience: 10,
    bio: "Mechanical mentor",
    credentials: [],
    featured: false,
    reviews: [],
  },
];

describe("applyStrictMentorFilters", () => {
  it("filters by search query", () => {
    const result = applyStrictMentorFilters(sampleMentors, { search: "reservoir" });
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("alice");
  });

  it("filters by discipline", () => {
    const result = applyStrictMentorFilters(sampleMentors, { discipline: "Drilling Engineering" });
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe("bob");
  });

  it("sorts by price ascending", () => {
    const result = applyStrictMentorFilters(sampleMentors, { sort: "price-asc" });
    expect(result[0].monthlyRate).toBeLessThanOrEqual(result[1].monthlyRate);
  });

  it("filters by session type", () => {
    const withCalendly: Mentor = {
      ...sampleMentors[0],
      slug: "dave",
      studyPlanCalendlyUrl: "https://calendly.com/dave",
    };
    const result = applyStrictMentorFilters([...sampleMentors, withCalendly], { session: "study-plan" });
    expect(result.every((m) => m.goals.includes("fe-pe") || m.studyPlanCalendlyUrl || m.calendlyUrl)).toBe(true);
  });
});

describe("filterMentors fallback", () => {
  it("returns strict results without fallback flag when matches exist", () => {
    const result = filterMentors(sampleMentors, { discipline: "Mechanical" });
    expect(result.isFallback).toBe(false);
    expect(result.items).toHaveLength(1);
    expect(result.items[0].slug).toBe("carol");
  });

  it("falls back to mechanical mentors for niche nuclear search", () => {
    const result = filterMentors(sampleMentors, { search: "Nuclear Engineering" });
    expect(result.isFallback).toBe(true);
    expect(result.items.some((m) => m.slug === "carol")).toBe(true);
    expect(result.fallbackReason).toMatch(/Nuclear/i);
  });

  it("falls back to adjacent disciplines when discipline has no mentors", () => {
    const oilGasMentor: Mentor = {
      ...sampleMentors[0],
      slug: "oil",
      discipline: "Oil & Gas",
    };
    const result = filterMentors([oilGasMentor, ...sampleMentors], { discipline: "Reservoir Engineering" });
    expect(result.isFallback).toBe(true);
    expect(result.items.some((m) => m.discipline === "Oil & Gas")).toBe(true);
  });
});
