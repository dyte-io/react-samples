import { useMeetingStore } from '../lib/meeting-store';
import {
  DyteAudioVisualizer,
  DyteCameraToggle,
  DyteChat,
  DyteChatToggle,
  DyteControlbarButton,
  DyteDialogManager,
  DyteEndedScreen,
  DyteIcon,
  DyteLeaveButton,
  DyteMicToggle,
  DyteNameTag,
  DyteParticipantTile,
  DyteParticipants,
  DyteParticipantsAudio,
  DyteParticipantsToggle,
  DytePipToggle,
  DytePluginMain,
  DytePlugins,
  DytePluginsToggle,
  DytePolls,
  DytePollsToggle,
  DyteScreenShareToggle,
  DyteScreenshareView,
  DyteSettingsToggle,
  DyteSetupScreen,
  DyteSimpleGrid,
  DyteStageToggle,
  DyteWaitingScreen,
  defaultIconPack,
} from '@dytesdk/react-ui-kit';
import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core';
import { type States } from '@dytesdk/ui-kit';
import type { DyteParticipant, DytePlugin, DyteSelf } from '@dytesdk/web-core';
import clsx from 'clsx';
import { useEffect, useMemo, useRef, useState } from 'react';

function ActiveSpeakerView({
  screenshares,
  plugins,
}: {
  screenshares: (DyteParticipant | DyteSelf)[];
  plugins: DytePlugin[];
}) {
  const { meeting } = useDyteMeeting();

  const [selectedTab, setSelectedTab] = useState<
    DyteParticipant | DyteSelf | DytePlugin
  >();

  const { size, setIsImmersiveMode } = useMeetingStore(
    ({ size, setIsImmersiveMode }) => ({ size, setIsImmersiveMode })
  );

  const showTabBar = screenshares.length + plugins.length > 1;

  const onFallback = () => {
    if (screenshares.length > 0) {
      setSelectedTab(screenshares.at(0));
    } else if (plugins.length > 0) {
      setSelectedTab(plugins.at(0));
    }
  };

  useEffect(() => {
    if (selectedTab) return;
    onFallback();
  }, [selectedTab]);

  useEffect(() => {
    if (!selectedTab) return;

    if (
      !screenshares.find((s) => selectedTab.id === s.id) ||
      !plugins.find((p) => selectedTab.id === p.id)
    ) {
      onFallback();
    }
  }, [screenshares, plugins]);

  return (
    <div className="size-full flex flex-col gap-2">
      {showTabBar && (
        <div className="h-12 flex items-center text-xs overflow-x-auto max-w-full w-full">
          {/* TODO: handle overflow */}
          <div className="flex items-center gap-1.5">
            {screenshares.map((participant) => (
              <button
                className={clsx(
                  'h-11 flex items-center justify-center gap-1.5 bg-zinc-800 p-2 rounded-lg',
                  selectedTab?.id === participant.id && 'bg-blue-600'
                )}
                key={participant.id}
                onClick={() => setSelectedTab(participant)}
              >
                <DyteIcon icon={defaultIconPack.share_screen_person} />
                <span>{participant.name}</span>
              </button>
            ))}

            {plugins.map((plugin) => (
              <button
                className={clsx(
                  'h-11 flex items-center justify-center gap-1.5 bg-zinc-800 p-2 rounded-lg',
                  selectedTab?.id === plugin.id && 'bg-blue-600'
                )}
                key={plugin.id}
                onClick={() => setSelectedTab(plugin)}
              >
                <img className="h-7 w-7 rounded-md" src={plugin.picture} />
                <span>{plugin.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedTab && 'audioEnabled' in selectedTab && (
        <DyteScreenshareView
          meeting={meeting}
          participant={selectedTab}
          className="flex-1"
        >
          <DyteNameTag
            participant={selectedTab}
            meeting={meeting}
            isScreenShare
          >
            <DyteAudioVisualizer
              participant={selectedTab}
              isScreenShare
              slot="start"
            />
          </DyteNameTag>
        </DyteScreenshareView>
      )}

      {plugins.map((plugin) => (
        <div
          className={clsx(
            'flex-1 relative isolate',
            selectedTab?.id === plugin.id ? 'block' : 'hidden'
          )}
        >
          <DytePluginMain meeting={meeting} plugin={plugin} key={plugin.id} />
          {/* <DyteButton
            size={size}
            variant="secondary"
            kind="icon"
            className="absolute bottom-3 right-3 z-10"
            onClick={() => {
              setIsImmersiveMode(true);
            }}
          >
            <DyteIcon icon={defaultIconPack.full_screen_maximize} />
          </DyteButton> */}
        </div>
      ))}
    </div>
  );
}

function MainArea() {
  const { meeting } = useDyteMeeting();
  const screenShareEnabled = useDyteSelector((m) => m.self.screenShareEnabled);
  const stageStatus = useDyteSelector((m) => m.stage.status);

  const activeParticipants = useDyteSelector((m) =>
    m.participants.active.toArray()
  );

  const participants =
    stageStatus === 'ON_STAGE'
      ? [...activeParticipants, meeting.self]
      : activeParticipants;

  const activePlugins = useDyteSelector((m) => m.plugins.active.toArray());

  const joinedParticipants = useDyteSelector((m) =>
    m.participants.joined.toArray()
  );

  const activeScreenShares = joinedParticipants.filter(
    (p) => p.screenShareEnabled
  );

  const screenshares = screenShareEnabled
    ? [...activeScreenShares, meeting.self]
    : activeScreenShares;

  const isActiveView = activeScreenShares.length + activePlugins.length > 0;

  const setActiveMode = useMeetingStore((s) => s.setIsActiveSpeakerMode);

  useEffect(() => {
    setActiveMode(isActiveView);
  }, [isActiveView]);

  return (
    <div className="flex flex-col w-full h-full max-w-full">
      {isActiveView ? (
        <ActiveSpeakerView
          screenshares={screenshares}
          plugins={activePlugins}
        />
      ) : (
        <DyteSimpleGrid participants={participants} meeting={meeting} />
      )}
    </div>
  );
}

function Sidebar() {
  const { meeting } = useDyteMeeting();
  const stageStatus = useDyteSelector((m) => m.stage.status);

  const lastActiveSpeaker = useDyteSelector(
    (m) => m.participants.lastActiveSpeaker
  );

  const pinnedParticipant = useDyteSelector((m) =>
    m.participants.pinned.toArray().at(0)
  );

  const activeSpeaker =
    pinnedParticipant ?? meeting.participants.joined.get(lastActiveSpeaker);

  let sidebar: JSX.Element;

  const { states, isImmersiveMode, size, isMobile, isActiveSpeakerMode } =
    useMeetingStore(
      ({ states, isImmersiveMode, size, isMobile, isActiveSpeakerMode }) => ({
        states,
        isImmersiveMode,
        size,
        isMobile,
        isActiveSpeakerMode,
      })
    );

  switch (states.sidebar) {
    case 'participants':
      sidebar = <DyteParticipants meeting={meeting} />;
      break;
    case 'plugins':
      sidebar = <DytePlugins meeting={meeting} />;
      break;
    case 'polls':
      sidebar = <DytePolls meeting={meeting} />;
      break;
    default:
      sidebar = <DyteChat meeting={meeting} />;
      break;
  }

  return (
    <div className="size-full flex flex-col gap-2">
      {activeSpeaker && isActiveSpeakerMode && (
        <DyteParticipantTile
          participant={activeSpeaker}
          className={clsx(
            'aspect-video h-auto',
            isImmersiveMode || isMobile
              ? 'absolute bottom-3 left-3 w-1/3 z-50'
              : 'w-full'
          )}
          size={size}
          states={states}
        />
      )}

      <div className="flex-1 rounded-lg overflow-clip bg-zinc-900">
        {sidebar}
      </div>
    </div>
  );
}

function Controlbar() {
  const { meeting } = useDyteMeeting();
  const size = useMeetingStore((s) => s.size);
  const [isImmersiveMode, toggleImmersiveMode] = useMeetingStore((s) => [
    s.isImmersiveMode,
    s.toggleImmersiveMode,
  ]);

  const buttonSize = size === 'lg' ? 'lg' : 'sm';

  return (
    <>
      <div className="flex flex-col lg:flex-row items-center">
        <DyteSettingsToggle size={buttonSize} />
        <DyteScreenShareToggle meeting={meeting} size={buttonSize} />
        <div>
          <DyteControlbarButton
            icon={
              isImmersiveMode
                ? defaultIconPack.full_screen_minimize
                : defaultIconPack.full_screen_maximize
            }
            label="Immersive Mode"
            onClick={() => toggleImmersiveMode()}
            size={buttonSize}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center">
        <DyteStageToggle meeting={meeting} size={buttonSize} />
        <DyteMicToggle meeting={meeting} size={buttonSize} />
        <DyteCameraToggle meeting={meeting} size={buttonSize} />
        <DyteLeaveButton size={buttonSize} />
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-end">
        <DyteParticipantsToggle meeting={meeting} size={buttonSize} />
        <DytePollsToggle meeting={meeting} size={buttonSize} />
        <DyteChatToggle meeting={meeting} size={buttonSize} />
        <DytePluginsToggle meeting={meeting} size={buttonSize} />
      </div>
    </>
  );
}

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
  const states = useMeetingStore(s => s.states);

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
