import { useEffect } from 'react';
import { DyteProvider, useDyteClient } from '@dytesdk/react-web-core';
import AudioRoom from './components/AudioRoom';

function App() {
  const [meeting, initMeeting] = useDyteClient();

  useEffect(() => {
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
        audio: false,
        video: false,
      },
    });
  }, []);

  // By default this component will cover the entire viewport.
  // To avoid that and to make it fill a parent container, pass the prop:
  // `mode="fill"` to the component.
  return (
    <DyteProvider value={meeting} fallback={<></>}>
      <AudioRoom />
    </DyteProvider>
  );
}

export default App;
