"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Portfolio } from "@/types";
import { PixelTransition } from "@/components/motion/pixel-transition";
import { Avatar } from "@/components/ui/Avatar";

type PortfolioCardProps = {
  portfolio: Portfolio;
};

function formatWorkStatus(seeking: Portfolio["seeking"]) {
  if (seeking === "full-time") return "Full-Time";
  if (seeking === "grad-school") return "Grad School";
  return seeking.charAt(0).toUpperCase() + seeking.slice(1);
}

function isRemoteLocation(location: string) {
  return /remote/i.test(location);
}

function PortfolioCardPreview({ portfolio }: { portfolio: Portfolio }) {
  return (
    <div className="flex h-full flex-col bg-bg-surface">
      <div className="relative min-h-0 flex-1 overflow-hidden bg-muted">
        <Avatar
          name={portfolio.name}
          discipline={portfolio.discipline}
          size="2xl"
          src={portfolio.avatarUrl}
          className="h-full w-full rounded-none object-cover ring-0"
        />
      </div>
      <div className="shrink-0 p-4 text-center">
        <h3 className="capitalize font-semibold text-text-main">{portfolio.name}</h3>
      </div>
    </div>
  );
}

function PortfolioCardDetails({ portfolio }: { portfolio: Portfolio }) {
  const workStatus = formatWorkStatus(portfolio.seeking);
  const isRemote = isRemoteLocation(portfolio.location);

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-bg-surface p-4 text-start">
      <div className="flex items-start gap-3">
        <Avatar
          name={portfolio.name}
          discipline={portfolio.discipline}
          size="md"
          src={portfolio.avatarUrl}
          className="h-12 w-12 shrink-0 rounded-xl border border-border-custom object-cover shadow-sm"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <h3 className="text-base font-bold capitalize text-text-main">{portfolio.name}</h3>
            {portfolio.openToWork && (
              <span className="inline-flex items-center rounded-full border border-border-custom bg-bg-main px-2 py-0.5 text-[10px] font-semibold text-text-main">
                Open to work
              </span>
            )}
            {portfolio.hasMentorEndorsement && (
              <span className="inline-flex items-center rounded-full border border-zone-recruiter/20 bg-zone-recruiter/10 px-2 py-0.5 text-[10px] font-semibold text-zone-recruiter">
                Mentor vetted
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs font-medium tracking-wide text-text-muted">
            {portfolio.headline || "Engineering Professional"}
          </p>
        </div>
      </div>

      <div className="my-3 flex min-h-[40px] items-center rounded-r-xl border-l-2 border-border-custom/80 bg-bg-main/40 py-2 pl-3 text-xs text-text-muted/90 line-clamp-3">
        {portfolio.bio?.trim() || "No description provided."}
      </div>

      <div className="mb-3 grid grid-cols-2 gap-2 rounded-xl border border-border-custom/50 bg-bg-main/50 p-2 text-[10px] font-medium text-text-muted">
        <div>
          Remote: <span className="font-semibold text-text-main">{isRemote ? "Yes" : "No"}</span>
        </div>
        <div>
          Status: <span className="font-semibold text-text-main">{workStatus}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1">
        {portfolio.skills.slice(0, 4).map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center rounded-lg border border-border-custom bg-bg-main px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-text-main"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-border-custom/60 pt-3 text-xs font-semibold text-text-muted">
        <span className="capitalize">{workStatus}</span>
        <span
          className="rounded-lg border border-border-custom bg-bg-main p-1.5 text-text-main"
          aria-hidden
        >
          <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </div>
  );
}

export function PortfolioCard({ portfolio }: PortfolioCardProps) {
  return (
    <Link
      href={`/portfolios/${portfolio.slug}`}
      className="group block h-full rounded-2xl border border-border-custom bg-bg-surface shadow-premium-card transition-all duration-300 hover:-translate-y-1 hover:shadow-zone-recruiter/5"
    >
      <PixelTransition
        fill
        gridSize={12}
        pixelColor="hsl(var(--background))"
        animationStepDuration={0.4}
        className="h-full w-full"
        firstContent={<PortfolioCardPreview portfolio={portfolio} />}
        secondContent={<PortfolioCardDetails portfolio={portfolio} />}
      />
    </Link>
  );
}
