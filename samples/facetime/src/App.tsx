import Facetime from './components/Facetime';
import {
  RealtimeKitProvider,
  useRealtimeKitClient,
} from '@cloudflare/realtimekit-react';
import { useEffect } from 'react';

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
    const baseURI = searchParams.get('baseURI') ?? 'realtime.cloudflare.com';

    initMeeting({
      authToken,
      defaults: {
        video: false,
        audio: false,
      },
      baseURI,
    }).then((m) => m?.joinRoom());
  }, []);

  Object.assign(window, { meeting });

  console.log(meeting?.self.waitlistStatus);

  // By default this component will cover the entire viewport.
  // To avoid that and to make it fill a parent container, pass the prop:
  // `mode="fill"` to the component.
  return (
    <RealtimeKitProvider
      value={meeting}
      fallback={
        <div className="bg-black text-white text-lg h-full w-full flex items-center justify-center">
          Joining...
        </div>
      }
    >
      <Facetime />
    </RealtimeKitProvider>
  );
}

export default App;
