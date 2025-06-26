import { useEffect } from 'react';
import {
  RealtimeKitProvider,
  useRealtimeKitClient,
} from '@cloudflare/realtimekit-react';
import {
  RtkMeeting,
  RtkUiProvider,
  provideRtkDesignSystem,
} from '@cloudflare/realtimekit-react-ui';

export function Meeting(
    { authToken, showSetupScreen, baseURI, meetingIdentifier }: { authToken: string, showSetupScreen?: boolean, baseURI?: string, meetingIdentifier: string }
) {
  const [meeting, initMeeting] = useRealtimeKitClient();

  useEffect(() => {
    console.log(`${meetingIdentifier}'s meeting object updated to a new value. PeerId: ${meeting?.self.peerId}`);
  }, [meeting]);

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
      baseURI,
    })
    /*.then((m) => m?.joinRoom())*/;
  }, [initMeeting, authToken]);

  console.log('Re-rendering', meetingIdentifier);
  (window as any).meetings[meetingIdentifier] = meeting;

  return (
    <div className="flex flex-col w-full h-full">
        <RealtimeKitProvider value={meeting}>
            <RtkMeeting 
              className="relative" 
              showSetupScreen={showSetupScreen} 
              meeting={meeting} 
            />
        </RealtimeKitProvider>
    </div>
  );
}
