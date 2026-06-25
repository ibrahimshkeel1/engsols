import { Suspense } from "react";
import { getTalentPipelinePortfolios } from "@/lib/data/portfolios";
import { TalentPipeline } from "@/components/companies/TalentPipeline";
import { TalentPipelineSkeleton } from "@/components/ui/DirectorySkeletons";

async function TalentContent() {
  const portfolios = await getTalentPipelinePortfolios();
  return <TalentPipeline portfolios={portfolios} />;
}

export default function CompaniesTalentPage() {
  return (
    <Suspense fallback={<TalentPipelineSkeleton />}>
      <TalentContent />
    </Suspense>
  );
}
