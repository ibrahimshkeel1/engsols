import type { RoadmapMilestone } from "@/lib/data/roadmaps";

export function computeRoadmapProgress(milestones: RoadmapMilestone[]): number {
  if (milestones.length === 0) return 0;
  const completed = milestones.filter((m) => m.status === "completed").length;
  return Math.round((completed / milestones.length) * 100);
}

export function isMilestoneOverdue(milestone: RoadmapMilestone): boolean {
  if (milestone.status === "completed" || !milestone.targetDate) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(milestone.targetDate);
  return target < today;
}
