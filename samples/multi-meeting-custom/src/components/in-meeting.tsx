import {
  RtkStage,
  RtkGrid,
  RtkNotifications,
  RtkParticipantsAudio,
  RtkSidebar,
  RtkControlbar,
  RtkHeader,
} from '@cloudflare/realtimekit-react-ui';
import type { CustomRtkMeetingProps } from './custom-rtk-meeting';

function InMeeting({ states, meetingIdentifier }: CustomRtkMeetingProps) {
  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      <header className="flex-shrink-0 w-full">
        <RtkHeader style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--rtk-space-2, 8px)',
          '--header-section-gap': 'var(--rtk-space-2, 8px)',
        }}/>
      </header>
      <main className="flex-1 w-full overflow-hidden relative">
        <RtkStage className="w-full h-full p-2 overflow-hidden relative">
          <RtkGrid />
          <RtkNotifications />
          { states.activeSidebar && <RtkSidebar/>}
        </RtkStage>
        <RtkParticipantsAudio />
      </main>
      <footer className="flex-shrink-0 w-full">
        <RtkControlbar style={{display: 'flex', justifyContent: 'space-between'}}/>
      </footer>
    </div>
  );
}

export default InMeeting;
