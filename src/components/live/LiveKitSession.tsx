"use client";

import { memo } from "react";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  VideoConference,
} from "@livekit/components-react";
import "@livekit/components-styles";

type LiveKitSessionProps = {
  serverUrl: string;
  token: string;
};

const LiveKitSession = memo(function LiveKitSession({ serverUrl, token }: LiveKitSessionProps) {
  return (
    <LiveKitRoom
      serverUrl={serverUrl}
      token={token}
      connect
      audio
      video
      data-lk-theme="default"
      options={{
        dynacast: true,
        adaptiveStream: true,
      }}
      style={{ height: "70vh", minHeight: "480px" }}
    >
      <VideoConference />
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
});

export { LiveKitSession };
