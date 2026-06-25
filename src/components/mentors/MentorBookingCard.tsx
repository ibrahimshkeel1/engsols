"use client";

import Link from "next/link";
import { useState } from "react";
import { ExternalLink } from "lucide-react";
import type { Mentor } from "@/types";
import { Badge } from "@/components/ui/badge";
import { BookingRequestForm } from "@/components/mentors/BookingRequestForm";
import { BookingCancellationPolicy } from "@/components/mentors/BookingCancellationPolicy";
import { MonthlyQuickCheckout } from "@/components/mentors/MonthlyQuickCheckout";
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
    <div className="rounded-xl border border-oil-gas-navy/10 bg-oil-gas-ice p-4 text-center">
      <p className="text-sm text-oil-gas-navy-muted">Log in to request this session with the mentor.</p>
      <Link
        href={`/login?next=${next}`}
        className="mt-3 inline-flex h-10 items-center justify-center rounded-xl bg-oil-gas-orange px-5 text-sm font-semibold text-white hover:bg-oil-gas-orange-hover"
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
  const introCalendly = calendlyForOption(mentor, "intro");
  const calendlyUrl = calendlyForOption(mentor, selected);
  const loginRequired = requiresLogin(selected);
  const showForm = !calendlyUrl;
  const paidMonthly = selected === "monthly" && mentor.monthlyRate > 0;

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
      {introCalendly && (
        <div className="mb-6 rounded-2xl border border-oil-gas-orange/30 bg-oil-gas-orange/5 p-5">
          <p className="text-sm font-semibold text-oil-gas-navy">Book a free intro instantly</p>
          <p className="mt-1 text-xs text-oil-gas-navy-muted">
            Pick a time on {mentor.name.split(" ")[0]}&apos;s calendar — no form, no login required.
          </p>
          <a
            href={introCalendly}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-oil-gas-orange text-sm font-semibold text-white transition hover:bg-oil-gas-orange-hover"
          >
            Book free intro on calendar <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      )}

      <h2 className="section-heading">Book a session</h2>
      <p className="text-body mt-2 text-oil-gas-navy-muted">
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
                  ? "border-oil-gas-orange ring-2 ring-oil-gas-orange/25"
                  : "border-oil-gas-navy/20 shadow-premium-card"
                : "border-border/75 hover:border-border",
            )}
          >
            {option.highlighted && (
              <Badge className="mb-3 w-fit border-oil-gas-orange/20 bg-oil-gas-orange/10 text-oil-gas-orange-hover">
                Best value
              </Badge>
            )}
            <p className="text-caption font-medium uppercase tracking-wide text-oil-gas-navy-muted">
              {option.duration}
            </p>
            <p className="mt-1 text-base font-semibold text-oil-gas-navy">{option.title}</p>
            <p className="mt-2 text-2xl font-bold tabular-nums text-oil-gas-navy">{option.price}</p>
            <p className="text-caption mt-2 line-clamp-3 text-oil-gas-navy-muted">{option.detail}</p>
            <span
              className={cn(
                "mt-4 inline-flex h-10 w-full items-center justify-center rounded-lg text-sm font-medium",
                selected === option.id
                  ? "bg-oil-gas-orange text-white"
                  : "border border-oil-gas-navy/15 bg-white text-oil-gas-navy",
              )}
            >
              {selected === option.id ? "Selected" : "Select"}
            </span>
          </button>
        ))}
      </div>

      {(selected === "monthly" || paidMonthly) && <BookingCancellationPolicy className="mt-4" />}

      <div className="mt-8 rounded-xl border border-oil-gas-navy/10 bg-oil-gas-ice/80 p-5 sm:p-6">
        {calendlyUrl && selected !== "intro" ? (
          <>
            <a
              href={calendlyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-oil-gas-orange text-sm font-semibold text-white hover:bg-oil-gas-orange-hover"
            >
              Book on calendar <ExternalLink className="h-4 w-4" />
            </a>
            <p className="mt-3 text-center text-xs text-oil-gas-navy-muted">
              Pick a time instantly — {mentor.name.split(" ")[0]} uses Calendly for scheduling.
            </p>
          </>
        ) : calendlyUrl && selected === "intro" ? (
          <div className="space-y-4">
            <p className="text-center text-sm text-oil-gas-navy-muted">
              Use the calendar button above for the fastest intro booking.
            </p>
            <BookingRequestForm
              mentorSlug={mentor.slug}
              mentorName={mentor.name}
              mentor={mentor}
              type="intro"
              monthlyRate={mentor.monthlyRate}
              defaultName={defaultName}
              defaultEmail={defaultEmail}
              isLoggedIn={isLoggedIn}
            />
          </div>
        ) : paidMonthly && isLoggedIn ? (
          <MonthlyQuickCheckout
            mentorSlug={mentor.slug}
            mentorName={mentor.name}
            monthlyRate={mentor.monthlyRate}
          />
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
