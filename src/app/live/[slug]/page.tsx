import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { getLiveSession } from "@/lib/data/live";
import { getMentorBySlug } from "@/lib/data/mentors";
import { avatarUrl } from "@/lib/utils";
import { videoThumbnail } from "@/lib/placeholders";
import { Badge } from "@/components/ui/badge";
import { MockMediaPlayer } from "@/components/shared/MockMediaPlayer";

type Props = { params: Promise<{ slug: string }> };

export default async function LiveStreamPage({ params }: Props) {
  const { slug } = await params;
  const stream = await getLiveSession(slug);
  if (!stream) notFound();

  const host = stream.hostSlug ? await getMentorBySlug(stream.hostSlug) : null;
  const hostName = "hostName" in stream ? stream.hostName : host?.name;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <MockMediaPlayer
        thumbnail={videoThumbnail(stream.title.slice(0, 24))}
        title={stream.title}
        live={stream.status === "live"}
      />
      <div className="mt-8">
        <div className="flex flex-wrap gap-2">
          <Badge>{stream.discipline}</Badge>
          {stream.status === "live" && (
            <Badge className="bg-red-500/15 text-red-600 dark:text-red-400">
              Live now · {stream.viewerCount} viewers
            </Badge>
          )}
        </div>
        <h1 className="mt-4 text-3xl font-bold tracking-tight">{stream.title}</h1>
        <p className="mt-4 text-muted-foreground">{stream.description}</p>
        <p className="mt-2 text-sm text-muted-foreground">{format(new Date(stream.scheduledAt), "MMMM d, yyyy h:mm a")}</p>
        {(host || hostName) && (
          <div className="card-elevated mt-8 flex items-center gap-4 rounded-2xl p-5">
            <Image src={avatarUrl(hostName || "Host")} alt="" width={52} height={52} className="rounded-full" unoptimized />
            <div>
              <p className="font-semibold">{hostName}</p>
              {host && <p className="text-sm text-muted-foreground">{host.headline} at {host.company}</p>}
              {host && (
                <Link href={`/mentors/${host.slug}`} className="text-sm text-primary hover:underline">
                  View mentor profile →
                </Link>
              )}
            </div>
          </div>
        )}
        {stream.status === "live" ? (
          <a href="#" className="mt-6 inline-flex h-11 items-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground hover:brightness-110">
            Join live
          </a>
        ) : (
          <p className="mt-6 text-sm text-muted-foreground">Stream link will be available before the session starts.</p>
        )}
      </div>
    </div>
  );
}
