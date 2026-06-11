export const disciplines = [
  "Oil & Gas",
  "Drilling Engineering",
  "Reservoir Engineering",
  "Production Engineering",
  "Mechanical",
  "Civil",
  "Electrical",
  "Chemical",
  "Biomedical",
  "Industrial",
  "Materials",
  "Environmental",
  "Agricultural",
  "Marine",
  "Automotive",
  "Mining",
] as const;

export type Discipline = (typeof disciplines)[number];
