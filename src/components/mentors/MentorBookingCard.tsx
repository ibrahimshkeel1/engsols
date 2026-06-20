"use client";

import Link from "next/link";
import { useState } from "react";
import { ExternalLink } from "lucide-react";
import type { Mentor } from "@/types";
import { Badge } from "@/components/ui/badge";
import { BookingRequestForm } from "@/components/mentors/BookingRequestForm";
import { sessionTypes } from "@/data/sessionTypes";
import { formatMentorAvailabilitySummary } from "@/lib/mentor-availability";
import { cn } from "@/lib/utils";

type BookingOption = "intro" | "deep" | "monthly";

type Props = {
  mentor: Mentor;
  defaultName?: string;
  defaultEmail?: string;
  initialSession?: string;
  isLoggedIn?: boolean;
};

function BookingLoginGate({ mentorSlug }: { mentorSlug: string }) {
  const next = encodeURIComponent(`/mentors/${mentorSlug}#booking-options`);
  return (
    <div className="rounded-xl border border-border bg-muted/40 p-4 text-center">
      <p className="text-sm text-muted-foreground">Log in to request a booking with this mentor.</p>
      <Link
        href={`/login?next=${next}`}
        className="mt-3 inline-flex h-10 items-center rounded-xl bg-zone-mentorship px-5 text-sm font-semibold text-white hover:brightness-110 dark:text-bg-main"
      >
        Log in to book
      </Link>
    </div>
  );
}

const deepSession = sessionTypes.find((s) => s.id === "study-plan")!;

export function MentorBookingCard({ mentor, defaultName, defaultEmail, initialSession, isLoggedIn = false }: Props) {
  const initialOption: BookingOption =
    initialSession === "monthly"
      ? "monthly"
      : initialSession === "study-plan" || initialSession === "interview-prep"
        ? "deep"
        : "intro";
  const [selected, setSelected] = useState<BookingOption>(initialOption);

  const introPrice = mentor.introCallRate > 0 ? `$${mentor.introCallRate}` : "Free";
  const availabilitySummary = formatMentorAvailabilitySummary(mentor);

  const formType = selected === "deep" ? "study-plan" : selected;

  const calendlyUrl =
    selected === "intro"
      ? mentor.introCalendlyUrl ?? mentor.calendlyUrl
      : selected === "deep"
        ? mentor.studyPlanCalendlyUrl ?? mentor.calendlyUrl
        : null;

  const options: {
    id: BookingOption;
    title: string;
    duration: string;
    price: string;
    detail: string;
    highlighted?: boolean;
  }[] = [
    {
      id: "intro",
      title: "Intro Call",
      duration: "30 min",
      price: introPrice,
      detail: "Meet the mentor, no commitment",
    },
    {
      id: "deep",
      title: "Deep Session",
      duration: "60 min",
      price: `$${deepSession.price}`,
      detail: deepSession.title,
    },
    {
      id: "monthly",
      title: "Monthly Mentorship",
      duration: "Ongoing",
      price: `$${mentor.monthlyRate}/mo`,
      detail: "Best for sustained career progress",
      highlighted: true,
    },
  ];

  return (
    <div id="booking-options" className="scroll-mt-24">
      <h2 className="section-heading">Book a session</h2>
      <p className="text-body mt-2 text-muted-foreground">
        {availabilitySummary ?? "Choose an option — pricing is upfront, no surprises."}
      </p>

      <div className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            id={option.id === "monthly" ? "booking-monthly" : undefined}
            onClick={() => setSelected(option.id)}
            className={cn(
              "flex w-[min(100%,16rem)] shrink-0 snap-start flex-col rounded-xl border bg-card p-5 text-start transition-all duration-200 ease-out sm:w-auto",
              option.highlighted && "shadow-premium-card",
              selected === option.id
                ? option.highlighted
                  ? "border-primary ring-2 ring-primary/25"
                  : "border-border-custom shadow-premium-card"
                : "border-border/75 hover:border-border",
            )}
          >
            {option.highlighted && (
              <Badge className="mb-3 w-fit bg-primary/10 text-primary">Best value</Badge>
            )}
            <p className="text-caption font-medium uppercase tracking-wide text-muted-foreground">
              {option.duration}
            </p>
            <p className="mt-1 text-base font-semibold text-foreground">{option.title}</p>
            <p className="mt-2 text-2xl font-bold tabular-nums">{option.price}</p>
            <p className="text-caption mt-2 text-muted-foreground">{option.detail}</p>
            <span
              className={cn(
                "mt-4 inline-flex h-10 w-full items-center justify-center rounded-lg text-sm font-medium",
                selected === option.id
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-surface text-foreground",
              )}
            >
              {selected === option.id ? "Selected" : "Book"}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-8 rounded-xl border border-border/75 bg-muted/20 p-5 sm:p-6">
        {calendlyUrl && (
          <a
            href={calendlyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-zone-mentorship text-sm font-semibold text-white hover:brightness-110 dark:text-bg-main"
          >
            Book via Calendly <ExternalLink className="h-4 w-4" />
          </a>
        )}
        {isLoggedIn ? (
          <BookingRequestForm
            mentorSlug={mentor.slug}
            mentorName={mentor.name}
            type={formType}
            monthlyRate={mentor.monthlyRate}
            defaultName={defaultName}
            defaultEmail={defaultEmail}
          />
        ) : (
          <BookingLoginGate mentorSlug={mentor.slug} />
        )}
      </div>
    </div>
  );
}
