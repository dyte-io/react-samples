import { DyteParticipantsAudio, DyteSetupScreen } from '@dytesdk/react-ui-kit';
import { useDyteMeeting, useDyteSelector } from '@dytesdk/react-web-core';
import User from './User';
import Requests from './Requests';
import { useEffect, useState } from 'react';
import { Clipboard, Mic, MicOff, XSquare } from 'react-feather';
import { HandIcon } from './icons';
import clsx from 'clsx';

export default function Meeting() {
  const [showRequests, setShowRequests] = useState(true);

  const { meeting } = useDyteMeeting();
  const audioEnabled = useDyteSelector((m) => m.self.audioEnabled);
  const roomJoined = useDyteSelector((m) => m.self.roomJoined);

  const title = useDyteSelector((m) => m.meta.meetingTitle);

  const status = useDyteSelector((m) => m.self.webinarStageStatus);

  const onStageParticipants = useDyteSelector((m) =>
    m.participants.joined
      .toArray()
      .filter((p) => p.webinarStageStatus === 'ON_STAGE')
  );

  const listeners = useDyteSelector((m) =>
    m.participants.joined
      .toArray()
      .filter((p) => p.webinarStageStatus !== 'ON_STAGE')
  );

  const isSelfListener = meeting.self.webinarStageStatus !== 'ON_STAGE';

  useEffect(() => {
    if (status === 'ACCEPTED_TO_JOIN_STAGE') {
      meeting.self.joinStage();
    }
  }, [status]);

  if (!roomJoined && window.location.search.includes('showSetupScreen')) {
    return <DyteSetupScreen meeting={meeting} size="sm" />;
  }

  return (
    <div className="flex flex-col w-full h-full">
      <DyteParticipantsAudio meeting={meeting} />

      <div className="flex-1 flex flex-col">
        <h1 className="text-lg font-bold p-4">{title}</h1>

        <main className="flex flex-col gap-4 flex-1 overflow-y-auto p-4">
          <div className="flex flex-wrap gap-4">
            {onStageParticipants.map((participant) => (
              <User participant={participant} key={participant.id} />
            ))}
            {!isSelfListener && <User participant={meeting.self} />}
          </div>

          {(isSelfListener || listeners.length > 0) && (
            <div className="mt-4">
              <h3 className="text-xs text-gray-500 font-medium">Listeners</h3>

              <div className="flex flex-wrap gap-4 mt-4">
                {isSelfListener && (
                  <User participant={meeting.self} size="sm" />
                )}

                {listeners.map((participant) => (
                  <User
                    participant={participant}
                    key={participant.id}
                    size="sm"
                  />
                ))}
              </div>
            </div>
          )}
        </main>

        <div className="border-t w-full flex items-center justify-between p-4 text-xs">
          <div className="flex items-center gap-2">
            <button
              className="icon-btn text-red-500"
              onClick={() => meeting.leaveRoom()}
            >
              <XSquare />
              Leave
            </button>
          </div>

          <div className="flex items-center gap-2">
            {meeting.self.permissions.acceptPresentRequests && (
              <button
                className="icon-btn"
                onClick={() => setShowRequests((r) => !r)}
              >
                <Clipboard className="" />
              </button>
            )}

            {(status === 'OFF_STAGE' ||
              status === 'REQUESTED_TO_JOIN_STAGE') && (
              <button
                className="icon-btn"
                onClick={() => {
                  if (status === 'REQUESTED_TO_JOIN_STAGE') {
                    meeting.self.withdrawRequestToJoinStage();
                  } else {
                    meeting.self.requestToJoinStage();
                  }
                }}
              >
                <HandIcon
                  className={clsx(
                    status === 'REQUESTED_TO_JOIN_STAGE' && 'rotate-180'
                  )}
                />
                {status === 'REQUESTED_TO_JOIN_STAGE'
                  ? 'Lower hand'
                  : 'Raise hand'}
              </button>
            )}

            {status === 'ON_STAGE' && (
              <button
                className="icon-btn"
                onClick={() => {
                  if (meeting.self.audioEnabled) {
                    meeting.self.disableAudio();
                  } else {
                    meeting.self.enableAudio();
                  }
                }}
              >
                {audioEnabled ? <Mic /> : <MicOff />}
              </button>
            )}
          </div>
        </div>
      </div>

      {showRequests && <Requests />}
    </div>
  );
}
