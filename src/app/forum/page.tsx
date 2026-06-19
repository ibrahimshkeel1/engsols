import { Suspense } from "react";
import Link from "next/link";
import { getForumPosts } from "@/lib/data/forum";
import { PageHero } from "@/components/shared/PageHero";
import { ForumList } from "@/components/forum/ForumList";
import { ForumListRealtime } from "@/components/forum/ForumListRealtime";
import { ForumSkeletonList } from "@/components/forum/ForumSkeletonList";

export const revalidate = 60;

export default async function ForumPage() {
  const posts = await getForumPosts();

  return (
    <>
      <PageHero
        variant="forum"
        title="Ask engineers who've been there"
        description="Get answers from mentors and peers who've passed the exams, landed the jobs, and solved the problems you're facing."
      >
        <Link href="/forum/new" className="inline-flex h-11 items-center rounded-xl bg-accent px-6 text-sm font-semibold text-accent-foreground shadow-md shadow-accent/25 transition-all hover:brightness-110 active:scale-95">
          Ask a question
        </Link>
      </PageHero>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <ForumListRealtime />
        <Suspense fallback={<ForumSkeletonList />}>
          <ForumList posts={posts} />
        </Suspense>
      </div>
    </>
  );
}
