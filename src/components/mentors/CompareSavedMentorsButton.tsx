"use client";

import Link from "next/link";
import { GitCompare } from "lucide-react";
import type { Mentor } from "@/types";

type Props = { mentors: Mentor[] };

export function CompareSavedMentorsButton({ mentors }: Props) {
  if (mentors.length < 2) return null;

  const slugs = mentors
    .slice(0, 3)
    .map((m) => m.slug)
    .join(",");

  return (
    <Link
      href={`/mentors/compare?slugs=${encodeURIComponent(slugs)}`}
      className="mt-4 inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium hover:border-primary/40 hover:text-primary"
    >
      <GitCompare className="h-4 w-4" />
      Compare {Math.min(mentors.length, 3)} saved mentors
    </Link>
  );
}
