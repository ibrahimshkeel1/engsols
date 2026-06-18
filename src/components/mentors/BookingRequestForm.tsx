"use client";

import { useState } from "react";
import { toast } from "sonner";
import { submitBookingRequest } from "@/actions";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";

type Props = {
  mentorSlug: string;
  mentorName: string;
  type?: "intro" | "monthly" | "study-plan" | "interview-prep";
  defaultName?: string;
  defaultEmail?: string;
};

export function BookingRequestForm({ mentorSlug, mentorName, type = "intro", defaultName = "", defaultEmail = "" }: Props) {
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
      <FormField label="Your name" id="booking-name">
        <Input name="name" required autoComplete="name" defaultValue={defaultName} />
      </FormField>
      <FormField label="Email" id="booking-email">
        <Input name="email" required type="email" autoComplete="email" defaultValue={defaultEmail} />
      </FormField>
      <FormField label="Message" id="booking-message">
        <Textarea
          name="message"
          required
          rows={3}
          placeholder={
            type === "intro"
              ? "What would you like to discuss on the intro call?"
              : type === "monthly"
                ? "Tell the mentor about your goals..."
                : `What do you need help with for your ${type.replace(/-/g, " ")} session?`
          }
        />
      </FormField>
      <Button type="submit" variant="accent" className="w-full" disabled={pending}>
        {pending ? "Sending..." : type === "intro" ? "Request free intro call" : type === "monthly" ? "Request mentorship" : "Request one-off session"}
      </Button>
    </form>
  );
}
