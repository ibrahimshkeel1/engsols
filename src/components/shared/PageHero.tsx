import Link from "next/link";
import { cn } from "@/lib/utils";
import { zoneTokens, type ZoneKey } from "@/lib/zone-tokens";

type PageHeroProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  variant?: "default" | "editorial" | "live" | "forum";
  zone?: ZoneKey;
  backHref?: string;
  backLabel?: string;
  label?: string;
  labelClassName?: string;
};

function resolveZone(variant: PageHeroProps["variant"], zone?: ZoneKey): ZoneKey | null {
  if (zone) return zone;
  if (variant === "live") return "live";
  if (variant === "editorial") return "news";
  if (variant === "forum") return "recruiter";
  return null;
}

export function PageHero({
  title,
  description,
  children,
  className,
  variant = "default",
  zone,
  backHref,
  backLabel,
  label,
  labelClassName,
}: PageHeroProps) {
  const resolved = resolveZone(variant, zone);

  if (resolved === "live") {
    const t = zoneTokens.live;
    return (
      <section className={cn(t.hero, className)}>
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-4 py-14 sm:px-6 sm:flex-row sm:items-end">
          <div className="animate-fade-up">
            {backHref && (
              <Link href={backHref} className={cn("text-sm font-medium hover:underline", t.accent)}>
                {backLabel ?? "← Back"}
              </Link>
            )}
            <div className="mt-4 flex items-center gap-2">
              <span className="live-dot h-2 w-2 rounded-full bg-zone-live" />
              <span className={cn("text-xs font-semibold uppercase tracking-widest", t.sectionLabel)}>
                Live Sessions
              </span>
            </div>
            <h1 className="font-display mt-3 text-4xl text-text-main sm:text-5xl">{title}</h1>
            {description && <p className="mt-4 max-w-2xl text-lg text-text-muted">{description}</p>}
          </div>
          {children && <div className="flex shrink-0 flex-wrap gap-3">{children}</div>}
        </div>
      </section>
    );
  }

  if (resolved === "recruiter" && variant === "forum") {
    const t = zoneTokens.recruiter;
    return (
      <section className={cn(t.hero, className)}>
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 animate-fade-up">
          <p className={cn("section-label", t.sectionLabel)}>Community</p>
          <h1 className="font-display mt-2 text-4xl text-text-main sm:text-5xl">{title}</h1>
          {description && <p className="mt-4 max-w-2xl text-lg text-text-muted">{description}</p>}
          {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
        </div>
      </section>
    );
  }

  if (resolved === "news") {
    const t = zoneTokens.news;
    return (
      <section className={cn(t.hero, className)}>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 animate-fade-up">
          {backHref && (
            <Link href={backHref} className={cn("text-sm font-medium hover:underline", t.accent)}>
              {backLabel ?? "← Back"}
            </Link>
          )}
          <p className={cn("section-label mt-4", t.sectionLabel)}>Industry News</p>
          <h1 className="font-display mt-2 max-w-4xl text-4xl leading-tight text-text-main sm:text-5xl">{title}</h1>
          {description && (
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-text-muted">{description}</p>
          )}
          {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
        </div>
      </section>
    );
  }

  if (resolved) {
    const t = zoneTokens[resolved];
    return (
      <section className={cn(t.hero, className)}>
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-4 py-14 sm:px-6 sm:flex-row sm:items-end animate-fade-up">
          <div>
            {label && <p className={cn("section-label", t.sectionLabel, labelClassName)}>{label}</p>}
            <h1 className={cn("font-display text-4xl text-text-main sm:text-5xl", label && "mt-2")}>{title}</h1>
            {description && (
              <p className="mt-3 max-w-2xl text-lg leading-relaxed text-text-muted">{description}</p>
            )}
          </div>
          {children && <div className="flex shrink-0 flex-wrap gap-3">{children}</div>}
        </div>
      </section>
    );
  }

  return (
    <section className={cn("gradient-hero border-b border-border", className)}>
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-4 py-14 sm:px-6 sm:flex-row sm:items-end animate-fade-up">
        <div>
          {label && <p className={cn("section-label", labelClassName)}>{label}</p>}
          <h1 className={cn("font-display text-4xl text-text-main sm:text-5xl", label && "mt-2")}>{title}</h1>
          {description && (
            <p className="mt-3 max-w-2xl text-lg leading-relaxed text-text-muted">{description}</p>
          )}
        </div>
        {children && <div className="flex shrink-0 flex-wrap gap-3">{children}</div>}
      </div>
    </section>
  );
}
