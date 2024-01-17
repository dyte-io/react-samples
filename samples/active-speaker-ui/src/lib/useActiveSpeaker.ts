import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core';

export function useActiveSpeaker() {
  const { meeting } = useDyteMeeting();

  const lastActiveSpeaker = useDyteSelector(
    (m) => m.participants.lastActiveSpeaker
  );

  const pinnedParticipants = useDyteSelector((m) =>
    m.participants.pinned.toArray()
  );

  const activeParticipants = useDyteSelector((m) =>
    m.participants.active.toArray()
  );

  const activeSpeaker =
    pinnedParticipants.at(0) ??
    meeting.participants.joined.get(lastActiveSpeaker) ??
    activeParticipants.at(0);

  return activeSpeaker;
}
