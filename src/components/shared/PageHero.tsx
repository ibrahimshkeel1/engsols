import Link from "next/link";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  variant?: "default" | "editorial" | "live" | "forum";
  backHref?: string;
  backLabel?: string;
};

export function PageHero({
  title,
  description,
  children,
  className,
  variant = "default",
  backHref,
  backLabel,
}: PageHeroProps) {
  if (variant === "live") {
    return (
      <section className={cn("hero-dark relative overflow-hidden border-b border-white/10", className)}>
        <div className="bg-grid absolute inset-0 opacity-30" />
        <div className="animate-float absolute right-0 top-0 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative mx-auto flex max-w-7xl flex-col justify-between gap-6 px-4 py-16 sm:px-6 sm:flex-row sm:items-end">
          <div className="animate-fade-up">
            {backHref && (
              <Link href={backHref} className="text-sm font-medium text-primary hover:underline">
                {backLabel ?? "← Back"}
              </Link>
            )}
            <div className="mt-4 flex items-center gap-2">
              <span className="live-dot h-2 w-2 rounded-full bg-red-500" />
              <span className="text-xs font-semibold uppercase tracking-widest text-red-400">Live Sessions</span>
            </div>
            <h1 className="font-display mt-3 text-4xl tracking-tight sm:text-5xl">{title}</h1>
            {description && <p className="text-muted-hero mt-4 max-w-2xl text-lg">{description}</p>}
          </div>
          {children && <div className="flex shrink-0 flex-wrap gap-3">{children}</div>}
        </div>
      </section>
    );
  }

  if (variant === "forum") {
    return (
      <section className={cn("border-b border-border bg-surface", className)}>
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 animate-fade-up">
          <p className="section-label">Community</p>
          <h1 className="font-display mt-2 text-4xl tracking-tight sm:text-5xl">{title}</h1>
          {description && <p className="mt-4 max-w-2xl text-lg text-muted-foreground">{description}</p>}
          {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
        </div>
      </section>
    );
  }

  if (variant === "editorial") {
    return (
      <section className={cn("border-b border-border", className)}>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 animate-fade-up">
          {backHref && (
            <Link href={backHref} className="text-sm font-medium text-accent hover:underline">
              {backLabel ?? "← Back"}
            </Link>
          )}
          <p className="section-label mt-4">Industry News</p>
          <h1 className="font-display mt-2 max-w-4xl text-4xl leading-tight tracking-tight sm:text-5xl">{title}</h1>
          {description && <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground">{description}</p>}
          {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
        </div>
      </section>
    );
  }

  return (
    <section className={cn("gradient-hero border-b border-border", className)}>
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-4 py-14 sm:px-6 sm:flex-row sm:items-end animate-fade-up">
        <div>
          <h1 className="font-display text-4xl tracking-tight sm:text-5xl">{title}</h1>
          {description && <p className="mt-3 max-w-2xl text-lg leading-relaxed text-muted-foreground">{description}</p>}
        </div>
        {children && <div className="flex shrink-0 flex-wrap gap-3">{children}</div>}
      </div>
    </section>
  );
}
