import { useEffect } from 'react';
import {
  DyteProvider,
  useDyteClient,
  useDyteMeeting,
} from '@dytesdk/react-web-core';
import { DyteDialogManager, DyteUiProvider } from '@dytesdk/react-ui-kit';
import CustomDyteMeeting from './components/custom-dyte-meeting';
import { useStatesStore } from './store';

function Meeting() {
  const { meeting } = useDyteMeeting();

  useEffect(() => {
    if (meeting) {
      /**
       * NOTE(ravindra-dyte):
       * During development phase, make sure to expose meeting object to window,
       * for debugging purposes.
       */
      Object.assign(window, {
        meeting,
      });
    }
  }, [meeting]);

  return <CustomDyteMeeting />;
}

function App() {
  const [meeting, initMeeting] = useDyteClient();
  const setStates = useStatesStore((s) => s.setStates);

  useEffect(() => {
    async function initalizeMeeting() {
      const searchParams = new URL(window.location.href).searchParams;

      const authToken = searchParams.get('authToken');

      if (!authToken) {
        alert(
          "An authToken wasn't passed, please pass an authToken in the URL query to join a meeting.",
        );
        return;
      }

      initMeeting({
        authToken,
        defaults: {
          audio: false,
          video: false,
        },
      });
    }

    if (!meeting) {
      initalizeMeeting();
    }
  }, [meeting]);

  // By default this component will cover the entire viewport.
  // To avoid that and to make it fill a parent container, pass the prop:
  // `mode="fill"` to the component.
  return (
    <DyteProvider value={meeting}>
      <DyteUiProvider
        meeting={meeting}
        onDyteStatesUpdate={(e) => {
          setStates(e.detail);
        }}
        showSetupScreen
        style={{ height: '100%', width: '100%', display: 'block' }}
      >
        <Meeting />
        <DyteDialogManager />
      </DyteUiProvider>
    </DyteProvider>
  );
}

export default App;
