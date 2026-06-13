import { CompanyLogo } from "@/components/ui/CompanyLogo";
import { AnimateIn } from "@/components/motion/AnimateIn";

const companies = ["Shell", "Schlumberger", "BP", "Chevron", "Halliburton", "ExxonMobil", "Wood"];

export function CompanyStrip() {
  return (
    <section className="border-b border-border py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <AnimateIn>
          <p className="text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Mentors from leading operators & service companies
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {companies.map((name) => (
              <div key={name} className="flex items-center gap-2 opacity-80 transition hover:opacity-100">
                <CompanyLogo company={name} />
                <span className="hidden text-sm font-medium text-muted-foreground sm:inline">{name}</span>
              </div>
            ))}
          </div>
        </AnimateIn>
      </div>
    </section>
  );
}
