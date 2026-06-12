import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { liveStreams, getStreamBySlug } from "@/data/liveStreams";
import { mentors } from "@/data/mentors";
import { avatarUrl } from "@/lib/utils";
import { videoThumbnail } from "@/lib/placeholders";
import { Badge } from "@/components/ui/badge";
import { ComingSoonButton } from "@/components/shared/ComingSoonButton";
import { MockMediaPlayer } from "@/components/shared/MockMediaPlayer";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return liveStreams.map((s) => ({ slug: s.slug }));
}

export default async function LiveStreamPage({ params }: Props) {
  const { slug } = await params;
  const stream = getStreamBySlug(slug);
  if (!stream) notFound();

  const host = mentors.find((m) => m.slug === stream.hostSlug);

  return (
    <div className="py-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <MockMediaPlayer
          thumbnail={videoThumbnail(stream.title.slice(0, 24))}
          title={stream.title}
          live={stream.status === "live"}
        />
        <div className="mt-6">
          <Badge>{stream.discipline}</Badge>
          {stream.status === "live" && <Badge className="ml-2 bg-red-100 text-red-700">Live now · {stream.viewerCount} viewers</Badge>}
          <h1 className="mt-3 text-3xl font-bold text-slate-900">{stream.title}</h1>
          <p className="mt-4 text-slate-600">{stream.description}</p>
          <p className="mt-2 text-sm text-slate-500">{new Date(stream.scheduledAt).toLocaleString()}</p>
          {host && (
            <div className="mt-6 flex items-center gap-4 rounded-xl border border-slate-200 p-4">
              <Image src={avatarUrl(host.name)} alt="" width={48} height={48} className="rounded-full" unoptimized />
              <div>
                <p className="font-semibold">{host.name}</p>
                <p className="text-sm text-slate-600">{host.headline} at {host.company}</p>
                <Link href={`/mentors/${host.slug}`} className="text-sm text-amber-600">View mentor profile →</Link>
              </div>
            </div>
          )}
          <div className="mt-6 flex gap-3">
            <ComingSoonButton variant="accent">
              {stream.status === "live" ? "Join live" : "Set reminder"}
            </ComingSoonButton>
          </div>
        </div>
      </div>
    </div>
  );
}
