import { SectionReveal } from "@/components/motion/SectionReveal";
import Link from "next/link";
import { searchPlatform, groupSearchResults } from "@/lib/data/search";
import { searchTrendingChips } from "@/data/empty-state-prompts";
import { EmptyState } from "@/components/shared/EmptyState";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search } from "lucide-react";

type Props = { searchParams: Promise<{ q?: string }> };

const typeLabels: Record<string, string> = {
  mentor: "Mentors",
  forum: "Discussions",
  portfolio: "Portfolios",
  job: "Jobs",
  news: "News",
  video: "Videos",
  live: "Live sessions",
  certification: "Certifications",
  marketplace: "Marketplace",
};

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const results = query ? await searchPlatform(query) : [];
  const grouped = groupSearchResults(results);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <SectionReveal>
        <h1 className="font-display text-3xl tracking-tight">Search EngSols</h1>
        <p className="mt-2 text-muted-foreground">Explore mentors, discussions, jobs, videos, live sessions, certifications, and marketplace.</p>
      </SectionReveal>
      <form className="mt-8" action="/search" method="get">
        <Input name="q" defaultValue={query} placeholder="Search..." tone="search" className="h-12" aria-label="Search query" />
      </form>

      {!query && (
        <div className="mt-8">
          <p className="text-sm font-medium text-muted-foreground">Trending</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {searchTrendingChips.map((chip) => (
              <Link
                key={chip.href}
                href={chip.href}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                {chip.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {query && results.length === 0 && (
        <div className="mt-8">
          <EmptyState
            icon={Search}
            title={`No results for "${query}"`}
            description="Try a different term or browse trending topics."
            promptChips={searchTrendingChips}
            action={{ href: "/mentors", label: "Browse mentors" }}
          />
        </div>
      )}

      {grouped.length > 0 && (
        <div className="mt-8 space-y-8">
          {grouped.map(({ type, items }) => (
            <section key={type}>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">{typeLabels[type]}</h2>
              <div className="mt-3 space-y-3">
                {items.map((r) => (
                  <Link key={r.href} href={r.href}>
                    <Card className="card-interactive">
                      <CardContent className="p-4">
                        <p className="font-semibold">{r.title}</p>
                        <p className="text-sm text-muted-foreground">{r.subtitle}</p>
                        {r.meta && <p className="mt-1 text-xs text-muted-foreground">{r.meta}</p>}
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
