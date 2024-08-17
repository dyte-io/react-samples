import { useMeetingStore } from '../lib/meeting-store';
import Controlbar from './Controlbar';
import MainArea from './MainArea';
import Sidebar from './Sidebar';
import {
  DyteDialogManager,
  DyteEndedScreen,
  DyteNotifications,
  DyteParticipantsAudio,
  DyteSetupScreen,
  DyteSpinner,
  DyteWaitingScreen,
} from '@dytesdk/react-ui-kit';
import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core';
import { type States } from '@dytesdk/ui-kit';
import { useEffect, useRef } from 'react';

function UI() {
  const { meeting } = useDyteMeeting();

  const isImmersiveMode = useMeetingStore((s) => s.isImmersiveMode);

  return (
    <div className="w-full h-full flex lg:flex-col">
      <div className="flex flex-1 h-full">
        <main className="flex-[2] relative">
          <MainArea />
          <DyteParticipantsAudio meeting={meeting} />
          <DyteNotifications
            meeting={meeting}
            config={{
              config: {
                notification_sounds: {
                  participant_joined: false,
                  participant_left: false,
                  chat: false,
                },
                notifications: {
                  participant_joined: false,
                  participant_left: false,
                  chat: false,
                },
              },
            }}
          />
        </main>

        {!isImmersiveMode && <Sidebar />}
      </div>

      <div className="grid p-2 pl-0 lg:pl-2 grid-rows-3 lg:grid-rows-1 lg:grid-cols-3 lg:pt-0">
        <Controlbar />
      </div>
    </div>
  );
}

export default function Meeting() {
  const $parent = useRef<HTMLDivElement>(null);
  const roomState = useDyteSelector((m) => m.self.roomState);
  const { meeting } = useDyteMeeting();

  const setDimensions = useMeetingStore((s) => s.setDimensions);
  const size = useMeetingStore((s) => s.size);

  const setStates = useMeetingStore((s) => s.setStates);
  const states = useMeetingStore((s) => s.states);

  useEffect(() => {
    const onStateUpdate = (e: CustomEvent<States>) => {
      setStates(e.detail);
    };

    $parent.current!.addEventListener('dyteStateUpdate', onStateUpdate as any);

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });
    observer.observe($parent.current!);
    return () => {
      observer.disconnect();
      $parent.current!.removeEventListener(
        'dyteStateUpdate',
        onStateUpdate as any
      );
    };
  }, []);

  let children: JSX.Element;

  switch (roomState) {
    case 'init':
      children = <DyteSetupScreen meeting={meeting} />;
      break;
    case 'waitlisted':
      children = <DyteWaitingScreen meeting={meeting} />;
      break;
    case 'joined':
      children = <UI />;
      break;
    default:
      children = <DyteEndedScreen meeting={meeting} />;
      break;
  }

  return (
    <div className="w-full h-full bg-black" ref={$parent} data-size={size}>
      {children}
      <DyteDialogManager
        size={size === 'lg' ? 'lg' : 'sm'}
        meeting={meeting}
        states={states}
      />
    </div>
  );
}
