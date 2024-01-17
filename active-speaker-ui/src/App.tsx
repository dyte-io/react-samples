import Meeting from './components/Meeting';
import { DyteProvider, useDyteClient } from '@dytesdk/react-web-core';
import { useEffect } from 'react';

function App() {
  const [meeting, initMeeting] = useDyteClient();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

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
    }).then((meeting) => {
      Object.assign(window, { meeting });
    });
  }, []);

  // By default this component will cover the entire viewport.
  // To avoid that and to make it fill a parent container, pass the prop:
  // `mode="fill"` to the component.
  return (
    <DyteProvider value={meeting}>
      <Meeting />
    </DyteProvider>
  );
}

export default App;
