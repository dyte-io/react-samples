import {
  defaultIconPack,
  DyteClock,
  DyteDialogManager,
  DyteIcon,
  DyteLeaveButton,
  DyteMicToggle,
  DyteParticipantCount,
  DyteParticipantsAudio,
  DyteRecordingIndicator,
  DyteTooltip,
} from '@dytesdk/react-ui-kit';
import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core';
import { useEffect } from 'react';
import Stage from './Stage';

export default function Room() {
  const { meeting } = useDyteMeeting();
  const audioEnabled = useDyteSelector((meeting) => meeting.self.audioEnabled);

  useEffect(() => {
    function onKeyPress(e: KeyboardEvent) {
      if (e.ctrlKey && e.key.toLowerCase() === 'd') {
        if (meeting.self.audioEnabled) {
          meeting.self.disableAudio();
        } else {
          meeting.self.enableAudio();
        }
      }
    }

    window.addEventListener('keypress', onKeyPress);

    return () => {
      window.removeEventListener('keypress', onKeyPress);
    };
  }, []);

  return (
    <div className="h-full w-full flex flex-col">
      <header className="flex items-center justify-between px-6 h-16">
        <h1 className="text-xl flex items-center gap-2">
          <DyteIcon icon={defaultIconPack.mic_on} className="h-6" />
          <span>{meeting.meta.meetingTitle}</span>
        </h1>

        <div>
          <DyteParticipantCount meeting={meeting} />
          <DyteClock meeting={meeting} />
          <DyteRecordingIndicator meeting={meeting} />
        </div>
      </header>

      <Stage />

      <footer className="flex items-center px-6 py-4 justify-center gap-1">
        <DyteLeaveButton>
          <DyteIcon icon={defaultIconPack.call_end} className="h-7 w-7" />
        </DyteLeaveButton>

        <DyteTooltip label="Ctrl+D to toggle mic">
          <DyteMicToggle meeting={meeting}>
            <DyteIcon
              icon={
                audioEnabled ? defaultIconPack.mic_on : defaultIconPack.mic_off
              }
              className="h-7 w-7"
            />
          </DyteMicToggle>
        </DyteTooltip>
      </footer>

      <DyteDialogManager meeting={meeting} />
      <DyteParticipantsAudio meeting={meeting} />
    </div>
  );
}
