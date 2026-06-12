import type { ForumReply } from "@/types";

export const forumReplies: Record<string, ForumReply[]> = {
  "break-into-reservoir-engineering": [
    { author: "James Whitfield", body: "A master's in petroleum engineering helps but isn't always required. Focus on Eclipse/Petrel, take online reservoir courses, and network at SPE events. I transitioned two mechanical engineers last year.", createdAt: "2026-06-08", isMentor: true, likes: 24 },
    { author: "Transitioning2025", body: "I made the switch with a part-time MSc while working. Took 2 years but landed a reservoir role at an independent.", createdAt: "2026-06-08", isMentor: false, likes: 8 },
    { author: "PetroHR", body: "Highlight any fluid mechanics, thermodynamics, and numerical methods from your ME degree. Those transfer well.", createdAt: "2026-06-09", isMentor: false, likes: 5 },
  ],
  "iwcf-level-4-prep": [
    { author: "Priya Nair", body: "Drill through the IWCF workbook twice. Focus on kill sheet calculations — they test those heavily. I offer a 1-hour mock oral session if you want practice.", createdAt: "2026-06-07", isMentor: true, likes: 18 },
    { author: "RigHand42", body: "Passed last month. The online practice exams on the IWCF portal are closest to the real thing.", createdAt: "2026-06-07", isMentor: false, likes: 12 },
  ],
  "fe-exam-structural-depth": [
    { author: "Carlos Mendez", body: "PPI practice problems + NCEES handbook familiarity. Do timed practice exams in the last 3 weeks. I have a 12-week study plan I share with mentees.", createdAt: "2026-06-05", isMentor: true, likes: 31 },
    { author: "PassedFE2025", body: "School of PE videos were worth it for structural depth. Budget 150-200 hours total.", createdAt: "2026-06-06", isMentor: false, likes: 9 },
  ],
  "eclipse-vs-cmg": [
    { author: "Marcus Chen", body: "Eclipse has more job postings globally. CMG is strong in Canada and thermal. Learn Eclipse first, pick up CMG if you work heavy oil.", createdAt: "2026-06-03", isMentor: true, likes: 15 },
  ],
  "pe-experience-documentation": [
    { author: "Michael O'Connor", body: "Be specific: list calculations you performed, codes you used, and projects you signed off on. Vague descriptions get rejected. Happy to review your write-ups.", createdAt: "2026-06-01", isMentor: true, likes: 22 },
  ],
  "grad-school-petroleum-phd": [
    { author: "Fatima Al-Rashid", body: "Industry values PhDs for R&D and advanced simulation roles. Operators hire PhDs for research centers. Academia if you love publishing. Both paths work.", createdAt: "2026-05-20", isMentor: true, likes: 19 },
  ],
  "artificial-lift-selection": [
    { author: "Elena Volkov", body: "At 7,000 ft and GOR 800, run nodal analysis in PROSPER. ESP is often preferred for high-rate wells; gas lift if you have gas availability. Happy to walk through a case study.", createdAt: "2026-05-18", isMentor: true, likes: 14 },
  ],
};
