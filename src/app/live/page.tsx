import { ButtonLink } from "@/components/ui/button";
import { getLiveSessions } from "@/lib/data/live";
import { PageHero } from "@/components/shared/PageHero";
import { LiveSessionsGrid } from "@/components/live/LiveSessionsGrid";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { serverT } from "@/lib/i18n/server";

export default async function LivePage() {
  const sessions = await getLiveSessions();
  const title = await serverT("liveOutcome");

  return (
    <>
      <PageHero
        variant="live"
        title={title}
        description="Join Q&As, workshops, and deep-dives with mentors — ask questions in real time."
      >
        <ButtonLink href="/live/new">Start a session</ButtonLink>
      </PageHero>
      <div className="page-container-wide bg-background py-12">
        <SectionReveal>
          <LiveSessionsGrid sessions={sessions} />
        </SectionReveal>
      </div>
    </>
  );
}
