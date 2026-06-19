import type { Mentor } from "@/types";
import { engineeringSkills, getSkillById, getRelatedSkills } from "@/data/engineering-skills";

export type MentorFilters = {
  search?: string;
  discipline?: string;
  subField?: string;
  goal?: string;
  skill?: string;
  company?: string;
  session?: string;
  sort?: "rating" | "price-asc" | "price-desc";
};

export type MentorFilterResult = {
  items: Mentor[];
  isFallback: boolean;
  fallbackReason: string | null;
};

/** Adjacent disciplines for zero-result discipline fallbacks */
const ADJACENT_DISCIPLINES: Record<string, string[]> = {
  "Oil & Gas": ["Drilling Engineering", "Reservoir Engineering", "Production Engineering"],
  "Drilling Engineering": ["Oil & Gas", "Reservoir Engineering", "Production Engineering", "Mechanical"],
  "Reservoir Engineering": ["Oil & Gas", "Drilling Engineering", "Production Engineering"],
  "Production Engineering": ["Oil & Gas", "Mechanical", "Chemical"],
  Mechanical: ["Automotive", "Industrial", "Materials", "Mining"],
  Automotive: ["Mechanical", "Industrial", "Electrical"],
  Civil: ["Environmental", "Mining", "Marine"],
  Electrical: ["Industrial", "Biomedical", "Automotive"],
  Chemical: ["Materials", "Environmental", "Biomedical", "Mechanical"],
  Biomedical: ["Chemical", "Electrical", "Mechanical"],
  Industrial: ["Mechanical", "Automotive", "Electrical"],
  Materials: ["Mechanical", "Chemical", "Mining"],
  Environmental: ["Civil", "Chemical", "Agricultural"],
  Agricultural: ["Environmental", "Mechanical", "Chemical"],
  Marine: ["Civil", "Mechanical", "Oil & Gas"],
  Mining: ["Civil", "Mechanical", "Materials", "Environmental"],
};

/** Niche search terms mapped to parent discipline + transferable skill hints */
const NICHE_DISCIPLINE_HINTS: { pattern: RegExp; parent: string; skillHints: string[]; label: string }[] = [
  {
    pattern: /nuclear/i,
    parent: "Mechanical",
    skillHints: ["thermodynamic", "heat transfer", "fluid", "thermal"],
    label: "Nuclear Engineering",
  },
  {
    pattern: /aerospace/i,
    parent: "Mechanical",
    skillHints: ["structural", "fluid", "composite", "dynamics"],
    label: "Aerospace Engineering",
  },
  {
    pattern: /petroleum|upstream|downstream/i,
    parent: "Oil & Gas",
    skillHints: ["reservoir", "drilling", "production"],
    label: "Petroleum Engineering",
  },
];

const TRANSFERABLE_SKILL_KEYWORDS = [
  ...new Set(
    engineeringSkills.flatMap((s) => [
      s.label.toLowerCase(),
      ...s.related.flatMap((id) => {
        const related = getSkillById(id);
        return related ? [related.label.toLowerCase()] : [];
      }),
    ]),
  ),
];

function sortMentors(mentors: Mentor[], sort?: MentorFilters["sort"]): Mentor[] {
  const result = [...mentors];
  switch (sort) {
    case "price-asc":
      result.sort((a, b) => a.monthlyRate - b.monthlyRate);
      break;
    case "price-desc":
      result.sort((a, b) => b.monthlyRate - a.monthlyRate);
      break;
    case "rating":
    default:
      result.sort((a, b) => b.rating - a.rating);
      break;
  }
  return result;
}

/** Strict filter pass — no fallback widening */
export function applyStrictMentorFilters(mentors: Mentor[], filters: MentorFilters): Mentor[] {
  let result = [...mentors];

  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.headline.toLowerCase().includes(q) ||
        m.company.toLowerCase().includes(q) ||
        m.skills.some((s) => s.toLowerCase().includes(q)) ||
        m.discipline.toLowerCase().includes(q) ||
        m.subFields.some((s) => s.toLowerCase().includes(q)),
    );
  }

  if (filters.discipline) {
    result = result.filter((m) => m.discipline === filters.discipline);
  }

  if (filters.subField) {
    const sf = filters.subField.toLowerCase();
    result = result.filter(
      (m) =>
        m.subFields.some((s) => s.toLowerCase().includes(sf)) ||
        m.headline.toLowerCase().includes(sf) ||
        m.skills.some((s) => s.toLowerCase().includes(sf)),
    );
  }

  if (filters.company) {
    const company = filters.company.toLowerCase();
    result = result.filter((m) => m.company.toLowerCase().includes(company));
  }

  if (filters.goal) {
    result = result.filter((m) => m.goals.includes(filters.goal!));
  }

  if (filters.session === "study-plan") {
    result = result.filter(
      (m) => m.studyPlanCalendlyUrl || m.calendlyUrl || m.goals.includes("fe-pe"),
    );
  } else if (filters.session === "interview-prep") {
    result = result.filter(
      (m) => m.interviewCalendlyUrl || m.calendlyUrl || m.goals.includes("ace-interviews"),
    );
  }

  if (filters.skill) {
    const skill = getSkillById(filters.skill);
    if (skill) {
      const label = skill.label.toLowerCase();
      result = result.filter(
        (m) =>
          m.discipline === skill.discipline ||
          m.skills.some((s) => s.toLowerCase().includes(label) || label.includes(s.toLowerCase())),
      );
    }
  }

  return sortMentors(result, filters.sort);
}

function mentorsWithSkillOverlap(mentors: Mentor[], skillHints: string[]): Mentor[] {
  const hints = skillHints.map((h) => h.toLowerCase());
  return mentors.filter((m) =>
    hints.some(
      (hint) =>
        m.skills.some((s) => s.toLowerCase().includes(hint)) ||
        m.headline.toLowerCase().includes(hint) ||
        m.subFields.some((s) => s.toLowerCase().includes(hint)),
    ),
  );
}

function mentorsInDisciplines(mentors: Mentor[], disciplines: string[]): Mentor[] {
  const set = new Set(disciplines);
  return mentors.filter((m) => set.has(m.discipline));
}

function detectNicheFromSearch(search?: string) {
  if (!search) return null;
  return NICHE_DISCIPLINE_HINTS.find((n) => n.pattern.test(search)) ?? null;
}

function resolveFallback(mentors: Mentor[], filters: MentorFilters): MentorFilterResult {
  const baseFilters = { ...filters };

  // 1. Skill filter → drop skill, keep parent discipline from skill graph
  if (filters.skill) {
    const skill = getSkillById(filters.skill);
    if (skill) {
      const withoutSkill = applyStrictMentorFilters(mentors, { ...baseFilters, skill: undefined });
      if (withoutSkill.length > 0) {
        return {
          items: withoutSkill,
          isFallback: true,
          fallbackReason: `No mentors matched "${skill.label}" exactly. Showing mentors with related expertise instead.`,
        };
      }

      const disciplineOnly = applyStrictMentorFilters(mentors, {
        ...baseFilters,
        skill: undefined,
        discipline: skill.discipline,
        subField: undefined,
      });
      if (disciplineOnly.length > 0) {
        return {
          items: disciplineOnly,
          isFallback: true,
          fallbackReason: `No mentors with "${skill.label}" skills found. Showing all ${skill.discipline} mentors instead.`,
        };
      }

      const relatedIds = getRelatedSkills(filters.skill).map((s) => s.id);
      const relatedLabels = relatedIds
        .map((id) => getSkillById(id)?.label)
        .filter(Boolean) as string[];
      const relatedOverlap = sortMentors(
        mentorsWithSkillOverlap(mentors, [skill.label, ...relatedLabels]),
        filters.sort,
      );
      if (relatedOverlap.length > 0) {
        return {
          items: relatedOverlap,
          isFallback: true,
          fallbackReason: `No exact match for "${skill.label}". Showing mentors with transferable skills in related fields.`,
        };
      }
    }
  }

  // 2. Sub-field filter → strip sub-field, keep discipline
  if (filters.subField) {
    const withoutSubField = applyStrictMentorFilters(mentors, { ...baseFilters, subField: undefined });
    if (withoutSubField.length > 0) {
      const disciplineLabel = filters.discipline ?? "this discipline";
      return {
        items: withoutSubField,
        isFallback: true,
        fallbackReason: `No mentors specializing in "${filters.subField}" found. Showing all ${disciplineLabel} mentors instead.`,
      };
    }
  }

  // 3. Discipline filter → adjacent disciplines + skill overlap
  if (filters.discipline) {
    const adjacent = ADJACENT_DISCIPLINES[filters.discipline] ?? [];
    const relaxed = applyStrictMentorFilters(mentors, {
      ...baseFilters,
      discipline: undefined,
      subField: undefined,
      skill: undefined,
    });
    const adjacentMentors = sortMentors(
      mentorsInDisciplines(relaxed.length > 0 ? relaxed : mentors, adjacent),
      filters.sort,
    );
    if (adjacentMentors.length > 0) {
      const adjacentLabel = adjacent.slice(0, 2).join(" and ");
      return {
        items: adjacentMentors,
        isFallback: true,
        fallbackReason: `No ${filters.discipline} mentors found. Showing top mentors in related fields (${adjacentLabel}).`,
      };
    }

    const transferable = sortMentors(
      mentorsWithSkillOverlap(relaxed.length > 0 ? relaxed : mentors, TRANSFERABLE_SKILL_KEYWORDS),
      filters.sort,
    );
    if (transferable.length > 0) {
      return {
        items: transferable,
        isFallback: true,
        fallbackReason: `No ${filters.discipline} mentors found. Showing mentors with overlapping engineering skills instead.`,
      };
    }
  }

  // 4. Niche search terms (e.g. Nuclear Engineering)
  const niche = detectNicheFromSearch(filters.search);
  if (niche) {
    const nicheMentors = sortMentors(
      mentorsWithSkillOverlap(
        mentorsInDisciplines(mentors, [niche.parent, ...(ADJACENT_DISCIPLINES[niche.parent] ?? [])]),
        niche.skillHints,
      ),
      filters.sort,
    );
    if (nicheMentors.length > 0) {
      return {
        items: nicheMentors,
        isFallback: true,
        fallbackReason: `No ${niche.label} mentors found. Showing ${niche.parent} mentors with relevant ${niche.skillHints[0]} skills instead.`,
      };
    }
  }

  // 5. Relax search-only filters
  if (filters.search) {
    const withoutSearch = applyStrictMentorFilters(mentors, { ...baseFilters, search: undefined });
    if (withoutSearch.length > 0) {
      return {
        items: withoutSearch,
        isFallback: true,
        fallbackReason: `No mentors matched "${filters.search}". Showing results for your other active filters.`,
      };
    }
  }

  // 6. Top-rated mentors platform-wide
  const topRated = sortMentors(mentors, filters.sort).slice(0, 12);
  if (topRated.length > 0) {
    return {
      items: topRated,
      isFallback: true,
      fallbackReason: "No exact matches for your filters. Showing our highest-rated mentors across disciplines.",
    };
  }

  return { items: [], isFallback: false, fallbackReason: null };
}

export function filterMentors(mentors: Mentor[], filters: MentorFilters): MentorFilterResult {
  const strict = applyStrictMentorFilters(mentors, filters);
  if (strict.length > 0) {
    return { items: strict, isFallback: false, fallbackReason: null };
  }
  return resolveFallback(mentors, filters);
}

export function getMentorBySlug(mentors: Mentor[], slug: string) {
  return mentors.find((m) => m.slug === slug);
}

export function getSimilarMentors(mentors: Mentor[], mentor: Mentor, limit = 4) {
  return mentors
    .filter((m) => m.slug !== mentor.slug && m.discipline === mentor.discipline)
    .slice(0, limit);
}
