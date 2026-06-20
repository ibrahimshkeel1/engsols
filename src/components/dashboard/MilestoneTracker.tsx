import { Map } from "lucide-react";
import type { MentorshipRoadmap } from "@/lib/data/roadmaps";
import { computeRoadmapProgress } from "@/lib/roadmap-utils";
import { MilestoneItem } from "@/components/dashboard/MilestoneItem";
import { cn } from "@/lib/utils";

type Props = {
  roadmaps: MentorshipRoadmap[];
  viewerRole: "mentor" | "student";
  className?: string;
  emptyMessage?: string;
};

function RoadmapCard({ roadmap, viewerRole }: { roadmap: MentorshipRoadmap; viewerRole: "mentor" | "student" }) {
  const progress = computeRoadmapProgress(roadmap.milestones);
  const partnerLabel =
    viewerRole === "mentor"
      ? roadmap.studentName ?? "Student"
      : roadmap.mentorName ?? "Mentor";

  return (
    <article className="rounded-2xl border border-zone-mentorship/20 bg-surface p-5 shadow-premium-card transition-colors duration-300">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-zone-mentorship">
            With {partnerLabel}
          </p>
          <h3 className="mt-1 font-display text-lg font-semibold tracking-tight">{roadmap.title}</h3>
          {roadmap.targetDeadline && (
            <p className="mt-1 text-sm text-muted-foreground">
              Roadmap deadline:{" "}
              {new Date(roadmap.targetDeadline).toLocaleDateString(undefined, {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          )}
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold tabular-nums text-zone-exams">{progress}%</p>
          <p className="text-xs text-muted-foreground">complete</p>
        </div>
      </div>

      <div className="mt-4">
        <div className="h-2.5 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-zone-recruiter to-zone-exams transition-all duration-500"
            style={{ width: `${progress}%` }}
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`${roadmap.title} progress`}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          {roadmap.milestones.filter((m) => m.status === "completed").length} of{" "}
          {roadmap.milestones.length} milestones completed
        </p>
      </div>

      {roadmap.milestones.length > 0 ? (
        <ul className="mt-5 space-y-3">
          {roadmap.milestones.map((milestone) => (
            <MilestoneItem key={milestone.id} milestone={milestone} />
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-muted-foreground">No milestones yet.</p>
      )}
    </article>
  );
}

export function MilestoneTracker({
  roadmaps,
  viewerRole,
  className,
  emptyMessage = "No active mentorship roadmaps yet.",
}: Props) {
  if (roadmaps.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center",
          className,
        )}
      >
        <Map className="h-10 w-10 text-muted-foreground/60" aria-hidden />
        <p className="mt-4 text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {roadmaps.map((roadmap) => (
        <RoadmapCard key={roadmap.id} roadmap={roadmap} viewerRole={viewerRole} />
      ))}
    </div>
  );
}
