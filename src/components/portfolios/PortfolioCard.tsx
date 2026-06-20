import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Portfolio } from "@/types";
import type { BentoVariant } from "@/lib/bento-layout";
import { Avatar } from "@/components/ui/Avatar";
import { cn } from "@/lib/utils";

type PortfolioCardProps = {
  portfolio: Portfolio;
  variant?: BentoVariant;
};

function avatarSizeForVariant(variant: BentoVariant): "md" | "lg" | "xl" {
  if (variant === "hero") return "xl";
  if (variant === "wide" || variant === "tall") return "lg";
  return "lg";
}

function formatSeeking(seeking: Portfolio["seeking"]) {
  return seeking.replace("-", " ");
}

function isRemoteLocation(location: string) {
  return /remote/i.test(location);
}

export function PortfolioCard({ portfolio, variant = "default" }: PortfolioCardProps) {
  const isHero = variant === "hero";
  const isTall = variant === "tall";
  const skillLimit = isHero ? 6 : isTall ? 5 : 4;

  return (
    <Link
      href={`/portfolios/${portfolio.slug}`}
      className={cn(
        "group flex h-full flex-col justify-between rounded-2xl border border-border-custom bg-bg-surface p-6 shadow-premium-card transition-all duration-300 hover:-translate-y-1",
        isHero && "min-h-[18rem]",
        isTall && "min-h-[16rem]",
      )}
    >
      <div>
        <div className="flex items-start gap-4">
          <Avatar
            name={portfolio.name}
            discipline={portfolio.discipline}
            size={avatarSizeForVariant(variant)}
            src={portfolio.avatarUrl}
            className="h-16 w-16 shrink-0 rounded-xl border-2 border-zone-recruiter/20 object-cover shadow-md transition-colors duration-300 group-hover:border-zone-recruiter/50"
          />

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className={cn("font-bold text-text-main", isHero ? "text-xl" : "text-lg")}>
                {portfolio.name}
              </h3>
              {portfolio.openToWork && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-zone-mentorship/20 bg-zone-mentorship/10 px-2.5 py-0.5 text-xs font-semibold text-zone-mentorship">
                  Open to work
                </span>
              )}
            </div>
            {portfolio.hasMentorEndorsement && (
              <span className="mt-1.5 inline-flex rounded-full border border-zone-recruiter/20 bg-zone-recruiter/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zone-recruiter">
                Mentor vetted
              </span>
            )}
            <p className="mt-0.5 text-sm font-medium text-text-muted">{portfolio.headline}</p>
            <p className="text-caption mt-0.5 truncate">{portfolio.university}</p>
          </div>
        </div>

        {portfolio.bio ? (
          <p className="mt-3 flex h-10 items-center rounded-r-lg border-l-2 border-border-custom bg-bg-main/30 pl-3 text-sm italic leading-snug text-text-muted line-clamp-2">
            {portfolio.bio}
          </p>
        ) : null}

        <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl border border-border-custom/50 bg-bg-main/50 p-2.5 text-xs font-medium text-text-muted">
          <div>
            Remote work:{" "}
            <span className="font-semibold text-text-main">
              {isRemoteLocation(portfolio.location) ? "Yes" : "No"}
            </span>
          </div>
          <div>
            Work status:{" "}
            <span className="font-semibold capitalize text-text-main">{formatSeeking(portfolio.seeking)}</span>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-end justify-between gap-3 border-t border-border-custom/60 pt-4">
        <div className="flex min-w-0 flex-1 flex-wrap gap-1.5">
          {portfolio.skills.slice(0, skillLimit).map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center rounded-lg border border-zone-recruiter/20 bg-zone-recruiter/10 px-2.5 py-1 text-xs font-medium text-zone-recruiter transition-all duration-200 hover:bg-zone-recruiter/20"
            >
              {skill}
            </span>
          ))}
        </div>
        <ArrowRight
          className="h-5 w-5 shrink-0 text-zone-recruiter transition-transform duration-200 group-hover:translate-x-1"
          aria-hidden
        />
      </div>
    </Link>
  );
}
