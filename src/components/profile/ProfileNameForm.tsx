"use client";

import { useState } from "react";
import { updateProfileName } from "@/actions";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function ProfileNameForm({ initialName }: { initialName: string }) {
  const [name, setName] = useState(initialName);
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setStatus(null);
    const result = await updateProfileName(name);
    setPending(false);
    setStatus(result.error ?? "Name updated.");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Display name" id="display-name">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoComplete="name"
        />
      </FormField>
      <Button type="submit" variant="outline" disabled={pending}>
        {pending ? "Saving..." : "Save name"}
      </Button>
      {status && (
        <p className={status.includes("updated") ? "text-sm text-green-600" : "text-sm text-red-600"}>{status}</p>
      )}
    </form>
  );
}
