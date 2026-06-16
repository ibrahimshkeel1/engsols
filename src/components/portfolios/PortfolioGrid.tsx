"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Portfolio } from "@/types";
import { disciplines } from "@/data/disciplines";
import { getDisciplineColors } from "@/lib/discipline-colors";
import { Avatar } from "@/components/ui/Avatar";
import { DisciplineBadge } from "@/components/ui/DisciplineBadge";
import { Input, Select } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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

  return (
    <>
      <div className="flex flex-wrap gap-3">
        <Input placeholder="Search by name, skills, university..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
        <Select value={discipline} onChange={(e) => setDiscipline(e.target.value)}>
          <option value="">All disciplines</option>
          {disciplines.map((d) => <option key={d} value={d}>{d}</option>)}
        </Select>
      </div>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => {
          const stripe = getDisciplineColors(p.discipline).stripe;
          return (
            <Link key={p.slug} href={`/portfolios/${p.slug}`} className="card-interactive relative flex overflow-hidden rounded-2xl">
              <div className={cn("w-1 shrink-0", stripe)} />
              <div className="flex-1 p-5">
                <div className="flex items-start gap-4">
                  <Avatar name={p.name} discipline={p.discipline} size="md" src={p.avatarUrl} />
                  <div>
                    {p.openToWork && (
                      <span className="inline-flex rounded-md bg-green-500/12 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
                        Open to work
                      </span>
                    )}
                    <h3 className="mt-1 font-semibold">{p.name}</h3>
                    <p className="text-sm text-muted-foreground">{p.headline}</p>
                    <p className="text-xs text-muted-foreground">{p.university}</p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  <DisciplineBadge discipline={p.discipline} />
                  {p.skills.slice(0, 3).map((s) => (
                    <span key={s} className="inline-flex rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">{s}</span>
                  ))}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      {filtered.length === 0 && (
        <p className="py-16 text-center text-muted-foreground">No portfolios match your search.</p>
      )}
    </>
  );
}
