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

  const pinnedParticipants = useDyteSelector((m) =>
    m.participants.pinned.toArray()
  );

  const activeParticipants = useDyteSelector((m) =>
    m.participants.active.toArray()
  );

  const activeSpeaker =
    pinnedParticipants.at(0) ??
    meeting.participants.joined.get(lastActiveSpeaker) ??
    activeParticipants.at(0);

  const { states, size, isMobile, isActiveSpeakerMode } = useMeetingStore(
    ({ states, isImmersiveMode, size, isMobile, isActiveSpeakerMode }) => ({
      states,
      isImmersiveMode,
      size,
      isMobile,
      isActiveSpeakerMode,
    })
  );

  console.log({ activeSpeaker, isActiveSpeakerMode, pinnedParticipants });

  let sidebar: JSX.Element;

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

  console.log({ activeSpeaker });

  return (
    <div className="size-full flex flex-col gap-2 p-2">
      {activeSpeaker && isActiveSpeakerMode && (
        <DyteParticipantTile
          participant={activeSpeaker}
          meeting={meeting}
          className={clsx(
            'h-auto',
            isMobile
              ? 'absolute bottom-3 left-3 w-36 z-50 aspect-square'
              : 'w-full aspect-video'
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
