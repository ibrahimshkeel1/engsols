"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Star, ArrowRight, BadgeCheck } from "lucide-react";
import type { Mentor } from "@/types";
import { getDisciplineColors } from "@/lib/discipline-colors";
import { Avatar } from "@/components/ui/Avatar";
import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { DisciplineBadge } from "@/components/ui/DisciplineBadge";

type MentorCardProps = {
  mentor: Mentor;
  showPrice?: boolean;
};

export function MentorCard({ mentor, showPrice = true }: MentorCardProps) {
  const stripe = getDisciplineColors(mentor.discipline).stripe;

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}>
      <Link href={`/mentors/${mentor.slug}`} className="card-interactive group relative flex h-full flex-col overflow-hidden rounded-2xl">
        <div className={`absolute left-0 top-0 h-full w-1 ${stripe}`} />
        <div className="absolute inset-0 bg-gradient-to-br from-accent/0 to-accent/0 transition-all duration-500 group-hover:from-accent/[0.03] group-hover:to-transparent" />
        <div className="relative flex flex-1 flex-col p-5 pl-6">
          <div className="flex items-start gap-4">
            <div className="relative">
              <Avatar name={mentor.name} discipline={mentor.discipline} size="md" src={mentor.avatarUrl} />
              {mentor.featured && (
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-sm">
                  <BadgeCheck className="h-3 w-3" />
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 text-accent">
                <Star className="h-3.5 w-3.5 fill-current" />
                <span className="text-sm font-semibold">{mentor.rating.toFixed(1)}</span>
                <span className="text-xs text-muted-foreground">({mentor.reviewCount})</span>
              </div>
              <h3 className="mt-0.5 truncate font-semibold">{mentor.name}</h3>
              <p className="truncate text-sm text-muted-foreground">{mentor.headline}</p>
              <div className="mt-1 flex items-center gap-1.5">
                <CompanyLogo company={mentor.company} size="sm" />
                <p className="truncate text-xs text-muted-foreground">{mentor.company}</p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            <DisciplineBadge discipline={mentor.discipline} />
            {mentor.credentials.slice(0, 2).map((c) => (
              <span key={c} className="inline-flex rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {c}
              </span>
            ))}
          </div>

          {showPrice && (
            <div className="mt-auto flex items-end justify-between pt-5">
              <p className="text-sm text-muted-foreground">
                From <span className="font-semibold text-foreground">${mentor.monthlyRate}</span>/mo
              </p>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-accent" />
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
