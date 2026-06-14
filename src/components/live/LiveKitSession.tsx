"use client";

import { memo, useState } from "react";
import type { RoomOptions } from "livekit-client";
import { Track } from "livekit-client";
import {
  LiveKitRoom,
  RoomAudioRenderer,
  ControlBar,
  GridLayout,
  ParticipantTile,
  LayoutContextProvider,
  useTracks,
} from "@livekit/components-react";
import "@livekit/components-styles";

/** Stable options — must be module-level so LiveKit does not recreate the room. */
const ROOM_OPTIONS: RoomOptions = {
  adaptiveStream: false,
  dynacast: false,
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

function LiveRoomInternals({
  deviceError,
  setDeviceError,
}: {
  deviceError: string | null;
  setDeviceError: (message: string | null) => void;
}) {
  return (
    <LayoutContextProvider>
      {deviceError && (
        <p className="live-device-error" role="alert">
          {deviceError}
        </p>
      )}
      <div className="live-kit-stage">
        <ParticipantGrid />
      </div>
      <ControlBar
        saveUserChoices={false}
        controls={{
          camera: true,
          microphone: true,
          screenShare: true,
          chat: false,
          settings: true,
        }}
        onDeviceError={({ source, error }) => {
          const label =
            source === Track.Source.Camera
              ? "Camera"
              : source === Track.Source.Microphone
                ? "Microphone"
                : "Device";
          setDeviceError(`${label}: ${error.message}`);
        }}
      />
      <RoomAudioRenderer />
    </LayoutContextProvider>
  );
}

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
      onMediaDeviceFailure={(failure) => {
        if (failure) {
          setDeviceError("Camera or microphone blocked. Check browser permissions for this site.");
        }
      }}
      onError={(error) => setDeviceError(error.message)}
    >
      <LiveRoomInternals deviceError={deviceError} setDeviceError={setDeviceError} />
    </LiveKitRoom>
  );
});

export { LiveKitSession };
