import { useEffect, useState, useMemo } from 'react';
import {
  RealtimeKitProvider,
  useRealtimeKitClient,
} from '@cloudflare/realtimekit-react';
import {
  RtkMeeting,
  UIConfig,
  createDefaultConfig,
  provideRtkDesignSystem,
  registerAddons,
} from '@cloudflare/realtimekit-react-ui';

import VideoBackground from '@cloudflare/realtimekit-ui-addons/video-background';
import HandRaise from '@cloudflare/realtimekit-ui-addons/hand-raise';
import ChatHostControl from '@cloudflare/realtimekit-ui-addons/chat-host-control';
import MicHostControl from '@cloudflare/realtimekit-ui-addons/mic-host-control';
import CameraHostControl from '@cloudflare/realtimekit-ui-addons/camera-host-control';

import { getStatesStore, cleanupStores } from './store';

export function Meeting(
    { authToken, showSetupScreen, baseURI, meetingIdentifier }: { authToken: string, showSetupScreen?: boolean, baseURI?: string, meetingIdentifier: string }
) {
  const [meeting, initMeeting] = useRealtimeKitClient();
  const [customConfig, setCustomConfig] = useState<UIConfig | null>(createDefaultConfig());
  
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
        selector: `#${meetingIdentifier}`
      });

      const handRaise = await HandRaise.init({
        meeting,
        canRaiseHand: true,
        canManageRaisedHand: true,
        handRaiseIcon: '<svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M4 12.02c0 1.06.2 2.1.6 3.08l.6 1.42c.22.55.64 1.01 1.17 1.29.27.14.56.21.86.21h2.55c.77 0 1.49-.41 1.87-1.08.5-.87 1.02-1.7 1.72-2.43l1.32-1.39c.44-.46.97-.84 1.49-1.23l.59-.45a.6.6 0 0 0 .23-.47c0-.75-.54-1.57-1.22-1.79a3.34 3.34 0 0 0-2.78.29V4.5a1.5 1.5 0 0 0-2.05-1.4 1.5 1.5 0 0 0-2.9 0A1.5 1.5 0 0 0 6 4.5v.09A1.5 1.5 0 0 0 4 6v6.02ZM8 4.5v4a.5.5 0 0 0 1 0v-5a.5.5 0 0 1 1 0v5a.5.5 0 0 0 1 0v-4a.5.5 0 0 1 1 0v6a.5.5 0 0 0 .85.37h.01c.22-.22.44-.44.72-.58.7-.35 2.22-.57 2.4.5l-.53.4c-.52.4-1.04.78-1.48 1.24l-1.33 1.38c-.75.79-1.31 1.7-1.85 2.63-.21.36-.6.58-1.01.58H7.23a.87.87 0 0 1-.4-.1 1.55 1.55 0 0 1-.71-.78l-.59-1.42a7.09 7.09 0 0 1-.53-2.7V6a.5.5 0 0 1 1 0v3.5a.5.5 0 0 0 1 0v-5a.5.5 0 0 1 1 0Z" fill="#ff0000"></path></svg>'
    });
    
    const chatHostControl = await ChatHostControl.init({
        meeting,
        hostPresets: ['group_call_host', 'webinar_presenter'],
        targetPresets: ['group_call_host', 'group_call_participant', 'webinar_presenter', 'webinar_viewer'],
        addActionInParticipantMenu: true,
    });
    
    const micHostControl = await MicHostControl.init({
        meeting,
        hostPresets: ['group_call_host', 'webinar_presenter'],
        targetPresets: ['group_call_host', 'group_call_participant', 'webinar_presenter', 'webinar_viewer'],
        addActionInParticipantMenu: true,
    });
    
    const cameraHostControl = await CameraHostControl.init({
        meeting,
        hostPresets: ['group_call_host', 'webinar_presenter'],
        targetPresets: ['group_call_host', 'group_call_participant', 'webinar_presenter', 'webinar_viewer'],
        addActionInParticipantMenu: true,
    });

    const newConfig = registerAddons([videoBackground, handRaise, chatHostControl, micHostControl, cameraHostControl], meeting!);
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
