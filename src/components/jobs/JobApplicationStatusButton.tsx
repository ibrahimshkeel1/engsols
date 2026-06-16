"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateJobApplicationStatus } from "@/actions/admin";
import { Button } from "@/components/ui/button";

export function JobApplicationStatusButton({
  applicationId,
  status,
}: {
  applicationId: string;
  status: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (status !== "pending") {
    return <span className="text-sm capitalize text-muted-foreground">{status}</span>;
  }

  return (
    <div className="flex gap-2">
      <Button
        type="button"
        size="sm"
        variant="accent"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await updateJobApplicationStatus(applicationId, "reviewed");
            router.refresh();
          })
        }
      >
        Mark reviewed
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await updateJobApplicationStatus(applicationId, "rejected");
            router.refresh();
          })
        }
      >
        Reject
      </Button>
    </div>
  );
}
