"use client";

import { rejectMentor } from "@/actions";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function RejectMentorButton({ mentorId }: { mentorId: string }) {
  async function handleReject(formData: FormData) {
    if (!confirm("Reject this mentor application? They will not appear publicly.")) return;
    await rejectMentor(formData);
  }

  return (
    <form action={handleReject}>
      <input type="hidden" name="id" value={mentorId} />
      <SubmitButton variant="outline" size="sm" pendingLabel="Rejecting...">
        Reject
      </SubmitButton>
    </form>
  );
}
