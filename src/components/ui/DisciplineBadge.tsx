import { cn } from "@/lib/utils";
import { getDisciplineColors } from "@/lib/discipline-colors";

export function DisciplineBadge({ discipline, className }: { discipline: string; className?: string }) {
  const colors = getDisciplineColors(discipline);
  return (
    <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium", colors.bg, colors.text, className)}>
      {discipline}
    </span>
  );
}
