"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { verifyJobEmployer } from "@/actions/content";
import { Button } from "@/components/ui/button";

type Props = {
  jobId: string;
  verified: boolean;
};

export function VerifyJobEmployerButton({ jobId, verified }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function toggle() {
    startTransition(async () => {
      await verifyJobEmployer(jobId, !verified);
      router.refresh();
    });
  }

  return (
    <Button
      type="button"
      size="sm"
      variant={verified ? "outline" : "accent"}
      disabled={pending}
      onClick={toggle}
    >
      {pending ? "Saving..." : verified ? "Revoke verification" : "Verify employer"}
    </Button>
  );
}
