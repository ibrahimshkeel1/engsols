import { Suspense } from "react";
import { getTalentPipelinePortfolios } from "@/lib/data/portfolios";
import { TalentPipeline } from "@/components/companies/TalentPipeline";
import { BentoSkeletonGrid } from "@/components/ui/BentoSkeletonGrid";

async function TalentContent() {
  const portfolios = await getTalentPipelinePortfolios();
  return <TalentPipeline portfolios={portfolios} />;
}

export default function CompaniesTalentPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <BentoSkeletonGrid count={6} />
      </div>
    }>
      <TalentContent />
    </Suspense>
  );
}
