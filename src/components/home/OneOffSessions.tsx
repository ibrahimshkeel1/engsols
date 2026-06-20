import Link from "next/link";
import { sessionTypes } from "@/data/sessionTypes";
import { ZoneSection } from "@/components/ui/ZoneSection";
import { ZoneCard } from "@/components/ui/ZoneCard";

export function OneOffSessions() {
  return (
    <ZoneSection zone="exams" alt accent className="py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <h2 className="text-center font-display text-3xl text-text-main">
          Not sure if mentorship is right for you? Try a one-off session
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-text-muted">
          Book a focused call with an expert — intro chats, study plans, or interview prep.
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {sessionTypes.map((session) => (
            <ZoneCard key={session.id} zone="exams" className="flex flex-col p-6">
              <h3 className="text-lg font-semibold text-text-main">{session.title}</h3>
              <p className="mt-2 flex-1 text-sm text-text-muted">{session.description}</p>
              <p className="mt-4 text-sm text-text-muted">
                From <span className="text-lg font-bold text-text-main">${session.price}</span>/session
              </p>
              <Link
                href={`/mentors?session=${session.id}`}
                className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-xl border border-border bg-card text-sm font-semibold text-text-main transition-colors hover:border-zone-exams/50"
              >
                Find a mentor
              </Link>
            </ZoneCard>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-text-muted">
          One-off sessions are a low-commitment way to test the fit before ongoing mentorship.
        </p>
      </div>
    </ZoneSection>
  );
}
