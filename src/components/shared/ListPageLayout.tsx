import { cn } from "@/lib/utils";
import { AnimateIn } from "@/components/motion/AnimateIn";
import { BallpitHeroBackground } from "@/components/motion/ballpit/BallpitHeroBackground";
import { routeAccentClasses } from "@/lib/nav-hover-colors";

type ListPageLayoutProps = {
  title: string;
  description: string;
  label?: string;
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
  preview,
  action,
  children,
  className,
  heroClassName,
  labelClassName,
}: ListPageLayoutProps) {
  return (
    <>
      <BallpitHeroBackground
        className={cn(routeAccentClasses.hairline, "border-b border-border", heroClassName)}
      >
        <div className="page-container-wide py-20 animate-fade-up">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              {label && (
                <p className={cn("section-label", routeAccentClasses.label, labelClassName)}>
                  {label}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-display-xl">{title}</h1>
                {preview && (
                  <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
                    Preview
                  </span>
                )}
              </div>
              <p className="mt-3 max-w-2xl text-body-lg">{description}</p>
            </div>
            {action && <div className="shrink-0">{action}</div>}
          </div>
        </div>
      </BallpitHeroBackground>
      <div className={cn("page-container-wide py-12 pb-24 lg:pb-12", className)}>
        <AnimateIn>{children}</AnimateIn>
      </div>
    </>
  );
}
