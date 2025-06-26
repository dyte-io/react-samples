import { useEffect, useMemo } from 'react';
import {
  RealtimeKitProvider,
  useRealtimeKitClient,
} from '@cloudflare/realtimekit-react';
import {
  RtkDialogManager,
  RtkUiProvider,
  provideRtkDesignSystem,
} from '@cloudflare/realtimekit-react-ui';
import CustomRtkMeeting from './components/custom-rtk-meeting';
import { getStatesStore, cleanupStores } from './store';

export function Meeting(
    { authToken, baseURI, meetingIdentifier }: { authToken: string, baseURI?: string, meetingIdentifier: string }
) {
  console.log(`[${meetingIdentifier}] Meeting component initializing`);
  const [meeting, initMeeting] = useRealtimeKitClient();
  
  // Create isolated store for this meeting instance
  const statesStore = useMemo(() => {
    console.log(`[${meetingIdentifier}] Creating isolated Zustand store`);
    return getStatesStore(meetingIdentifier);
  }, [meetingIdentifier]);
  
  const setStates = statesStore((s) => s.setStates);
  const states = statesStore((s) => s.states);

  useEffect(() => {
    console.log(`[${meetingIdentifier}] Meeting object updated. PeerId: ${meeting?.self?.peerId}, ID: ${meeting?.self?.id}`);
  }, [meeting, meetingIdentifier]);

  // Cleanup store when component unmounts
  useEffect(() => {
    console.log(`[${meetingIdentifier}] Setting up cleanup effect`);
    return () => {
      console.log(`[${meetingIdentifier}] Cleaning up stores`);
      cleanupStores(meetingIdentifier);
    };
  }, [meetingIdentifier]);

  useEffect(() => {
    console.log(`[${meetingIdentifier}] Initializing RealtimeKit client`);
    if (!initMeeting || !authToken) {
      console.log(`[${meetingIdentifier}] Missing initMeeting or authToken`);
      return;
    }

    initMeeting({
      authToken,
      defaults: {
        audio: false,
        video: false,
      },
      ...(baseURI && { baseURI }),
    })
    .then((m) => {
      console.log(`[${meetingIdentifier}] RealtimeKit client initialized successfully`, m?.self?.id);
    })
    .catch((error) => {
      console.error(`[${meetingIdentifier}] RealtimeKit client initialization failed:`, error);
    });
  }, [initMeeting, authToken, baseURI, meetingIdentifier]);

  console.log(`[${meetingIdentifier}] Re-rendering Meeting component. Meeting ready: ${!!meeting?.self?.id}`);
  (window as any).meetings = (window as any).meetings || {};
  (window as any).meetings[meetingIdentifier] = meeting;

  console.log(`CUSTOM-RTK-MEETING Rerendering Meetings.tsx for ${meetingIdentifier}`)
  return (
    <div className="flex flex-col w-full h-full">
        <RealtimeKitProvider value={meeting}>
            <RtkUiProvider
                meeting={meeting}
                showSetupScreen
                style={{ height: '100%', width: '100%', display: 'block' }}
                onRtkStatesUpdate={(e) => {
                    console.log(`[CUSTOM-RTK-MEETING]: ${meetingIdentifier} Got RTK state update event:`, e.detail);
                    setStates(e.detail);
                    e.stopPropagation();
                  }}
                ref={(el) => {
                  // Listen for scoped state update events to prevent cross-meeting contamination
                  if (el && meeting?.self?.id) {
                    const scopedEventName = `rtkStatesUpdate-${meeting.self.id}`;
                    console.log(`[${meetingIdentifier}] Setting up scoped event listener: ${scopedEventName}`);
                    
                    const handleScopedStateUpdate = (e: CustomEvent) => {
                      console.log(`[CUSTOM-RTK-MEETING]: ${meetingIdentifier} Got SCOPED RTK state update event:`, e.detail);
                      setStates(e.detail);
                      e.stopPropagation();
                    };
                    
                    // Remove existing listener if any
                    el.removeEventListener(scopedEventName, handleScopedStateUpdate as any);
                    // Add new scoped listener
                    el.addEventListener(scopedEventName, handleScopedStateUpdate as any);
                  }
                }} >
                <CustomRtkMeeting meetingIdentifier={meetingIdentifier} states={states} />
                <RtkDialogManager />
            </RtkUiProvider>
        </RealtimeKitProvider>
    </div>
  );
}
