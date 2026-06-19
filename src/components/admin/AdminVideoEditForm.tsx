"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateVideo } from "@/actions/admin";
import { disciplines } from "@/data/disciplines";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";

type Props = {
  video: {
    id: string;
    title: string;
    description: string;
    author_mentor_slug: string | null;
    discipline: string;
    duration: string;
    video_url: string | null;
    thumbnail_url?: string | null;
    tags: string[];
    published: boolean;
  };
};

export function AdminVideoEditForm({ video }: Props) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="space-y-5"
      onSubmit={async (e) => {
        e.preventDefault();
        setPending(true);
        setError(null);
        const result = await updateVideo(video.id, new FormData(e.currentTarget));
        if (result?.error) setError(result.error);
        else router.push("/admin/videos");
        setPending(false);
      }}
    >
      <Input name="title" required defaultValue={video.title} />
      <Textarea name="description" required rows={4} defaultValue={video.description} />
      <Input name="authorSlug" defaultValue={video.author_mentor_slug ?? ""} />
      <Select name="discipline" defaultValue={video.discipline} className="w-full">
        {disciplines.map((d) => <option key={d} value={d}>{d}</option>)}
      </Select>
      <Input name="duration" required defaultValue={video.duration} />
      <Input name="videoUrl" type="url" required defaultValue={video.video_url ?? ""} />
      <Input name="thumbnailUrl" type="url" placeholder="Thumbnail URL (optional)" defaultValue={video.thumbnail_url ?? ""} />
      <Input name="tags" defaultValue={(video.tags ?? []).join(", ")} />
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="published" value="true" defaultChecked={video.published} className="rounded" />
        Published
      </label>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <Button type="submit" variant="accent" disabled={pending}>{pending ? "Saving..." : "Save"}</Button>
    </form>
  );
}
