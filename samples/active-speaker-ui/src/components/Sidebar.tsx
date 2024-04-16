import { useMeetingStore } from '../lib/meeting-store';
import ActiveSpeaker from './ActiveSpeaker';
import Grid from './Grid';
import {
  DyteParticipants,
  DytePlugins,
  DytePolls,
  DyteChat,
  DyteSwitch,
} from '@dytesdk/react-ui-kit';
import { useDyteMeeting } from '@dytesdk/react-web-core';

export default function Sidebar() {
  const { meeting } = useDyteMeeting();

  const isActiveMode = useMeetingStore((m) => m.isActiveSpeakerMode);
  const [chatEnabled, setChatEnabled] = useMeetingStore((m) => [m.chatEnabled, m.setChatEnabled]);
  
  const { states, isMobile } = useMeetingStore(({ states, isMobile }) => ({
    states,
    isMobile,
  }));

  let sidebar: JSX.Element | null = null;

  switch (states.sidebar) {
    case 'participants':
    
      sidebar = <DyteParticipants meeting={meeting} className="pt-3">
        <div slot='start' className='pt-4 px-4 flex justify-between items-center'>
          <span className='font-semibold text-md'>Enable Chat</span>
          <DyteSwitch checked={chatEnabled ?? true} onDyteChange={(e) => {
            const isEnabled = e.detail;
            const updateList = meeting.participants.joined.toArray().map((e) => e.id);
            if(updateList.length > 0) {
              meeting.participants.updatePermissions(updateList, { chat: { public: { text: isEnabled, files: isEnabled }}})
            }
            setChatEnabled(e.detail)
          }}/>
        </div>
      </DyteParticipants>;
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

  const isHost = meeting.self.presetName === 'webinar_presenter';

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
