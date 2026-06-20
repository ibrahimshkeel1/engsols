"use client";

import { useEffect, useRef, useState } from "react";
import type { WidgetState } from "@livekit/components-core";
import { isEqualTrackRef, isTrackReference, isWeb, log } from "@livekit/components-core";
import type { TrackReferenceOrPlaceholder } from "@livekit/components-core";
import { RoomEvent, Track } from "livekit-client";
import {
  CarouselLayout,
  Chat,
  ConnectionStateToast,
  ControlBar,
  FocusLayout,
  FocusLayoutContainer,
  GridLayout,
  LayoutContextProvider,
  ParticipantTile,
  RoomAudioRenderer,
  useCreateLayoutContext,
  useLayoutContext,
  usePinnedTracks,
  useTracks,
} from "@livekit/components-react";

type ChromeProps = {
  children: React.ReactNode;
};

export function LiveRoomMediaChrome({ children }: ChromeProps) {
  const layoutContext = useCreateLayoutContext();
  const [widgetState, setWidgetState] = useState<WidgetState>({
    showChat: false,
    unreadMessages: 0,
    showSettings: false,
  });

  return (
    <LayoutContextProvider value={layoutContext} onWidgetChange={setWidgetState}>
      <div className="live-workspace-root flex min-h-0 w-full flex-1 flex-col">
        {children}

        <div
          className="live-room-chat-panel"
          data-lk-theme="default"
          data-open={widgetState.showChat ? "true" : "false"}
          aria-hidden={!widgetState.showChat}
        >
          <Chat style={{ display: widgetState.showChat ? "grid" : "none" }} />
        </div>

        <div className="live-room-control-dock shrink-0" data-lk-theme="default">
          <ControlBar controls={{ chat: true, settings: false }} />
        </div>
      </div>
    </LayoutContextProvider>
  );
}

/** Video grid — render inside `LiveRoomMediaChrome` so pin/layout context is available. */
export function LiveKitVideoStage() {
  const layoutContext = useLayoutContext();
  const lastAutoFocusedScreenShareTrack = useRef<TrackReferenceOrPlaceholder | null>(null);

  const tracks = useTracks(
    [
      { source: Track.Source.Camera, withPlaceholder: true },
      { source: Track.Source.ScreenShare, withPlaceholder: false },
    ],
    { updateOnlyOn: [RoomEvent.ActiveSpeakersChanged], onlySubscribed: false },
  );

  const focusTrack = usePinnedTracks(layoutContext)?.[0];
  const carouselTracks = tracks.filter((track) => !isEqualTrackRef(track, focusTrack));
  const screenShareTracks = tracks
    .filter(isTrackReference)
    .filter((track) => track.publication.source === Track.Source.ScreenShare);

  useEffect(() => {
    if (
      screenShareTracks.some((track) => track.publication.isSubscribed) &&
      lastAutoFocusedScreenShareTrack.current === null
    ) {
      log.debug("Auto set screen share focus:", { newScreenShareTrack: screenShareTracks[0] });
      layoutContext.pin.dispatch?.({ msg: "set_pin", trackReference: screenShareTracks[0] });
      lastAutoFocusedScreenShareTrack.current = screenShareTracks[0];
    } else if (
      lastAutoFocusedScreenShareTrack.current &&
      !screenShareTracks.some(
        (track) =>
          track.publication.trackSid ===
          lastAutoFocusedScreenShareTrack.current?.publication?.trackSid,
      )
    ) {
      log.debug("Auto clearing screen share focus.");
      layoutContext.pin.dispatch?.({ msg: "clear_pin" });
      lastAutoFocusedScreenShareTrack.current = null;
    }

    if (focusTrack && !isTrackReference(focusTrack)) {
      const updatedFocusTrack = tracks.find(
        (tr) =>
          tr.participant.identity === focusTrack.participant.identity &&
          tr.source === focusTrack.source,
      );
      if (updatedFocusTrack !== focusTrack && isTrackReference(updatedFocusTrack)) {
        layoutContext.pin.dispatch?.({ msg: "set_pin", trackReference: updatedFocusTrack });
      }
    }
  }, [screenShareTracks, focusTrack, tracks, layoutContext.pin]);

  if (!isWeb()) return null;

  return (
    <div className="live-kit-video-stage lk-video-conference-inner h-full min-h-0">
      {!focusTrack ? (
        <div className="lk-grid-layout-wrapper h-full min-h-0">
          <GridLayout tracks={tracks}>
            <ParticipantTile />
          </GridLayout>
        </div>
      ) : (
        <div className="lk-focus-layout-wrapper h-full min-h-0">
          <FocusLayoutContainer>
            <CarouselLayout tracks={carouselTracks}>
              <ParticipantTile />
            </CarouselLayout>
            {focusTrack && <FocusLayout trackRef={focusTrack} />}
          </FocusLayoutContainer>
        </div>
      )}
      <RoomAudioRenderer />
      <ConnectionStateToast />
    </div>
  );
}
