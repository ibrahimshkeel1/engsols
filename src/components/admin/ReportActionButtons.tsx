"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { resolveContentReport, deleteReportedContent } from "@/actions/admin";
import { Button } from "@/components/ui/button";

export function ReportActionButtons({
  reportId,
  status,
  contentType,
}: {
  reportId: string;
  status: string;
  contentType: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (status !== "pending") return null;

  const canDelete = contentType === "forum_post" || contentType === "forum_reply";

  return (
    <div className="mt-4 flex flex-wrap gap-2">
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
      {canDelete && (
        <Button
          type="button"
          size="sm"
          variant="destructive"
          disabled={pending}
          onClick={() =>
            startTransition(async () => {
              await deleteReportedContent(reportId);
              router.refresh();
            })
          }
        >
          Delete content
        </Button>
      )}
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
