import {
  DyteBreakoutRoomsToggle,
  DyteCameraToggle,
  DyteChatToggle,
  DyteControlbar,
  DyteControlbarButton,
  DyteFullscreenToggle,
  DyteLeaveButton,
  DyteMicToggle,
  DyteMoreToggle,
  DyteMuteAllButton,
  DyteParticipantsToggle,
  DytePipToggle,
  DytePluginsToggle,
  DytePoll,
  DytePollsToggle,
  DyteRecordingToggle,
  DyteScreenShareToggle,
  DyteSettingsToggle,
  DyteStageToggle,
} from '@dytesdk/react-ui-kit';
import { defaultIconPack } from '@dytesdk/ui-kit';
import { useStatesStore } from '../store';

function ControlBarPreBuilt() {
  return (
    <DyteControlbar className="flex w-full overflow-visible	justify-between" />
  );
}

function ControlBarWithCustomUI() {
  const fullScreenTargetElement = document.querySelector(
    '#root',
  ) as HTMLElement;

  const states = useStatesStore((s) => s.states);

  return (
    <div className="flex w-full py-2 px-3 text-white justify-between">
      <div
        id="controlbar-left"
        className="flex items-center overflow-visible justify-center"
      >
        <DyteFullscreenToggle targetElement={fullScreenTargetElement} />
        <DyteSettingsToggle />
        <DyteScreenShareToggle />
      </div>
      <div
        id="controlbar-center"
        className="flex items-center overflow-visible justify-center"
      >
        <DyteMicToggle />
        <DyteCameraToggle />
        <DyteStageToggle />
        <DyteLeaveButton />
        <DyteMoreToggle>
          <div slot="more-elements">
            <DytePipToggle variant="horizontal" />
            <DyteMuteAllButton variant="horizontal" />
            <DyteBreakoutRoomsToggle variant="horizontal" />
            <DyteRecordingToggle variant="horizontal" />
          </div>
        </DyteMoreToggle>
      </div>
      <div
        id="controlbar-right"
        className="flex items-center overflow-visible justify-center"
      >
        <DyteChatToggle />
        <DytePollsToggle />
        <DyteParticipantsToggle />
        <DytePluginsToggle />
        <DyteControlbarButton
          icon={defaultIconPack.add}
          label="Open Custom Sidebar"
          onClick={(e) => {
            console.log(states.activeSidebar);
            e.currentTarget.dispatchEvent(
              new CustomEvent('dyteStateUpdate', {
                detail: {
                  activeSidebar:
                    (states.sidebar as any) !== 'warnings'
                      ? true
                      : !states.activeSidebar,
                  sidebar: 'warnings',
                },
                bubbles: true,
                composed: true,
              }),
            );
          }}
        />
      </div>
    </div>
  );
}

// export default ControlBarPreBuilt; // uncomment if you are fine with prebuilt control bar
export default ControlBarWithCustomUI; // uncomment if you want to create a custom control bar
