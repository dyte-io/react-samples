import HOST_PRESET from '../lib/const';
import { useMeetingStore } from '../lib/meeting-store';
import ActiveSpeaker from './ActiveSpeaker';
import Grid from './Grid';
import {
  DyteParticipants,
  DytePlugins,
  DytePolls,
  DyteChat,
} from '@dytesdk/react-ui-kit';
import { useDyteMeeting } from '@dytesdk/react-web-core';

export default function Sidebar() {
  const { meeting } = useDyteMeeting();

  const isActiveMode = useMeetingStore((m) => m.isActiveSpeakerMode);

  const { states, isMobile } = useMeetingStore(({ states, isMobile }) => ({
    states,
    isMobile,
  }));

  let sidebar: JSX.Element | null = null;

  switch (states.sidebar) {
    case 'participants':
      sidebar = <DyteParticipants meeting={meeting} className="pt-3" />;
      break;
    case 'plugins':
      sidebar = <DytePlugins meeting={meeting} />;
      break;
    case 'polls':
      sidebar = <DytePolls meeting={meeting} className="m-0" />;
      break;
    case 'chat':
      sidebar = <DyteChat meeting={meeting} />;
      break;
  }

  const isHost = meeting.self.presetName === HOST_PRESET;

  if (isHost && !sidebar) {
    return null;
  }

  if (!isHost && !sidebar && !isActiveMode) {
    return null;
  }

  if (!isHost && !sidebar && isMobile) {
    return null;
  }

  return (
    <aside className="flex-1 lg:flex-auto lg:w-full lg:max-w-sm -ml-2">
      <div className="size-full flex flex-col gap-2 p-2">
        {sidebar ? (
          <>
            {!isMobile && (
              <ActiveSpeaker className="h-auto w-full aspect-video" isSmall />
            )}

            <div className="flex-1 rounded-lg overflow-clip bg-zinc-900">
              {sidebar}
            </div>
          </>
        ) : (
          <Grid />
        )}
      </div>
    </aside>
  );
}
