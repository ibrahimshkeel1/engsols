"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { savePortfolioProject, deletePortfolioProject } from "@/actions/portfolio";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";

type Project = {
  id: string;
  title: string;
  description: string;
  tags: string[];
  year: number;
};

export function PortfolioProjectsBuilder({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const result = await savePortfolioProject(new FormData(e.currentTarget));
    setPending(false);
    if (result?.error) toast.error(result.error);
    else {
      toast.success("Project saved");
      e.currentTarget.reset();
      router.refresh();
    }
  }

  async function remove(id: string) {
    const result = await deletePortfolioProject(id);
    if (result?.error) toast.error(result.error);
    else router.refresh();
  }

  return (
    <div className="mt-8 space-y-6">
      <h2 className="text-lg font-semibold">Projects</h2>
      {projects.map((p) => (
        <div key={p.id} className="rounded-xl border border-border p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-medium">{p.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{p.description}</p>
              <p className="mt-1 text-xs text-muted-foreground">{p.year} · {p.tags.join(", ")}</p>
            </div>
            <Button type="button" size="sm" variant="ghost" onClick={() => remove(p.id)}>Remove</Button>
          </div>
        </div>
      ))}
      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-dashed border-border p-4">
        <FormField label="Project title" id="proj-title">
          <Input name="title" required />
        </FormField>
        <FormField label="Description" id="proj-desc">
          <Textarea name="description" rows={3} />
        </FormField>
        <FormField label="Tags (comma-separated)" id="proj-tags">
          <Input name="tags" placeholder="Python, Reservoir" />
        </FormField>
        <FormField label="Year" id="proj-year">
          <Input name="year" type="number" defaultValue={new Date().getFullYear()} />
        </FormField>
        <Button type="submit" variant="outline" disabled={pending}>Add project</Button>
      </form>
    </div>
  );
}
