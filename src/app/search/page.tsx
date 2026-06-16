import Link from "next/link";
import { searchPlatform } from "@/lib/data/search";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

type Props = { searchParams: Promise<{ q?: string }> };

const typeLabels: Record<string, string> = {
  mentor: "Mentor",
  forum: "Forum",
  portfolio: "Portfolio",
  job: "Job",
};

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const results = query ? await searchPlatform(query) : [];

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <h1 className="font-display text-3xl tracking-tight">Search EngSols</h1>
      <p className="mt-2 text-muted-foreground">Find mentors, discussions, portfolios, and jobs.</p>
      <form className="mt-8" action="/search" method="get">
        <Input name="q" defaultValue={query} placeholder="Search..." className="h-12" aria-label="Search query" />
      </form>
      {query && (
        <div className="mt-8 space-y-3">
          {results.length === 0 ? (
            <p className="text-muted-foreground">No results for &ldquo;{query}&rdquo;.</p>
          ) : (
            results.map((r) => (
              <Link key={r.href} href={r.href}>
                <Card className="card-interactive">
                  <CardContent className="p-4">
                    <span className="text-xs font-medium uppercase text-muted-foreground">{typeLabels[r.type]}</span>
                    <p className="font-semibold">{r.title}</p>
                    <p className="text-sm text-muted-foreground">{r.subtitle}</p>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
