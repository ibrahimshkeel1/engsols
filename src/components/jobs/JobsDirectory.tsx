"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { disciplines } from "@/data/disciplines";
import { ListPageLayout } from "@/components/shared/ListPageLayout";
import { EmptyStateClient } from "@/components/shared/EmptyStateClient";
import { jobPromptChips } from "@/data/empty-state-prompts";
import { DisciplineBadge } from "@/components/ui/DisciplineBadge";
import { Input, Select } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getDisciplineColors } from "@/lib/discipline-colors";
import type { Job } from "@/types";

type Props = { jobs: Job[] };

export function JobsDirectory({ jobs }: Props) {
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
  }, [jobs, search, type, discipline]);

  return (
    <ListPageLayout
      label="Careers"
      title="Engineering Jobs"
      description="Roles from operators, service companies, and consultancies."
      action={
        <div className="flex flex-wrap gap-3">
          <Link href="/jobs/inbox" className="inline-flex h-11 items-center rounded-xl border border-border px-5 text-sm font-semibold hover:bg-muted">
            Applications inbox
          </Link>
          <Link href="/jobs/post" className="inline-flex h-11 items-center rounded-xl bg-accent px-5 text-sm font-semibold text-accent-foreground shadow-sm hover:brightness-110">
            Post a job
          </Link>
        </div>
      }
    >
      <div className="flex flex-wrap gap-3">
        <Input placeholder="Search jobs..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
        <Select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">All types</option>
          <option value="full-time">Full-time</option>
          <option value="internship">Internship</option>
          <option value="contract">Contract</option>
          <option value="graduate-program">Graduate program</option>
        </Select>
        <Select value={discipline} onChange={(e) => setDiscipline(e.target.value)}>
          <option value="">All disciplines</option>
          {disciplines.map((d) => <option key={d} value={d}>{d}</option>)}
        </Select>
      </div>
      {filtered.length === 0 ? (
        <EmptyStateClient
          title="No jobs match"
          description={jobs.length === 0 ? "New roles from operators and service companies appear here regularly." : "Try adjusting your search or filters."}
          action={{ href: "/jobs/post", label: "Post a job" }}
          promptChips={jobPromptChips}
        />
      ) : (
        <div className="mt-8 space-y-4">
          {filtered.map((job) => {
            const stripe = getDisciplineColors(job.discipline).stripe;
            return (
              <Link
                key={job.slug}
                href={`/jobs/${job.slug}`}
                data-transition-title={job.title}
                data-transition-subtitle={job.company}
                className={cn("card-interactive relative block overflow-hidden rounded-2xl p-5", job.featured && "ring-1 ring-accent/30")}
              >
                <div className={cn("absolute left-0 top-0 h-full w-1", stripe)} />
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{job.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {job.company} · {job.location} · <span className="capitalize">{job.type.replace("-", " ")}</span>
                    </p>
                  </div>
                  <DisciplineBadge discipline={job.discipline} />
                </div>
                <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{job.description}</p>
                {job.salaryRange && <p className="mt-2 text-sm font-medium">{job.salaryRange}</p>}
              </Link>
            );
          })}
        </div>
      )}
    </ListPageLayout>
  );
}
