"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { disciplines } from "@/data/disciplines";
import { cn } from "@/lib/utils";

const FILTER_OPTIONS = ["All", ...disciplines] as const;

export function NewsDisciplineFilter({ active }: { active: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function hrefFor(discipline: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (discipline === "All") {
      params.delete("discipline");
    } else {
      params.set("discipline", discipline);
    }
    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  }

  return (
    <div className="sticky top-16 z-20 -mx-4 border-b border-border/80 bg-background/90 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 lg:top-20">
      <div className="flex gap-2 overflow-x-auto scrollbar-none">
        {FILTER_OPTIONS.map((discipline) => {
          const selected = active === discipline || (discipline === "All" && active === "All");
          return (
            <Link
              key={discipline}
              href={hrefFor(discipline)}
              className={cn(
                "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 active:scale-[0.98]",
                selected
                  ? "border-zone-news bg-zone-news text-white shadow-sm dark:text-slate-950"
                  : "border-border bg-card text-muted-foreground hover:border-zone-news/30 hover:text-foreground",
              )}
            >
              {discipline}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
