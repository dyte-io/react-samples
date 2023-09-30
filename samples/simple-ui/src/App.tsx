import { useEffect, useReducer } from 'react';
import {
  DyteProvider,
  useDyteClient,
  useDyteMeeting,
  useDyteSelector,
} from '@dytesdk/react-web-core';
import {
  DyteCameraToggle,
  DyteChatToggle,
  DyteGrid,
  DyteLogo,
  DyteMeetingTitle,
  DyteMicToggle,
  DytePollsToggle,
  DyteScreenShareToggle,
  DyteSetupScreen,
  DyteSidebar,
  DyteSpinner,
  defaultConfig,
  provideDyteDesignSystem,
} from '@dytesdk/react-ui-kit';

const config = { ...defaultConfig };

if (config.root) {
  config.root['dyte-participant-tile'] = (
    config.root['dyte-participant-tile'] as any
  ).children;
}

function Meeting() {
  const { meeting } = useDyteMeeting();
  const roomJoined = useDyteSelector((m) => m.self.roomJoined);

  const [states, updateStates] = useReducer(
    (state: any, payload: any) => ({
      ...state,
      ...payload,
    }),
    { meeting: 'joined', activeSidebar: false },
  );

  if (!meeting) {
    return <DyteSpinner />;
  }

  if (!roomJoined) {
    return <DyteSetupScreen meeting={meeting} />;
  }

  return (
    <div
      className="flex flex-col w-full h-full"
      ref={(el) => {
        el?.addEventListener('dyteStateUpdate', (e: any) => {
          updateStates(e.detail);
        });
      }}
    >
      <header className="flex items-center gap-3 h-12 border-b w-full px-2 text-sm">
        <DyteLogo meeting={meeting} />
        <DyteMeetingTitle meeting={meeting} />
      </header>

      <main className="flex flex-1 p-2">
        <DyteGrid meeting={meeting} config={config} />
        {states.activeSidebar && <DyteSidebar meeting={meeting} states={states} />}
      </main>

      <footer className="p-2 flex place-items-center justify-center">
        <DyteMicToggle meeting={meeting} />
        <DyteCameraToggle meeting={meeting} />
        <DyteScreenShareToggle meeting={meeting} />
        <DyteChatToggle meeting={meeting} />
        <DytePollsToggle meeting={meeting} />
      </footer>
    </div>
  );
}

function App() {
  const [meeting, initMeeting] = useDyteClient();

  useEffect(() => {
    const searchParams = new URL(window.location.href).searchParams;

    const authToken = searchParams.get('authToken');

    if (!authToken) {
      alert(
        "An authToken wasn't passed, please pass an authToken in the URL query to join a meeting.",
      );
      return;
    }

    provideDyteDesignSystem(document.body, {
      theme: 'light',
    });

    initMeeting({
      authToken,
      defaults: {
        audio: false,
        video: false,
      },
    }).then((m) => m?.joinRoom());
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
