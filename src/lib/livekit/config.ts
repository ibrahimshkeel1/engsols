export function isLiveKitConfigured() {
  return !!(
    process.env.LIVEKIT_API_KEY &&
    process.env.LIVEKIT_API_SECRET &&
    process.env.LIVEKIT_URL
  );
}

export function getLiveKitUrl() {
  return process.env.LIVEKIT_URL ?? process.env.NEXT_PUBLIC_LIVEKIT_URL ?? "";
}
