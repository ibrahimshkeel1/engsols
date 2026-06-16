"use client";

import { useState } from "react";
import { createForumPost } from "@/actions";
import { disciplines } from "@/data/disciplines";
import { FormField } from "@/components/ui/FormField";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Input, Textarea, Select } from "@/components/ui/input";
import { ImageUpload } from "@/components/ui/ImageUpload";

export function NewForumPostForm() {
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  async function handleSubmit(formData: FormData) {
    formData.set("imageUrls", JSON.stringify(imageUrls));
    await createForumPost(formData);
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      <FormField label="Title" id="forum-title">
        <Input name="title" required placeholder="What's your question?" />
      </FormField>
      <FormField label="Discipline" id="forum-discipline">
        <Select name="discipline" required className="w-full">
          <option value="">Select discipline</option>
          {disciplines.map((d) => <option key={d} value={d}>{d}</option>)}
        </Select>
      </FormField>
      <FormField label="Details" id="forum-body">
        <Textarea name="body" required rows={6} placeholder="Describe your problem..." />
      </FormField>
      <ImageUpload
        folder="forum"
        multiple
        maxFiles={4}
        value={imageUrls}
        onChange={setImageUrls}
        label="Attach images (optional)"
      />
      <SubmitButton variant="accent" className="w-full" pendingLabel="Posting...">
        Post question
      </SubmitButton>
    </form>
  );
}
