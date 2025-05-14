import { useEffect } from 'react';
import { RtkMeeting } from '@cloudflare/realtimekit-react-ui';
import { useRealtimeKitClient } from '@cloudflare/realtimekit-react';
import DyteVideoBackgroundTransformer from '@dytesdk/video-background-transformer';

declare global {
  interface Window {
    meeting: any;
  }
}

function App() {
  const [meeting, initMeeting] = useRealtimeKitClient();

  useEffect(() => {
    const searchParams = new URL(window.location.href).searchParams;

    const authToken = searchParams.get('authToken');

    if (!authToken) {
      alert(
        "An authToken wasn't passed, please pass an authToken in the URL query to join a meeting."
      );
      return;
    }

    (
      initMeeting({
        authToken,
      }) as any
    ).then(async (meeting: any) => {
      window.meeting = meeting;

      /**
       * To customise DyteVideoBackgroundTransformer configs, please refer to https://www.npmjs.com/package/@dytesdk/video-background-transformer?activeTab=readme.
       * 
      */
      const videoBackgroundTransformer =
        await DyteVideoBackgroundTransformer.init({
          meeting,
          segmentationConfig: {
            pipeline: 'canvas2dCpu', // 'webgl2' | 'canvas2dCpu'
          },
        });

      // The video-background-transformer provides two functionalities
      // 1. Add background blur
      // 2. Add a background image

      // 1. To add background blur, with strength of 10
      meeting.self.addVideoMiddleware(
        await videoBackgroundTransformer.createBackgroundBlurVideoMiddleware(10)
      );

      // 2. To add a background image
      // meeting.self.addVideoMiddleware(
      //   await videoBackgroundTransformer.createStaticBackgroundVideoMiddleware(
      //     'https://assets.dyte.io/backgrounds/bg-dyte-office.jpg'
      //   )
      // );

      // We have the following set of images for your immediate use:
      // https://assets.dyte.io/backgrounds/bg-dyte-office.jpg
      // https://assets.dyte.io/backgrounds/bg_0.jpg
      // https://assets.dyte.io/backgrounds/bg_1.jpg
      // https://assets.dyte.io/backgrounds/bg_2.jpg
      // https://assets.dyte.io/backgrounds/bg_3.jpg
      // https://assets.dyte.io/backgrounds/bg_4.jpg
      // https://assets.dyte.io/backgrounds/bg_5.jpg
      // https://assets.dyte.io/backgrounds/bg_6.jpg
      // https://assets.dyte.io/backgrounds/bg_7.jpg
    });
  }, []);

  // By default this component will cover the entire viewport.
  // To avoid that and to make it fill a parent container, pass the prop:
  // `mode="fill"` to the component.
  return <RtkMeeting meeting={meeting!} />;
}

export default App;
