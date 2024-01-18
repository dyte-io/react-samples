import { useMeetingStore } from '../lib/meeting-store';
import ActiveSpeaker from './ActiveSpeaker';
import {
  DyteIcon,
  defaultIconPack,
  DyteScreenshareView,
  DyteNameTag,
  DyteAudioVisualizer,
  DytePluginMain,
  DyteSimpleGrid,
  DyteButton,
} from '@dytesdk/react-ui-kit';
import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core';
import type { DyteParticipant, DytePlugin, DyteSelf } from '@dytesdk/web-core';
import clsx from 'clsx';
import { useState, useEffect, useRef } from 'react';

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

  const showTabBar = screenshares.length + plugins.length > 1;

  const [isImmersiveMode, toggleImmersiveMode] = useMeetingStore((s) => [
    s.isImmersiveMode,
    s.toggleImmersiveMode,
  ]);

  const size = useMeetingStore((s) => s.size);

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

    const id = selectedTab.id;

    if (
      !screenshares.find((s) => s.id === id) &&
      !plugins.find((p) => p.id === id)
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
          <DyteButton
            size={size}
            variant="secondary"
            kind="icon"
            className="absolute bottom-3 right-3 z-40"
            onClick={() => {
              toggleImmersiveMode();
            }}
          >
            <DyteIcon
              icon={
                isImmersiveMode
                  ? defaultIconPack.full_screen_minimize
                  : defaultIconPack.full_screen_maximize
              }
            />
          </DyteButton>
        </div>
      ))}
    </div>
  );
}

export default function MainArea() {
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

  const isActiveView = screenshares.length + activePlugins.length > 0;

  const setActiveMode = useMeetingStore((s) => s.setIsActiveSpeakerMode);
  const isMobile = useMeetingStore((s) => s.isMobile);

  useEffect(() => {
    setActiveMode(isActiveView);
  }, [isActiveView]);

  return (
    <div className="flex flex-col w-full h-full max-w-full p-2">
      {isActiveView ? (
        <ActiveSpeakerView
          screenshares={screenshares}
          plugins={activePlugins}
        />
      ) : (
        <DyteSimpleGrid participants={participants} meeting={meeting} />
      )}

      {isMobile && (
        <ActiveSpeaker
          className="absolute bottom-3 left-3 w-24 z-50 h-auto aspect-square"
          isSmall
        />
      )}
    </div>
  );
}
