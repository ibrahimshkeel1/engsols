"use client";

import Link from "next/link";
import { useState } from "react";
import { Calendar, Check, ExternalLink, MessageSquare, Video } from "lucide-react";
import type { Mentor } from "@/types";
import { Badge } from "@/components/ui/badge";
import { BookingRequestForm } from "@/components/mentors/BookingRequestForm";
import { sessionTypes } from "@/data/sessionTypes";
import { formatMentorAvailabilitySummary } from "@/lib/mentor-availability";
import { cn } from "@/lib/utils";

const includes = [
  { icon: Video, text: "30-min free intro call" },
  { icon: MessageSquare, text: "Async Q&A between sessions" },
  { icon: Calendar, text: "Flexible weekly or bi-weekly calls" },
  { icon: Check, text: "Career roadmap tailored to you" },
];

type Tab = "intro" | "monthly" | "one-off";
type OneOffType = "study-plan" | "interview-prep";

type Props = {
  mentor: Mentor;
  defaultName?: string;
  defaultEmail?: string;
  initialSession?: string;
  isLoggedIn?: boolean;
};

function BookingLoginGate({ mentorSlug }: { mentorSlug: string }) {
  const next = encodeURIComponent(`/mentors/${mentorSlug}#book-intro`);
  return (
    <div className="rounded-xl border border-border bg-muted/40 p-4 text-center">
      <p className="text-sm text-muted-foreground">Log in to request a booking with this mentor.</p>
      <Link
        href={`/login?next=${next}`}
        className="mt-3 inline-flex h-10 items-center rounded-xl bg-accent px-5 text-sm font-semibold text-accent-foreground hover:brightness-110"
      >
        Log in to book
      </Link>
    </div>
  );
}

export function MentorBookingCard({ mentor, defaultName, defaultEmail, initialSession, isLoggedIn = false }: Props) {
  const initialTab: Tab =
    initialSession === "study-plan" || initialSession === "interview-prep" ? "one-off" : "intro";
  const [tab, setTab] = useState<Tab>(initialTab);
  const [oneOffType, setOneOffType] = useState<OneOffType>(
    initialSession === "interview-prep" ? "interview-prep" : "study-plan",
  );

  const calendlyForOneOff =
    oneOffType === "study-plan"
      ? mentor.studyPlanCalendlyUrl ?? mentor.calendlyUrl
      : mentor.interviewCalendlyUrl ?? mentor.calendlyUrl;

  const availabilitySummary = formatMentorAvailabilitySummary(mentor);

  return (
    <div className="card-elevated overflow-hidden rounded-2xl">
      <div className="border-b border-border bg-muted/40 p-5">
        <Badge className="bg-green-500/15 text-green-700 dark:text-green-400">Free intro call</Badge>
        <p className="mt-3 text-sm text-muted-foreground">Monthly mentorship</p>
        <p className="text-3xl font-bold">
          ${mentor.monthlyRate}
          <span className="text-base font-normal text-muted-foreground">/mo</span>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {availabilitySummary ?? "Book a free intro to check availability"}
        </p>
      </div>

      <div className="flex border-b border-border">
        {([
          { id: "intro" as const, label: "Intro" },
          { id: "monthly" as const, label: "Monthly" },
          { id: "one-off" as const, label: "One-off" },
        ]).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "flex-1 py-3 text-sm font-medium transition-colors",
              tab === t.id ? "border-b-2 border-accent text-accent" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="p-5">
        {tab === "one-off" ? (
          <div className="space-y-4">
            <div className="flex gap-2">
              {(["study-plan", "interview-prep"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setOneOffType(t)}
                  className={cn(
                    "flex-1 rounded-lg border px-2 py-2 text-xs font-medium",
                    oneOffType === t ? "border-accent bg-accent/10 text-accent" : "border-border text-muted-foreground",
                  )}
                >
                  {sessionTypes.find((s) => s.id === t)?.title ?? t}
                </button>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              {sessionTypes.find((s) => s.id === oneOffType)?.description}
            </p>
            {calendlyForOneOff ? (
              <a
                href={calendlyForOneOff}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-accent text-sm font-semibold text-accent-foreground hover:brightness-110"
              >
                Book & pay via Calendly <ExternalLink className="h-4 w-4" />
              </a>
            ) : null}
            {isLoggedIn ? (
              <BookingRequestForm
                mentorSlug={mentor.slug}
                mentorName={mentor.name}
                type={oneOffType}
                defaultName={defaultName}
                defaultEmail={defaultEmail}
              />
            ) : (
              <BookingLoginGate mentorSlug={mentor.slug} />
            )}
          </div>
        ) : isLoggedIn ? (
          <BookingRequestForm
            mentorSlug={mentor.slug}
            mentorName={mentor.name}
            type={tab}
            defaultName={defaultName}
            defaultEmail={defaultEmail}
          />
        ) : (
          <BookingLoginGate mentorSlug={mentor.slug} />
        )}
      </div>

      <div className="space-y-2.5 border-t border-border p-5">
        <p className="text-sm font-semibold">What&apos;s included</p>
        {includes.map((item) => (
          <div key={item.text} className="flex items-center gap-2 text-sm text-muted-foreground">
            <item.icon className="h-4 w-4 shrink-0 text-accent" />
            {item.text}
          </div>
        ))}
      </div>

      <div className="space-y-2 border-t border-border p-5">
        <p className="text-sm font-semibold">One-off sessions</p>
        {sessionTypes.filter((s) => s.id !== "intro").map((s) => (
          <div key={s.id} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{s.title}</span>
            <span className="font-medium">${s.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
