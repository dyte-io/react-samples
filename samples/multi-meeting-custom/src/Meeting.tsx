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
import RealtimeKitVideoBackgroundTransformer from '@cloudflare/realtimekit-virtual-background';
import CustomRtkMeeting from './components/custom-rtk-meeting';
import { getStatesStore, cleanupStores } from './store';

export function Meeting(
    { authToken, baseURI, meetingIdentifier }: { authToken: string, baseURI?: string, meetingIdentifier: string }
) {

  const [meeting, initMeeting] = useRealtimeKitClient();
  
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
    const setupVirtualBackground = async () => {
      if (!meeting) return;
      
      // Disable per frame rendering for better performance
      await meeting.self.setVideoMiddlewareGlobalConfig({ disablePerFrameCanvasRendering: true });
      
      // Initialize the video background transformer
      const videoBackgroundTransformer = await RealtimeKitVideoBackgroundTransformer.init({ meeting });
      
      // Add background blur middleware (50% blur strength)
      // const blurMiddleware = await videoBackgroundTransformer.createBackgroundBlurVideoMiddleware(50);
      // meeting.self.addVideoMiddleware(blurMiddleware);

      meeting.self.addVideoMiddleware(
        await videoBackgroundTransformer.createStaticBackgroundVideoMiddleware(`https://images.unsplash.com/photo-1487088678257-3a541e6e3922?q=80&w=2874&auto=format&fit=crop&ixlib=rb-4.0.3`)
      );
    };

    setupVirtualBackground();
  }, [meeting]);

  useEffect(() => {

    if (!initMeeting || !authToken) {
      console.log(`[${meetingIdentifier}] Missing initMeeting or authToken`);
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
      ...(baseURI && { baseURI }),
    })
    .then((m) => {
      console.log(`[${meetingIdentifier}] Meeting initialized`);
    })
    .catch((error) => {
      console.error(`[${meetingIdentifier}] Error initializing meeting:`, error);
    });
  }, [initMeeting, authToken, baseURI, meetingIdentifier]);



  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
        <RealtimeKitProvider value={meeting}>
            <RtkUiProvider
                meeting={meeting}
                showSetupScreen
                style={{ height: '100%', width: '100%', display: 'block', overflow: 'hidden' }}
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
                }} >
                      <CustomRtkMeeting meetingIdentifier={meetingIdentifier} states={states} />
                      <RtkDialogManager/>
            </RtkUiProvider>
        </RealtimeKitProvider>
    </div>
  );
}
