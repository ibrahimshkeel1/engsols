"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { submitMentorReview } from "@/actions/mentor";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";

export function MentorReviewForm({ mentorSlug }: { mentorSlug: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const result = await submitMentorReview(mentorSlug, new FormData(e.currentTarget));
    setPending(false);
    if (result?.error) toast.error(result.error);
    else {
      toast.success("Review submitted");
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Rating" id="review-rating">
        <Select name="rating" required className="w-full" defaultValue="5">
          {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} stars</option>)}
        </Select>
      </FormField>
      <FormField label="Your role" id="review-role">
        <Input name="authorRole" placeholder="e.g. Petroleum Engineering Student" />
      </FormField>
      <FormField label="Your review" id="review-text">
        <Textarea name="text" required rows={4} placeholder="Share your experience with this mentor..." />
      </FormField>
      <Button type="submit" variant="accent" disabled={pending}>
        {pending ? "Submitting..." : "Submit review"}
      </Button>
    </form>
  );
}
