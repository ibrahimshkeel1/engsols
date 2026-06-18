"use client";

import Link from "next/link";
import { format } from "date-fns";

type Application = {
  id: string;
  jobSlug: string;
  jobTitle: string;
  message: string;
  status: string;
  createdAt: string;
};

export function StudentJobApplicationsSection({ applications }: { applications: Application[] }) {
  if (applications.length === 0) {
    return <p className="mt-2 text-sm text-muted-foreground">You haven&apos;t applied to any jobs yet.</p>;
  }

  return (
    <ul className="mt-4 space-y-3">
      {applications.map((a) => (
        <li key={a.id} className="rounded-xl border border-border p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Link href={`/jobs/${a.jobSlug}`} className="font-medium text-primary hover:underline">
              {a.jobTitle}
            </Link>
            <span className="rounded-md bg-muted px-2 py-0.5 text-xs capitalize">{a.status}</span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{a.message}</p>
          <p className="mt-2 text-xs text-muted-foreground">{format(new Date(a.createdAt), "MMM d, yyyy")}</p>
        </li>
      ))}
    </ul>
  );
}
