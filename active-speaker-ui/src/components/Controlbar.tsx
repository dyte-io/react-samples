import { useMeetingStore } from '../lib/meeting-store';
import {
  DyteSettingsToggle,
  DyteScreenShareToggle,
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
  const isMobile = useMeetingStore((s) => s.isMobile);

  const buttonSize = size === 'lg' ? 'lg' : 'sm';

  const isHost = meeting.self.presetName === 'webinar_presenter';

  if (isMobile) {
    return (
      <>
        <div className="flex flex-col lg:flex-row items-center">
          {isHost && (
            <>
              <DyteParticipantsToggle meeting={meeting} size={buttonSize} />
              <DytePluginsToggle meeting={meeting} size={buttonSize} />
            </>
          )}
          <DyteChatToggle meeting={meeting} size={buttonSize} />
          <DytePollsToggle meeting={meeting} size={buttonSize} />
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center">
          <DyteMicToggle meeting={meeting} size={buttonSize} />
          <DyteCameraToggle meeting={meeting} size={buttonSize} />
          <DyteScreenShareToggle meeting={meeting} size={buttonSize} />
        </div>

        <div className="flex flex-col lg:flex-row items-center">
          <DyteStageToggle meeting={meeting} size={buttonSize} />
          <DyteLeaveButton size={buttonSize} />
          <DyteSettingsToggle size={buttonSize} />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row items-center">
        <DyteSettingsToggle size={buttonSize} />
        <DyteScreenShareToggle meeting={meeting} size={buttonSize} />
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center">
        <DyteStageToggle meeting={meeting} size={buttonSize} />
        <DyteMicToggle meeting={meeting} size={buttonSize} />
        <DyteCameraToggle meeting={meeting} size={buttonSize} />
        <DyteLeaveButton size={buttonSize} />
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-end">
        {isHost && (
          <>
            <DyteParticipantsToggle meeting={meeting} size={buttonSize} />
            <DytePluginsToggle meeting={meeting} size={buttonSize} />
          </>
        )}
        <DyteChatToggle meeting={meeting} size={buttonSize} />
        <DytePollsToggle meeting={meeting} size={buttonSize} />
      </div>
    </>
  );
}
