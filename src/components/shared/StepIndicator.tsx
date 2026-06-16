import { cn } from "@/lib/utils";

type Step = { label: string };

type StepIndicatorProps = {
  steps: Step[];
  current: number;
};

export function StepIndicator({ steps, current }: StepIndicatorProps) {
  return (
    <ol className="flex items-center gap-2" aria-label="Progress">
      {steps.map((step, index) => {
        const stepNum = index + 1;
        const active = stepNum === current;
        const done = stepNum < current;
        return (
          <li key={step.label} className="flex items-center gap-2">
            <span
              className={cn(
                "flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold",
                active && "bg-accent text-accent-foreground",
                done && "bg-primary/15 text-primary",
                !active && !done && "bg-muted text-muted-foreground",
              )}
              aria-current={active ? "step" : undefined}
            >
              {stepNum}
            </span>
            <span className={cn("text-sm", active ? "font-medium text-foreground" : "text-muted-foreground")}>
              {step.label}
            </span>
            {index < steps.length - 1 && <span className="mx-1 hidden h-px w-6 bg-border sm:block" aria-hidden />}
          </li>
        );
      })}
    </ol>
  );
}
