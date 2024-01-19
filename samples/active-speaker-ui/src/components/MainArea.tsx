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

type ActiveTab =
  | { type: 'plugin'; plugin: DytePlugin }
  | { type: 'screenshare'; participant: DyteParticipant | DyteSelf };

function ActiveSpeakerView({
  screenshares,
  plugins,
}: {
  screenshares: (DyteParticipant | DyteSelf)[];
  plugins: DytePlugin[];
}) {
  const { meeting } = useDyteMeeting();

  const [selectedTab, setSelectedTab] = useState<ActiveTab>();
  const pluginsRef = useRef<DytePlugin[]>([]);
  const screensharesRef = useRef<(DyteParticipant | DyteSelf)[]>([]);

  const showTabBar = screenshares.length + plugins.length > 1;

  const size = useMeetingStore((s) => s.size);
  const isImmersiveMode = useMeetingStore((s) => s.isImmersiveMode);
  const [states, setStates] = useMeetingStore((s) => [s.states, s.setStates]);

  const activeTab = useDyteSelector((m) => m.meta.selfActiveTab);

  useEffect(() => {
    if (activeTab) {
      if (activeTab.type === 'plugin') {
        const plugin = meeting.plugins.active.get(activeTab.id);

        if (plugin) {
          setSelectedTab({
            type: 'plugin',
            plugin,
          });
        }
      } else {
        const participant = meeting.participants.joined.get(activeTab.id);

        if (participant) {
          setSelectedTab({
            type: 'screenshare',
            participant,
          });
        }
      }
    }
  }, [activeTab]);

  const onFallback = () => {
    if (screenshares.length > 0) {
      setSelectedTab({ type: 'screenshare', participant: screenshares[0] });
    } else if (plugins.length > 0) {
      setSelectedTab({ type: 'plugin', plugin: plugins[0] });
    }
  };

  useEffect(() => {
    if (screenshares.length > screensharesRef.current.length) {
      setActiveTab({
        type: 'screenshare',
        participant: screenshares.at(-1)!,
      });
    }
    screensharesRef.current = screenshares;
  }, [screenshares]);

  useEffect(() => {
    if (plugins.length > pluginsRef.current.length) {
      setActiveTab({
        type: 'plugin',
        plugin: plugins.at(-1)!,
      });
    }
    pluginsRef.current = plugins;
  }, [plugins]);

  useEffect(() => {
    if (selectedTab) return;
    onFallback();
  }, [selectedTab]);

  useEffect(() => {
    if (!selectedTab) return;

    if (
      selectedTab.type === 'screenshare' &&
      !screenshares.find((s) => s.id === selectedTab.participant.id)
    ) {
      onFallback();
    }

    if (
      selectedTab.type === 'plugin' &&
      !plugins.find((p) => p.id === selectedTab.plugin.id)
    ) {
      onFallback();
    }
  }, [screenshares, plugins]);

  const setActiveTab = (tab: ActiveTab) => {
    if (meeting.self.permissions.canSpotlight) {
      meeting.meta.setSelfActiveTab(
        {
          type: tab.type,
          id: tab.type === 'plugin' ? tab.plugin.id : tab.participant.id,
        },
        0
      );
    }
    setSelectedTab(tab);
  };

  return (
    <div className="size-full flex flex-col gap-2">
      {showTabBar && (
        <div className="h-12 flex items-center text-xs overflow-x-auto max-w-full w-full">
          {/* TODO: handle overflow */}
          <div className="flex items-center gap-1.5">
            {screenshares.map((participant) => (
              <button
                className={clsx(
                  'h-11 flex items-center justify-center gap-1.5 p-2 rounded-lg',
                  selectedTab?.type === 'screenshare' &&
                    selectedTab.participant.id === participant.id
                    ? 'bg-blue-600'
                    : 'bg-zinc-800'
                )}
                key={participant.id}
                onClick={() =>
                  setActiveTab({ type: 'screenshare', participant })
                }
              >
                <DyteIcon icon={defaultIconPack.share_screen_person} />
                <span>{participant.name}</span>
              </button>
            ))}

            {plugins.map((plugin) => (
              <button
                className={clsx(
                  'h-11 flex items-center justify-center gap-1.5 p-2 rounded-lg',
                  selectedTab?.type === 'plugin' &&
                    selectedTab.plugin.id === plugin.id
                    ? 'bg-blue-600'
                    : 'bg-zinc-800'
                )}
                key={plugin.id}
                onClick={() => setActiveTab({ type: 'plugin', plugin })}
              >
                <img className="h-7 w-7 rounded-md" src={plugin.picture} />
                <span>{plugin.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedTab?.type === 'screenshare' &&
        'audioEnabled' in selectedTab.participant && (
          <DyteScreenshareView
            meeting={meeting}
            participant={selectedTab.participant}
            className="flex-1"
          >
            <DyteNameTag
              participant={selectedTab.participant}
              meeting={meeting}
              isScreenShare
            >
              <DyteAudioVisualizer
                participant={selectedTab.participant}
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
            selectedTab?.type === 'plugin' &&
              selectedTab.plugin.id === plugin.id
              ? 'block'
              : 'hidden'
          )}
          key={plugin.id}
        >
          <DytePluginMain meeting={meeting} plugin={plugin} />

          {states.activeSidebar && (
            <DyteButton
              size={size}
              variant="secondary"
              kind="icon"
              className="absolute bottom-3 right-3 z-40"
              onClick={() => {
                setStates({ activeSidebar: false, sidebar: undefined });
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
          )}
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
