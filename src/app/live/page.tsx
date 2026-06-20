import Link from "next/link";
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
        <Link href="/live/new" className="inline-flex h-11 items-center rounded-xl bg-zone-live px-6 text-sm font-semibold text-white shadow-zone-live hover:brightness-110 dark:text-bg-main">
          Start a session
        </Link>
      </PageHero>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <SectionReveal>
          <LiveSessionsGrid sessions={sessions} />
        </SectionReveal>
      </div>
    </>
  );
}
