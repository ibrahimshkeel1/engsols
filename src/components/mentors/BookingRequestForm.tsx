"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { submitBookingRequest } from "@/actions";
import { createMentorshipCheckoutSession } from "@/actions/stripe";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Props = {
  mentorSlug: string;
  mentorName: string;
  type?: "intro" | "monthly" | "study-plan" | "interview-prep";
  monthlyRate?: number;
  defaultName?: string;
  defaultEmail?: string;
};

export function BookingRequestForm({
  mentorSlug,
  mentorName,
  type = "intro",
  monthlyRate = 0,
  defaultName = "",
  defaultEmail = "",
}: Props) {
  const [pending, setPending] = useState(false);
  const requiresPaidMonthly = type === "monthly" && monthlyRate > 0;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const form = new FormData(e.currentTarget);
    form.set("mentorSlug", mentorSlug);
    form.set("mentorName", mentorName);
    form.set("type", type);

    try {
      const result = await submitBookingRequest(form);

      if (result.requiresPayment && result.bookingRequestId) {
        const checkout = await createMentorshipCheckoutSession(result.bookingRequestId);
        if ("error" in checkout) {
          toast.error(checkout.error);
          setPending(false);
          return;
        }
        window.location.href = checkout.url;
        return;
      }

      toast.success("Request sent! The mentor will follow up by email.");
      e.currentTarget.reset();
    } catch {
      toast.error("Could not send request. Try again or log in first.");
    }

    setPending(false);
  }

  const submitLabel =
    type === "intro"
      ? "Request free intro call"
      : type === "monthly"
        ? requiresPaidMonthly
          ? `Pay $${monthlyRate}/mo & request mentorship`
          : "Request mentorship"
        : "Request one-off session";

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
      {requiresPaidMonthly && (
        <p className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-muted-foreground">
          Monthly mentorship requires a one-time payment of{" "}
          <span className="font-semibold text-foreground">${monthlyRate}</span> before your request is
          sent to the mentor.
        </p>
      )}
      <Button type="submit" variant="accent" className={cn("w-full", pending && "opacity-90")} disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
            {requiresPaidMonthly ? "Redirecting to checkout..." : "Sending..."}
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  );
}
