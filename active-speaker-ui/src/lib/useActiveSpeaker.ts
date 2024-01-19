import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core';

export function useActiveSpeaker() {
  const { meeting } = useDyteMeeting();
  const isPinned = useDyteSelector((m) => m.self.isPinned);

  const lastActiveSpeaker = useDyteSelector(
    (m) => m.participants.lastActiveSpeaker
  );

  const pinnedParticipants = useDyteSelector((m) =>
    m.participants.pinned.toArray()
  );

  const activeParticipants = useDyteSelector((m) =>
    m.participants.active.toArray()
  );

  if (isPinned) {
    return meeting.self;
  }

  if (pinnedParticipants.length > 0) {
    return pinnedParticipants.at(0);
  }

  if (meeting.self.id === lastActiveSpeaker) {
    return meeting.self;
  }

  return (
    meeting.participants.joined.get(lastActiveSpeaker) ??
    activeParticipants.at(0) ??
    meeting.self
  );
}
