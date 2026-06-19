import { disciplines } from "@/data/disciplines";

export function disciplineToSlug(discipline: string): string {
  return discipline
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function slugToDiscipline(slug: string): string | null {
  const normalized = slug.toLowerCase();
  return disciplines.find((d) => disciplineToSlug(d) === normalized) ?? null;
}

export function getDisciplineSlugs(): { slug: string; name: string }[] {
  return disciplines.map((name) => ({ slug: disciplineToSlug(name), name }));
}
