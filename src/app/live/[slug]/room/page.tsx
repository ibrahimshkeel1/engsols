import { notFound, redirect } from "next/navigation";
import { getLiveSession } from "@/lib/data/live";
import { getCurrentUser } from "@/lib/auth";
import { LiveRoomClient } from "@/components/live/LiveRoomClient";

type Props = { params: Promise<{ slug: string }> };

export default async function LiveRoomPage({ params }: Props) {
  const { slug } = await params;
  const [stream, user] = await Promise.all([getLiveSession(slug), getCurrentUser()]);

  if (!stream) notFound();
  if (!user) redirect(`/login?next=/live/${slug}/room`);
  if (stream.status === "ended") redirect(`/live/${slug}`);
  if (stream.status === "upcoming" && stream.hostId !== user.id) {
    redirect(`/live/${slug}`);
  }

  const isHost = stream.hostId === user.id;

  return (
    <div className="live-room-container mx-auto max-w-6xl px-4 py-4 sm:px-6">
      <LiveRoomClient slug={slug} title={stream.title} isHost={isHost} />
    </div>
  );
}
