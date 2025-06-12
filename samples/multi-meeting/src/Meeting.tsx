import { useEffect, useReducer } from 'react';
import {
  RealtimeKitProvider,
  useRealtimeKitClient,
  useRealtimeKitMeeting,
  useRealtimeKitSelector,
} from '@cloudflare/realtimekit-react';
import {
  RtkMeeting,
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

export function Meeting({ authToken, showSetupScreen }: { authToken: string, showSetupScreen?: boolean }) {
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
        <SimpleMeeting showSetupScreen={showSetupScreen} />
    </RealtimeKitProvider>
  );
}

export function SimpleMeeting({showSetupScreen}: {showSetupScreen?: boolean}) {
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
      <RtkMeeting meeting={meeting} showSetupScreen={!!showSetupScreen}/>
    </div>
  );
}