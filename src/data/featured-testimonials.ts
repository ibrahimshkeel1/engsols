import type { FeaturedTestimonial } from "@/types";

/** Curated outcome stories — enriched at runtime with live mentor review data when available. */
export const featuredTestimonials: FeaturedTestimonial[] = [
  {
    quote:
      "My mentor helped me turn a vague 'get into reservoir engineering' goal into a 90-day plan. I had an offer within two months of our first intro call.",
    name: "Sara Al-Hassan",
    role: "Graduate Reservoir Engineer",
    discipline: "Reservoir Engineering",
    mentorSlug: undefined,
  },
  {
    quote:
      "I was stuck on FE prep for a year. Three sessions on problem strategy and I passed on my next attempt — the mock exams alone were worth it.",
    name: "James Okonkwo",
    role: "Mechanical Engineer, EIT",
    discipline: "Mechanical",
    mentorSlug: undefined,
  },
  {
    quote:
      "The forum pointed me to the right mentor for drilling internships. Having someone who's actually hired grads at a major operator changed how I pitched my portfolio.",
    name: "Priya Menon",
    role: "Drilling Engineering Intern",
    discipline: "Drilling Engineering",
    portfolioSlug: undefined,
  },
];
