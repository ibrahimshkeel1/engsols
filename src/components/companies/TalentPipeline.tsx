"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { BadgeCheck, Briefcase, Filter, ShieldCheck } from "lucide-react";
import type { Portfolio, PortfolioProject } from "@/types";
import { disciplines } from "@/data/disciplines";
import { Avatar } from "@/components/ui/Avatar";
import { DisciplineBadge } from "@/components/ui/DisciplineBadge";
import { EndorsementBadge } from "@/components/portfolios/EndorsementBadge";
import { EmptyStateClient } from "@/components/shared/EmptyStateClient";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Props = {
  portfolios: Portfolio[];
};

function getEndorsedProjects(portfolio: Portfolio): PortfolioProject[] {
  return portfolio.projects.filter((p) => (p.endorsements?.length ?? 0) > 0);
}

function TalentCard({ portfolio }: { portfolio: Portfolio }) {
  const endorsed = getEndorsedProjects(portfolio);

  return (
    <article className="card-elevated flex h-full flex-col rounded-2xl border border-border bg-card p-5 transition-colors hover:border-zone-recruiter/30">
      <div className="flex items-start gap-4">
        <Avatar
          name={portfolio.name}
          discipline={portfolio.discipline}
          size="lg"
          src={portfolio.avatarUrl}
          className="shrink-0 rounded-xl ring-2 ring-border"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {portfolio.hasMentorEndorsement && (
              <span className="inline-flex items-center gap-1 rounded-full bg-zone-recruiter/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-zone-recruiter">
                <ShieldCheck className="h-3 w-3" aria-hidden />
                Vetted
              </span>
            )}
            {portfolio.openToWork && (
              <span className="rounded-md bg-zone-mentorship/12 px-2 py-0.5 text-xs font-medium text-zone-mentorship-on">
                Open to work
              </span>
            )}
          </div>
          <h3 className="mt-1 font-display text-lg font-semibold tracking-tight">{portfolio.name}</h3>
          <p className="text-sm text-muted-foreground">{portfolio.headline}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {portfolio.university} · Class of {portfolio.graduationYear} · {portfolio.location}
          </p>
          <div className="mt-2">
            <DisciplineBadge discipline={portfolio.discipline} />
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {portfolio.skills.slice(0, 6).map((skill) => (
          <span key={skill} className="rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {skill}
          </span>
        ))}
      </div>

      {endorsed.length > 0 && (
        <div className="mt-5 rounded-xl border border-zone-recruiter/20 bg-zone-recruiter/5 p-4">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-zone-recruiter">
            <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
            Mentor-endorsed work
          </p>
          <ul className="mt-3 space-y-3">
            {endorsed.map((proj) => (
              <li key={proj.id} className="rounded-lg border border-border/60 bg-card/80 p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <p className="font-medium text-sm">{proj.title}</p>
                  <EndorsementBadge endorsements={proj.endorsements ?? []} />
                </div>
                {proj.endorsements?.[0] && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    <span className="font-medium text-foreground">{proj.endorsements[0].mentorName}</span>
                    {proj.endorsements[0].mentorCompany
                      ? ` (${proj.endorsements[0].mentorCompany})`
                      : ""}{" "}
                    — industry-ready validation
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
        <span className="text-xs text-muted-foreground capitalize">
          Seeking {portfolio.seeking.replace("-", " ")}
        </span>
        <Link
          href={`/portfolios/${portfolio.slug}`}
          className="text-sm font-medium text-zone-recruiter hover:underline"
        >
          View portfolio →
        </Link>
      </div>
    </article>
  );
}

export function TalentPipeline({ portfolios }: Props) {
  const [endorsedOnly, setEndorsedOnly] = useState(false);
  const [selectedDisciplines, setSelectedDisciplines] = useState<string[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<number[]>([]);
  const [skillQuery, setSkillQuery] = useState("");

  const allSkills = useMemo(() => {
    const set = new Set<string>();
    for (const p of portfolios) {
      for (const s of p.skills) set.add(s);
    }
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [portfolios]);

  const graduationYears = useMemo(() => {
    const set = new Set(portfolios.map((p) => p.graduationYear));
    return [...set].sort((a, b) => b - a);
  }, [portfolios]);

  const filtered = useMemo(() => {
    let result = [...portfolios];

    if (endorsedOnly) {
      result = result.filter((p) => p.hasMentorEndorsement);
    }
    if (selectedDisciplines.length > 0) {
      result = result.filter((p) => selectedDisciplines.includes(p.discipline));
    }
    if (selectedYears.length > 0) {
      result = result.filter((p) => selectedYears.includes(p.graduationYear));
    }
    if (selectedSkills.length > 0) {
      result = result.filter((p) =>
        selectedSkills.every((skill) =>
          p.skills.some((s) => s.toLowerCase() === skill.toLowerCase()),
        ),
      );
    }

    return result;
  }, [portfolios, endorsedOnly, selectedDisciplines, selectedSkills, selectedYears]);

  const visibleSkills = allSkills.filter((s) =>
    skillQuery ? s.toLowerCase().includes(skillQuery.toLowerCase()) : true,
  ).slice(0, 12);

  function toggleDiscipline(d: string) {
    setSelectedDisciplines((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d],
    );
  }

  function toggleSkill(s: string) {
    setSelectedSkills((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );
  }

  function toggleYear(y: number) {
    setSelectedYears((prev) =>
      prev.includes(y) ? prev.filter((x) => x !== y) : [...prev, y],
    );
  }

  const hasFilters =
    endorsedOnly ||
    selectedDisciplines.length > 0 ||
    selectedSkills.length > 0 ||
    selectedYears.length > 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="section-label text-zone-recruiter">B2B talent pipeline</p>
          <h1 className="font-display mt-1 text-3xl tracking-tight sm:text-4xl">Recruiter talent hub</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Source engineering graduates with mentor-verified project work — filter by discipline, skills, and
            graduation cohort.
          </p>
        </div>
        <Link
          href="/companies"
          className="inline-flex h-10 items-center rounded-xl border border-border px-4 text-sm font-medium hover:bg-muted"
        >
          ← Employer directory
        </Link>
      </div>

      <div className="mt-10 rounded-2xl border border-border bg-card p-5 lg:p-6">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Filter className="h-4 w-4 text-zone-recruiter" aria-hidden />
          Premium filters
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setEndorsedOnly((v) => !v)}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors",
              endorsedOnly
                ? "border-zone-recruiter bg-zone-recruiter text-white shadow-sm"
                : "border-border bg-muted/40 text-foreground hover:bg-muted",
            )}
          >
            <ShieldCheck className="h-4 w-4" aria-hidden />
            Show only mentor-endorsed talent
          </button>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Discipline</p>
            <div className="mt-2 flex max-h-36 flex-wrap gap-1.5 overflow-y-auto">
              {disciplines.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => toggleDiscipline(d)}
                  className={cn(
                    "rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors",
                    selectedDisciplines.includes(d)
                      ? "border-zone-recruiter bg-zone-recruiter/10 text-zone-recruiter"
                      : "border-border text-muted-foreground hover:bg-muted",
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Graduation year</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {graduationYears.map((y) => (
                <button
                  key={y}
                  type="button"
                  onClick={() => toggleYear(y)}
                  className={cn(
                    "rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors",
                    selectedYears.includes(y)
                      ? "border-zone-recruiter bg-zone-recruiter/10 text-zone-recruiter"
                      : "border-border text-muted-foreground hover:bg-muted",
                  )}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Technical skills</p>
            <Input
              type="search"
              value={skillQuery}
              onChange={(e) => setSkillQuery(e.target.value)}
              placeholder="Search skills…"
              tone="search"
              className="mt-2 h-9 text-xs"
            />
            <div className="mt-2 flex max-h-28 flex-wrap gap-1.5 overflow-y-auto">
              {visibleSkills.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSkill(s)}
                  className={cn(
                    "rounded-lg border px-2.5 py-1 text-xs font-medium transition-colors",
                    selectedSkills.includes(s)
                      ? "border-zone-recruiter bg-zone-recruiter/10 text-zone-recruiter"
                      : "border-border text-muted-foreground hover:bg-muted",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              setEndorsedOnly(false);
              setSelectedDisciplines([]);
              setSelectedSkills([]);
              setSelectedYears([]);
            }}
            className="mt-4 text-xs font-medium text-zone-recruiter hover:underline"
          >
            Clear all filters
          </button>
        )}
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        <span className="font-semibold text-zone-recruiter">{filtered.length}</span> candidate{filtered.length === 1 ? "" : "s"} match
        {endorsedOnly ? " · mentor-endorsed only" : ""}
      </p>

      {portfolios.length === 0 ? (
        <div className="mt-8">
          <EmptyStateClient
            icon={Briefcase}
            title="No published portfolios"
            description="Students publish portfolios to appear in the recruiter pipeline."
            action={{ href: "/portfolios", label: "Browse portfolios" }}
          />
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-8">
          <EmptyStateClient
            icon={Briefcase}
            title="No candidates match your filters"
            description="Try widening discipline or skill filters, or disable mentor-only mode."
            onClearFilters={hasFilters ? () => {
              setEndorsedOnly(false);
              setSelectedDisciplines([]);
              setSelectedSkills([]);
              setSelectedYears([]);
            } : undefined}
          />
        </div>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((portfolio) => (
            <TalentCard key={portfolio.slug} portfolio={portfolio} />
          ))}
        </div>
      )}
    </div>
  );
}
