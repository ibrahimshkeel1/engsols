"use client";

import { memo, useState } from "react";
import type { RoomOptions } from "livekit-client";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import "@livekit/components-styles";

/** Stable options — must be module-level so LiveKit does not recreate the room. */
export const LIVEKIT_ROOM_OPTIONS: RoomOptions = {
  adaptiveStream: false,
  dynacast: false,
};

type LiveKitRoomProviderProps = {
  serverUrl: string;
  token: string;
  children: React.ReactNode;
};

/** Wraps children in a connected LiveKit room — use `useRoomContext()` downstream. */
export const LiveKitRoomProvider = memo(function LiveKitRoomProvider({
  serverUrl,
  token,
  children,
}: LiveKitRoomProviderProps) {
  const [deviceError, setDeviceError] = useState<string | null>(null);

  return (
    <LiveKitRoom
      serverUrl={serverUrl}
      token={token}
      connect
      audio
      video
      options={LIVEKIT_ROOM_OPTIONS}
      data-lk-theme="default"
      className="live-kit-room-provider"
      onMediaDeviceFailure={() => {
        setDeviceError("Camera or microphone blocked. Allow access in your browser settings.");
      }}
      onError={(error) => setDeviceError(error.message)}
    >
      {deviceError && (
        <p className="live-device-error" role="alert">
          {deviceError}
        </p>
      )}
      {children}
    </LiveKitRoom>
  );
});

export function LiveKitVideoPane() {
  return (
    <div className="live-video-conference-wrap h-full min-h-0">
      <VideoConference />
    </div>
  );
}

/** @deprecated Use LiveKitRoomProvider + LiveKitVideoPane */
const LiveKitSession = memo(function LiveKitSession({
  serverUrl,
  token,
}: {
  serverUrl: string;
  token: string;
}) {
  return (
    <LiveKitRoomProvider serverUrl={serverUrl} token={token}>
      <div className="live-kit-room h-full">
        <LiveKitVideoPane />
      </div>
    </LiveKitRoomProvider>
  );
});

export { LiveKitSession };
