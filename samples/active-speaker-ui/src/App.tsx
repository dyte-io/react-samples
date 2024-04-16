import Meeting from './components/Meeting';
import { DyteSpinner } from '@dytesdk/react-ui-kit';
import { DyteProvider, useDyteClient } from '@dytesdk/react-web-core';
import { useEffect } from 'react';
import { useMeetingStore } from './lib/meeting-store';

function App() {
  const [meeting, initMeeting] = useDyteClient();

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);

    const authToken = searchParams.get('authToken');

    if (!authToken) {
      alert(
        "An authToken wasn't passed, please pass an authToken in the URL query to join a meeting."
      );
      return;
    }

    initMeeting({
      authToken,
      defaults: {
        audio: false,
        video: false,
      },
    }).then((meeting) => {
      Object.assign(window, { meeting });
    });
  }, []);

  useEffect(() => {
    if(!meeting || meeting.self.presetName !== "webinar_presenter") return () => {}
    const onParticipantJoin = ({ id }: { id: string }) => {
      // If host has disabled chat
      if(useMeetingStore.getState().chatEnabled === false){
        // Disable chat for the newly joined participant
        meeting.participants.updatePermissions([id], { chat: { public: { text: false, files: false }}})
      }
    }
    meeting.participants.joined.on('participantJoined', onParticipantJoin);
    return () => {
      meeting.participants.joined.removeListener('participantJoined', onParticipantJoin);
    }
  }, [meeting]);

  // By default this component will cover the entire viewport.
  // To avoid that and to make it fill a parent container, pass the prop:
  // `mode="fill"` to the component.
  return (
    <DyteProvider
      value={meeting}
      fallback={
        <div className="size-full flex flex-col gap-3 place-items-center justify-center">
          <DyteSpinner className="w-12 h-12 text-blue-600" />
          <p className="text-lg">Joining...</p>
        </div>
      }
    >
      <Meeting />
    </DyteProvider>
  );
}

export default App;
