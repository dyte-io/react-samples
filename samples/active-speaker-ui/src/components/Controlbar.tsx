import { useMeetingStore } from '../lib/meeting-store';
import {
  DyteSettingsToggle,
  DyteScreenShareToggle,
  DyteStageToggle,
  DyteMicToggle,
  DyteCameraToggle,
  DyteParticipantsToggle,
  DytePollsToggle,
  DyteChatToggle,
  DytePluginsToggle,
  DyteControlbarButton,
} from '@dytesdk/react-ui-kit';
import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core';
import HOST_PRESET, { iconPack, saveWhiteboard, WHITEBOARD_ID } from '../lib/const';

export default function Controlbar() {
  const { meeting } = useDyteMeeting();
  const size = useMeetingStore((s) => s.size);
  const isMobile = useMeetingStore((s) => s.isMobile);
  const states = useMeetingStore((s) => s.states);
  const isDarkMode = useMeetingStore((s) => s.darkMode);
  const toggleDarkMode = useMeetingStore((s) => s.toggleDarkMode);
  const setStates = useMeetingStore((s) => s.setStates);
  const whiteboardPlugin = useDyteSelector(m => m.plugins.active.get(WHITEBOARD_ID)) 

  const buttonSize = size === 'lg' ? 'lg' : 'sm';

  const isHost = meeting.self.presetName === HOST_PRESET;

  const leaveMeeting = async () => {
    if (whiteboardPlugin?.active) {
      await saveWhiteboard(whiteboardPlugin);
    }
    setStates({
      activeLeaveConfirmation: true,
    })
  }

  const LeaveButton = () => {
    return (
      <DyteControlbarButton icon={iconPack.call_end} size={buttonSize} label='Leave' onClick={leaveMeeting}/>
    )
  }


  if (isMobile) {
    return (
      <>
        <div className="flex flex-col lg:flex-row items-center">
          {isHost && (
            <>
              <DyteParticipantsToggle
                meeting={meeting}
                size={buttonSize}
                states={states}
              />
              <DytePluginsToggle
                meeting={meeting}
                size={buttonSize}
                states={states}
              />
            </>
          )}
          <DyteChatToggle meeting={meeting} size={buttonSize} states={states} />
          <DytePollsToggle
            meeting={meeting}
            size={buttonSize}
            states={states}
          />
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center">
          <DyteMicToggle meeting={meeting} size={buttonSize} />
          <DyteCameraToggle meeting={meeting} size={buttonSize} />
          <DyteScreenShareToggle
            meeting={meeting}
            size={buttonSize}
            states={states}
          />
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-end">
          <DyteStageToggle
            meeting={meeting}
            size={buttonSize}
            iconPack={iconPack}
          />
          <LeaveButton/>
          <DyteSettingsToggle size={buttonSize} states={states} />
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row items-center">
        <DyteSettingsToggle size={buttonSize} states={states} />
        <DyteScreenShareToggle
          meeting={meeting}
          size={buttonSize}
          states={states}
        />
        {
          isHost 
          && <DyteControlbarButton
              icon={isDarkMode ? iconPack.dark : iconPack.light}
              label= {isDarkMode ? 'Dark' : 'Light'}
              onClick={() => {
                toggleDarkMode(!isDarkMode);
              }}
            />
        }
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-center">
        <DyteStageToggle
          meeting={meeting}
          size={buttonSize}
          iconPack={iconPack}
        />
        <DyteMicToggle meeting={meeting} size={buttonSize} />
        <DyteCameraToggle meeting={meeting} size={buttonSize} />
        <LeaveButton />
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-end">
        {isHost && (
          <>
            <DyteParticipantsToggle
              meeting={meeting}
              size={buttonSize}
              states={states}
            />
            <DytePluginsToggle
              meeting={meeting}
              size={buttonSize}
              states={states}
            />
          </>
        )}
        <DyteChatToggle meeting={meeting} size={buttonSize} states={states} />
        <DytePollsToggle meeting={meeting} size={buttonSize} states={states} />
      </div>
    </>
  );
}
