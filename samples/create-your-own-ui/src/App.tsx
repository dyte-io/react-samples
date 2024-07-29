import { useEffect, useState } from 'react';
import {
  DyteProvider,
  useDyteClient,
  useDyteMeeting,
} from '@dytesdk/react-web-core';
import DyteVideoBackgroundTransformer from '@dytesdk/video-background-transformer';

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
  
      // if (!authToken) {
      //   alert(
      //     "An authToken wasn't passed, please pass an authToken in the URL query to join a meeting.",
      //   );
      //   return;
      // }
  
      const meeting = await initMeeting({
        authToken: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJvcmdJZCI6ImQ2ZjA0NmI4LWI2MzgtNGNmNy04MDkwLWQ5MzMyNDQ3YWU0OSIsIm1lZXRpbmdJZCI6ImJiYjlkZmI4LWNlODItNDNiOS1iYjk3LWQyYjVhZjRmMmIxZCIsInBhcnRpY2lwYW50SWQiOiJhYWExM2M3YS0xMDQ0LTRkMGItYWUxMy01MzZjNDNiZmQ3YTgiLCJwcmVzZXRJZCI6ImJkM2M0NWE4LTYyOTMtNDgyNC1iMzY2LTIyM2RkMzgwMWU5NCIsImlhdCI6MTcyMjIyNzcyNCwiZXhwIjoxNzMwODY3NzI0fQ.Dx49uzvss-u5mbFbbg9UJ5ju6bdUXXRtIN50IqsUYoyxJStSAZ6i4HAyW4lKzajteA-mJduN-tamSIpDpMAHCnQbqLm4rJ8F-K7Ac0TAGkSVpisRAyMqVJzKAFTxA-jmg1LG_J4X9-2_UFBm974MjuWsrUDD40WxyINMW92e_v0',
        defaults: {
          audio: false,
          video: false,
        },
        baseURI: 'devel.dyte.io',
        modules: {devTools: {logs: true}}
      });

      // Add middleware
      if(meeting){
        console.log('Adding middleware');
        await meeting.self.setVideoMiddlewareGlobalConfig({disablePerFrameCanvasRendering: true});
        console.log('Find me to change pipeline to canvas2dCpu');
        var transformer = await DyteVideoBackgroundTransformer.init({ meeting, segmentationConfig: {
          model: 'mlkit', // could be 'meet' | 'bodyPix' - BodyPix is useless.
          backend: 'wasmSimd',
          inputResolution: '256x256', // '256x144' for meet
          pipeline: 'webgl2', // canvas2dCpu webgl2
          targetFps: 65, // 60 introduces fps drop and unstable fps on Chrome
          deferInputResizing: true,
        }, });
        // await meeting.self.addVideoMiddleware(await transformer.createStaticBackgroundVideoMiddleware('https://assets.dyte.io/backgrounds/bg_3.jpg'));
        console.log('Find me to enable static background middleware');
        await meeting.self.addVideoMiddleware(await transformer.createBackgroundBlurVideoMiddleware(50));
      }

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
