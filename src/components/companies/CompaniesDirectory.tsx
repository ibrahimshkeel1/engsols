"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ListPageLayout } from "@/components/shared/ListPageLayout";
import { EmptyStateClient } from "@/components/shared/EmptyStateClient";
import { companyPromptChips } from "@/data/empty-state-prompts";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { Input } from "@/components/ui/input";
import type { Company, Job } from "@/types";

type Props = {
  companies: Company[];
  jobs: Job[];
};

export function CompaniesDirectory({ companies, jobs }: Props) {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("");

  const filtered = useMemo(() => {
    let result = [...companies];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q));
    }
    if (type) result = result.filter((c) => c.type === type);
    return result;
  }, [companies, search, type]);

  return (
    <ListPageLayout
      label="Employers"
      title="Companies"
      description="Operators, service companies, manufacturers, and consultancies hiring engineers."
      className="bg-background"
      action={
        <Link
          href="/companies/talent"
          className="inline-flex h-11 items-center rounded-xl border border-zone-recruiter-border bg-card px-5 text-sm font-semibold text-zone-recruiter-on hover:bg-card/80"
        >
          Recruiter talent hub
        </Link>
      }
    >
      <div className="flex flex-wrap gap-3">
        <Input placeholder="Search companies..." value={search} onChange={(e) => setSearch(e.target.value)} tone="search" className="max-w-xs" />
        <select value={type} onChange={(e) => setType(e.target.value)} className="h-10 rounded-xl border border-border bg-background px-3 text-sm">
          <option value="">All types</option>
          <option value="operator">Operator</option>
          <option value="service-company">Service company</option>
          <option value="manufacturer">Manufacturer</option>
          <option value="consultancy">Consultancy</option>
          <option value="epc">EPC</option>
        </select>
      </div>
      {filtered.length === 0 ? (
        <EmptyStateClient
          title="No companies match"
          description={companies.length === 0 ? "Employer profiles will appear as partners join the directory." : "Try a different search or company type."}
          action={companies.length === 0 ? { href: "/jobs", label: "Browse jobs" } : undefined}
          promptChips={companyPromptChips}
        />
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((company) => {
            const openJobs = jobs.filter((j) => j.companySlug === company.slug).length;
            return (
              <Link
                key={company.slug}
                href={`/companies/${company.slug}`}
                data-transition-title={company.name}
                data-transition-subtitle={company.headquarters}
                className="card-interactive rounded-2xl p-5"
              >
                <div className="flex items-center gap-3">
                  <CompanyLogo company={company.name} />
                  <div>
                    {company.verified && (
                      <span className="rounded-md bg-zone-recruiter/12 px-2 py-0.5 text-xs font-medium text-zone-recruiter">Verified</span>
                    )}
                    <h3 className="font-semibold">{company.name}</h3>
                    <p className="text-xs capitalize text-muted-foreground">{company.type.replace("-", " ")}</p>
                  </div>
                </div>
                <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{company.description}</p>
                <p className="mt-2 text-sm text-muted-foreground">{company.headquarters} · {openJobs} open jobs</p>
              </Link>
            );
          })}
        </div>
      )}
    </ListPageLayout>
  );
}
