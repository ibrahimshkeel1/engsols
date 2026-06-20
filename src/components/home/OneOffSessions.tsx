import Link from "next/link";
import { sessionTypes } from "@/data/sessionTypes";
import { ZoneSection } from "@/components/ui/ZoneSection";

export function OneOffSessions() {
  return (
    <ZoneSection zone="exams" alt accent={false} className="!py-12 lg:!py-16">
      <div className="page-container-wide opacity-90">
        <p className="section-label opacity-50">One-off sessions</p>
        <p className="text-caption mt-2 max-w-lg text-muted-foreground">
          Try a focused intro, study plan, or interview prep call before committing to ongoing mentorship.
        </p>
        <ul className="mt-5 flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
          {sessionTypes.map((session) => (
            <li key={session.id}>
              <Link
                href={`/mentors?session=${session.id}`}
                className="inline-flex rounded-lg border border-border/75 bg-card px-3 py-2 text-xs text-foreground/85 transition-colors hover:border-primary/25 hover:text-primary"
              >
                {session.title}
                <span className="ms-2 text-muted-foreground">from ${session.price}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </ZoneSection>
  );
}
