import {
  DyteAvatar,
  DyteParticipantTile,
  DyteParticipantsAudio,
  provideDyteDesignSystem,
} from '@dytesdk/react-ui-kit';
import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core';
import { useEffect, useRef } from 'react';

import { useGridDimensions } from 'good-grid/react';
import { createGrid } from 'good-grid';
import { Mic, Video, X } from 'react-feather';
import clsx from 'clsx';
import Draggable from 'react-draggable';

function Grid() {
  const $el = useRef(null);
  const participants = useDyteSelector((m) => m.participants.active);

  const dimensions = useGridDimensions($el);
  const { width, height, getPosition } = createGrid({
    aspectRatio: '1:1',
    gap: 18,
    dimensions,
    count: participants.size,
  });

  return (
    <div
      className="relative flex place-items-center justify-center flex-1 overflow-hidden -m-4"
      ref={$el}
    >
      {participants.size === 0 && (
        <p className="text-2xl">People haven't joined yet.</p>
      )}
      {participants.toArray().map((participant, idx) => {
        const { top, left } = getPosition(idx);

        return (
          <DyteParticipantTile
            participant={participant}
            key={participant.id}
            style={{
              position: 'absolute',
              width,
              height,
              top,
              left,
              transition: '0.2s all',
            }}
            className={clsx(
              'border-2',
              participant.audioEnabled
                ? 'border-white scale-[101%] shadow-2xl'
                : 'border-transparent'
            )}
          >
            <DyteAvatar participant={participant} />
          </DyteParticipantTile>
        );
      })}
    </div>
  );
}

export default function Facetime() {
  const { meeting } = useDyteMeeting();

  const roomJoined = useDyteSelector((m) => m.self.roomJoined);
  const participants = useDyteSelector((m) => m.participants.joined);

  const { videoEnabled, audioEnabled } = useDyteSelector((m) => ({
    videoEnabled: m.self.videoEnabled,
    audioEnabled: m.self.audioEnabled,
  }));

  useEffect(() => {
    provideDyteDesignSystem(document.body, {
      colors: {
        'video-bg': '#333333',
      },
    });
  }, []);

  const toggleCamera = () => {
    if (meeting.self.videoEnabled) {
      meeting.self.disableVideo();
    } else {
      meeting.self.enableVideo();
    }
  };

  const toggleMic = () => {
    if (meeting.self.audioEnabled) {
      meeting.self.disableAudio();
    } else {
      meeting.self.enableAudio();
    }
  };

  const leaveMeeting = () => {
    meeting.leaveRoom();
  };

  if (!roomJoined) {
    return (
      <div className="bg-black text-white w-full h-full flex place-items-center justify-center">
        <p className="text-2xl">You are not in the meeting.</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full p-4 flex flex-col bg-black text-white overflow-hidden">
      <DyteParticipantsAudio meeting={meeting} />

      <Grid />

      <div className="z-20 flex p-4">
        <div className="w-min p-4 gap-4 bg-neutral-800 shadow-2xl shadow-black rounded-3xl flex flex-col">
          <div className="text-sm">
            <h1>{meeting.meta.meetingTitle}</h1>
            <div className="text-stone-400">
              {participants.size + 1} People Active
            </div>
          </div>
          <div className="flex items-center justify-evenly gap-10">
            <button
              className={clsx(
                'p-3 flex items-center justify-center rounded-full',
                audioEnabled
                  ? 'bg-white text-black'
                  : 'bg-neutral-700 text-white'
              )}
              onClick={toggleMic}
            >
              <Mic />
            </button>
            <button
              className={clsx(
                'p-3 flex items-center justify-center rounded-full',
                videoEnabled
                  ? 'bg-white text-black'
                  : 'bg-neutral-700 text-white'
              )}
              onClick={toggleCamera}
            >
              <Video />
            </button>
            <button
              className="bg-red-500 text-white p-3 flex items-center justify-center rounded-full"
              onClick={leaveMeeting}
            >
              <X />
            </button>
          </div>
        </div>
      </div>

      <Draggable bounds="parent">
        <DyteParticipantTile
          participant={meeting.self}
          key={meeting.self.id}
          className="z-10 aspect-square absolute bottom-4 right-4 w-56 shadow-2xl shadow-black cursor-move"
        >
          <DyteAvatar participant={meeting.self} size="md" />
        </DyteParticipantTile>
      </Draggable>
    </div>
  );
}
