import { cn } from "@/lib/utils";
import { AnimateIn } from "@/components/motion/AnimateIn";
import { zoneTokens, type ZoneKey } from "@/lib/zone-tokens";

type ListPageLayoutProps = {
  title: string;
  description: string;
  label?: string;
  zone?: ZoneKey;
  preview?: boolean;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  heroClassName?: string;
  labelClassName?: string;
};

export function ListPageLayout({
  title,
  description,
  label,
  zone,
  preview,
  action,
  children,
  className,
  heroClassName,
  labelClassName,
}: ListPageLayoutProps) {
  const t = zone ? zoneTokens[zone] : null;

  return (
    <>
      <section
        className={cn(
          zone ? t!.hero : "gradient-hero border-b border-border",
          heroClassName,
        )}
      >
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 animate-fade-up">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              {label && (
                <p className={cn("section-label", zone ? t!.sectionLabel : undefined, labelClassName)}>
                  {label}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-display text-4xl tracking-tight text-text-main sm:text-5xl">{title}</h1>
                {preview && (
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                    Preview
                  </span>
                )}
              </div>
              <p className="mt-3 max-w-2xl text-lg text-text-muted">{description}</p>
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </div>
        </div>
      </section>
      <div className={cn("mx-auto max-w-7xl px-4 py-12 pb-24 sm:px-6 lg:pb-12", className)}>
        <AnimateIn>{children}</AnimateIn>
      </div>
    </>
  );
}
