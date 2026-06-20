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

function formatWorkStatus(seeking: Portfolio["seeking"]) {
  if (seeking === "full-time") return "Full-Time";
  if (seeking === "grad-school") return "Grad School";
  return seeking.charAt(0).toUpperCase() + seeking.slice(1);
}

function isRemoteLocation(location: string) {
  return /remote/i.test(location);
}

export function PortfolioCard({ portfolio, variant = "default" }: PortfolioCardProps) {
  const isHero = variant === "hero";
  const isTall = variant === "tall";
  const tagLimit = isHero ? 6 : isTall ? 5 : 4;
  const workStatus = formatWorkStatus(portfolio.seeking);
  const isRemote = isRemoteLocation(portfolio.location);

  return (
    <Link
      href={`/portfolios/${portfolio.slug}`}
      className={cn(
        "group flex h-full flex-col justify-between rounded-2xl border border-border-custom bg-bg-surface p-6 shadow-premium-card transition-all duration-300 hover:-translate-y-1 hover:shadow-zone-recruiter/5",
        isHero && "min-h-[18rem] p-7",
        isTall && "min-h-[16rem]",
      )}
    >
      <div className="flex items-start gap-5">
        <div className="shrink-0">
          <Avatar
            name={portfolio.name}
            discipline={portfolio.discipline}
            size="lg"
            src={portfolio.avatarUrl}
            className="h-16 w-16 rounded-xl border border-border-custom object-cover shadow-sm"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={cn(
                "capitalize font-bold text-text-main transition-colors duration-200 group-hover:text-zone-recruiter",
                isHero ? "text-2xl" : "text-xl",
              )}
            >
              {portfolio.name}
            </h3>
            {portfolio.openToWork && (
              <span className="inline-flex items-center rounded-full border border-border-custom bg-bg-main px-2.5 py-0.5 text-xs font-semibold text-text-main">
                Open to work
              </span>
            )}
            {portfolio.hasMentorEndorsement && (
              <span className="inline-flex items-center rounded-full border border-zone-recruiter/20 bg-zone-recruiter/10 px-2.5 py-0.5 text-xs font-semibold text-zone-recruiter">
                Mentor vetted
              </span>
            )}
          </div>

          <p
            className={cn(
              "mt-0.5 font-medium tracking-wide text-text-muted",
              isHero ? "text-base" : "text-sm",
            )}
          >
            {portfolio.headline || "Engineering Professional"}
          </p>

          <div
            className={cn(
              "my-4 flex min-h-[48px] items-center rounded-r-xl border-l-2 border-border-custom/80 bg-bg-main/40 py-2 pl-3 text-sm text-text-muted/90 line-clamp-2",
              isHero && "min-h-[56px] text-base",
            )}
          >
            {portfolio.bio?.trim() || "No description provided."}
          </div>

          <div className="mb-4 grid grid-cols-2 gap-2 rounded-xl border border-border-custom/50 bg-bg-main/50 p-2.5 text-xs font-medium text-text-muted">
            <div>
              Remote work:{" "}
              <span className="font-semibold text-text-main">{isRemote ? "Yes" : "No"}</span>
            </div>
            <div>
              Work status:{" "}
              <span className="font-semibold text-text-main">{workStatus}</span>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {portfolio.skills.slice(0, tagLimit).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-lg border border-border-custom bg-bg-main px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-text-main"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <div className="my-4 w-full border-t border-border-custom/60" />
        <div className="flex items-center justify-between text-sm font-semibold text-text-muted">
          <span className="capitalize">{workStatus}</span>
          <span
            className="rounded-xl border border-border-custom bg-bg-main p-2 text-text-main transition-all duration-300 group-hover:bg-text-main group-hover:text-bg-main"
            aria-hidden
          >
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
