import { AccessToken, RoomServiceClient, TrackSource } from "livekit-server-sdk";
import { getLiveKitUrl, isLiveKitConfigured } from "./config";

function getCredentials() {
  return {
    apiKey: process.env.LIVEKIT_API_KEY!,
    apiSecret: process.env.LIVEKIT_API_SECRET!,
    url: getLiveKitUrl(),
  };
}

export async function ensureLiveKitRoom(roomName: string, maxParticipants = 50) {
  if (!isLiveKitConfigured()) return;

  const { apiKey, apiSecret, url } = getCredentials();
  const client = new RoomServiceClient(url, apiKey, apiSecret);

  try {
    await client.createRoom({
      name: roomName,
      emptyTimeout: 300,
      maxParticipants,
    });
  } catch {
    // Room may already exist
  }
}

export async function deleteLiveKitRoom(roomName: string) {
  if (!isLiveKitConfigured()) return;

  const { apiKey, apiSecret, url } = getCredentials();
  const client = new RoomServiceClient(url, apiKey, apiSecret);

  try {
    await client.deleteRoom(roomName);
  } catch {
    // Room may already be closed
  }
}

export async function createParticipantToken(
  roomName: string,
  identity: string,
  name: string,
  isHost: boolean,
) {
  if (!isLiveKitConfigured()) {
    throw new Error("LiveKit is not configured");
  }

  const { apiKey, apiSecret } = getCredentials();
  const token = new AccessToken(apiKey, apiSecret, { identity, name });
  token.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
    canPublishSources: [
      TrackSource.CAMERA,
      TrackSource.MICROPHONE,
      TrackSource.SCREEN_SHARE,
      TrackSource.SCREEN_SHARE_AUDIO,
    ],
    roomAdmin: isHost,
  });

  return await token.toJwt();
}
