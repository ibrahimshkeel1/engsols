"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { saveSessionNote } from "@/actions/mentor";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";

type Note = {
  id: string;
  mentor_slug: string;
  note: string;
  updated_at: string;
};

export function SessionNotesSection({ notes }: { notes: Note[] }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const result = await saveSessionNote(new FormData(e.currentTarget));
    setPending(false);
    if (result?.error) toast.error(result.error);
    else {
      toast.success("Note saved");
      e.currentTarget.reset();
      router.refresh();
    }
  }

  return (
    <div>
      <h2 className="font-semibold">Session notes</h2>
      <p className="mt-1 text-sm text-muted-foreground">Private notes from mentorship sessions (only you can see these).</p>
      {notes.length > 0 && (
        <ul className="mt-4 space-y-3">
          {notes.map((n) => (
            <li key={n.id} className="rounded-xl border border-border p-4 text-sm">
              <p className="font-medium">Mentor: {n.mentor_slug}</p>
              <p className="mt-1 text-muted-foreground">{n.note}</p>
            </li>
          ))}
        </ul>
      )}
      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <FormField label="Mentor slug" id="note-mentor">
          <Input name="mentorSlug" required placeholder="mentor-profile-slug" />
        </FormField>
        <FormField label="Note" id="note-body">
          <Textarea name="note" required rows={3} placeholder="Key takeaways from your session..." />
        </FormField>
        <Button type="submit" variant="outline" disabled={pending}>Save note</Button>
      </form>
    </div>
  );
}
