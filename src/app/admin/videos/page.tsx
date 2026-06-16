import Link from "next/link";
import { Video } from "lucide-react";
import { getVideosForAdmin } from "@/lib/data/admin-content";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/EmptyState";

export default async function AdminVideosPage() {
  const videos = await getVideosForAdmin();

  return (
    <div>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Videos</h1>
          <p className="mt-1 text-muted-foreground">Manage tutorial and career video content.</p>
        </div>
        <Link
          href="/admin/videos/new"
          className="inline-flex h-10 items-center rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 hover:brightness-110"
        >
          Add video
        </Link>
      </div>
      <div className="mt-8 space-y-4">
        {videos.length === 0 ? (
          <EmptyState
            icon={Video}
            title="No videos yet"
            description="Add video listings from mentor partnerships and platform content."
            action={{ href: "/admin/videos/new", label: "Add a video" }}
          />
        ) : (
          videos.map((video) => (
            <Card key={video.id} className="card-elevated">
              <CardContent className="flex flex-col gap-3 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold">{video.title}</h2>
                    {!video.published && (
                      <Badge className="bg-muted text-muted-foreground">Draft</Badge>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {video.discipline} · {video.duration}
                    {video.author_mentor_slug ? ` · ${video.author_mentor_slug}` : ""}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{video.description}</p>
                </div>
                {video.published && (
                  <Link href={`/videos/${video.slug}`} className="shrink-0 text-sm font-medium text-primary hover:underline">
                    View →
                  </Link>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
