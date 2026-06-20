import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import type { PromptChip } from "@/data/empty-state-prompts";
import {
  SpecialistRequestTrigger,
  type SpecialistRequestContext,
} from "@/components/mentors/SpecialistRequestModal";
import { ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: { href: string; label: string };
  secondaryAction?: { label: string; onClick?: () => void; href?: string };
  promptChips?: PromptChip[];
  specialistRequest?: SpecialistRequestContext;
  className?: string;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  promptChips,
  specialistRequest,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center rounded-xl border border-dashed border-border bg-muted/20 px-6 py-16 text-center",
        className,
      )}
    >
      {Icon && <Icon className="h-10 w-10 text-muted-foreground/50" aria-hidden />}
      <h3 className={cn("text-lg font-medium text-foreground", Icon && "mt-4")}>{title}</h3>
      {description && <p className="text-caption mt-2 max-w-sm">{description}</p>}
      {promptChips && promptChips.length > 0 && (
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {promptChips.map((chip) => (
            <Link
              key={chip.href + chip.label}
              href={chip.href}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/30 hover:text-foreground"
            >
              {chip.label}
            </Link>
          ))}
        </div>
      )}
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {action && (
          <ButtonLink href={action.href}>{action.label}</ButtonLink>
        )}
        {secondaryAction &&
          (secondaryAction.href ? (
            <ButtonLink href={secondaryAction.href} variant="secondary">
              {secondaryAction.label}
            </ButtonLink>
          ) : (
            <button type="button" onClick={secondaryAction.onClick} className="btn-secondary">
              {secondaryAction.label}
            </button>
          ))}
        {specialistRequest && <SpecialistRequestTrigger context={specialistRequest} />}
      </div>
    </div>
  );
}
