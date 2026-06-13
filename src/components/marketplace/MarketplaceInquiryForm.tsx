"use client";

import { useState } from "react";
import { toast } from "sonner";
import { submitMarketplaceInquiry } from "@/actions";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";

type Props = {
  listingSlug: string;
  listingTitle: string;
  variant?: "quote" | "contact";
};

export function MarketplaceInquiryForm({ listingSlug, listingTitle, variant = "quote" }: Props) {
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const form = new FormData(e.currentTarget);
    form.set("listingSlug", listingSlug);
    form.set("listingTitle", listingTitle);
    form.set("type", variant);
    try {
      await submitMarketplaceInquiry(form);
      toast.success(variant === "quote" ? "Quote request sent!" : "Message sent to seller!");
      e.currentTarget.reset();
    } catch {
      toast.error("Could not send inquiry. Try again.");
    }
    setPending(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input name="name" required placeholder="Your name" />
      <Input name="email" required type="email" placeholder="you@company.com" />
      <Textarea
        name="message"
        required
        rows={3}
        placeholder={variant === "quote" ? "Quantity, specs, and delivery timeline..." : "Your question for the seller..."}
      />
      <Button type="submit" variant={variant === "quote" ? "accent" : "outline"} className="w-full" disabled={pending}>
        {pending ? "Sending..." : variant === "quote" ? "Request quote" : "Contact seller"}
      </Button>
    </form>
  );
}
