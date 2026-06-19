import { videoThumbnail } from "@/lib/placeholders";

/** YouTube / Vimeo thumbnail when no custom URL is stored. */
export function resolveVideoThumbnail(title: string, videoUrl?: string | null, thumbnailUrl?: string | null): string {
  if (thumbnailUrl?.trim()) return thumbnailUrl.trim();

  if (videoUrl) {
    const ytMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/);
    if (ytMatch) return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;

    const vimeoMatch = videoUrl.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) return `https://vumbnail.com/${vimeoMatch[1]}.jpg`;
  }

  return videoThumbnail(title.slice(0, 20));
}
