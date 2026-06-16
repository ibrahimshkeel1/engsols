export type SkillNode = {
  id: string;
  label: string;
  discipline: string;
  related: string[];
};

/** Engineering skill graph — disciplines linked by shared competencies */
export const engineeringSkills: SkillNode[] = [
  { id: "reservoir-modeling", label: "Reservoir modeling", discipline: "Reservoir Engineering", related: ["production-optimization", "petrophysics"] },
  { id: "production-optimization", label: "Production optimization", discipline: "Production Engineering", related: ["reservoir-modeling", "facilities"] },
  { id: "drilling-ops", label: "Drilling operations", discipline: "Drilling Engineering", related: ["well-control", "directional-drilling"] },
  { id: "well-control", label: "Well control", discipline: "Drilling Engineering", related: ["drilling-ops", "hse"] },
  { id: "directional-drilling", label: "Directional drilling", discipline: "Drilling Engineering", related: ["drilling-ops"] },
  { id: "petrophysics", label: "Petrophysics", discipline: "Geoscience", related: ["reservoir-modeling", "seismic"] },
  { id: "seismic", label: "Seismic interpretation", discipline: "Geoscience", related: ["petrophysics"] },
  { id: "facilities", label: "Facilities design", discipline: "Facilities Engineering", related: ["production-optimization", "process-safety"] },
  { id: "process-safety", label: "Process safety", discipline: "HSE", related: ["facilities", "hse"] },
  { id: "hse", label: "HSE management", discipline: "HSE", related: ["process-safety", "well-control"] },
  { id: "pipelines", label: "Pipeline engineering", discipline: "Pipeline Engineering", related: ["facilities"] },
  { id: "fe-exam", label: "FE exam prep", discipline: "General", related: ["pe-exam"] },
  { id: "pe-exam", label: "PE exam prep", discipline: "General", related: ["fe-exam"] },
];

export function getSkillById(id: string) {
  return engineeringSkills.find((s) => s.id === id);
}

export function getRelatedSkills(skillId: string) {
  const skill = getSkillById(skillId);
  if (!skill) return [];
  return skill.related.map((id) => getSkillById(id)).filter(Boolean) as SkillNode[];
}
