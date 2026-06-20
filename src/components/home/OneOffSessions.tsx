import { sessionTypes } from "@/data/sessionTypes";
import { ZoneSection } from "@/components/ui/ZoneSection";
import { ZoneCard } from "@/components/ui/ZoneCard";
import { ButtonLink } from "@/components/ui/button";

export function OneOffSessions() {
  return (
    <ZoneSection zone="exams" alt accent={false}>
      <div className="page-container-wide">
        <h2 className="section-heading text-center">
          Not sure if mentorship is right for you? Try a one-off session
        </h2>
        <p className="text-body-lg mx-auto mt-4 max-w-2xl text-center">
          Book a focused call with an expert — intro chats, study plans, or interview prep.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {sessionTypes.map((session) => (
            <ZoneCard key={session.id} zone="exams" className="flex flex-col" interactive={false}>
              <h3 className="text-base font-medium text-text-main">{session.title}</h3>
              <p className="text-caption mt-2 flex-1">{session.description}</p>
              <p className="text-caption mt-4">
                From <span className="text-base font-medium text-text-main">${session.price}</span>/session
              </p>
              <ButtonLink
                href={`/mentors?session=${session.id}`}
                variant="secondary"
                className="mt-6 w-full"
              >
                Find a mentor
              </ButtonLink>
            </ZoneCard>
          ))}
        </div>
        <p className="text-caption mt-8 text-center">
          One-off sessions are a low-commitment way to test the fit before ongoing mentorship.
        </p>
      </div>
    </ZoneSection>
  );
}
