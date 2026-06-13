const companyStyles: Record<string, { bg: string; text: string; abbr: string }> = {
  Shell: { bg: "bg-yellow-400", text: "text-red-700", abbr: "S" },
  Schlumberger: { bg: "bg-blue-600", text: "text-white", abbr: "SLB" },
  BP: { bg: "bg-green-600", text: "text-white", abbr: "BP" },
  Chevron: { bg: "bg-blue-800", text: "text-red-500", abbr: "CVX" },
  Halliburton: { bg: "bg-red-600", text: "text-white", abbr: "HAL" },
  ExxonMobil: { bg: "bg-red-700", text: "text-white", abbr: "XOM" },
  Wood: { bg: "bg-orange-500", text: "text-white", abbr: "W" },
  Baker: { bg: "bg-slate-700", text: "text-white", abbr: "BKR" },
};

export function getCompanyStyle(company: string) {
  const match = Object.entries(companyStyles).find(([key]) =>
    company.toLowerCase().includes(key.toLowerCase()),
  );
  if (match) return { name: match[0], ...match[1] };
  return {
    name: company,
    bg: "bg-muted",
    text: "text-foreground",
    abbr: company.slice(0, 2).toUpperCase(),
  };
}
