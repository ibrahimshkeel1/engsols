"use client";

import { useState } from "react";
import { toast } from "sonner";
import { submitJobApplication } from "@/actions";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";

type Props = {
  jobSlug: string;
  jobTitle: string;
  company: string;
};

export function JobApplicationForm({ jobSlug, jobTitle, company }: Props) {
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const form = new FormData(e.currentTarget);
    form.set("jobSlug", jobSlug);
    form.set("jobTitle", jobTitle);
    form.set("company", company);
    try {
      await submitJobApplication(form);
      toast.success("Application submitted! The employer will follow up.");
      e.currentTarget.reset();
    } catch {
      toast.error("Could not submit. Try again or log in first.");
    }
    setPending(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input name="name" required placeholder="Your name" />
      <Input name="email" required type="email" placeholder="you@email.com" />
      <Textarea name="message" required rows={3} placeholder="Brief cover note and relevant experience..." />
      <Button type="submit" variant="accent" className="w-full" disabled={pending}>
        {pending ? "Submitting..." : "Apply now"}
      </Button>
    </form>
  );
}
