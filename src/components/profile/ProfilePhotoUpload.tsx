"use client";

import { useState } from "react";
import { toast } from "sonner";
import { clearProfileAvatar, updateAvatarFocus, updateProfileAvatar } from "@/actions";
import { Avatar } from "@/components/ui/Avatar";
import { ImageUpload } from "@/components/ui/ImageUpload";

type Props = {
  name: string;
  discipline?: string;
  initialUrl?: string | null;
  initialFocusY?: number | null;
};

export function ProfilePhotoUpload({ name, discipline, initialUrl, initialFocusY = 0 }: Props) {
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initialUrl ?? null);
  const [focusY, setFocusY] = useState(initialFocusY ?? 0);
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleUrlsChange(urls: string[]) {
    const url = urls[0];
    if (!url) {
      setSaving(true);
      setStatus(null);
      const result = await clearProfileAvatar();
      setSaving(false);
      if (result.error) {
        setStatus(result.error);
        toast.error(result.error);
        return;
      }
      setAvatarUrl(null);
      setFocusY(0);
      setStatus("Photo removed.");
      return;
    }

    setSaving(true);
    setStatus(null);
    const result = await updateProfileAvatar(url, focusY);
    setSaving(false);
    if (result.error) {
      setStatus(result.error);
      toast.error(result.error);
      return;
    }
    setAvatarUrl(url);
    setStatus("Photo saved.");
  }

  async function handleSaveFocus() {
    if (!avatarUrl) return;
    setSaving(true);
    setStatus(null);
    const result = await updateAvatarFocus(focusY);
    setSaving(false);
    if (result.error) {
      setStatus(result.error);
      toast.error(result.error);
      return;
    }
    setStatus("Crop position saved.");
    toast.success("Crop position saved");
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
      <Avatar name={name} discipline={discipline} size="xl" src={avatarUrl} focusY={focusY} />
      <div className="flex-1">
        <ImageUpload
          folder="avatars"
          value={avatarUrl ? [avatarUrl] : []}
          onChange={handleUrlsChange}
          cropPreview="portrait"
          portraitFocusY={focusY}
          onPortraitFocusYChange={setFocusY}
          onPortraitSave={avatarUrl ? handleSaveFocus : undefined}
          label={saving ? "Saving..." : "Upload profile photo"}
          disabled={saving}
        />
        {status && <p className={cnStatus(status)}>{status}</p>}
      </div>
    </div>
  );
}

function cnStatus(status: string) {
  return status.includes("saved") || status.includes("removed")
    ? "mt-2 text-sm text-zone-mentorship"
    : "mt-2 text-sm text-zone-news";
}
