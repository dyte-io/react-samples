import { useMeetingStore } from '../lib/meeting-store';
import {
  DyteAudioVisualizer,
  DyteButton,
  DyteIcon,
  DyteNameTag,
  DyteScreenshareView,
} from '@dytesdk/react-ui-kit';
import { useDyteMeeting } from '@dytesdk/react-web-core';
import type { DyteParticipant, DyteSelf } from '@dytesdk/web-core';
import { iconPack } from '../lib/const';

export default function ScreenShareView({
  participant,
}: {
  participant: DyteSelf | DyteParticipant;
}) {
  const { meeting } = useDyteMeeting();
  const [states, setStates] = useMeetingStore((s) => [s.states, s.setStates]);

  const onMaximise = async () => {
    setStates({ activeSidebar: false, sidebar: undefined });
  };

  const isSelf = meeting.self.id === participant.id;

  return (
    <DyteScreenshareView
      meeting={meeting}
      participant={participant}
      className="flex-1 relative"
      // hidden default full screen button
      hideFullScreenButton
    >
      <DyteNameTag participant={participant} meeting={meeting} isScreenShare>
        <DyteAudioVisualizer
          participant={participant}
          isScreenShare
          slot="start"
        />
      </DyteNameTag>

      {/* custom full screen button that doesn't hide */}
      {states.activeSidebar && !isSelf && (
        <DyteButton
          variant="secondary"
          kind="icon"
          onClick={onMaximise}
          className="absolute bottom-3 right-3"
        >
          <DyteIcon icon={iconPack.full_screen_maximize} />
        </DyteButton>
      )}
    </DyteScreenshareView>
  );
}
