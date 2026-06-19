import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Portfolio } from "@/types";
import type { BentoVariant } from "@/lib/bento-layout";
import { getDisciplineColors } from "@/lib/discipline-colors";
import { Avatar } from "@/components/ui/Avatar";
import { DisciplineBadge } from "@/components/ui/DisciplineBadge";
import { cn } from "@/lib/utils";

type PortfolioCardProps = {
  portfolio: Portfolio;
  variant?: BentoVariant;
};

export function PortfolioCard({ portfolio, variant = "default" }: PortfolioCardProps) {
  const stripe = getDisciplineColors(portfolio.discipline).stripe;
  const isHero = variant === "hero";
  const isWide = variant === "wide";
  const isTall = variant === "tall";
  const avatarSize = isHero || isTall ? "lg" : "md";

  return (
    <Link
      href={`/portfolios/${portfolio.slug}`}
      className={cn(
        "card-interactive group relative flex h-full overflow-hidden rounded-xl",
        isHero && "min-h-[18rem]",
        isTall && "min-h-[16rem] flex-col",
        isWide && "min-h-[11rem]",
      )}
    >
      <div className={cn("absolute left-0 top-0 h-full w-1", stripe)} />
      <div
        className={cn(
          "relative flex flex-1 flex-col p-5 pl-6",
          isWide && "sm:flex-row sm:items-stretch sm:gap-6",
          isTall && "items-center text-center",
          isHero && "justify-between",
        )}
      >
        <div
          className={cn(
            "flex gap-4",
            isWide && "sm:min-w-0 sm:flex-1 sm:items-start",
            isTall && "flex-col items-center",
            isHero && "items-start",
          )}
        >
          <Avatar
            name={portfolio.name}
            discipline={portfolio.discipline}
            size={avatarSize}
            src={portfolio.avatarUrl}
            className={cn("shrink-0", isTall && "mx-auto", isHero && "ring-2 ring-primary/20")}
          />
          <div className={cn("min-w-0 flex-1", isTall && "w-full")}>
            {portfolio.openToWork && (
              <span className="inline-flex rounded-md bg-green-500/12 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
                Open to work
              </span>
            )}
            <h3 className={cn("font-semibold", isHero ? "mt-2 text-xl" : "mt-1")}>{portfolio.name}</h3>
            <p className={cn("text-sm text-muted-foreground", !isHero && !isWide && "truncate", isWide && "line-clamp-2")}>
              {portfolio.headline}
            </p>
            <p className="text-xs text-muted-foreground">{portfolio.university}</p>
            {(isHero || isWide) && portfolio.bio && (
              <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground sm:line-clamp-3">
                {portfolio.bio}
              </p>
            )}
            {isHero && portfolio.projects.length > 0 && (
              <p className="mt-2 text-xs font-medium text-primary">
                {portfolio.projects.length} project{portfolio.projects.length === 1 ? "" : "s"}
              </p>
            )}
          </div>
        </div>

        <div className={cn("mt-4 flex flex-wrap gap-1.5", isTall && "justify-center", isWide && "sm:mt-0 sm:max-w-xs sm:content-end")}>
          <DisciplineBadge discipline={portfolio.discipline} />
          {portfolio.skills.slice(0, isHero ? 5 : isTall ? 4 : 3).map((s) => (
            <span key={s} className="inline-flex rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
              {s}
            </span>
          ))}
        </div>

        <div
          className={cn(
            "mt-auto flex items-center justify-between pt-4 text-sm text-muted-foreground",
            isTall && "w-full",
            isHero && "border-t border-border/60 pt-5",
          )}
        >
          <span className="capitalize">{portfolio.seeking.replace("-", " ")}</span>
          <ArrowRight className="h-4 w-4 transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary" />
        </div>
      </div>
    </Link>
  );
}
