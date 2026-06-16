"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { setLiveRecordingUrl } from "@/actions/forum";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  slug: string;
  initialUrl?: string | null;
};

export function LiveRecordingForm({ slug, initialUrl }: Props) {
  const router = useRouter();
  const [url, setUrl] = useState(initialUrl ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <div className="card-elevated rounded-2xl border border-border p-5">
      <h3 className="font-semibold">Session recording</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Paste a link to the recording (YouTube, Vimeo, or cloud storage) after the session ends.
      </p>
      {initialUrl && (
        <a href={initialUrl} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-sm text-primary hover:underline">
          View current recording →
        </a>
      )}
      <form
        className="mt-4 flex flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          setError(null);
          startTransition(async () => {
            const result = await setLiveRecordingUrl(slug, url);
            if (result?.error) setError(result.error);
            else router.refresh();
          });
        }}
      >
        <Input
          type="url"
          placeholder="https://..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={pending} variant="accent">
          {pending ? "Saving..." : "Save recording"}
        </Button>
      </form>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
