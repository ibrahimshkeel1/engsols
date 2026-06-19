"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { toggleSavedMentor } from "@/actions/mentor";
import { recordEngagement } from "@/lib/engagement";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SaveMentorButton({ mentorSlug, initialSaved }: { mentorSlug: string; initialSaved: boolean }) {
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [pending, setPending] = useState(false);

  async function toggle() {
    setPending(true);
    const result = await toggleSavedMentor(mentorSlug);
    setPending(false);
    if (result?.error) toast.error(result.error);
    else {
      setSaved(result.saved ?? false);
      if (result.saved) recordEngagement("saved-mentor");
      toast.success(result.saved ? "Mentor saved" : "Removed from saved");
      router.refresh();
    }
  }

  return (
    <Button type="button" variant="outline" size="sm" disabled={pending} onClick={toggle} className="gap-2">
      <Heart className={cn("h-4 w-4", saved && "fill-red-500 text-red-500")} />
      {saved ? "Saved" : "Save mentor"}
    </Button>
  );
}
