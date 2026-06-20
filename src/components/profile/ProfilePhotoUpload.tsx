"use client";

import { useState } from "react";
import { updateProfileAvatar } from "@/actions";
import { Avatar } from "@/components/ui/Avatar";
import { ImageUpload } from "@/components/ui/ImageUpload";

type Props = {
  name: string;
  discipline?: string;
  initialUrl?: string | null;
};

export function ProfilePhotoUpload({ name, discipline, initialUrl }: Props) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialUrl ?? null);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleChange(urls: string[]) {
    const url = urls[0];
    if (!url) return;
    setSaving(true);
    setStatus(null);
    const result = await updateProfileAvatar(url);
    setSaving(false);
    if (result.error) {
      setStatus(result.error);
      return;
    }
    setAvatarUrl(url);
    setStatus("Photo saved.");
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
      <Avatar name={name} discipline={discipline} size="xl" src={avatarUrl} />
      <div className="flex-1">
        <ImageUpload
          folder="avatars"
          value={avatarUrl ? [avatarUrl] : []}
          onChange={handleChange}
          label={saving ? "Saving..." : "Upload profile photo"}
        />
        {status && (
          <p className={cnStatus(status)}>{status}</p>
        )}
      </div>
    </div>
  );
}

function cnStatus(status: string) {
  return status.includes("saved")
    ? "mt-2 text-sm text-zone-mentorship"
    : "mt-2 text-sm text-zone-news";
}
