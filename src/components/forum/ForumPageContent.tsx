import { Suspense } from "react";
import { getForumPosts } from "@/lib/data/forum";
import { ForumList } from "@/components/forum/ForumList";
import { ForumListRealtime } from "@/components/forum/ForumListRealtime";
import { ForumThreadListSkeleton } from "@/components/ui/DirectorySkeletons";

export async function ForumPageContent() {
  const posts = await getForumPosts();
  return (
    <>
      <ForumListRealtime />
      <Suspense fallback={<ForumThreadListSkeleton count={5} />}>
        <ForumList posts={posts} />
      </Suspense>
    </>
  );
}
