import { useMeetingStore } from '../lib/meeting-store';
import {
  DyteGrid,
  DyteSimpleGrid,
  DyteSpotlightGrid,
} from '@dytesdk/react-ui-kit';
import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core';

export default function Grid() {
  const { meeting } = useDyteMeeting();

  const size = useMeetingStore((s) => s.size);
  const stageStatus = useDyteSelector((m) => m.stage.status);
  const isPinned = useDyteSelector((m) => m.self.isPinned);

  const activeParticipants = useDyteSelector((m) =>
    m.participants.active.toArray()
  );

  const participants =
    stageStatus === 'ON_STAGE' && !isPinned
      ? [...activeParticipants, meeting.self]
      : activeParticipants;

  const pinned = useDyteSelector((m) => m.participants.pinned.toArray());

  const pinnedParticipants =
    isPinned && stageStatus === 'ON_STAGE' ? [...pinned, meeting.self] : pinned;

  if (pinnedParticipants.length > 0) {
    return (
      <DyteSpotlightGrid
        participants={participants}
        pinnedParticipants={pinnedParticipants}
        meeting={meeting}
        size={size}
      />
    );
  }

  return (
    <DyteSimpleGrid participants={participants} meeting={meeting} size={size} />
  );
}
