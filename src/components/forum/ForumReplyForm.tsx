"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ForumReplyForm() {
  return (
    <form
      className="mt-8"
      onSubmit={(e) => {
        e.preventDefault();
        toast.info("Posting replies is coming soon!");
      }}
    >
      <textarea
        rows={4}
        placeholder="Write your reply..."
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
      />
      <Button type="submit" variant="accent" className="mt-3">
        Post reply
      </Button>
    </form>
  );
}
