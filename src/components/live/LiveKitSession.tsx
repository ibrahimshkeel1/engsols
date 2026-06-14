"use client";

import { memo, useState } from "react";
import type { RoomOptions } from "livekit-client";
import {
  LiveKitRoom,
  VideoConference,
} from "@livekit/components-react";
import "@livekit/components-styles";

/** Stable options — must be module-level so LiveKit does not recreate the room. */
const ROOM_OPTIONS: RoomOptions = {
  adaptiveStream: false,
  dynacast: false,
};

type LiveKitSessionProps = {
  serverUrl: string;
  token: string;
};

const LiveKitSession = memo(function LiveKitSession({ serverUrl, token }: LiveKitSessionProps) {
  const [deviceError, setDeviceError] = useState<string | null>(null);

  return (
    <LiveKitRoom
      serverUrl={serverUrl}
      token={token}
      connect
      audio
      video
      options={ROOM_OPTIONS}
      data-lk-theme="default"
      className="live-kit-room"
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
      <div className="live-video-conference-wrap">
        <VideoConference />
      </div>
    </LiveKitRoom>
  );
});

export { LiveKitSession };
