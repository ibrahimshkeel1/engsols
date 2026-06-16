"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toggleMentorVerified } from "@/actions/mentor";
import { Button } from "@/components/ui/button";

export function VerifyMentorToggle({ mentorId, verified }: { mentorId: string; verified: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      size="sm"
      variant={verified ? "outline" : "accent"}
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await toggleMentorVerified(mentorId, !verified);
          router.refresh();
        })
      }
    >
      {pending ? "Saving..." : verified ? "Revoke verification" : "Verify credentials"}
    </Button>
  );
}
