"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateBookingStatus } from "@/actions";
import { Button } from "@/components/ui/button";

type Props = {
  bookingId: string;
  status: string;
};

export function AdminBookingActions({ bookingId, status }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function setStatus(next: "pending" | "contacted" | "closed") {
    startTransition(async () => {
      await updateBookingStatus(bookingId, next);
      router.refresh();
    });
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
      <span className="w-full text-xs font-medium uppercase tracking-wide text-muted-foreground">Status: {status}</span>
      <Button type="button" size="sm" variant="outline" disabled={pending || status === "contacted"} onClick={() => setStatus("contacted")}>
        Mark contacted
      </Button>
      <Button type="button" size="sm" variant="outline" disabled={pending || status === "closed"} onClick={() => setStatus("closed")}>
        Close
      </Button>
      {status !== "pending" && (
        <Button type="button" size="sm" variant="ghost" disabled={pending} onClick={() => setStatus("pending")}>
          Reopen
        </Button>
      )}
    </div>
  );
}
