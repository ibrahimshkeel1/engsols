import Link from "next/link";
import { CompanyLogo } from "@/components/ui/CompanyLogo";

function CompanyItem({ name }: { name: string }) {
  return (
    <Link
      href={`/mentors?company=${encodeURIComponent(name)}`}
      className="flex shrink-0 items-center gap-3 px-6 opacity-80 transition-opacity hover:opacity-100"
    >
      <CompanyLogo company={name} />
      <span className="whitespace-nowrap text-sm font-medium text-muted-foreground">{name}</span>
    </Link>
  );
}

export function CompanyStrip({ companyNames }: { companyNames: string[] }) {
  if (companyNames.length === 0) return null;

  const track = [...companyNames, ...companyNames];

  return (
    <section className="border-b border-border py-10">
      <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Mentors from leading operators & service companies
      </p>
      <p className="mt-1 text-center text-xs text-muted-foreground">Tap a company to browse its mentors</p>
      <div className="marquee-fade relative mt-6 overflow-hidden">
        <div className="animate-marquee-ltr flex w-max items-center">
          {track.map((name, i) => (
            <CompanyItem key={`${name}-${i}`} name={name} />
          ))}
        </div>
      </div>
    </section>
  );
}
