import { useEffect, useState } from 'react';
import {
  DyteProvider,
  useDyteClient,
  useDyteMeeting,
} from '@dytesdk/react-web-core';
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

      const authToken = searchParams.get('authToken');
  
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
