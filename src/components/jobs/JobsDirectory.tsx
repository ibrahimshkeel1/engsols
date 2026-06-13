"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { jobs } from "@/data/jobs";
import { disciplines } from "@/data/disciplines";
import { ListPageLayout } from "@/components/shared/ListPageLayout";
import { DisciplineBadge } from "@/components/ui/DisciplineBadge";
import { Input, Select } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getDisciplineColors } from "@/lib/discipline-colors";

export function JobsDirectory() {
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
    <ListPageLayout
      label="Careers"
      title="Engineering Jobs"
      description="Roles across oil & gas, drilling, reservoir, and applied engineering. Full listings coming with employer partnerships."
      preview
      action={
        <Link href="/jobs/post" className="inline-flex h-11 items-center rounded-xl bg-accent px-5 text-sm font-semibold text-accent-foreground shadow-sm hover:brightness-110">
          Post a job
        </Link>
      }
    >
      <div className="flex flex-wrap gap-2">
        {(["", "full-time", "internship", "contract", "graduate-program"] as const).map((t) => (
          <button
            key={t || "all"}
            onClick={() => setType(t)}
            className={cn(
              "rounded-xl px-4 py-2 text-sm font-medium capitalize transition",
              type === t ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground hover:text-foreground",
            )}
          >
            {t ? t.replace("-", " ") : "All"}
          </button>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <Input placeholder="Search jobs..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
        <Select value={discipline} onChange={(e) => setDiscipline(e.target.value)}>
          <option value="">All disciplines</option>
          {disciplines.map((d) => <option key={d} value={d}>{d}</option>)}
        </Select>
      </div>
      <div className="mt-8 space-y-3">
        {filtered.map((job) => {
          const stripe = getDisciplineColors(job.discipline).stripe;
          return (
            <Link key={job.slug} href={`/jobs/${job.slug}`} className="card-interactive relative flex overflow-hidden rounded-2xl">
              <div className={cn("w-1 shrink-0", stripe)} />
              <div className="flex-1 p-5">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-md bg-muted px-2 py-0.5 text-xs capitalize">{job.type.replace("-", " ")}</span>
                  {job.featured && <span className="rounded-md bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">Featured</span>}
                  <DisciplineBadge discipline={job.discipline} />
                </div>
                <h3 className="mt-2 text-lg font-semibold hover:text-accent">{job.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {job.company} · {job.location} · {job.remote}
                </p>
                {job.salaryRange && <p className="mt-1 text-sm font-medium">{job.salaryRange}</p>}
              </div>
              <span className="self-start p-5 text-xs text-muted-foreground">{job.postedAt}</span>
            </Link>
          );
        })}
      </div>
    </ListPageLayout>
  );
}
