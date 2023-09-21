import { useEffect } from 'react';
import { DyteProvider, useDyteClient } from '@dytesdk/react-web-core';
import Facetime from './components/Facetime';

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
        video: false,
        audio: false,
      },
    }).then((m) => m?.joinRoom());
  }, []);

  Object.assign(window, { meeting });

  // By default this component will cover the entire viewport.
  // To avoid that and to make it fill a parent container, pass the prop:
  // `mode="fill"` to the component.
  return (
    <DyteProvider value={meeting} fallback={<div>Loading...</div>}>
      <Facetime />
    </DyteProvider>
  );
}

export default App;
