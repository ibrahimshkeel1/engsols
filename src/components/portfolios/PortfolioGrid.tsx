"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Portfolio } from "@/types";
import { disciplines } from "@/data/disciplines";
import { avatarUrl } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input, Select } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

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
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <Card key={p.slug} className="card-elevated transition hover:border-primary/30">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <Image src={avatarUrl(p.name)} alt="" width={52} height={52} className="rounded-full ring-2 ring-border" unoptimized />
                <div>
                  {p.openToWork && <Badge className="bg-green-500/15 text-green-700 dark:text-green-400">Open to work</Badge>}
                  <h3 className="mt-1 font-semibold">{p.name}</h3>
                  <p className="text-sm text-muted-foreground">{p.headline}</p>
                  <p className="text-xs text-muted-foreground">{p.university} · {p.discipline}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.skills.slice(0, 4).map((s) => <Badge key={s}>{s}</Badge>)}
              </div>
              <Link href={`/portfolios/${p.slug}`} className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
                View portfolio →
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="py-16 text-center text-muted-foreground">No portfolios match your search.</p>
      )}
    </>
  );
}
