import type { Mentor } from "@/types";
import { CompanyLogo } from "@/components/ui/CompanyLogo";

type Props = {
  mentors: Mentor[];
};

export function CompanyLogoStrip({ mentors }: Props) {
  const companies = [
    ...new Set(
      mentors
        .map((m) => m.company?.trim())
        .filter((company): company is string => Boolean(company)),
    ),
  ].slice(0, 10);

  if (companies.length === 0) return null;

  return (
    <section className="border-b border-border/60 py-8" aria-label="Mentor employers">
      <div className="page-container-wide">
        <p className="text-caption text-center font-medium text-muted-foreground">
          Mentors from leading operators &amp; engineering firms
        </p>
        <ul className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {companies.map((company) => (
            <li
              key={company}
              className="flex items-center gap-2 rounded-xl border border-border-custom bg-bg-surface px-3 py-2 text-xs font-medium text-text-main"
            >
              <CompanyLogo company={company} size="sm" />
              <span>{company}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
