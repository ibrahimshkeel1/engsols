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

function avatarSizeForVariant(variant: BentoVariant): "lg" | "xl" | "2xl" {
  if (variant === "hero") return "2xl";
  if (variant === "wide" || variant === "tall") return "xl";
  return "lg";
}

export function PortfolioCard({ portfolio, variant = "default" }: PortfolioCardProps) {
  const stripe = getDisciplineColors(portfolio.discipline).stripe;
  const isHero = variant === "hero";
  const isWide = variant === "wide";
  const showBio = isHero || isWide || variant === "tall";
  const skillLimit = isHero ? 5 : variant === "tall" ? 4 : 3;

  return (
    <Link
      href={`/portfolios/${portfolio.slug}`}
      className={cn(
        "card-interactive group relative flex h-full min-h-[10rem] overflow-hidden rounded-xl",
        isHero && "min-h-[18rem]",
        variant === "tall" && "min-h-[16rem]",
      )}
    >
      <div className={cn("absolute left-0 top-0 h-full w-1", stripe)} />

      <div className="relative flex flex-1 flex-col p-5 pl-6">
        <div className="flex flex-1 items-start gap-4 sm:gap-5">
          <Avatar
            name={portfolio.name}
            discipline={portfolio.discipline}
            size={avatarSizeForVariant(variant)}
            src={portfolio.avatarUrl}
            className={cn("shrink-0 rounded-2xl ring-2 ring-border", isHero && "ring-primary/20")}
          />

          <div className="flex min-w-0 flex-1 flex-col gap-1">
            {portfolio.openToWork && (
              <span className="inline-flex w-fit rounded-md bg-green-500/12 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
                Open to work
              </span>
            )}
            <h3 className={cn("font-semibold leading-tight", isHero ? "text-xl" : "text-base")}>
              {portfolio.name}
            </h3>
            <p className={cn("text-sm text-muted-foreground", !showBio && "line-clamp-2")}>
              {portfolio.headline}
            </p>
            <p className="text-xs text-muted-foreground">{portfolio.university}</p>
            {showBio && portfolio.bio && (
              <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground sm:line-clamp-3">
                {portfolio.bio}
              </p>
            )}
            {isHero && portfolio.projects.length > 0 && (
              <p className="text-xs font-medium text-primary">
                {portfolio.projects.length} project{portfolio.projects.length === 1 ? "" : "s"}
              </p>
            )}
            <div className="mt-2 flex flex-wrap gap-1.5">
              <DisciplineBadge discipline={portfolio.discipline} />
              {portfolio.skills.slice(0, skillLimit).map((s) => (
                <span key={s} className="inline-flex rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div
          className={cn(
            "mt-4 flex items-center justify-between border-t border-border/60 pt-4 text-sm text-muted-foreground",
            isHero && "pt-5",
          )}
        >
          <span className="capitalize">{portfolio.seeking.replace("-", " ")}</span>
          <ArrowRight className="h-4 w-4 transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary" />
        </div>
      </div>
    </Link>
  );
}
