"use client";

import { useState } from "react";
import { toast } from "sonner";
import { submitBookingRequest } from "@/actions";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";

type Props = {
  mentorSlug: string;
  mentorName: string;
  type?: "intro" | "monthly";
};

export function BookingRequestForm({ mentorSlug, mentorName, type = "intro" }: Props) {
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const form = new FormData(e.currentTarget);
    form.set("mentorSlug", mentorSlug);
    form.set("mentorName", mentorName);
    form.set("type", type);
    try {
      await submitBookingRequest(form);
      toast.success("Request sent! The mentor will follow up by email.");
      e.currentTarget.reset();
    } catch {
      toast.error("Could not send request. Try again or log in first.");
    }
    setPending(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input name="name" required placeholder="Your name" />
      <Input name="email" required type="email" placeholder="you@email.com" />
      <Textarea
        name="message"
        required
        rows={3}
        placeholder={type === "intro" ? "What would you like to discuss on the intro call?" : "Tell the mentor about your goals..."}
      />
      <Button type="submit" variant="accent" className="w-full" disabled={pending}>
        {pending ? "Sending..." : type === "intro" ? "Request free intro call" : "Request mentorship"}
      </Button>
    </form>
  );
}
