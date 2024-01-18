import { useMeetingStore } from '../lib/meeting-store';
import { useActiveSpeaker } from '../lib/useActiveSpeaker';
import { DyteParticipantTile } from '@dytesdk/react-ui-kit';
import { useDyteMeeting } from '@dytesdk/react-web-core';
import { HTMLAttributes } from 'react';

export default function ActiveSpeaker(
  props: Omit<HTMLAttributes<HTMLDyteParticipantTileElement>, 'style'> & {
    isSmall?: true;
  }
) {
  const activeSpeaker = useActiveSpeaker();
  const { meeting } = useDyteMeeting();
  const [size, states] = useMeetingStore((s) => [s.size, s.states]);
  const isActiveMode = useMeetingStore((s) => s.isActiveSpeakerMode);

  if (!activeSpeaker || !isActiveMode) return null;

  return (
    <DyteParticipantTile
      participant={activeSpeaker}
      meeting={meeting}
      size={props.isSmall ? 'sm' : size}
      states={states}
      {...props}
    />
  );
}
