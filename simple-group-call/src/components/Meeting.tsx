import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core';
import {
  DyteAudioVisualizer,
  DyteParticipantTile,
  DyteNameTag,
  DyteAvatar,
  DyteMeetingTitle,
  DyteClock,
  DyteMicToggle,
  DyteCameraToggle,
  DyteParticipantCount,
  DyteParticipantsAudio,
  DyteSetupScreen,
} from '@dytesdk/react-ui-kit';
import { useMemo, useRef } from 'react';
import { createGrid } from 'good-grid';
import { useGridDimensions } from 'good-grid/react';
import clsx from 'clsx';

function UI() {
  const $grid = useRef<HTMLElement>(null);
  const dimensions = useGridDimensions($grid);

  const { meeting } = useDyteMeeting();
  const self = useDyteSelector((meeting) => meeting.self);
  const activeParticipants = useDyteSelector((meeting) =>
    meeting.participants.active.toArray()
  );

  const pinnedParticipants = useDyteSelector((meeting) =>
    meeting.participants.pinned.toArray()
  );

  // show pinned participants first
  const participants = [
    ...pinnedParticipants,
    ...activeParticipants.filter((p) => !pinnedParticipants.includes(p)),
    self,
  ];

  const { width, height, getPosition } = useMemo(
    () =>
      createGrid({
        dimensions,
        count: participants.length,
        aspectRatio: '4:3',
        gap: 12,
      }),
    [participants]
  );

  return (
    <div className="w-full h-full flex flex-col">
      <DyteParticipantsAudio meeting={meeting} />
      <header className="h-12 flex items-center justify-between px-4 border-b">
        <div className="flex items-center gap-1 md:gap-2">
          <img
            src="https://assets.dyte.io/logo-outlined.png"
            className="h-6 md:h-7"
          />
          <div className="w-px h-7 mx-1 rotate-[18deg] bg-zinc-200"></div>
          <DyteMeetingTitle
            meeting={meeting}
            className="mx-0 font-medium text-xs md:text-sm font-sans"
          />
        </div>
        <div>
          <DyteParticipantCount
            meeting={meeting}
            className="text-xs md:text-sm"
          />
          <DyteClock meeting={meeting} className="text-xs md:text-sm" />
        </div>
      </header>
      <main
        className="flex-grow flex-shrink-0 relative flex flex-wrap content-center justify-center gap-4 p-4 overflow-clip"
        ref={$grid}
      >
        {participants.map((participant, index) => {
          const { top, left } = getPosition(index);

          return (
            <DyteParticipantTile
              participant={participant}
              key={participant.id}
              className={clsx(
                'absolute transition-all border bg-zinc-100',
                participant.audioEnabled
                  ? 'border-dyte-blue shadow-md shadow-dyte-blue/30'
                  : 'border-zinc-200'
              )}
              style={{
                width,
                height,
                top,
                left,
              }}
            >
              <DyteAvatar participant={participant} size="md" />
              <DyteNameTag participant={participant} meeting={meeting}>
                <DyteAudioVisualizer participant={participant} slot="start" />
              </DyteNameTag>
            </DyteParticipantTile>
          );
        })}
      </main>
      <footer className="py-2 flex items-center justify-center">
        <DyteMicToggle meeting={meeting} />
        <DyteCameraToggle meeting={meeting} />
      </footer>
    </div>
  );
}

export default function Meeting() {
  const { meeting } = useDyteMeeting();

  const roomJoined = useDyteSelector((meeting) => meeting.self.roomJoined);

  if (!roomJoined) {
    return <DyteSetupScreen meeting={meeting} />;
  }

  return <UI />;
}
