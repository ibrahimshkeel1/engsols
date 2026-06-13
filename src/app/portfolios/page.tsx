import Link from "next/link";
import { getPublishedPortfolios } from "@/lib/data/portfolios";
import { ListPageLayout } from "@/components/shared/ListPageLayout";
import { PortfolioGrid } from "@/components/portfolios/PortfolioGrid";

export default async function PortfoliosPage() {
  const portfolios = await getPublishedPortfolios();

  return (
    <ListPageLayout
      label="Talent"
      title="Student Portfolios"
      description="Discover engineering students and graduates open to internships and full-time roles."
      action={
        <Link href="/portfolios/build" className="inline-flex h-11 items-center rounded-xl bg-accent px-6 text-sm font-semibold text-accent-foreground shadow-md shadow-accent/25 transition-all hover:brightness-110 active:scale-95">
          Build your portfolio
        </Link>
      }
    >
      <PortfolioGrid portfolios={portfolios} />
    </ListPageLayout>
  );
}
