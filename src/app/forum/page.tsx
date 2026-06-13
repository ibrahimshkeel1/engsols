import Link from "next/link";
import { getForumPosts } from "@/lib/data/forum";
import { PageHero } from "@/components/shared/PageHero";
import { ForumList } from "@/components/forum/ForumList";

export default async function ForumPage() {
  const posts = await getForumPosts();

  return (
    <>
      <PageHero
        title="Engineering Forum"
        description="Ask questions, share knowledge, and learn from mentors and peers."
      >
        <Link href="/forum/new" className="inline-flex h-11 items-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/25 hover:brightness-110">
          Ask a question
        </Link>
      </PageHero>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <ForumList posts={posts} />
      </div>
    </>
  );
}
