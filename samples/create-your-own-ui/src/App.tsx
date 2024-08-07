import { useEffect, useState } from 'react';
import {
  DyteProvider,
  useDyteClient,
  useDyteMeeting,
} from '@dytesdk/react-web-core';
import './global.css';
import {
  defaultConfig,
  generateConfig,
} from '@dytesdk/react-ui-kit';
import { DyteStateListenersUtils } from './dyte-state-listeners';
import { CustomStates } from './types';
import { setFullScreenToggleTargetElement } from './utils';
import CustomDyteMeeting from './components/custom-dyte-meeting';

function Meeting() {
  const { meeting } = useDyteMeeting();
  const [config, setConfig] = useState(defaultConfig);
  const [states, setStates] = useState<CustomStates>({
    meeting: 'setup',
    sidebar: 'chat'
  });

  useEffect(() => {
    async function setupMeetingConfigs(){
      const theme = meeting!.self.config;
      const { config } = generateConfig(theme, meeting!);

      /**
       * NOTE(ravindra-dyte):
       * Full screen by default requests dyte-meeting/DyteMeeting element to be in full screen.
       * Since DyteMeeting element is not here,
       *  we need to pass dyte-fullscreen-toggle, an targetElementId through config.
       */
      setFullScreenToggleTargetElement({config, targetElementId: 'root'});

      setConfig({...config});

    /**
     * NOTE(ravindra-dyte):
     * Add listeners on meeting & self to monitor leave meeting, join meeting and so on.
     * This work was earlier done by DyteMeeting component internally.
     */
      const stateListenersUtils = new DyteStateListenersUtils(() => meeting, () => states, () => setStates);
      stateListenersUtils.addDyteEventListeners();
    }

    if(meeting){
    /**
     * NOTE(ravindra-dyte):
     * During development phase, make sure to expose meeting object to window,
     * for debugging purposes.
     */
      Object.assign(window, {
        meeting,
      })
      setupMeetingConfigs();
    }

  }, [meeting]);

  return <CustomDyteMeeting meeting={meeting} config={config} states={states} setStates={setStates} />
  
}

function App() {
  const [meeting, initMeeting] = useDyteClient();

  useEffect(() => {
    async function initalizeMeeting(){
      const searchParams = new URL(window.location.href).searchParams;

      const authToken = searchParams.get('authToken') || 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdJZCI6IjJlYmYzMzM5LTJhOGEtNDVhZi1hNDQwLTYxZDM4YjU0NzI1YiIsIm1lZXRpbmdJZCI6ImJiYjRjYWQzLTNlNDctNDNjYy1iODEyLTZkMDU1NDk5OWFiNyIsInBhcnRpY2lwYW50SWQiOiJhYWFlOWZjOC1kMzc1LTQ4MWQtYTAyOS1jYTI1MzdmM2E2OTQiLCJwcmVzZXRJZCI6ImFkNjY4NjlkLTUxZjgtNDg5Yi1iZTRhLTkwZTk3YWM4NTdkMSIsImlhdCI6MTcyMzAwNzUyMywiZXhwIjoxNzMxNjQ3NTIzfQ.DYBTVszc9YzK4r3hH37onwTcK8rh81QSIvKQRdj922665C7DFaNZN4vBcS6mvHoKJUHM7veQP9ot28z8the7EjOsEFYQkw2Oiwzwd_3HIYyhRlMmgB_rY4lPWUGn6vEVxUCBd4XBWRe5iUETSqv9e4CT6WUekuoQ-4uqz2bMr7E';
  
      if (!authToken) {
        alert(
          "An authToken wasn't passed, please pass an authToken in the URL query to join a meeting.",
        );
        return;
      }
  
      const meeting = await initMeeting({
        authToken,
        defaults: {
          audio: false,
          video: false,
        },
        baseURI: 'devel.dyte.io',
        modules: {devTools: {logs: true}}
      });

      // await meeting!.joinRoom();

    }

    if(!meeting){
      initalizeMeeting();
    }
  }, [meeting]);

  // By default this component will cover the entire viewport.
  // To avoid that and to make it fill a parent container, pass the prop:
  // `mode="fill"` to the component.
  return (
    <DyteProvider value={meeting}>
      <Meeting/>
    </DyteProvider>
  );
}

export default App;
