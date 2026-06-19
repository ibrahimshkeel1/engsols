import { ForumSkeletonList } from "@/components/forum/ForumSkeletonList";

export default function ForumLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <ForumSkeletonList />
    </div>
  );
}
