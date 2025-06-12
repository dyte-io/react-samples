import { useEffect, useReducer } from 'react';
import {
  RealtimeKitProvider,
  useRealtimeKitClient,
  useRealtimeKitMeeting,
  useRealtimeKitSelector,
} from '@cloudflare/realtimekit-react';
import {
  RtkCameraToggle,
  RtkChatToggle,
  RtkGrid,
  RtkLogo,
  RtkMeetingTitle,
  RtkMicToggle,
  RtkPollsToggle,
  RtkScreenShareToggle,
  RtkSetupScreen,
  RtkSidebar,
  RtkSpinner,
  defaultConfig,
  provideRtkDesignSystem,
} from '@cloudflare/realtimekit-react-ui';

const config = { ...defaultConfig };

if (config.root) {
  config.root['rtk-participant-tile'] = (
    config.root['rtk-participant-tile'] as any
  ).children;
}

export function Meeting({ authToken }: { authToken: string }) {
  const [meeting, initMeeting] = useRealtimeKitClient();

  useEffect(() => {
    if (!authToken) {
      alert(
        "An authToken wasn't passed, please pass an authToken in the URL query to join a meeting.",
      );
      return;
    }

    provideRtkDesignSystem(document.body, {
      theme: 'light',
    });

    initMeeting({
      authToken,
      defaults: {
        audio: false,
        video: false,
      },
      baseURI: 'devel.dyte.io',
    })
    /*.then((m) => m?.joinRoom())*/;
  }, [initMeeting, authToken]);

  return (
    <RealtimeKitProvider value={meeting}>
      <RtkMeeting />
    </RealtimeKitProvider>
  );
}

export function RtkMeeting() {
  const { meeting } = useRealtimeKitMeeting();
  const roomJoined = useRealtimeKitSelector((m) => m.self.roomJoined);

  const [states, updateStates] = useReducer(
    (state: any, payload: any) => ({
      ...state,
      ...payload,
    }),
    { meeting: 'joined', activeSidebar: false },
  );

  if (!meeting) {
    return <RtkSpinner />;
  }

  if (!roomJoined) {
    return <RtkSetupScreen meeting={meeting} />;
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
        <RtkLogo meeting={meeting} />
        <RtkMeetingTitle meeting={meeting} />
      </header>
      <main className="flex flex-1 p-2">
        <RtkGrid meeting={meeting} config={config} />
        {states.activeSidebar && <RtkSidebar meeting={meeting} states={states} />}
      </main>
      <footer className="p-2 flex place-items-center justify-center">
        <RtkMicToggle meeting={meeting} />
        <RtkCameraToggle meeting={meeting} />
        <RtkScreenShareToggle meeting={meeting} />
        <RtkChatToggle meeting={meeting} />
        <RtkPollsToggle meeting={meeting} />
      </footer>
    </div>
  );
}