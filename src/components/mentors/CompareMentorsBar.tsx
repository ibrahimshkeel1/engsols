import Link from "next/link";
import { GitCompareArrows } from "lucide-react";

type Props = { savedSlugs: string[] };

export function CompareMentorsBar({ savedSlugs }: Props) {
  if (savedSlugs.length < 2) return null;

  const slugs = savedSlugs.slice(0, 3).join(",");

  return (
    <div className="fixed bottom-20 end-4 z-40 lg:bottom-6">
      <Link
        href={`/mentors/compare?slugs=${encodeURIComponent(slugs)}`}
        className="inline-flex h-11 items-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-semibold shadow-lg hover:border-primary/40 hover:text-primary"
      >
        <GitCompareArrows className="h-4 w-4" />
        Compare ({Math.min(savedSlugs.length, 3)})
      </Link>
    </div>
  );
}
