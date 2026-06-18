"use client";

import { useState } from "react";
import { toast } from "sonner";
import { submitJobApplication } from "@/actions";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";

type Props = {
  jobSlug: string;
  jobTitle: string;
  company: string;
  defaultName?: string;
  defaultEmail?: string;
};

export function JobApplicationForm({ jobSlug, jobTitle, company, defaultName = "", defaultEmail = "" }: Props) {
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const form = new FormData(e.currentTarget);
    form.set("jobSlug", jobSlug);
    form.set("jobTitle", jobTitle);
    form.set("company", company);
    try {
      const result = await submitJobApplication(form);
      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success("Application submitted! The employer will follow up.");
        e.currentTarget.reset();
      }
    } catch {
      toast.error("Could not submit. Try again or log in first.");
    }
    setPending(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <FormField label="Your name" id="job-app-name">
        <Input name="name" required autoComplete="name" defaultValue={defaultName} />
      </FormField>
      <FormField label="Email" id="job-app-email">
        <Input name="email" required type="email" autoComplete="email" defaultValue={defaultEmail} />
      </FormField>
      <FormField label="Cover note" id="job-app-message">
        <Textarea name="message" required rows={3} placeholder="Brief cover note and relevant experience..." />
      </FormField>
      <Button type="submit" variant="accent" className="w-full" disabled={pending}>
        {pending ? "Submitting..." : "Apply now"}
      </Button>
    </form>
  );
}
