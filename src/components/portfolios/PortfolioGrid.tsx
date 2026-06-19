"use client";

import { useMemo, useState } from "react";
import { Briefcase } from "lucide-react";
import type { Portfolio } from "@/types";
import { disciplines } from "@/data/disciplines";
import { PortfolioCard } from "@/components/portfolios/PortfolioCard";
import { EmptyStateClient } from "@/components/shared/EmptyStateClient";
import { Input, Select } from "@/components/ui/input";
import { ProfileBentoGrid } from "@/components/ui/ProfileBentoGrid";

export function PortfolioGrid({ portfolios }: { portfolios: Portfolio[] }) {
  const [search, setSearch] = useState("");
  const [discipline, setDiscipline] = useState("");

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
    return result;
  }, [portfolios, search, discipline]);

  const hasFilters = Boolean(search || discipline);

  function clearFilters() {
    setSearch("");
    setDiscipline("");
  }

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Input placeholder="Search by name, skills, university..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" aria-label="Search portfolios" />
        <Select value={discipline} onChange={(e) => setDiscipline(e.target.value)} aria-label="Filter by discipline">
          <option value="">All disciplines</option>
          {disciplines.map((d) => <option key={d} value={d}>{d}</option>)}
        </Select>
      </div>
      {portfolios.length === 0 ? (
        <div className="mt-8">
          <EmptyStateClient
            icon={Briefcase}
            title="No portfolios yet"
            description="Students can build and publish portfolios to showcase their work."
            action={{ href: "/portfolios/build", label: "Build your portfolio" }}
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
