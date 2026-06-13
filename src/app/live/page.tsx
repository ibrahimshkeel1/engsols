import { getLiveSessions } from "@/lib/data/live";
import { PageHero } from "@/components/shared/PageHero";
import { LiveSessionsGrid } from "@/components/live/LiveSessionsGrid";

export default async function LivePage() {
  const sessions = await getLiveSessions();

  return (
    <>
      <PageHero
        title="Live Sessions"
        description="Watch engineers and mentors live — Q&As, workshops, and industry deep dives."
      />
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <LiveSessionsGrid sessions={sessions} />
      </div>
    </>
  );
}
