"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { portfolios } from "@/data/portfolios";
import { disciplines } from "@/data/disciplines";
import { avatarUrl } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function PortfoliosPage() {
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
  }, [search, discipline]);

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Student Portfolios</h1>
            <p className="mt-2 text-slate-600">Discover engineering students and graduates open to opportunities.</p>
          </div>
          <Link href="/portfolios/build" className="inline-flex rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-amber-400">
            Build your portfolio
          </Link>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Input placeholder="Search by name, skills, university..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
          <select value={discipline} onChange={(e) => setDiscipline(e.target.value)} className="h-10 rounded-lg border border-slate-300 px-3 text-sm">
            <option value="">All disciplines</option>
            {disciplines.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <Card key={p.slug}>
              <CardContent>
                <div className="flex items-start gap-3">
                  <Image src={avatarUrl(p.name)} alt="" width={48} height={48} className="rounded-full" unoptimized />
                  <div>
                    {p.openToWork && <Badge className="bg-green-50 text-green-700">Open to work</Badge>}
                    <h3 className="mt-1 font-semibold text-slate-900">{p.name}</h3>
                    <p className="text-sm text-slate-600">{p.headline}</p>
                    <p className="text-xs text-slate-500">{p.university} · {p.discipline}</p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {p.skills.slice(0, 3).map((s) => <Badge key={s}>{s}</Badge>)}
                </div>
                <Link href={`/portfolios/${p.slug}`} className="mt-3 inline-block text-sm font-medium text-amber-600">
                  View portfolio →
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
