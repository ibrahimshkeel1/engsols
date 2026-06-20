import { Suspense } from "react";
import Link from "next/link";
import { PageHero } from "@/components/shared/PageHero";
import { ForumPageContent } from "@/components/forum/ForumPageContent";
import { ForumSkeletonList } from "@/components/forum/ForumSkeletonList";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { serverT } from "@/lib/i18n/server";

export const revalidate = 60;

export default async function ForumPage() {
  const title = await serverT("forumOutcome");

  return (
    <>
      <PageHero
        variant="forum"
        title={title}
        description="Get answers from mentors and peers who've passed the exams, landed the jobs, and solved the problems you're facing."
      >
        <Link href="/forum/new" className="inline-flex h-11 items-center rounded-xl bg-zone-recruiter px-6 text-sm font-semibold text-white shadow-sm hover:brightness-110 dark:text-bg-main">
          Ask a question
        </Link>
      </PageHero>
      <div className="mx-auto max-w-7xl bg-background px-4 py-12 sm:px-6">
        <SectionReveal>
          <Suspense fallback={<ForumSkeletonList />}>
            <ForumPageContent />
          </Suspense>
        </SectionReveal>
      </div>
    </>
  );
}
