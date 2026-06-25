import Link from "next/link";
import { GitCompareArrows, ShieldCheck, Timer, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { icon: UserCheck, label: "Vetted engineers", detail: "Every mentor is reviewed before listing" },
  { icon: ShieldCheck, label: "Free intro calls", detail: "Meet before you commit to monthly mentorship" },
  { icon: Timer, label: "Cancel anytime", detail: "No lock-in on monthly plans" },
  { icon: GitCompareArrows, label: "Compare mentors", detail: "Side-by-side — unique to EngSols", href: "/mentors/compare" },
] as const;

type Props = {
  compact?: boolean;
};

export function MentorTrustBar({ compact = false }: Props) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-zone-mentorship/20 bg-zone-mentorship/5 px-4 py-4 sm:px-6",
        compact ? "mb-4" : "mb-8",
      )}
    >
      <ul className={cn("grid gap-4", compact ? "grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-4")}>
        {ITEMS.map((item) => (
          <li key={item.label} className="flex gap-3">
            <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-zone-mentorship" aria-hidden />
            <div>
              {"href" in item && item.href ? (
                <Link href={item.href} className="text-sm font-semibold text-foreground hover:text-zone-mentorship hover:underline">
                  {item.label}
                </Link>
              ) : (
                <p className="text-sm font-semibold text-foreground">{item.label}</p>
              )}
              <p className="text-xs text-muted-foreground">{item.detail}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
