import type { Certification } from "@/types";

export const certifications: Certification[] = [
  {
    slug: "fe-exam",
    name: "Fundamentals of Engineering Exam",
    shortName: "FE",
    discipline: "General",
    description:
      "The first step toward professional engineering licensure in the United States. Required before taking the PE exam in most states.",
    eligibility: "Enrolled in or graduated from an ABET-accredited engineering program.",
    examFormat: "6-hour computer-based exam, discipline-specific depth section.",
    avgPrepMonths: 3,
    passRate: "~70%",
    resources: [
      { title: "NCEES FE Reference Handbook", type: "official" },
      { title: "PPI FE Practice Problems", type: "book" },
      { title: "School of PE FE Review", type: "course" },
    ],
    relatedMentorSlugs: ["carlos-mendez", "michael-oconnor", "ahmed-hassan"],
    forumThreadSlugs: ["fe-exam-structural-depth"],
  },
  {
    slug: "pe-exam",
    name: "Professional Engineer Exam",
    shortName: "PE",
    discipline: "General",
    description:
      "License to practice engineering independently. Requires FE, experience, and passing the PE exam in your discipline.",
    eligibility: "4+ years of engineering experience under a PE (varies by state), FE passed.",
    examFormat: "8-hour exam: breadth AM + depth PM in your discipline.",
    avgPrepMonths: 4,
    passRate: "~65%",
    resources: [
      { title: "NCEES PE Reference Handbook", type: "official" },
      { title: "PPI PE Practice Problems", type: "book" },
    ],
    relatedMentorSlugs: ["michael-oconnor", "carlos-mendez", "elena-volkov"],
    forumThreadSlugs: ["pe-experience-documentation"],
  },
  {
    slug: "iwcf-level-4",
    name: "IWCF Level 4 Well Control",
    shortName: "IWCF Level 4",
    discipline: "Drilling Engineering",
    description:
      "International well control certification required for supervisory drilling roles on many rigs worldwide.",
    eligibility: "Drilling experience; Level 3 prerequisite for some candidates.",
    examFormat: "Written + practical assessment covering surface and subsea well control.",
    avgPrepMonths: 2,
    passRate: "~75%",
    resources: [
      { title: "IWCF Official Workbook", type: "official" },
      { title: "Well Control Principles & Procedures", type: "book" },
    ],
    relatedMentorSlugs: ["priya-nair", "david-okonkwo", "isabelle-martin"],
    forumThreadSlugs: ["iwcf-level-4-prep"],
  },
  {
    slug: "api-510",
    name: "API 510 Pressure Vessel Inspector",
    shortName: "API 510",
    discipline: "Mechanical",
    description:
      "Certification for inspection of pressure vessels in oil & gas and petrochemical facilities.",
    eligibility: "Combination of education and inspection experience per API requirements.",
    examFormat: "Closed-book exam covering code, inspection, and calculations.",
    avgPrepMonths: 4,
    passRate: "~60%",
    resources: [
      { title: "API 510 Publication", type: "official" },
      { title: "ASME Section VIII", type: "book" },
    ],
    relatedMentorSlugs: ["michael-oconnor", "vikram-patel"],
  },
  {
    slug: "nace-cip",
    name: "NACE Corrosion Inspector",
    shortName: "NACE CIP",
    discipline: "Oil & Gas",
    description:
      "Corrosion inspection certification for pipelines, tanks, and offshore structures.",
    eligibility: "Corrosion/inspection experience; Level 1 before Level 2/3.",
    examFormat: "Written exam + practical coating inspection assessment.",
    avgPrepMonths: 3,
    resources: [
      { title: "NACE CIP Course Manual", type: "official" },
    ],
    relatedMentorSlugs: ["vikram-patel"],
  },
  {
    slug: "pmp",
    name: "Project Management Professional",
    shortName: "PMP",
    discipline: "General",
    description:
      "Globally recognized project management certification valuable for engineering managers and EPC leads.",
    eligibility: "4-year degree + 36 months leading projects + 35 hours PM education.",
    examFormat: "180-question computer-based exam.",
    avgPrepMonths: 3,
    passRate: "~58%",
    resources: [
      { title: "PMBOK Guide", type: "official" },
      { title: "Rita Mulcahy PMP Prep", type: "book" },
    ],
    relatedMentorSlugs: ["fatima-al-rashid", "samuel-adeyemi"],
  },
  {
    slug: "spe-cert-reservoir",
    name: "SPE Petroleum Engineering Certification",
    shortName: "SPE PET",
    discipline: "Reservoir Engineering",
    description:
      "SPE's petroleum engineering certification demonstrating competency in upstream engineering.",
    eligibility: "Petroleum engineering degree + experience per SPE guidelines.",
    examFormat: "Comprehensive petroleum engineering examination.",
    avgPrepMonths: 4,
    resources: [
      { title: "SPE Certification Guide", type: "official" },
      { title: "Petroleum Engineering Handbook", type: "book" },
    ],
    relatedMentorSlugs: ["james-whitfield", "fatima-al-rashid", "marcus-chen"],
  },
  {
    slug: "completions-cert",
    name: "Well Completions Certification",
    shortName: "Completions",
    discipline: "Production Engineering",
    description:
      "Industry certification covering well completion design, sand control, and stimulation.",
    eligibility: "Production/completions engineering experience.",
    examFormat: "Technical exam on completion design and operations.",
    avgPrepMonths: 2,
    resources: [
      { title: "Well Completions Textbook", type: "book" },
    ],
    relatedMentorSlugs: ["elena-volkov", "isabelle-martin"],
    forumThreadSlugs: ["artificial-lift-selection"],
  },
];

export function getCertificationBySlug(slug: string) {
  return certifications.find((c) => c.slug === slug);
}
