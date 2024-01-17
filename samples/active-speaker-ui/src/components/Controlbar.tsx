import { useMeetingStore } from '../lib/meeting-store';
import {
  DyteSettingsToggle,
  DyteScreenShareToggle,
  DyteControlbarButton,
  defaultIconPack,
  DyteStageToggle,
  DyteMicToggle,
  DyteCameraToggle,
  DyteLeaveButton,
  DyteParticipantsToggle,
  DytePollsToggle,
  DyteChatToggle,
  DytePluginsToggle,
} from '@dytesdk/react-ui-kit';
import { useDyteMeeting } from '@dytesdk/react-web-core';

export default function Controlbar() {
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
