import Link from "next/link";
import { cn } from "@/lib/utils";
import { HeroSection } from "@/components/shared/HeroSection";
import { routeAccentClasses } from "@/lib/nav-hover-colors";

type PageHeroProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
  variant?: "default" | "editorial" | "live" | "forum";
  backHref?: string;
  backLabel?: string;
  label?: string;
  labelClassName?: string;
};

export function PageHero({
  title,
  description,
  children,
  className,
  variant = "default",
  backHref,
  backLabel,
  label,
  labelClassName,
}: PageHeroProps) {
  if (variant === "live") {
    return (
      <HeroSection className={cn(className)}>
        <div className="page-container-wide flex flex-col justify-between gap-6 py-20 sm:flex-row sm:items-end">
          <div className="animate-fade-up">
            {backHref && (
              <Link
                href={backHref}
                className={cn("text-sm font-medium hover:underline", routeAccentClasses.link)}
              >
                {backLabel ?? "← Back"}
              </Link>
            )}
            <div className="mt-4 flex items-center gap-2">
              <span className={cn("live-dot h-2 w-2 rounded-full", routeAccentClasses.dot)} />
              <span className={cn("section-label", routeAccentClasses.label)}>Live Sessions</span>
            </div>
            <h1 className="text-display-xl mt-3">{title}</h1>
            {description && <p className="mt-4 max-w-2xl text-body-lg">{description}</p>}
          </div>
          {children && <div className="flex shrink-0 flex-wrap gap-3">{children}</div>}
        </div>
      </HeroSection>
    );
  }

  if (variant === "forum") {
    return (
      <HeroSection className={cn(className)}>
        <div className="page-container-wide py-20 animate-fade-up">
          <p className={cn("section-label", routeAccentClasses.label)}>Community</p>
          <h1 className="text-display-xl mt-2">{title}</h1>
          {description && <p className="mt-4 max-w-2xl text-body-lg">{description}</p>}
          {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
        </div>
      </HeroSection>
    );
  }

  if (variant === "editorial") {
    return (
      <HeroSection className={cn(className)}>
        <div className="page-container-wide py-20 animate-fade-up">
          {backHref && (
            <Link
              href={backHref}
              className={cn("text-sm font-medium hover:underline", routeAccentClasses.link)}
            >
              {backLabel ?? "← Back"}
            </Link>
          )}
          <p className={cn("section-label mt-4", routeAccentClasses.label)}>Industry News</p>
          <h1 className="text-display-xl mt-2 max-w-4xl">{title}</h1>
          {description && <p className="mt-5 max-w-2xl text-body-lg">{description}</p>}
          {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
        </div>
      </HeroSection>
    );
  }

  return (
    <HeroSection className={cn(className)}>
      <div className="page-container-wide flex flex-col justify-between gap-6 py-20 sm:flex-row sm:items-end animate-fade-up">
        <div>
          {label && (
            <p className={cn("section-label", routeAccentClasses.label, labelClassName)}>{label}</p>
          )}
          <h1 className={cn("text-display-xl", label && "mt-2")}>{title}</h1>
          {description && <p className="mt-3 max-w-2xl text-body-lg">{description}</p>}
        </div>
        {children && <div className="flex shrink-0 flex-wrap gap-3">{children}</div>}
      </div>
    </HeroSection>
  );
}
