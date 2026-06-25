"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { startMonthlyMentorshipCheckout } from "@/actions/booking-messages";
import { BookingCancellationPolicy } from "@/components/mentors/BookingCancellationPolicy";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";

type Props = {
  mentorSlug: string;
  mentorName: string;
  monthlyRate: number;
};

export function MonthlyQuickCheckout({ mentorSlug, mentorName, monthlyRate }: Props) {
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function handleCheckout() {
    if (!message.trim()) {
      toast.error("Tell the mentor about your goals first");
      return;
    }
    setPending(true);
    const result = await startMonthlyMentorshipCheckout(mentorSlug, mentorName, message);
    setPending(false);
    if ("error" in result) {
      toast.error(result.error);
      return;
    }
    window.location.href = result.url;
  }

  return (
    <div className="space-y-4">
      <FormField label="Your goals" id="monthly-goals">
        <Textarea
          id="monthly-goals"
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What do you want to achieve with monthly mentorship?"
        />
      </FormField>
      <BookingCancellationPolicy variant="card" />
      <Button
        type="button"
        variant="accent"
        className="w-full bg-oil-gas-orange hover:bg-oil-gas-orange-hover"
        disabled={pending}
        onClick={handleCheckout}
      >
        {pending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
            Redirecting to Stripe…
          </>
        ) : (
          `Pay $${monthlyRate}/mo & start mentorship`
        )}
      </Button>
    </div>
  );
}
