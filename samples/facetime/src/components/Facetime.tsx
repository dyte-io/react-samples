import {
  DyteAudioVisualizer,
  DyteAvatar,
  DyteNameTag,
  DyteParticipantTile,
  DyteParticipantsAudio,
  DyteSimpleGrid,
  provideDyteDesignSystem,
} from '@dytesdk/react-ui-kit';
import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core';
import clsx from 'clsx';
import { useEffect } from 'react';
import Draggable from 'react-draggable';
import { Mic, Video, X } from 'react-feather';

function Grid() {
  const { meeting } = useDyteMeeting();
  const participants = useDyteSelector((m) => m.participants.active);

  return (
    <div className="relative flex place-items-center justify-center flex-1 overflow-hidden -m-4">
      {participants.size === 0 && (
        <p className="text-2xl">People haven't joined yet.</p>
      )}
      {participants.size > 0 && (
        <DyteSimpleGrid
          participants={participants.toArray()}
          meeting={meeting}
          aspectRatio="1:1"
          gap={18}
        />
      )}
    </div>
  );
}

function Controlbar() {
  const { meeting } = useDyteMeeting();

  const participants = useDyteSelector((m) => m.participants.joined);

  const { videoEnabled, audioEnabled } = useDyteSelector((m) => ({
    videoEnabled: m.self.videoEnabled,
    audioEnabled: m.self.audioEnabled,
  }));

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

  return (
    <div className="z-20 flex w-full max-w-xs sm:w-min pt-4">
      <div className="w-full p-4 gap-4 bg-neutral-800 shadow-2xl shadow-black rounded-2xl md:rounded-3xl flex flex-col">
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
              audioEnabled ? 'bg-white text-black' : 'bg-neutral-700 text-white'
            )}
            onClick={toggleMic}
          >
            <Mic />
          </button>
          <button
            className={clsx(
              'p-3 flex items-center justify-center rounded-full',
              videoEnabled ? 'bg-white text-black' : 'bg-neutral-700 text-white'
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
  );
}

export default function Facetime() {
  const { meeting } = useDyteMeeting();

  const roomJoined = useDyteSelector((m) => m.self.roomJoined);

  useEffect(() => {
    provideDyteDesignSystem(document.body, {
      colors: {
        'video-bg': '#333333',
      },
    });
  }, []);

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

      <Draggable bounds="parent">
        <DyteParticipantTile
          participant={meeting.self}
          meeting={meeting}
          key={meeting.self.id}
          className="z-10 absolute bottom-44 right-4 sm:bottom-4 shadow-black shadow-2xl aspect-square w-52 h-auto cursor-move duration-0"
        >
          <DyteAvatar participant={meeting.self} size="md" />
          <DyteNameTag participant={meeting.self} size="md">
            <DyteAudioVisualizer
              participant={meeting.self}
              size="md"
              slot="start"
            />
          </DyteNameTag>
        </DyteParticipantTile>
      </Draggable>

      <Controlbar />
    </div>
  );
}
