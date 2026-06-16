import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createParticipantToken } from "@/lib/livekit/server";
import { getLiveKitUrl, isLiveKitConfigured } from "@/lib/livekit/config";

export async function POST(request: Request) {
  if (!isLiveKitConfigured()) {
    return NextResponse.json(
      { error: "LiveKit is not configured. Add LIVEKIT_API_KEY, LIVEKIT_API_SECRET, and LIVEKIT_URL." },
      { status: 503 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const slug = body.slug as string | undefined;
  if (!slug) {
    return NextResponse.json({ error: "Missing session slug" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "You must be logged in to join" }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Supabase required for live rooms" }, { status: 503 });
  }

  const { data: session } = await supabase
    .from("live_sessions")
    .select("*, profiles(full_name)")
    .eq("slug", slug)
    .single();

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  if (session.status === "ended") {
    return NextResponse.json({ error: "This session has ended" }, { status: 403 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, email, full_name")
    .eq("id", user.id)
    .single();

  const isAdmin = profile?.role === "admin";

  if (session.status === "upcoming" && session.host_id !== user.id && !isAdmin) {
    return NextResponse.json({ error: "This session has not started yet" }, { status: 403 });
  }

  if (session.access_mode === "invite_only" && session.host_id !== user.id && !isAdmin) {
    const { data: booking } = session.booking_request_id
      ? await supabase
          .from("booking_requests")
          .select("requester_email, user_id")
          .eq("id", session.booking_request_id)
          .single()
      : { data: null };

    const profileEmail = profile?.email;
    const isInvitee =
      booking?.user_id === user.id ||
      (profileEmail && booking?.requester_email === profileEmail);

    if (!isInvitee) {
      return NextResponse.json({ error: "This is a private call" }, { status: 403 });
    }
  }

  const roomName = session.room_name || session.slug;
  const isHost = session.host_id === user.id;
  const displayName =
    profile?.full_name ||
    user.email?.split("@")[0] ||
    "Participant";

  const token = await createParticipantToken(roomName, user.id, displayName, isHost);

  return NextResponse.json({
    token,
    serverUrl: getLiveKitUrl(),
    roomName,
    isHost,
  });
}
