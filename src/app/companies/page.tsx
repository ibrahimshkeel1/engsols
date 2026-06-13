"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { companies } from "@/data/companies";
import { jobs } from "@/data/jobs";
import { companyLogo } from "@/lib/placeholders";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export default function CompaniesPage() {
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
  }, [search, type]);

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-foreground">Companies</h1>
        <p className="mt-2 text-muted-foreground">Operators, service companies, manufacturers, and consultancies hiring engineers.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Input placeholder="Search companies..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />
          <select value={type} onChange={(e) => setType(e.target.value)} className="h-10 rounded-lg border border-border px-3 text-sm">
            <option value="">All types</option>
            <option value="operator">Operator</option>
            <option value="service-company">Service company</option>
            <option value="manufacturer">Manufacturer</option>
            <option value="consultancy">Consultancy</option>
            <option value="epc">EPC</option>
          </select>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((company) => {
            const openJobs = jobs.filter((j) => j.companySlug === company.slug).length;
            return (
              <Card key={company.slug}>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Image src={companyLogo(company.name)} alt="" width={48} height={48} className="rounded-lg" unoptimized />
                    <div>
                      {company.verified && <Badge className="bg-green-50 text-green-700">Verified</Badge>}
                      <h3 className="font-semibold text-foreground">{company.name}</h3>
                      <p className="text-xs capitalize text-muted-foreground">{company.type.replace("-", " ")}</p>
                    </div>
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">{company.description}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{company.headquarters} · {openJobs} open jobs</p>
                  <Link href={`/companies/${company.slug}`} className="mt-3 inline-block text-sm font-medium text-primary">
                    View company →
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
