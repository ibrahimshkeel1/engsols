import Link from "next/link";
import { ArrowRight, Target } from "lucide-react";

type Props = {
  goals: string[];
  completed: string[];
};

export function GoalsProgressCompact({ goals, completed }: Props) {
  if (!goals.length) return null;

  const done = goals.filter((g) => completed.includes(g)).length;
  const percent = Math.round((done / goals.length) * 100);

  return (
    <div className="mt-8 rounded-xl border border-border bg-card/80 p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          <p className="text-sm font-medium">Your goals</p>
        </div>
        <span className="text-sm text-muted-foreground">{percent}% complete</span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-accent transition-all" style={{ width: `${percent}%` }} />
      </div>
      <ul className="mt-3 space-y-1.5">
        {goals.slice(0, 3).map((goal) => (
          <li key={goal} className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className={completed.includes(goal) ? "text-green-600" : "text-muted-foreground/50"}>
              {completed.includes(goal) ? "✓" : "○"}
            </span>
            <span className={completed.includes(goal) ? "line-through opacity-70" : ""}>{goal}</span>
          </li>
        ))}
      </ul>
      <Link href="/settings" className="mt-3 inline-flex items-center gap-1 text-sm text-primary hover:underline">
        Update goals <ArrowRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
