import { getForumPosts } from "@/lib/data/forum";
import { ForumList } from "@/components/forum/ForumList";
import { ForumListRealtime } from "@/components/forum/ForumListRealtime";

export async function ForumPageContent() {
  const posts = await getForumPosts();
  return (
    <>
      <ForumListRealtime />
      <ForumList posts={posts} />
    </>
  );
}
