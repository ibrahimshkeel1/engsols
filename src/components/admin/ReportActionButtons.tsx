"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { resolveContentReport } from "@/actions/admin";
import { Button } from "@/components/ui/button";

export function ReportActionButtons({ reportId, status }: { reportId: string; status: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (status !== "pending") return null;

  return (
    <div className="mt-4 flex gap-2">
      <Button
        type="button"
        size="sm"
        variant="accent"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await resolveContentReport(reportId, "resolved");
            router.refresh();
          })
        }
      >
        Resolve
      </Button>
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            await resolveContentReport(reportId, "dismissed");
            router.refresh();
          })
        }
      >
        Dismiss
      </Button>
    </div>
  );
}
