const disciplineMap: Record<string, { bg: string; text: string; stripe: string }> = {
  "Oil & Gas": { bg: "bg-blue-500/12", text: "text-blue-700 dark:text-blue-300", stripe: "bg-blue-600" },
  "Drilling Engineering": { bg: "bg-orange-500/12", text: "text-orange-700 dark:text-orange-300", stripe: "bg-orange-600" },
  "Reservoir Engineering": { bg: "bg-teal-500/12", text: "text-teal-700 dark:text-teal-300", stripe: "bg-teal-600" },
  "Production Engineering": { bg: "bg-violet-500/12", text: "text-violet-700 dark:text-violet-300", stripe: "bg-violet-600" },
  Mechanical: { bg: "bg-slate-500/12", text: "text-slate-700 dark:text-slate-300", stripe: "bg-slate-600" },
  Civil: { bg: "bg-green-500/12", text: "text-green-700 dark:text-green-300", stripe: "bg-green-600" },
  Electrical: { bg: "bg-yellow-500/12", text: "text-yellow-700 dark:text-yellow-300", stripe: "bg-yellow-600" },
  Chemical: { bg: "bg-pink-500/12", text: "text-pink-700 dark:text-pink-300", stripe: "bg-pink-600" },
  default: { bg: "bg-primary/10", text: "text-primary", stripe: "bg-primary" },
};

export function getDisciplineColors(discipline: string) {
  return disciplineMap[discipline] ?? disciplineMap.default;
}
