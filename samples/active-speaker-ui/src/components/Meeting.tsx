import { useMeetingStore } from '../lib/meeting-store';
import Controlbar from './Controlbar';
import MainArea from './MainArea';
import Sidebar from './Sidebar';
import {
  DyteDialogManager,
  DyteEndedScreen,
  DyteParticipantsAudio,
  DyteSetupScreen,
  DyteWaitingScreen,
} from '@dytesdk/react-ui-kit';
import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core';
import { type States } from '@dytesdk/ui-kit';
import { useEffect, useRef } from 'react';

function UI() {
  const { meeting } = useDyteMeeting();

  const isImmersiveMode = useMeetingStore((s) => s.isImmersiveMode);

  return (
    <div className="w-full h-full flex lg:flex-col p-2 gap-2 lg:gap-0">
      <div className="flex flex-1 h-full gap-2">
        <main className="flex-[2]">
          <MainArea />
          <DyteParticipantsAudio meeting={meeting} className="" />
        </main>
        {!isImmersiveMode && (
          <aside className="flex-1 lg:flex-auto lg:w-full lg:max-w-sm">
            <Sidebar />
          </aside>
        )}
      </div>

      <div className="grid grid-rows-3 lg:grid-rows-1 lg:grid-cols-3 lg:p-1">
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
    case 'disconnected':
    // TODO: show disconnected screen
    default:
      children = <DyteEndedScreen meeting={meeting} />;
      break;
  }

  return (
    <div className="w-full h-full bg-black" ref={$parent} data-size={size}>
      {children}
      <DyteDialogManager meeting={meeting} states={states} />
    </div>
  );
}
