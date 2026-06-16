"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { savePortfolioExperience, deletePortfolioExperience } from "@/actions/portfolio";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";

type Experience = {
  id: string;
  role: string;
  company: string;
  duration: string;
  description: string;
};

export function PortfolioExperienceBuilder({ experience }: { experience: Experience[] }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const result = await savePortfolioExperience(new FormData(e.currentTarget));
    setPending(false);
    if (result?.error) toast.error(result.error);
    else {
      toast.success("Experience saved");
      e.currentTarget.reset();
      router.refresh();
    }
  }

  async function remove(id: string) {
    const result = await deletePortfolioExperience(id);
    if (result?.error) toast.error(result.error);
    else router.refresh();
  }

  return (
    <div className="mt-8 space-y-6">
      <h2 className="text-lg font-semibold">Experience</h2>
      {experience.map((e) => (
        <div key={e.id} className="rounded-xl border border-border p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-medium">{e.role} — {e.company}</p>
              <p className="text-sm text-muted-foreground">{e.duration}</p>
              <p className="mt-1 text-sm text-muted-foreground">{e.description}</p>
            </div>
            <Button type="button" size="sm" variant="ghost" onClick={() => remove(e.id)}>Remove</Button>
          </div>
        </div>
      ))}
      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-dashed border-border p-4">
        <FormField label="Role" id="exp-role">
          <Input name="role" required />
        </FormField>
        <FormField label="Company" id="exp-company">
          <Input name="company" required />
        </FormField>
        <FormField label="Duration" id="exp-duration">
          <Input name="duration" placeholder="Jun 2024 – Aug 2024" />
        </FormField>
        <FormField label="Description" id="exp-desc">
          <Textarea name="description" rows={3} />
        </FormField>
        <Button type="submit" variant="outline" disabled={pending}>Add experience</Button>
      </form>
    </div>
  );
}
