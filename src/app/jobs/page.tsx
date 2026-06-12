"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { jobs } from "@/data/jobs";
import { disciplines } from "@/data/disciplines";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function JobsPage() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");
  const [discipline, setDiscipline] = useState(searchParams.get("discipline") ?? "");

  const filtered = useMemo(() => {
    let result = [...jobs];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q),
      );
    }
    if (type) result = result.filter((j) => j.type === type);
    if (discipline) result = result.filter((j) => j.discipline === discipline);
    result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    return result;
  }, [search, type, discipline]);

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Engineering Jobs</h1>
            <p className="mt-2 text-slate-600">Roles across oil & gas, drilling, reservoir, and applied engineering.</p>
          </div>
          <Link href="/jobs/post" className="inline-flex rounded-lg bg-amber-500 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-amber-400">
            Post a job
          </Link>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {(["", "full-time", "internship", "contract", "graduate-program"] as const).map((t) => (
            <button
              key={t || "all"}
              onClick={() => setType(t)}
              className={`rounded-lg px-3 py-1.5 text-sm capitalize ${type === t ? "bg-slate-900 text-white" : "bg-slate-100"}`}
            >
              {t ? t.replace("-", " ") : "All"}
            </button>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Input placeholder="Search jobs..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
          <select value={discipline} onChange={(e) => setDiscipline(e.target.value)} className="h-10 rounded-lg border border-slate-300 px-3 text-sm">
            <option value="">All disciplines</option>
            {disciplines.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="mt-8 space-y-3">
          {filtered.map((job) => (
            <Card key={job.slug}>
              <CardContent className="py-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="capitalize">{job.type.replace("-", " ")}</Badge>
                      {job.featured && <Badge className="bg-amber-50 text-amber-800">Featured</Badge>}
                      <Badge>{job.discipline}</Badge>
                    </div>
                    <Link href={`/jobs/${job.slug}`} className="mt-2 block text-lg font-semibold text-slate-900 hover:text-amber-600">
                      {job.title}
                    </Link>
                    <p className="text-slate-600">
                      <Link href={`/companies/${job.companySlug}`} className="hover:text-amber-600">{job.company}</Link>
                      {" · "}{job.location} · {job.remote}
                    </p>
                    {job.salaryRange && <p className="mt-1 text-sm font-medium text-slate-700">{job.salaryRange}</p>}
                  </div>
                  <span className="text-xs text-slate-500">{job.postedAt}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
