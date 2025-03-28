import InMeeting from './in-meeting';
import {
  DyteEndedScreen,
  DyteIdleScreen,
  DyteSetupScreen,
  DyteWaitingScreen,
} from '@dytesdk/react-ui-kit';
import { useCustomStatesStore, useStatesStore } from '../store';
import SetupScreen from './setup-screen';

function CustomDyteMeeting() {
  const states = useStatesStore((s) => s.states);
  const customStates = useCustomStatesStore((s) => s.states);
  console.log(states, customStates);

  switch (states.meeting) {
    case 'idle':
      return <DyteIdleScreen />;
    case 'setup':
      return <SetupScreen />;
    case 'waiting':
      return <DyteWaitingScreen />;
    case 'ended':
      return <DyteEndedScreen />;
    case 'joined':
    default:
      return <InMeeting />;
  }
}

export default CustomDyteMeeting;
