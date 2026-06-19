"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateCertification } from "@/actions/admin";
import { disciplines } from "@/data/disciplines";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";

type PrepStep = { phase: string; description: string; week?: number };

type Props = {
  cert: {
    id: string;
    name: string;
    short_name: string;
    discipline: string;
    description: string;
    eligibility: string;
    exam_format: string;
    avg_prep_months: number;
    pass_rate: string | null;
    related_mentor_slugs: string[];
    published: boolean;
    prep_steps?: PrepStep[] | null;
  };
};

export function AdminCertEditForm({ cert }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const defaultPrep = JSON.stringify(cert.prep_steps?.length ? cert.prep_steps : [
    { phase: "Assess", description: "Review eligibility and experience gaps.", week: 2 },
    { phase: "Study", description: "Follow structured resources weekly.", week: 8 },
    { phase: "Practice", description: "Take timed practice exams.", week: 12 },
    { phase: "Mentor", description: "Book sessions with certified mentors.", week: 14 },
    { phase: "Exam", description: "Schedule your exam window.", week: 16 },
  ], null, 2);

  return (
    <form
      className="space-y-5"
      onSubmit={async (e) => {
        e.preventDefault();
        setPending(true);
        setError(null);
        const formData = new FormData(e.currentTarget);
        try {
          JSON.parse(formData.get("prepSteps") as string);
        } catch {
          setError("Prep steps must be valid JSON array.");
          setPending(false);
          return;
        }
        const result = await updateCertification(cert.id, formData);
        if (result?.error) setError(result.error);
        else router.push("/admin/certifications");
        setPending(false);
      }}
    >
      <div>
        <label className="text-sm font-medium">Name</label>
        <Input name="name" required defaultValue={cert.name} className="mt-1.5" />
      </div>
      <Input name="shortName" required defaultValue={cert.short_name} />
      <Select name="discipline" defaultValue={cert.discipline} className="w-full">
        {disciplines.map((d) => <option key={d} value={d}>{d}</option>)}
      </Select>
      <Textarea name="description" required rows={4} defaultValue={cert.description} />
      <Textarea name="eligibility" required rows={3} defaultValue={cert.eligibility} />
      <Input name="examFormat" required defaultValue={cert.exam_format} />
      <Input name="avgPrepMonths" type="number" defaultValue={cert.avg_prep_months} />
      <Input name="passRate" defaultValue={cert.pass_rate ?? ""} />
      <Input name="mentorSlugs" defaultValue={cert.related_mentor_slugs.join(", ")} />
      <div>
        <label className="text-sm font-medium">Prep path steps (JSON)</label>
        <Textarea name="prepSteps" required rows={8} defaultValue={defaultPrep} className="mt-1.5 font-mono text-xs" />
        <p className="mt-1 text-xs text-muted-foreground">Array of {"{ phase, description, week? }"} objects.</p>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="published" value="true" defaultChecked={cert.published} className="rounded" />
        Published
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" variant="accent" disabled={pending}>{pending ? "Saving..." : "Save"}</Button>
    </form>
  );
}
