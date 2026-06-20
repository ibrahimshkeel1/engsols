"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { createMentorshipRoadmap } from "@/actions/roadmap";
import type { RoadmapStudentOption } from "@/lib/data/roadmaps";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  students: RoadmapStudentOption[];
};

export function CreateRoadmapForm({ students }: Props) {
  const [pending, startTransition] = useTransition();
  const [studentId, setStudentId] = useState(students[0]?.userId ?? "");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const title = form.get("title") as string;
    const deadline = form.get("deadline") as string;
    const selectedStudent = (form.get("studentId") as string) || studentId;

    startTransition(async () => {
      const result = await createMentorshipRoadmap(selectedStudent, title, deadline);
      if (result?.error) {
        toast.error(result.error);
        return;
      }
      toast.success("Roadmap created with starter milestones");
      e.currentTarget.reset();
      setStudentId(students[0]?.userId ?? "");
    });
  }

  const defaultDeadline = () => {
    const d = new Date();
    d.setMonth(d.getMonth() + 3);
    return d.toISOString().slice(0, 10);
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-border bg-surface p-5 shadow-premium-card transition-colors duration-300">
      <h2 className="font-semibold">Create mentorship roadmap</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Initialize milestone tracking for a student you&apos;re mentoring.
      </p>

      <div className="mt-5 space-y-4">
        {students.length > 0 ? (
          <FormField label="Student" id="roadmap-student">
            <select
              id="roadmap-student"
              name="studentId"
              required
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-border bg-background px-3 text-sm"
            >
              {students.map((s) => (
                <option key={s.userId} value={s.userId}>
                  {s.name} ({s.email})
                </option>
              ))}
            </select>
          </FormField>
        ) : (
          <FormField label="Student user ID" id="roadmap-student-id">
            <div>
              <Input
                name="studentId"
                required
                placeholder="UUID from booking request"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
              />
              <p className="mt-1 text-xs text-muted-foreground">
                Students appear here after they submit a booking request while logged in.
              </p>
            </div>
          </FormField>
        )}

        <FormField label="Roadmap title" id="roadmap-title">
          <Input name="title" required placeholder="FE Mechanical prep — Spring 2026" />
        </FormField>

        <FormField label="Target deadline" id="roadmap-deadline">
          <Input name="deadline" type="date" required defaultValue={defaultDeadline()} />
        </FormField>
      </div>

      <Button type="submit" variant="accent" className="mt-5" disabled={pending}>
        {pending ? "Creating..." : "Create roadmap"}
      </Button>
    </form>
  );
}
