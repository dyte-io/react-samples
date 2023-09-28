import { useEffect } from 'react';
import { DyteProvider, useDyteClient } from '@dytesdk/react-web-core';
import Meeting from './components/Meeting';
import { provideDyteDesignSystem } from '@dytesdk/react-ui-kit';

function App() {
  const [meeting, initMeeting] = useDyteClient();

  useEffect(() => {
    provideDyteDesignSystem(document.body, {
      theme: 'light'
    });

    const searchParams = new URL(window.location.href).searchParams;

    const authToken = searchParams.get('authToken');

    if (!authToken) {
      alert(
        "An authToken wasn't passed, please pass an authToken in the URL query to join a meeting."
      );
      return;
    }

    initMeeting({
      authToken,
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

  return (
    <div className="w-full max-w-lg mx-auto h-full bg-gray-100">
      <DyteProvider value={meeting} fallback={<div>loading...</div>}>
        <Meeting />
      </DyteProvider>
    </div>
  );
}

export default App;
