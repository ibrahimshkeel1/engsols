import { CompaniesDirectory } from "@/components/companies/CompaniesDirectory";
import { getCompanies } from "@/lib/data/companies";
import { getJobs } from "@/lib/data/jobs";

export default async function CompaniesPage() {
  const [companies, jobs] = await Promise.all([getCompanies(), getJobs()]);

  return <CompaniesDirectory companies={companies} jobs={jobs} />;
}
