import InMeeting from './in-meeting';
import {
  RtkEndedScreen,
  RtkIdleScreen,
  RtkSetupScreen,
  RtkWaitingScreen,
} from '@cloudflare/realtimekit-react-ui';
import { States } from '@cloudflare/realtimekit-ui';

export interface CustomRtkMeetingProps {
  states: States;
  meetingIdentifier: string;
}

function CustomRtkMeeting({ states, meetingIdentifier }: CustomRtkMeetingProps) {

  
  switch (states.meeting) {
    case 'idle':

      return <RtkIdleScreen />;
    case 'setup':

      return <RtkSetupScreen />;
    case 'waiting':

      return <RtkWaitingScreen />;
    case 'ended':

      return <RtkEndedScreen />;
    case 'joined':
    default:

      return <InMeeting states={states} />;
  }
}

export default CustomRtkMeeting;
