"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  MEDIA_BUCKET,
  buildMediaPath,
  getPublicMediaUrl,
  validateImageFile,
  type MediaFolder,
} from "@/lib/storage";
import { PortraitCropPreview } from "@/components/ui/PortraitCropPreview";
import { cn } from "@/lib/utils";

type ImageUploadProps = {
  folder: MediaFolder;
  value?: string[];
  onChange: (urls: string[]) => void;
  multiple?: boolean;
  maxFiles?: number;
  label?: string;
  className?: string;
  /** Show portrait crop frames and placement grid after selecting a photo. */
  cropPreview?: "portrait";
  portraitFocusY?: number;
  onPortraitFocusYChange?: (focusY: number) => void;
  onPortraitSave?: () => void;
  disabled?: boolean;
};

export function ImageUpload({
  folder,
  value = [],
  onChange,
  multiple = false,
  maxFiles = multiple ? 4 : 1,
  label = "Add image",
  className,
  cropPreview,
  portraitFocusY = 0,
  onPortraitFocusYChange,
  onPortraitSave,
  disabled = false,
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [localPreviewUrl, setLocalPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (localPreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(localPreviewUrl);
      }
    };
  }, [localPreviewUrl]);

  function setPreviewFromFile(file: File) {
    if (localPreviewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(localPreviewUrl);
    }
    if (cropPreview === "portrait") {
      setLocalPreviewUrl(URL.createObjectURL(file));
    }
  }

  const previewUrl = cropPreview === "portrait" ? (value[0] ?? localPreviewUrl) : null;

  async function handleFiles(fileList: FileList | null) {
    if (!fileList?.length) return;
    setError(null);

    const files = Array.from(fileList).slice(0, maxFiles - value.length);
    if (!files.length) {
      setError(`Maximum ${maxFiles} image${maxFiles === 1 ? "" : "s"}.`);
      return;
    }

    if (cropPreview === "portrait" && files[0]) {
      setPreviewFromFile(files[0]);
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
      if (localPreviewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(localPreviewUrl);
        setLocalPreviewUrl(null);
      }
      onChange(multiple ? [...value, ...uploaded] : uploaded);
    }
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function removeAt(index: number) {
    if (localPreviewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(localPreviewUrl);
      setLocalPreviewUrl(null);
    }
    onChange(value.filter((_, i) => i !== index));
  }

  const canAddMore = value.length < maxFiles;

  return (
    <div className={cn("space-y-3", className)}>
      {label && <p className="text-sm font-medium">{label}</p>}
      {previewUrl && (
        <>
          <PortraitCropPreview
            src={previewUrl}
            alt="Uploaded photo preview"
            focusY={portraitFocusY}
            onFocusYChange={onPortraitFocusYChange}
          />
          {onPortraitSave && (value[0] || localPreviewUrl) && onPortraitFocusYChange && value[0] && (
            <button
              type="button"
              onClick={onPortraitSave}
              disabled={uploading || disabled}
              className="rounded-xl bg-oil-gas-navy px-4 py-2 text-sm font-semibold text-white hover:bg-oil-gas-navy-muted disabled:opacity-60"
            >
              Save crop position
            </button>
          )}
        </>
      )}
      {value.length > 0 && !cropPreview && (
        <div className={cn("flex flex-wrap gap-3", multiple ? "" : "justify-start")}>
          {value.map((url, index) => (
            <div key={url} className="relative h-24 w-24 overflow-hidden rounded-xl border border-border bg-muted">
              <Image
                src={url}
                alt={`Upload preview ${index + 1}`}
                fill
                className="object-cover"
                sizes="96px"
              />
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
      {value.length > 0 && cropPreview && (
        <button
          type="button"
          disabled={disabled || uploading}
          onClick={() => removeAt(0)}
          className="text-sm font-medium text-oil-gas-orange-hover hover:underline disabled:opacity-60"
        >
          Remove photo
        </button>
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
            disabled={uploading || disabled}
            onClick={() => inputRef.current?.click()}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-dashed border-oil-gas-navy/20 bg-oil-gas-ice px-4 text-sm font-medium text-oil-gas-navy-muted transition hover:border-oil-gas-orange/40 hover:text-oil-gas-navy disabled:opacity-60"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
            {uploading ? "Uploading..." : label}
          </button>
        </div>
      )}
      {error && <p className="text-sm text-oil-gas-orange-hover">{error}</p>}
      <p className="text-xs text-oil-gas-navy-muted">JPEG, PNG, WebP, or GIF · max 5 MB</p>
    </div>
  );
}
