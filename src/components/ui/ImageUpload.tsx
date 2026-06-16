"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  MEDIA_BUCKET,
  buildMediaPath,
  getPublicMediaUrl,
  validateImageFile,
  type MediaFolder,
} from "@/lib/storage";
import { cn } from "@/lib/utils";

type ImageUploadProps = {
  folder: MediaFolder;
  value?: string[];
  onChange: (urls: string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  label?: string;
  className?: string;
};

export function ImageUpload({
  folder,
  value = [],
  onChange,
  multiple = false,
  maxFiles = multiple ? 4 : 1,
  label = "Add image",
  className,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList?.length) return;
    setError(null);

    const files = Array.from(fileList).slice(0, maxFiles - value.length);
    if (!files.length) {
      setError(`Maximum ${maxFiles} image${maxFiles === 1 ? "" : "s"}.`);
      return;
    }

    setUploading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Log in to upload images.");
      setUploading(false);
      return;
    }

    const uploaded: string[] = [];
    for (const file of files) {
      const validationError = validateImageFile(file);
      if (validationError) {
        setError(validationError);
        continue;
      }

      const path = buildMediaPath(folder, user.id, file);
      const { error: uploadError } = await supabase.storage
        .from(MEDIA_BUCKET)
        .upload(path, file, { upsert: folder === "avatars", cacheControl: "3600" });

      if (uploadError) {
        setError(uploadError.message);
        continue;
      }

      uploaded.push(getPublicMediaUrl(path));
    }

    if (uploaded.length) {
      onChange(multiple ? [...value, ...uploaded] : uploaded);
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  const canAddMore = value.length < maxFiles;

  return (
    <div className={cn("space-y-3", className)}>
      {label && <p className="text-sm font-medium">{label}</p>}
      {value.length > 0 && (
        <div className={cn("flex flex-wrap gap-3", multiple ? "" : "justify-start")}>
          {value.map((url, index) => (
            <div key={url} className="relative h-24 w-24 overflow-hidden rounded-xl border border-border bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removeAt(index)}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white hover:bg-black/80"
                aria-label="Remove image"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      {canAddMore && (
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple={multiple && maxFiles > 1}
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-dashed border-border bg-muted/40 px-4 text-sm font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground disabled:opacity-60"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
            {uploading ? "Uploading..." : label}
          </button>
        </div>
      )}
      {error && <p className="text-sm text-red-600">{error}</p>}
      <p className="text-xs text-muted-foreground">JPEG, PNG, WebP, or GIF · max 5 MB</p>
    </div>
  );
}
