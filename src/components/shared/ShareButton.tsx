"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

type Props = {
  title: string;
  text?: string;
  className?: string;
};

export function ShareButton({ title, text, className }: Props) {
  const [pending, setPending] = useState(false);

  async function share() {
    const url = window.location.href;
    setPending(true);
    try {
      if (navigator.share) {
        await navigator.share({ title, text: text ?? title, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard");
      }
    } catch {
      /* user cancelled */
    } finally {
      setPending(false);
    }
  }

  return (
    <Button type="button" variant="outline" size="sm" disabled={pending} onClick={share} className={className}>
      <Share2 className="h-4 w-4" />
      Share
    </Button>
  );
}
