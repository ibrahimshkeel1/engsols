import { BentoSkeletonGrid } from "@/components/ui/BentoSkeletonGrid";

export default function VideosLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <BentoSkeletonGrid count={6} />
    </div>
  );
}
