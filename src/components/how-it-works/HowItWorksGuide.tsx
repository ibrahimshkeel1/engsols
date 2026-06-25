import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import {
  howItWorksIntro,
  howItWorksQuickLinks,
  howItWorksSections,
  type HowItWorksSection,
} from "@/lib/how-it-works-sections";
import { cn } from "@/lib/utils";

function FeatureVisual({
  icon: Icon,
  accentClass,
  title,
}: {
  icon: LucideIcon;
  accentClass: string;
  title: string;
}) {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-border-custom bg-bg-surface shadow-premium-card"
      aria-hidden
    >
      <div
        className={cn(
          "flex aspect-[4/3] items-center justify-center bg-gradient-to-br",
          accentClass,
        )}
      >
        <Icon className="h-20 w-20 text-white/90 drop-shadow-sm" strokeWidth={1.25} />
      </div>
      <div className="space-y-3 border-t border-border-custom/60 p-5">
        <div className="h-3 w-2/5 rounded-full bg-muted" />
        <div className="h-2 w-full rounded-full bg-muted/70" />
        <div className="h-2 w-4/5 rounded-full bg-muted/70" />
        <p className="pt-1 text-xs font-medium text-text-muted">{title}</p>
      </div>
    </div>
  );
}

function SectionBlock({
  section,
  reversed,
}: {
  section: HowItWorksSection;
  reversed: boolean;
}) {
  return (
    <section id={section.id} className="scroll-mt-24 border-b border-border/60 py-16 lg:py-20">
      <div
        className={cn(
          "grid items-center gap-10 lg:grid-cols-2 lg:gap-14",
          reversed && "lg:[&>*:first-child]:order-2",
        )}
      >
        <FeatureVisual
          icon={section.icon}
          accentClass={section.accentClass}
          title={section.title}
        />
        <div>
          <p className="section-label text-zone-mentorship">Step guide</p>
          <h2 className="text-display-lg mt-2">{section.title}</h2>
          <p className="text-body-lg mt-4 text-pretty">{section.summary}</p>
          <ol className="mt-6 space-y-3">
            {section.steps.map((step, index) => (
              <li key={step} className="flex gap-3 text-sm leading-relaxed text-text-muted">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-text-main">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
          {section.href && section.linkLabel && (
            <ButtonLink href={section.href} className="mt-8" variant="outline">
              {section.linkLabel}
            </ButtonLink>
          )}
        </div>
      </div>
    </section>
  );
}

export function HowItWorksGuide() {
  return (
    <>
      <section className="border-b border-border/60 bg-muted/20 py-16 lg:py-20">
        <div className="page-container-wide mx-auto max-w-3xl text-center">
          <h2 className="text-display-lg">{howItWorksIntro.title}</h2>
          <p className="text-body-lg mt-4 text-pretty">{howItWorksIntro.description}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {howItWorksQuickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="inline-flex items-center gap-2 rounded-full border border-border-custom bg-bg-surface px-4 py-2 text-sm font-medium text-text-main transition-colors hover:border-zone-mentorship/40 hover:text-zone-mentorship"
              >
                <link.icon className="h-4 w-4" aria-hidden />
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {howItWorksSections.map((section, index) => (
        <div key={section.id} className="page-container-wide">
          <SectionBlock section={section} reversed={index % 2 === 1} />
        </div>
      ))}

      <section className="py-16 lg:py-20">
        <div className="page-container-wide mx-auto max-w-2xl text-center">
          <h2 className="text-display-lg">Ready to start?</h2>
          <p className="text-body-lg mt-3 text-text-muted">
            Create a free account, browse mentors, or explore the community — everything connects in one platform.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <ButtonLink href="/signup" size="lg">
              Sign up free
            </ButtonLink>
            <ButtonLink href="/mentors" size="lg" variant="outline">
              Find a mentor
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
