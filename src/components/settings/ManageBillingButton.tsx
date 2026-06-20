"use client";

import { useTransition } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createBillingPortalSession } from "@/actions/stripe";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ManageBillingButton({ className }: { className?: string }) {
  const [pending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await createBillingPortalSession();
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      window.location.href = result.url;
    });
  }

  return (
    <Button
      type="button"
      variant="zoneRecruiter"
      onClick={handleClick}
      disabled={pending}
      className={cn(
        "w-full justify-center shadow-sm transition-all duration-200 hover:scale-[1.01] hover:shadow-md active:scale-[0.99] sm:w-auto",
        className,
      )}
    >
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
          Opening billing portal...
        </>
      ) : (
        <>
          <CreditCard className="mr-2 h-4 w-4" aria-hidden />
          Manage billing & subscriptions
        </>
      )}
    </Button>
  );
}
