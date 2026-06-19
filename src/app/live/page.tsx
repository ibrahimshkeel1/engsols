import Link from "next/link";
import { getLiveSessions } from "@/lib/data/live";
import { PageHero } from "@/components/shared/PageHero";
import { LiveSessionsGrid } from "@/components/live/LiveSessionsGrid";

export default async function LivePage() {
  const sessions = await getLiveSessions();

  return (
    <>
      <PageHero
        variant="live"
        title="Watch engineers live"
        description="Join Q&As, workshops, and deep-dives with mentors — ask questions in real time."
      >
        <Link href="/live/new" className="inline-flex h-11 items-center rounded-xl bg-accent px-6 text-sm font-semibold text-accent-foreground shadow-md hover:brightness-110">
          Start a session
        </Link>
      </PageHero>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <LiveSessionsGrid sessions={sessions} />
      </div>
    </>
  );
}
