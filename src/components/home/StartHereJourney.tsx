import Link from "next/link";

const supportingLinks = [
  { label: "Start Here Journey", href: "/mentors", description: "Browse mentors by discipline and goal" },
  { label: "Career Assist", href: "/assist", description: "Match mentors to your career goal" },
  { label: "One-off Sessions", href: "/mentors?session=intro", description: "Try a focused intro or prep call" },
  { label: "Community", href: "/forum", description: "Forum, live sessions, and industry news" },
];

export function StartHereJourney() {
  return (
    <section className="py-10 lg:py-12">
      <div className="page-container-wide">
        <p className="text-caption font-medium text-muted-foreground">Also on EngSols</p>
        <ul className="mt-4 flex flex-col gap-1">
          {supportingLinks.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex flex-col gap-0.5 py-3 transition-colors duration-150 hover:text-foreground sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <span className="text-caption text-muted-foreground/80 sm:text-end">{item.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
