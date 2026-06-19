import { Award, Flame, ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  reputation?: number;
  likes?: number;
  activeThisWeek?: boolean;
  isMentor?: boolean;
  className?: string;
};

export function ForumGamificationBadges({
  reputation = 0,
  likes = 0,
  activeThisWeek = false,
  isMentor = false,
  className,
}: Props) {
  const badges = [];

  if (reputation > 0) {
    badges.push(
      <span key="rep" className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
        <Award className="h-3 w-3" />
        {reputation} rep
      </span>,
    );
  }

  if (likes >= 2) {
    badges.push(
      <span key="helpful" className="inline-flex items-center gap-1 rounded-md bg-amber-500/12 px-2 py-0.5 text-xs font-medium text-amber-700 dark:text-amber-400">
        <ThumbsUp className="h-3 w-3" />
        Helpful answer
      </span>,
    );
  }

  if (activeThisWeek) {
    badges.push(
      <span key="active" className="inline-flex items-center gap-1 rounded-md bg-green-500/12 px-2 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
        <Flame className="h-3 w-3" />
        Active this week
      </span>,
    );
  }

  if (isMentor) {
    badges.push(
      <span key="mentor" className="inline-flex rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
        Mentor
      </span>,
    );
  }

  if (!badges.length) return null;

  return <div className={cn("flex flex-wrap items-center gap-2", className)}>{badges}</div>;
}

export function isActiveThisWeek(dateStr: string): boolean {
  const diff = Date.now() - new Date(dateStr.includes("T") ? dateStr : `${dateStr}T12:00:00`).getTime();
  return diff >= 0 && diff < 7 * 86_400_000;
}
