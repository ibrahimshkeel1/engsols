"use client";

import Link from "next/link";
import { useState } from "react";
import { ExternalLink } from "lucide-react";
import type { Mentor } from "@/types";
import { Badge } from "@/components/ui/badge";
import { BookingRequestForm } from "@/components/mentors/BookingRequestForm";
import { sessionTypes } from "@/data/sessionTypes";
import { formatIntroCallPrice, introBadgeLabel } from "@/lib/mentor-display";
import { formatMentorAvailabilitySummary } from "@/lib/mentor-availability";
import { cn } from "@/lib/utils";

type BookingOption = "intro" | "study-plan" | "interview-prep" | "monthly";

type Props = {
  mentor: Mentor;
  defaultName?: string;
  defaultEmail?: string;
  initialSession?: string;
  isLoggedIn?: boolean;
  variant?: "default" | "sidebar";
};

function BookingLoginGate({ mentorSlug, sessionType }: { mentorSlug: string; sessionType: string }) {
  const next = encodeURIComponent(`/mentors/${mentorSlug}?session=${sessionType}#booking-options`);
  return (
    <div className="rounded-xl border border-border bg-muted/40 p-4 text-center">
      <p className="text-sm text-muted-foreground">Log in to request this session with the mentor.</p>
      <Link
        href={`/login?next=${next}`}
        className="mt-3 inline-flex h-10 items-center justify-center rounded-xl bg-zone-mentorship px-5 text-sm font-semibold text-white hover:brightness-110"
      >
        Log in to book
      </Link>
    </div>
  );
}

const studyPlanSession = sessionTypes.find((s) => s.id === "study-plan")!;
const interviewSession = sessionTypes.find((s) => s.id === "interview-prep")!;

function calendlyForOption(mentor: Mentor, option: BookingOption): string | null {
  switch (option) {
    case "intro":
      return mentor.introCalendlyUrl ?? mentor.calendlyUrl ?? null;
    case "study-plan":
      return mentor.studyPlanCalendlyUrl ?? mentor.calendlyUrl ?? null;
    case "interview-prep":
      return mentor.interviewCalendlyUrl ?? mentor.calendlyUrl ?? null;
    default:
      return null;
  }
}

function requiresLogin(option: BookingOption): boolean {
  return option === "monthly" || option === "study-plan" || option === "interview-prep";
}

export function MentorBookingCard({
  mentor,
  defaultName,
  defaultEmail,
  initialSession,
  isLoggedIn = false,
  variant = "default",
}: Props) {
  const initialOption: BookingOption =
    initialSession === "monthly"
      ? "monthly"
      : initialSession === "interview-prep"
        ? "interview-prep"
        : initialSession === "study-plan"
          ? "study-plan"
          : "intro";

  const [selected, setSelected] = useState<BookingOption>(initialOption);

  const introPrice = formatIntroCallPrice(mentor.introCallRate);
  const availabilitySummary = formatMentorAvailabilitySummary(mentor);
  const calendlyUrl = calendlyForOption(mentor, selected);
  const loginRequired = requiresLogin(selected);
  const showForm = !calendlyUrl;

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
      detail: `${introBadgeLabel(mentor.introCallRate)} · meet with no commitment`,
    },
    {
      id: "study-plan",
      title: studyPlanSession.title,
      duration: "60 min",
      price: `$${studyPlanSession.price}`,
      detail: studyPlanSession.description.slice(0, 72) + "…",
    },
    {
      id: "interview-prep",
      title: interviewSession.title,
      duration: "60 min",
      price: `$${interviewSession.price}`,
      detail: interviewSession.description.slice(0, 72) + "…",
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

  const gridClass =
    variant === "sidebar"
      ? "mt-6 flex flex-col gap-3"
      : "mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-4";

  return (
    <div id="booking-options" className="scroll-mt-24">
      <h2 className="section-heading">Book a session</h2>
      <p className="text-body mt-2 text-muted-foreground">
        {availabilitySummary ?? "Choose an option — pricing is upfront, no surprises."}
      </p>

      <div className={gridClass}>
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            id={option.id === "monthly" ? "booking-monthly" : undefined}
            onClick={() => setSelected(option.id)}
            className={cn(
              "flex shrink-0 flex-col rounded-xl border bg-card p-5 text-start transition-all duration-200 ease-out",
              variant === "sidebar" ? "w-full" : "w-[min(100%,16rem)] snap-start sm:w-auto",
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
            <p className="text-caption mt-2 line-clamp-3 text-muted-foreground">{option.detail}</p>
            <span
              className={cn(
                "mt-4 inline-flex h-10 w-full items-center justify-center rounded-lg text-sm font-medium",
                selected === option.id
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-surface text-foreground",
              )}
            >
              {selected === option.id ? "Selected" : "Select"}
            </span>
          </button>
        ))}
      </div>

      {selected === "monthly" && (
        <p className="mt-4 text-xs text-muted-foreground">
          Cancel anytime — no lock-in. Monthly plans are billed through Stripe; you can manage billing from your
          account settings.
        </p>
      )}

      <div className="mt-8 rounded-xl border border-border/75 bg-muted/20 p-5 sm:p-6">
        {calendlyUrl ? (
          <>
            <a
              href={calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-zone-mentorship text-sm font-semibold text-white hover:brightness-110"
            >
              {selected === "intro" ? "Book intro on calendar" : "Book on calendar"}{" "}
              <ExternalLink className="h-4 w-4" />
            </a>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Pick a time instantly — {mentor.name.split(" ")[0]} uses Calendly for scheduling.
            </p>
          </>
        ) : loginRequired && !isLoggedIn ? (
          <BookingLoginGate mentorSlug={mentor.slug} sessionType={selected} />
        ) : showForm ? (
          <BookingRequestForm
            mentorSlug={mentor.slug}
            mentorName={mentor.name}
            mentor={mentor}
            type={selected}
            monthlyRate={mentor.monthlyRate}
            defaultName={defaultName}
            defaultEmail={defaultEmail}
            isLoggedIn={isLoggedIn}
          />
        ) : null}
      </div>
    </div>
  );
}
