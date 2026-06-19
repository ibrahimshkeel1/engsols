import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { getLiveSession } from "@/lib/data/live";
import { getMentorBySlug } from "@/lib/data/mentors";
import { getCurrentUser } from "@/lib/auth";
import { isLiveKitConfigured } from "@/lib/livekit/config";
import { videoThumbnail } from "@/lib/placeholders";
import { SessionCountdown } from "@/components/shared/SessionCountdown";
import { AddToCalendarButton } from "@/components/shared/AddToCalendarButton";
import { SessionReminderButton } from "@/components/shared/SessionReminderButton";
import { Avatar } from "@/components/ui/Avatar";
import { DisciplineBadge } from "@/components/ui/DisciplineBadge";
import { LiveSessionActions } from "@/components/live/LiveSessionActions";
import { LiveRecordingForm } from "@/components/live/LiveRecordingForm";
import { LiveRecordingPlayer } from "@/components/live/LiveRecordingPlayer";
import { LiveStatusWatcher } from "@/components/live/LiveStatusWatcher";
import Image from "next/image";

type Props = { params: Promise<{ slug: string }> };

export default async function LiveStreamPage({ params }: Props) {
  const { slug } = await params;
  const [stream, user] = await Promise.all([getLiveSession(slug), getCurrentUser()]);
  if (!stream) notFound();

  const host = stream.hostSlug ? await getMentorBySlug(stream.hostSlug) : null;
  const hostName = "hostName" in stream ? stream.hostName : host?.name;
  const isHost = !!user && stream.hostId === user.id;
  const isAdmin = user?.role === "admin";
  const liveKitConfigured = isLiveKitConfigured();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 pb-24 sm:px-6 lg:pb-12">
      <LiveStatusWatcher slug={slug} />
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-muted">
        <Image
          src={videoThumbnail(stream.title.slice(0, 24))}
          alt=""
          fill
          className="object-cover opacity-90"
          unoptimized
        />
        {stream.status === "live" && (
          <span className="absolute left-4 top-4 rounded-lg bg-red-600 px-3 py-1 text-xs font-bold text-white">
            LIVE
          </span>
        )}
      </div>
      <div className="mt-8">
        <div className="flex flex-wrap gap-2">
          <DisciplineBadge discipline={stream.discipline} />
          {stream.callType === "forum_instant" && (
            <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium">From forum</span>
          )}
          {stream.status === "live" && (
            <span className="rounded-md bg-red-500/15 px-2 py-0.5 text-xs font-medium text-red-600 dark:text-red-400">
              Live now · {stream.viewerCount} viewers
            </span>
          )}
        </div>
        <h1 className="mt-4 font-display text-3xl tracking-tight">{stream.title}</h1>
        <p className="mt-4 text-muted-foreground">{stream.description}</p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {stream.status === "upcoming" && <SessionCountdown scheduledAt={stream.scheduledAt} />}
          {stream.status === "upcoming" && (
            <>
              <AddToCalendarButton title={stream.title} description={stream.description} scheduledAt={stream.scheduledAt} />
              <SessionReminderButton sessionSlug={stream.slug} sessionTitle={stream.title} />
            </>
          )}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          {format(new Date(stream.scheduledAt), "MMMM d, yyyy h:mm a")}
          {stream.endedAt && ` · Ended ${format(new Date(stream.endedAt), "MMM d, h:mm a")}`}
        </p>
        {stream.forumPostSlug && (
          <Link href={`/forum/${stream.forumPostSlug}`} className="mt-2 inline-block text-sm text-primary hover:underline">
            View forum discussion →
          </Link>
        )}
        {(host || hostName) && (
          <div className="card-elevated mt-8 flex items-center gap-4 rounded-2xl p-5">
            <Avatar name={hostName || "Host"} discipline={host?.discipline ?? stream.discipline} size="md" />
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
        <div className="mt-6">
          <LiveSessionActions
            slug={slug}
            status={stream.status}
            isHost={isHost}
            isAdmin={isAdmin}
            liveKitConfigured={liveKitConfigured}
          />
        </div>
        {stream.recordingUrl && stream.status === "ended" && (
          <LiveRecordingPlayer url={stream.recordingUrl} title={stream.title} />
        )}
        {(isHost || isAdmin) && stream.status === "ended" && (
          <div className="mt-6">
            <LiveRecordingForm slug={slug} initialUrl={stream.recordingUrl} />
          </div>
        )}
      </div>
    </div>
  );
}
