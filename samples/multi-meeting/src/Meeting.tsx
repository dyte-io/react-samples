import { useEffect, useState, useMemo } from 'react';
import {
  RealtimeKitProvider,
  useRealtimeKitClient,
} from '@cloudflare/realtimekit-react';
import {
  RtkMeeting,
  UIConfig,
  provideRtkDesignSystem,
  registerAddons,
} from '@cloudflare/realtimekit-react-ui';

import VideoBackground from '@cloudflare/realtimekit-ui-addons/video-background';
import { getStatesStore, cleanupStores } from './store';

export function Meeting(
    { authToken, showSetupScreen, baseURI, meetingIdentifier }: { authToken: string, showSetupScreen?: boolean, baseURI?: string, meetingIdentifier: string }
) {
  const [meeting, initMeeting] = useRealtimeKitClient();
  const [customConfig, setCustomConfig] = useState<UIConfig | null>(null);
  
  // Create peer specific store for this meeting peer instance
  const statesStore = useMemo(() => {
    return getStatesStore(meetingIdentifier);
  }, [meetingIdentifier]);
  
  const setStates = statesStore((s) => s.setStates);
  const states = statesStore((s) => s.states);

  // Cleanup store when component unmounts
  useEffect(() => {
    return () => {
      cleanupStores(meetingIdentifier);
    };
  }, [meetingIdentifier]);

  useEffect(() => {
    async function setupUiKitAddons(){
      if (!meeting) return;
      // Register UI kit addons
      const videoBackground = await VideoBackground.init({
        modes: ["blur", "virtual", "random"],
        blurStrength: 30, // 0 - 100 for opacity
        meeting: meeting!,
        images: [
            "https://images.unsplash.com/photo-1487088678257-3a541e6e3922?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3",
            "https://images.unsplash.com/photo-1496715976403-7e36dc43f17b?q=80&w=2848&auto=format&fit=crop&ixlib=rb-4.0.3",
            "https://images.unsplash.com/photo-1600431521340-491eca880813?q=80&w=2938&auto=format&fit=crop&ixlib=rb-4.0.3"
        ],
        randomCount: 10,
      });

      const newConfig = registerAddons([videoBackground], meeting!);
      setCustomConfig(newConfig);
    } 
    setupUiKitAddons();
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


  (window as any).meetings[meetingIdentifier] = meeting;

  return (
    <div className="flex flex-col w-full h-full">
        <RealtimeKitProvider value={meeting}>
            <RtkMeeting 
              className="relative" 
              showSetupScreen={showSetupScreen} 
              meeting={meeting} 
              config={customConfig!}
              ref={(el) => {
                if (!el) return;
                
                const handleStateUpdate = (e: CustomEvent) => {
                  // Only update states if this event is for our meeting
                  if (!meeting?.self?.id || e.detail?.peerId !== meeting?.self?.id) return;
                  setStates(e.detail);
                };
                
                // Add new listener
                el.addEventListener('rtkStatesUpdate', handleStateUpdate);
                
                // Cleanup listener on unmount
                return () => {
                  el.removeEventListener('rtkStatesUpdate', handleStateUpdate);
                };
              }}
            />
        </RealtimeKitProvider>
    </div>
  );
}
