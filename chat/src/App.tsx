import { useEffect } from 'react';
import { useDyteClient } from '@dytesdk/react-web-core';
import {
  DyteChat,
  DyteUiProvider,
  provideDyteDesignSystem,
} from '@dytesdk/react-ui-kit';

function App() {
  const [meeting, initMeeting] = useDyteClient();

  useEffect(() => {
    provideDyteDesignSystem(document.body, {
      theme: 'light',
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
      // NOTE: for debugging
      Object.assign(window, { meeting: m });
    });
  }, []);

  if (!meeting) return <div>"Loading..."</div>;

  return (
    <DyteUiProvider meeting={meeting}>
      <DyteChat />
    </DyteUiProvider>
  );
}

export default App;
