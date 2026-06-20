"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Briefcase } from "lucide-react";
import type { Portfolio } from "@/types";
import { disciplines } from "@/data/disciplines";
import { PortfolioCard } from "@/components/portfolios/PortfolioCard";
import { EmptyStateClient } from "@/components/shared/EmptyStateClient";
import { Input, Select } from "@/components/ui/input";
import { ProfileBentoGrid } from "@/components/ui/ProfileBentoGrid";
import { cn } from "@/lib/utils";

export function PortfolioGrid({ portfolios }: { portfolios: Portfolio[] }) {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [discipline, setDiscipline] = useState(searchParams.get("discipline") ?? "");
  const [openOnly, setOpenOnly] = useState(searchParams.get("openToWork") === "1");
  const [sort, setSort] = useState<"recent" | "name">("recent");

  const filtered = useMemo(() => {
    let result = [...portfolios];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.skills.some((s) => s.toLowerCase().includes(q)) ||
          p.university.toLowerCase().includes(q),
      );
    }
    if (discipline) result = result.filter((p) => p.discipline === discipline);
    if (openOnly) result = result.filter((p) => p.openToWork);
    if (sort === "name") result.sort((a, b) => a.name.localeCompare(b.name));
    else result.sort((a, b) => (b.updatedAt ?? "").localeCompare(a.updatedAt ?? ""));
    return result;
  }, [portfolios, search, discipline, openOnly, sort]);

  const hasFilters = Boolean(search || discipline || openOnly);

  function clearFilters() {
    setSearch("");
    setDiscipline("");
    setOpenOnly(false);
    setSort("recent");
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <Input placeholder="Search by name, skills, university..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" aria-label="Search portfolios" />
        <Select value={discipline} onChange={(e) => setDiscipline(e.target.value)} aria-label="Filter by discipline">
          <option value="">All disciplines</option>
          {disciplines.map((d) => <option key={d} value={d}>{d}</option>)}
        </Select>
        <Select value={sort} onChange={(e) => setSort(e.target.value as "recent" | "name")} aria-label="Sort portfolios">
          <option value="recent">Recently updated</option>
          <option value="name">Name A–Z</option>
        </Select>
        <button
          type="button"
          onClick={() => setOpenOnly(!openOnly)}
          className={cn(
            "rounded-xl border px-4 py-2 text-sm font-medium transition-colors",
            openOnly ? "border-zone-mentorship-border bg-zone-mentorship/10 text-zone-mentorship-on" : "border-border text-muted-foreground hover:bg-muted",
          )}
        >
          Open to work only
        </button>
      </div>
      {portfolios.length === 0 ? (
        <div className="mt-8">
          <EmptyStateClient
            icon={Briefcase}
            title="No portfolios yet"
            description="Students can build and publish portfolios to showcase their work."
            action={{ href: "/portfolios/build", label: "Build your portfolio" }}
            promptChips={[
              { label: "See mentors", href: "/mentors" },
              { label: "Browse jobs", href: "/jobs" },
            ]}
          />
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-8">
          <EmptyStateClient
            icon={Briefcase}
            title="No portfolios match your search"
            description="Try different keywords or clear your filters."
            onClearFilters={hasFilters ? clearFilters : undefined}
          />
        </div>
      ) : (
        <ProfileBentoGrid
          className="mt-8"
          items={filtered}
          getKey={(portfolio) => portfolio.slug}
          isFeatured={(portfolio) => portfolio.openToWork}
          renderCard={(portfolio, variant) => <PortfolioCard portfolio={portfolio} variant={variant} />}
        />
      )}
    </>
  );
}
