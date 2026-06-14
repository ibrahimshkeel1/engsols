"use client";

import { memo } from "react";
import type { RoomOptions } from "livekit-client";
import { Track } from "livekit-client";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  ControlBar,
  GridLayout,
  ParticipantTile,
  useTracks,
} from "@livekit/components-react";
import "@livekit/components-styles";

/** Stable options — do not inline; LiveKit recreates the room if this object changes. */
const ROOM_OPTIONS: RoomOptions = {
  adaptiveStream: false,
  dynacast: false,
  videoCaptureDefaults: {
    resolution: { width: 1280, height: 720, frameRate: 24 },
  },
};

function ParticipantGrid() {
  const tracks = useTracks([{ source: Track.Source.Camera, withPlaceholder: true }], {
    onlySubscribed: false,
  });

  return (
    <GridLayout tracks={tracks} className="live-participant-grid">
      <ParticipantTile />
    </GridLayout>
  );
}

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
      options={ROOM_OPTIONS}
      data-lk-theme="default"
      className="live-kit-room"
    >
      <div className="live-kit-stage">
        <ParticipantGrid />
      </div>
      <ControlBar controls={{ chat: false, settings: false, screenShare: true }} />
      <RoomAudioRenderer />
    </LiveKitRoom>
  );
});

export { LiveKitSession };
