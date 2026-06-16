"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: { href: string; label: string };
  onClearFilters?: () => void;
  className?: string;
};

export function EmptyStateClient({
  icon: Icon,
  title,
  description,
  action,
  onClearFilters,
  className,
}: Props) {
  return (
    <div className={cn("flex flex-col items-center rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-14 text-center", className)}>
      {Icon && <Icon className="h-10 w-10 text-muted-foreground/60" aria-hidden />}
      <h3 className={cn("font-semibold", Icon && "mt-4")}>{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-muted-foreground">{description}</p>}
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {action && (
          <Link
            href={action.href}
            className="inline-flex h-10 items-center rounded-xl bg-accent px-5 text-sm font-semibold text-accent-foreground hover:brightness-110"
          >
            {action.label}
          </Link>
        )}
        {onClearFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="inline-flex h-10 items-center rounded-xl border border-border bg-card px-5 text-sm font-medium hover:bg-muted"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}
