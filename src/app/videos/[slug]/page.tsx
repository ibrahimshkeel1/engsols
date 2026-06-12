import Link from "next/link";
import { notFound } from "next/navigation";
import { videos, getVideoBySlug } from "@/data/videos";
import { mentors } from "@/data/mentors";
import { videoThumbnail } from "@/lib/placeholders";
import { Badge } from "@/components/ui/badge";
import { MockMediaPlayer } from "@/components/shared/MockMediaPlayer";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return videos.map((v) => ({ slug: v.slug }));
}

export default async function VideoPage({ params }: Props) {
  const { slug } = await params;
  const video = getVideoBySlug(slug);
  if (!video) notFound();

  const author = mentors.find((m) => m.slug === video.authorSlug);
  const related = videos.filter((v) => v.slug !== slug && v.discipline === video.discipline).slice(0, 3);

  return (
    <div className="py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <MockMediaPlayer thumbnail={videoThumbnail(video.title.slice(0, 24))} title={video.title} duration={video.duration} />
        <h1 className="mt-6 text-3xl font-bold text-slate-900">{video.title}</h1>
        <p className="mt-2 text-sm text-slate-500">{video.views.toLocaleString()} views · {video.publishedAt}</p>
        <p className="mt-4 text-slate-700">{video.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {video.tags.map((t) => <Badge key={t}>{t}</Badge>)}
        </div>
        {author && (
          <div className="mt-6 rounded-xl border border-slate-200 p-4">
            <p className="font-semibold">{author.name}</p>
            <p className="text-sm text-slate-600">{author.headline}</p>
            <Link href={`/mentors/${author.slug}`} className="text-sm text-amber-600">View profile →</Link>
          </div>
        )}
        {related.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-bold">Related videos</h2>
            <ul className="mt-4 space-y-2">
              {related.map((v) => (
                <li key={v.slug}>
                  <Link href={`/videos/${v.slug}`} className="text-amber-600 hover:text-amber-700">{v.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
