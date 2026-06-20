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

function avatarSizeForVariant(variant: BentoVariant): "md" | "lg" | "xl" {
  if (variant === "hero") return "xl";
  if (variant === "wide" || variant === "tall") return "lg";
  return "md";
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
        "card-interactive group relative flex h-full min-h-[9rem] overflow-hidden rounded-xl",
        isHero && "min-h-[16rem]",
        variant === "tall" && "min-h-[14rem]",
      )}
    >
      <div className={cn("absolute left-0 top-0 h-full w-1", stripe)} />

      {portfolio.projects[0] && (variant === "hero" || variant === "wide") && (
        <div className="absolute right-4 top-4 hidden h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-xs font-bold text-primary sm:flex">
          {portfolio.projects[0].title.slice(0, 2).toUpperCase()}
        </div>
      )}

      <div className="relative flex min-w-0 flex-1 flex-col p-4 pl-5 sm:p-5 sm:pl-6">
        <div className="flex min-w-0 flex-1 items-start gap-3 sm:gap-4">
          <Avatar
            name={portfolio.name}
            discipline={portfolio.discipline}
            size={avatarSizeForVariant(variant)}
            src={portfolio.avatarUrl}
            className={cn("shrink-0 rounded-2xl ring-2 ring-border", isHero && "ring-primary/20")}
          />

          <div className="flex min-w-0 flex-1 flex-col gap-1">
            {portfolio.openToWork && (
              <span className="inline-flex w-fit rounded-md bg-zone-mentorship/12 px-2 py-0.5 text-xs font-medium text-zone-mentorship-on">
                Open to work
              </span>
            )}
            {portfolio.hasMentorEndorsement && (
              <span className="inline-flex w-fit rounded-md bg-zone-recruiter/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-zone-recruiter">
                Mentor vetted
              </span>
            )}
            <h3 className={cn("font-semibold leading-tight", isHero ? "text-lg sm:text-xl" : "text-base")}>
              {portfolio.name}
            </h3>
            <p className={cn("text-sm text-muted-foreground", !showBio && "line-clamp-2")}>
              {portfolio.headline}
            </p>
            <p className="truncate text-xs text-muted-foreground">{portfolio.university}</p>
            {showBio && portfolio.bio && (
              <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                {portfolio.bio}
              </p>
            )}
            {isHero && portfolio.projects.length > 0 && (
              <p className="text-xs font-medium text-zone-recruiter">
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
            "mt-3 flex items-center justify-between border-t border-border/60 pt-3 text-sm text-muted-foreground sm:mt-4 sm:pt-4",
            isHero && "sm:pt-5",
          )}
        >
          <span className="capitalize">{portfolio.seeking.replace("-", " ")}</span>
          <ArrowRight className="h-4 w-4 shrink-0 transition-all duration-300 group-hover:translate-x-1 group-hover:text-zone-recruiter" />
        </div>
      </div>
    </Link>
  );
}
