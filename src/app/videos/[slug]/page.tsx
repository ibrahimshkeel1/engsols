import Link from "next/link";
import { notFound } from "next/navigation";
import { getVideoBySlug, getVideos } from "@/lib/data/videos";
import { getMentorBySlug } from "@/lib/data/mentors";
import { videoThumbnail } from "@/lib/placeholders";
import { Badge } from "@/components/ui/badge";
import { MockMediaPlayer } from "@/components/shared/MockMediaPlayer";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const videos = await getVideos();
  return videos.map((v) => ({ slug: v.slug }));
}

export default async function VideoPage({ params }: Props) {
  const { slug } = await params;
  const video = await getVideoBySlug(slug);
  if (!video) notFound();

  const [author, allVideos] = await Promise.all([
    video.authorSlug ? getMentorBySlug(video.authorSlug) : null,
    getVideos(),
  ]);

  const related = allVideos.filter((v) => v.slug !== slug && v.discipline === video.discipline).slice(0, 3);

  return (
    <div className="py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <MockMediaPlayer thumbnail={videoThumbnail(video.title.slice(0, 24))} title={video.title} duration={video.duration} />
        <h1 className="mt-6 text-3xl font-bold text-foreground">{video.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{video.views.toLocaleString()} views · {video.publishedAt}</p>
        <p className="mt-4 text-foreground/90">{video.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {video.tags.map((t) => <Badge key={t}>{t}</Badge>)}
        </div>
        {author && (
          <div className="mt-6 rounded-xl border border-border p-4">
            <p className="font-semibold">{author.name}</p>
            <p className="text-sm text-muted-foreground">{author.headline}</p>
            <Link href={`/mentors/${author.slug}`} className="text-sm text-primary">View profile →</Link>
          </div>
        )}
        {related.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold">Related videos</h2>
            <ul className="mt-4 space-y-2">
              {related.map((v) => (
                <li key={v.slug}>
                  <Link href={`/videos/${v.slug}`} className="text-primary hover:text-primary">{v.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
