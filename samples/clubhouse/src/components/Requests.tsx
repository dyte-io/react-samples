import { useRealtimeKitMeeting, useRealtimeKitSelector } from '@cloudflare/realtimekit-react';
import { Check, X } from 'react-feather';

export default function Requests() {
  const { meeting } = useRealtimeKitMeeting();

  const participants = useRealtimeKitSelector((m) => m.participants.joined).toArray();

  const requestedParticipants = participants.filter(
    (p) => p.webinarStageStatus === 'REQUESTED_TO_JOIN_STAGE'
  );

  if (!meeting.self.permissions.acceptPresentRequests) {
    return null;
  }

  return (
    <div className="w-full min-h-[20vh] max-h-[50vh] p-4 bg-gray-200">
      <h2 className="text-lg font-semibold">Requests</h2>

      {requestedParticipants.length === 0 && (
        <p className="text-xs text-gray-600">There are no requests.</p>
      )}

      <div className="flex flex-col gap-2 mt-3">
        {requestedParticipants.map((p) => (
          <div className="flex items-center justify-between text-sm" key={p.id}>
            <div>{p.name}</div>
            <div className="flex gap-2">
              <button
                className="icon-btn text-red-600"
                onClick={() => p.rejectRequestToJoinStage()}
              >
                <X />
              </button>
              <button
                className="icon-btn text-green-700"
                onClick={() => p.acceptJoinStageRequest()}
              >
                <Check />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
