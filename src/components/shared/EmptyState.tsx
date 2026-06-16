import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: { href: string; label: string };
  secondaryAction?: { label: string; onClick?: () => void; href?: string };
  className?: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
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
        {secondaryAction &&
          (secondaryAction.href ? (
            <Link
              href={secondaryAction.href}
              className="inline-flex h-10 items-center rounded-xl border border-border bg-card px-5 text-sm font-medium hover:bg-muted"
            >
              {secondaryAction.label}
            </Link>
          ) : (
            <button
              type="button"
              onClick={secondaryAction.onClick}
              className="inline-flex h-10 items-center rounded-xl border border-border bg-card px-5 text-sm font-medium hover:bg-muted"
            >
              {secondaryAction.label}
            </button>
          ))}
      </div>
    </div>
  );
}
