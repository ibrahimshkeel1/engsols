"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, BadgeCheck, Star } from "lucide-react";
import type { Mentor } from "@/types";
import type { BentoVariant } from "@/lib/bento-layout";
import { Avatar } from "@/components/ui/Avatar";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { cn } from "@/lib/utils";

type MentorCardProps = {
  mentor: Mentor;
  showPrice?: boolean;
  variant?: BentoVariant;
};

const pillClass =
  "inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-zone-mentorship/10 text-zone-mentorship border border-zone-mentorship/20 tracking-wide uppercase";

function avatarSizeForVariant(variant: BentoVariant): "md" | "lg" | "xl" {
  if (variant === "hero") return "xl";
  if (variant === "wide" || variant === "tall") return "lg";
  return "md";
}

function CardRating({ rating, reviewCount, large }: { rating: number; reviewCount: number; large?: boolean }) {
  if (reviewCount === 0) {
    return (
      <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-text-muted">
        ⭐ 0.0 (0 reviews)
      </span>
    );
  }

  return (
    <span
      className={cn(
        "flex shrink-0 items-center gap-1 font-semibold text-text-muted",
        large ? "text-sm" : "text-xs",
      )}
    >
      <Star className={cn("fill-zone-mentorship text-zone-mentorship", large ? "h-4 w-4" : "h-3.5 w-3.5")} />
      <span className="text-text-main">{rating.toFixed(1)}</span>
      <span className="font-normal">({reviewCount} reviews)</span>
    </span>
  );
}

export function MentorCard({ mentor, showPrice = true, variant = "default" }: MentorCardProps) {
  const isHero = variant === "hero";
  const bioText = mentor.bio?.trim() || mentor.headline;

  const badgeItems: { key: string; label: string; uppercase?: boolean; icon?: ReactNode }[] = [
    { key: "company", label: mentor.company, uppercase: false, icon: <CompanyLogo company={mentor.company} size="sm" /> },
    ...mentor.subFields.slice(0, 3).map((field) => ({
      key: field,
      label: field,
      uppercase: true,
    })),
    ...mentor.skills
      .filter((skill) => !mentor.subFields.includes(skill))
      .slice(0, 2)
      .map((skill) => ({
        key: skill,
        label: skill,
        uppercase: true,
      })),
  ];

  return (
    <Link
      href={`/mentors/${mentor.slug}`}
      className={cn(
        "group flex h-full flex-col justify-between rounded-2xl border border-border-custom bg-bg-surface p-6 shadow-premium-card transition-all duration-300 hover:-translate-y-1 hover:shadow-zone-mentorship/5",
        isHero && "min-h-[18rem] p-7",
        variant === "tall" && "min-h-[16rem]",
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="relative shrink-0">
            <Avatar
              name={mentor.name}
              discipline={mentor.discipline}
              size={avatarSizeForVariant(variant)}
              src={mentor.avatarUrl}
              className="rounded-2xl ring-2 ring-border-custom"
            />
            {mentor.featured && (
              <span className="absolute -bottom-1 -end-1 flex h-5 w-5 items-center justify-center rounded-full bg-zone-mentorship text-bg-main shadow-sm">
                <BadgeCheck className="h-3 w-3" />
              </span>
            )}
          </div>
          <CardRating rating={mentor.rating} reviewCount={mentor.reviewCount} large={isHero} />
        </div>

        <div className="mt-4 min-w-0">
          <h3
            className={cn(
              "capitalize text-text-main transition-colors duration-200 group-hover:text-zone-mentorship",
              isHero ? "text-2xl font-bold" : "text-xl font-bold",
            )}
          >
            {mentor.name}
          </h3>
          <p
            className={cn(
              "mt-0.5 font-medium tracking-wide text-text-muted",
              isHero ? "text-base" : "text-sm",
            )}
          >
            {mentor.headline}
          </p>
        </div>

        <div
          className={cn(
            "my-4 flex min-h-[48px] items-center rounded-r-xl border-l-2 border-zone-mentorship/30 bg-bg-main/40 py-2 pl-3 text-sm text-text-muted/90 line-clamp-2",
            isHero && "min-h-[56px] text-base",
          )}
        >
          {bioText}
        </div>

        <div className="flex flex-wrap gap-2">
          {badgeItems.map((item) => (
            <span key={item.key} className={cn(pillClass, !item.uppercase && "normal-case tracking-normal")}>
              {item.icon}
              {item.label}
            </span>
          ))}
          {mentor.verified && (
            <span className={pillClass}>Verified</span>
          )}
        </div>
      </div>

      {showPrice && (
        <div className="mt-2 flex items-center justify-between border-t border-border-custom/60 pt-4">
          <p className="text-sm text-text-muted">
            From{" "}
            <span className={cn("text-lg font-extrabold text-text-main", isHero && "text-xl")}>
              ${mentor.monthlyRate}
            </span>
            /mo
          </p>
          <span
            className="rounded-xl bg-zone-mentorship/10 p-2 text-zone-mentorship transition-all duration-300 group-hover:bg-zone-mentorship group-hover:text-bg-main"
            aria-hidden
          >
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
          </span>
        </div>
      )}
    </Link>
  );
}
