import { useEffect } from 'react';
import { DyteProvider, useDyteClient } from '@dytesdk/react-web-core';
import Meeting from './components/Meeting';
import { DyteSpinner, provideDyteDesignSystem } from '@dytesdk/react-ui-kit';

function App() {
  const [meeting, initMeeting] = useDyteClient();

  useEffect(() => {
    provideDyteDesignSystem(document.body, {
      theme: 'light',
    });

    const searchParams = new URL(window.location.href).searchParams;

    const authToken = searchParams.get('authToken');

    // pass an empty string when using v2 meetings
    // for v1 meetings, you would need to pass the correct roomName here
    const roomName = searchParams.get('roomName') || '';

    if (!authToken) {
      alert(
        "An authToken wasn't passed, please pass an authToken in the URL query to join a meeting."
      );
      return;
    }

    initMeeting({
      authToken,
      roomName,
      // apiBase: 'https://api.staging.dyte.in',
      defaults: {
        video: false,
        audio: false,
      },
    }).then((m) => {
      Object.assign(window, { meeting: m });

      if (!window.location.search.includes('showSetupScreen')) {
        m?.joinRoom();
      }
    });
  }, []);

  console.log({ meeting });

  return (
    <div className="w-full max-w-lg mx-auto h-full bg-gray-100">
      <DyteProvider
        value={meeting}
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <DyteSpinner className="my-12 mx-auto text-blue-500" size="lg" />
          </div>
        }
      >
        <Meeting />
      </DyteProvider>
    </div>
  );
}

export default App;
