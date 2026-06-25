"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { submitBookingRequest } from "@/actions";
import { createMentorshipCheckoutSession } from "@/actions/stripe";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { BookingConfirmation } from "@/components/mentors/BookingConfirmation";
import type { Mentor } from "@/types";
import { cn } from "@/lib/utils";

type Props = {
  mentorSlug: string;
  mentorName: string;
  mentor?: Pick<Mentor, "respondsWithinHours">;
  type?: "intro" | "monthly" | "study-plan" | "interview-prep";
  monthlyRate?: number;
  defaultName?: string;
  defaultEmail?: string;
  isLoggedIn?: boolean;
};

type FieldErrors = {
  name?: string;
  email?: string;
  message?: string;
};

function validateBooking(fields: { name: string; email: string; message: string }): FieldErrors {
  const errors: FieldErrors = {};
  if (!fields.name.trim()) errors.name = "Enter your name";
  if (!fields.email.trim()) {
    errors.email = "Enter your email";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) {
    errors.email = "Enter a valid email address";
  }
  if (!fields.message.trim()) errors.message = "Add a short message for the mentor";
  return errors;
}

export function BookingRequestForm({
  mentorSlug,
  mentorName,
  mentor,
  type = "intro",
  monthlyRate = 0,
  defaultName = "",
  defaultEmail = "",
  isLoggedIn = false,
}: Props) {
  const [pending, setPending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const requiresPaidMonthly = type === "monthly" && monthlyRate > 0;

  if (submitted) {
    return (
      <BookingConfirmation
        mentorName={mentorName}
        requestType={type}
        mentor={mentor}
        isGuest={!isLoggedIn}
      />
    );
  }

  function touchField(name: keyof FieldErrors, value: string, all: { name: string; email: string; message: string }) {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const nextErrors = validateBooking({ ...all, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: nextErrors[name] }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;
    const fields = {
      name: (formEl.elements.namedItem("name") as HTMLInputElement).value,
      email: (formEl.elements.namedItem("email") as HTMLInputElement).value,
      message: (formEl.elements.namedItem("message") as HTMLTextAreaElement).value,
    };
    const nextErrors = validateBooking(fields);
    setErrors(nextErrors);
    setTouched({ name: true, email: true, message: true });
    if (Object.keys(nextErrors).length > 0) return;

    setPending(true);
    const form = new FormData(formEl);
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

      setSubmitted(true);
      formEl.reset();
      setErrors({});
      setTouched({});
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
    <form onSubmit={handleSubmit} className="space-y-3" noValidate>
      <FormField label="Your name" id="booking-name" error={touched.name ? errors.name : undefined}>
        <Input
          name="name"
          autoComplete="name"
          defaultValue={defaultName}
          invalid={Boolean(touched.name && errors.name)}
          onBlur={(e) =>
            touchField("name", e.target.value, {
              name: e.target.value,
              email: (e.currentTarget.form?.elements.namedItem("email") as HTMLInputElement | null)?.value ?? "",
              message: (e.currentTarget.form?.elements.namedItem("message") as HTMLTextAreaElement | null)?.value ?? "",
            })
          }
        />
      </FormField>
      <FormField label="Email" id="booking-email" error={touched.email ? errors.email : undefined}>
        <Input
          name="email"
          type="email"
          autoComplete="email"
          defaultValue={defaultEmail}
          invalid={Boolean(touched.email && errors.email)}
          onBlur={(e) =>
            touchField("email", e.target.value, {
              name: (e.currentTarget.form?.elements.namedItem("name") as HTMLInputElement | null)?.value ?? "",
              email: e.target.value,
              message: (e.currentTarget.form?.elements.namedItem("message") as HTMLTextAreaElement | null)?.value ?? "",
            })
          }
        />
      </FormField>
      <FormField label="Message" id="booking-message" error={touched.message ? errors.message : undefined}>
        <Textarea
          name="message"
          rows={3}
          placeholder={
            type === "intro"
              ? "What would you like to discuss on the intro call?"
              : type === "monthly"
                ? "Tell the mentor about your goals..."
                : `What do you need help with for your ${type.replace(/-/g, " ")} session?`
          }
          invalid={Boolean(touched.message && errors.message)}
          onBlur={(e) =>
            touchField("message", e.target.value, {
              name: (e.currentTarget.form?.elements.namedItem("name") as HTMLInputElement | null)?.value ?? "",
              email: (e.currentTarget.form?.elements.namedItem("email") as HTMLInputElement | null)?.value ?? "",
              message: e.target.value,
            })
          }
        />
      </FormField>
      {requiresPaidMonthly && (
        <p className="rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-muted-foreground">
          Monthly mentorship requires a one-time payment of{" "}
          <span className="font-semibold text-foreground">${monthlyRate}</span> before your request is sent to the
          mentor. Cancel anytime from your billing portal.
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
