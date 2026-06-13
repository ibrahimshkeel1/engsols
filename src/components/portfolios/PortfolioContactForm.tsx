"use client";

import { useState } from "react";
import { toast } from "sonner";
import { submitPortfolioContact } from "@/actions";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";

type Props = {
  portfolioSlug: string;
  studentName: string;
};

export function PortfolioContactForm({ portfolioSlug, studentName }: Props) {
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const form = new FormData(e.currentTarget);
    form.set("portfolioSlug", portfolioSlug);
    form.set("studentName", studentName);
    try {
      await submitPortfolioContact(form);
      toast.success("Message sent! They'll receive your note by email.");
      e.currentTarget.reset();
    } catch {
      toast.error("Could not send message. Try again.");
    }
    setPending(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input name="name" required placeholder="Your name" />
      <Input name="email" required type="email" placeholder="you@company.com" />
      <Textarea name="message" required rows={3} placeholder="Introduce yourself and the opportunity..." />
      <Button type="submit" variant="accent" className="w-full" disabled={pending}>
        {pending ? "Sending..." : "Contact student"}
      </Button>
    </form>
  );
}
