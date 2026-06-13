import { cn } from "@/lib/utils";

type PageHeroProps = {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
};

export function PageHero({ title, description, children, className }: PageHeroProps) {
  return (
    <section className={cn("gradient-hero border-b border-border", className)}>
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-4 py-14 sm:px-6 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{title}</h1>
          {description && <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{description}</p>}
        </div>
        {children && <div className="flex shrink-0 flex-wrap gap-3">{children}</div>}
      </div>
    </section>
  );
}
