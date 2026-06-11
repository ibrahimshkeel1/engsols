import type { SessionType } from "@/types";

export const sessionTypes: SessionType[] = [
  {
    id: "intro",
    title: "Introductory Call",
    description:
      "Not sure how mentorship works? In a casual introductory call, your mentor will explain their background, how they can help, and what a typical program looks like for your goals.",
    price: 39,
  },
  {
    id: "study-plan",
    title: "Study Plan",
    description:
      "Overwhelmed by resources for FE/PE prep, reservoir simulation, or drilling certifications? A mentor will map out a focused study plan tailored to your timeline and experience.",
    price: 119,
  },
  {
    id: "interview-prep",
    title: "Interview Preparation",
    description:
      "Big interviews coming up? In this 1-hour session, a mentor with hiring experience will run a realistic technical interview and give actionable feedback.",
    price: 149,
  },
];
