import InMeeting from './in-meeting';
import {
  RtkEndedScreen,
  RtkIdleScreen,
  RtkSetupScreen,
  RtkWaitingScreen,
} from '@cloudflare/realtimekit-react-ui';
import { States } from '@cloudflare/realtimekit-ui';

interface CustomRtkMeetingProps {
  states: States;
  meetingIdentifier: string;
}

function CustomRtkMeeting({ states, meetingIdentifier }: CustomRtkMeetingProps) {
  console.log(`[CUSTOM-RTK-MEETING] ${meetingIdentifier} Rendering with states.meeting:`, states.meeting);
  
  switch (states.meeting) {
    case 'idle':
      console.log('[CUSTOM-RTK-MEETING] Rendering RtkIdleScreen');
      return <RtkIdleScreen />;
    case 'setup':
      console.log('[CUSTOM-RTK-MEETING] Rendering RtkSetupScreen');
      return <RtkSetupScreen />;
    case 'waiting':
      console.log('[CUSTOM-RTK-MEETING] Rendering RtkWaitingScreen');
      return <RtkWaitingScreen />;
    case 'ended':
      console.log('[CUSTOM-RTK-MEETING] Rendering RtkEndedScreen');
      return <RtkEndedScreen />;
    case 'joined':
    default:
      console.log('[CUSTOM-RTK-MEETING] Rendering InMeeting');
      return <InMeeting />;
  }
}

export default CustomRtkMeeting;
