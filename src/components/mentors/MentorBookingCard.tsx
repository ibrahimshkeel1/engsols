"use client";

import { useState } from "react";
import { Calendar, Check, MessageSquare, Video } from "lucide-react";
import type { Mentor } from "@/types";
import { Badge } from "@/components/ui/badge";
import { BookingRequestForm } from "@/components/mentors/BookingRequestForm";
import { sessionTypes } from "@/data/sessionTypes";
import { cn } from "@/lib/utils";

const includes = [
  { icon: Video, text: "30-min free intro call" },
  { icon: MessageSquare, text: "Async Q&A between sessions" },
  { icon: Calendar, text: "Flexible weekly or bi-weekly calls" },
  { icon: Check, text: "Career roadmap tailored to you" },
];

type Props = {
  mentor: Mentor;
  defaultName?: string;
  defaultEmail?: string;
};

export function MentorBookingCard({ mentor, defaultName, defaultEmail }: Props) {
  const [tab, setTab] = useState<"intro" | "monthly">("intro");

  return (
    <div className="card-elevated sticky top-24 overflow-hidden rounded-2xl">
      <div className="border-b border-border bg-muted/40 p-5">
        <Badge className="bg-green-500/15 text-green-700 dark:text-green-400">Free intro call</Badge>
        <p className="mt-3 text-sm text-muted-foreground">Monthly mentorship</p>
        <p className="text-3xl font-bold">
          ${mentor.monthlyRate}
          <span className="text-base font-normal text-muted-foreground">/mo</span>
        </p>
        <p className="mt-1 text-xs text-muted-foreground">Next slot: usually within 48 hours</p>
      </div>

      <div className="flex border-b border-border">
        {(["intro", "monthly"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "flex-1 py-3 text-sm font-medium transition-colors",
              tab === t ? "border-b-2 border-accent text-accent" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t === "intro" ? "Intro call" : "Monthly"}
          </button>
        ))}
      </div>

      <div className="p-5">
        <BookingRequestForm
          mentorSlug={mentor.slug}
          mentorName={mentor.name}
          type={tab}
          defaultName={defaultName}
          defaultEmail={defaultEmail}
        />
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
        {sessionTypes.map((s) => (
          <div key={s.id} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{s.title}</span>
            <span className="font-medium">${s.price}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
