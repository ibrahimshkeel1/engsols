import Link from "next/link";
import { getForumPosts } from "@/lib/data/forum";
import { PageHero } from "@/components/shared/PageHero";
import { ForumList } from "@/components/forum/ForumList";

export default async function ForumPage() {
  const posts = await getForumPosts();

  return (
    <>
      <PageHero
        variant="forum"
        title="Engineering Forum"
        description="Ask questions, share knowledge, and learn from mentors and peers."
      >
        <Link href="/forum/new" className="inline-flex h-11 items-center rounded-xl bg-accent px-6 text-sm font-semibold text-accent-foreground shadow-md shadow-accent/25 transition-all hover:brightness-110 active:scale-95">
          Ask a question
        </Link>
      </PageHero>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <ForumList posts={posts} />
      </div>
    </>
  );
}
