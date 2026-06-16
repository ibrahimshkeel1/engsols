"use client";

import { useState } from "react";
import { updatePassword } from "@/actions/auth-extra";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function PasswordUpdateForm() {
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    const formData = new FormData(e.currentTarget);
    const result = await updatePassword(formData);
    setPending(false);
    if (result?.error) toast.error(result.error);
    else {
      toast.success("Password updated");
      e.currentTarget.reset();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="New password" id="new-password">
        <Input name="password" type="password" required minLength={8} autoComplete="new-password" />
      </FormField>
      <FormField label="Confirm password" id="confirm-password">
        <Input name="confirm" type="password" required minLength={8} autoComplete="new-password" />
      </FormField>
      <Button type="submit" variant="accent" disabled={pending}>
        {pending ? "Updating..." : "Update password"}
      </Button>
    </form>
  );
}
