import { useMeetingStore } from '../lib/meeting-store';
import ActiveSpeaker from './ActiveSpeaker';
import {
  DyteParticipants,
  DytePlugins,
  DytePolls,
  DyteChat,
} from '@dytesdk/react-ui-kit';
import { useDyteMeeting } from '@dytesdk/react-web-core';

export default function Sidebar() {
  const { meeting } = useDyteMeeting();

  const { states, size, isMobile, isActiveSpeakerMode } = useMeetingStore(
    ({ states, isImmersiveMode, size, isMobile, isActiveSpeakerMode }) => ({
      states,
      isImmersiveMode,
      size,
      isMobile,
      isActiveSpeakerMode,
    })
  );

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

  return (
    <div className="size-full flex flex-col gap-2 p-2">
      {!isMobile && <ActiveSpeaker className="h-auto w-full aspect-video" />}

      <div className="flex-1 rounded-lg overflow-clip bg-zinc-900">
        {sidebar}
      </div>
    </div>
  );
}
