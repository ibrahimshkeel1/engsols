import Link from "next/link";
import { notFound } from "next/navigation";
import { getVideoBySlug, getVideos } from "@/lib/data/videos";
import { getMentorBySlug } from "@/lib/data/mentors";
import { resolveVideoThumbnail } from "@/lib/video-thumbnail";
import { buildDetailMetadata } from "@/lib/page-metadata";
import { Badge } from "@/components/ui/badge";
import { MockMediaPlayer } from "@/components/shared/MockMediaPlayer";
import { ShareButton } from "@/components/shared/ShareButton";
import { SectionReveal } from "@/components/motion/SectionReveal";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const videos = await getVideos();
  return videos.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const video = await getVideoBySlug(slug);
  if (!video) return { title: "Video not found" };
  return buildDetailMetadata({
    title: `${video.title} | EngSols Videos`,
    description: video.description.slice(0, 160),
    path: `/videos/${slug}`,
  });
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
  const thumbnail = resolveVideoThumbnail(video.title, video.videoUrl, video.thumbnailUrl);

  return (
    <div className="py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionReveal>
          <MockMediaPlayer thumbnail={thumbnail} title={video.title} duration={video.duration} videoUrl={video.videoUrl} />
          <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{video.title}</h1>
              <p className="mt-2 text-sm text-muted-foreground">{video.views.toLocaleString()} views · {video.publishedAt}</p>
            </div>
            <ShareButton title={video.title} text={video.description.slice(0, 120)} />
          </div>
          <p className="mt-4 text-foreground/90">{video.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {video.tags.map((t) => <Badge key={t}>{t}</Badge>)}
          </div>
        </SectionReveal>
        {author && (
          <SectionReveal className="mt-6" delay={0.08}>
            <div className="rounded-xl border border-border p-4">
              <p className="font-semibold">{author.name}</p>
              <p className="text-sm text-muted-foreground">{author.headline}</p>
              <Link href={`/mentors/${author.slug}`} className="text-sm text-primary">View profile →</Link>
            </div>
          </SectionReveal>
        )}
        {related.length > 0 && (
          <SectionReveal className="mt-10" delay={0.12}>
            <h2 className="text-xl font-bold">Related videos</h2>
            <ul className="mt-4 space-y-2">
              {related.map((v) => (
                <li key={v.slug}>
                  <Link href={`/videos/${v.slug}`} className="text-primary hover:text-primary">{v.title}</Link>
                </li>
              ))}
            </ul>
          </SectionReveal>
        )}
      </div>
    </div>
  );
}
