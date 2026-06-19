import { LiveSkeletonGrid } from "@/components/live/LiveSkeletonGrid";

export default function LiveLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <LiveSkeletonGrid />
    </div>
  );
}
