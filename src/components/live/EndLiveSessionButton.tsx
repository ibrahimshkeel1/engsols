"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { endLiveSession } from "@/actions";
import { Button } from "@/components/ui/button";

type Props = {
  slug: string;
  variant?: "outline" | "destructive";
  size?: "default" | "sm";
  className?: string;
};

export function EndLiveSessionButton({ slug, variant = "outline", size = "default", className }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleEnd() {
    if (!confirm("End this live session for everyone?")) return;
    startTransition(async () => {
      await endLiveSession(slug);
      router.refresh();
    });
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleEnd}
      disabled={pending}
      className={className}
    >
      {pending ? "Ending..." : "End session"}
    </Button>
  );
}
