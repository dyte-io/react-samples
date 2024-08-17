import { useMeetingStore } from '../lib/meeting-store';
import ActiveSpeaker from './ActiveSpeaker';
import ScreenShareView from './ScreenShareView';
import {
  DyteIcon,
  DytePluginMain,
  DyteSimpleGrid,
  DyteButton,
} from '@dytesdk/react-ui-kit';
import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core';
import type { DyteParticipant, DytePlugin, DyteSelf } from '@dytesdk/web-core';
import clsx from 'clsx';
import { useState, useEffect, useRef } from 'react';
import HOST_PRESET, { iconPack, saveWhiteboard, WHITEBOARD_ID } from '../lib/const';

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
  const whiteboardPlugin = useDyteSelector(m => m.plugins.active.get(WHITEBOARD_ID)) 
  const [states, setStates] = useMeetingStore((s) => [s.states, s.setStates]);

  const activeTab = useDyteSelector((m) => m.meta.selfActiveTab);
  const isHost = meeting.self.presetName === HOST_PRESET;
  const isDarkMode = useMeetingStore((s) => s.darkMode);

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

  const setConfig = () => {
    const hostId = 
      isHost
      ? meeting.self.id
      : meeting.participants.joined.toArray().find(x => x.presetName === HOST_PRESET)?.id;

    whiteboardPlugin?.sendData({
      eventName: 'config',
      data: {
        eventName: 'config',
        follow: hostId,
        role: isHost ? 'editor' : 'viewer',
        infiniteCanvas: false,
        darkMode: isDarkMode,
        exportMode: 'pdf', 
      }
    })
  }

  // NOTE(ishita1805): Set whiteboard config on launch 
  useEffect(() => {
    if (!whiteboardPlugin) return;
    setConfig();
    whiteboardPlugin.on('ready', setConfig);
    return () => {
      whiteboardPlugin.off('ready', setConfig);
    }
  }, [whiteboardPlugin])

  // NOTE(ishita1805): Update whiteboard config when dark mode is toggled
  useEffect(() => {
    setConfig();
  }, [isDarkMode])

  // NOTE(ishita1805): Save whiteboard before closing
  const closePlugin = async (plugin: DytePlugin) => {
    if (plugin.id === whiteboardPlugin?.id) {
      await saveWhiteboard(whiteboardPlugin);
    }
    plugin.deactivate();
  }
  

  return (
    <div className="size-full flex flex-col gap-2">
      {showTabBar && (
        <div className="h-8 flex items-center text-xs overflow-x-auto max-w-full w-full overflow-y-hidden">
          <div className="flex items-center gap-1.5">
            {screenshares.map((participant) => (
              <button
                className={clsx(
                  'h-8 !min-w-fit flex items-center justify-center gap-1.5 p-1 rounded-sm',
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
                <DyteIcon size='md' icon={iconPack.share_screen_person} />
                <span>{participant.name}</span>
              </button>
            ))}

            {plugins.map((plugin) => (
              <button
                className={clsx(
                  'h-8 flex !min-w-fit  items-center justify-center gap-1.5 p-1 rounded-sm',
                  selectedTab?.type === 'plugin' &&
                    selectedTab.plugin.id === plugin.id
                    ? 'bg-blue-600'
                    : 'bg-zinc-800'
                )}
                key={plugin.id}
                onClick={() => setActiveTab({ type: 'plugin', plugin })}
              >
                <img className="h-6 w-6 rounded-sm" src={plugin.picture} />
                <span>{plugin.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedTab?.type === 'screenshare' &&
        'audioEnabled' in selectedTab.participant && (
          <ScreenShareView participant={selectedTab.participant} />
        )}

      {plugins.map((plugin) => (
        <div
          className={clsx(
            'flex-1 isolate relative',
            selectedTab?.type === 'plugin' &&
              selectedTab.plugin.id === plugin.id
              ? 'block'
              : 'hidden'
          )}
          key={plugin.id}
        >
          <div className={clsx(
            'absolute flex row w-full p-1 px-2 rounded-t-lg text-sm rounded-none bg-zinc-900 overflow-hidden items-center justify-between'
          )}>
            {plugin.name}
            <div className={clsx(
              'cursor-pointer bg-blue-600 rounded-full p-[2px] flex items-center justify-center'
            )} >
            <DyteIcon icon={iconPack.dismiss} size='sm' onClick={() => closePlugin(plugin)} />
            </div>
          </div>
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
              <DyteIcon icon={iconPack.full_screen_maximize} />
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
  const isHost = meeting.self.presetName === HOST_PRESET;
  const isEmptyStage = participants.length === 0;

  useEffect(() => {
    setActiveMode(isActiveView);
  }, [isActiveView]);

  return (
    <div className="flex flex-col w-full h-full max-w-full p-2">
      {isEmptyStage ? (
        <div className="flex box-border h-full content-center items-center justify-center text-center">
            <div className="center">
              {isHost && (
                <div className="flex flex-col items-center">
                  <p className="text-text-lg bg-background-800 text-text-1000 rounded-lg px-8 py-4">
                    The stage is empty
                  </p>
                  <span className="text-text-md my-4">
                    You are off stage.
                  </span>
                </div>
              )}
              {!isHost && (
                <div className="flex flex-col items-center">
                  <p className="text-text-lg bg-background-800 text-text-1000 rounded-lg px-8 py-4">
                    Waiting for the host to join
                  </p>
                </div>
              )}
            </div>
          </div>
      ): isActiveView ? (
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
