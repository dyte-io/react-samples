import { useMeetingStore } from '../lib/meeting-store';
import {
  DyteParticipants,
  DytePlugins,
  DytePolls,
  DyteChat,
  DyteParticipantTile,
} from '@dytesdk/react-ui-kit';
import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core';
import clsx from 'clsx';

export default function Sidebar() {
  const { meeting } = useDyteMeeting();

  const lastActiveSpeaker = useDyteSelector(
    (m) => m.participants.lastActiveSpeaker
  );

  const pinnedParticipant = useDyteSelector((m) =>
    m.participants.pinned.toArray().at(0)
  );

  const activeSpeaker =
    pinnedParticipant ?? meeting.participants.joined.get(lastActiveSpeaker);

  let sidebar: JSX.Element;

  const { states, size, isMobile, isActiveSpeakerMode } = useMeetingStore(
    ({ states, isImmersiveMode, size, isMobile, isActiveSpeakerMode }) => ({
      states,
      isImmersiveMode,
      size,
      isMobile,
      isActiveSpeakerMode,
    })
  );

  switch (states.sidebar) {
    case 'participants':
      sidebar = <DyteParticipants meeting={meeting} />;
      break;
    case 'plugins':
      sidebar = <DytePlugins meeting={meeting} />;
      break;
    case 'polls':
      sidebar = <DytePolls meeting={meeting} />;
      break;
    default:
      sidebar = <DyteChat meeting={meeting} />;
      break;
  }

  return (
    <div className="size-full flex flex-col gap-2">
      {activeSpeaker && isActiveSpeakerMode && (
        <DyteParticipantTile
          participant={activeSpeaker}
          className={clsx(
            'aspect-video h-auto',
            isMobile ? 'absolute bottom-3 left-3 w-1/3 z-50' : 'w-full'
          )}
          size={size}
          states={states}
        />
      )}

      <div className="flex-1 rounded-lg overflow-clip bg-zinc-900">
        {sidebar}
      </div>
    </div>
  );
}
