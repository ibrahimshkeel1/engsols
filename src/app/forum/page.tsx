import { Suspense } from "react";
import { ButtonLink } from "@/components/ui/button";
import { PageHero } from "@/components/shared/PageHero";
import { ForumPageContent } from "@/components/forum/ForumPageContent";
import { FilterBarSkeleton, ForumThreadListSkeleton } from "@/components/ui/DirectorySkeletons";
import { SectionReveal } from "@/components/motion/SectionReveal";
import { messages } from "@/lib/i18n/messages";

export const revalidate = 60;

export default async function ForumPage() {
  const title = messages.en.forumOutcome;

  return (
    <>
      <PageHero
        variant="forum"
        title={title}
        description="Get answers from mentors and peers who've passed the exams, landed the jobs, and solved the problems you're facing."
      >
        <ButtonLink href="/forum/new">Ask a question</ButtonLink>
      </PageHero>
      <div className="page-container-wide bg-background py-12">
        <SectionReveal>
          <Suspense
            fallback={
              <>
                <FilterBarSkeleton selects={2} />
                <div className="mt-8">
                  <ForumThreadListSkeleton count={5} />
                </div>
              </>
            }
          >
            <ForumPageContent />
          </Suspense>
        </SectionReveal>
      </div>
    </>
  );
}
