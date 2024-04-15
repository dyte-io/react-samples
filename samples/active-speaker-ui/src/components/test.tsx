import { useCallback, useEffect, useState } from 'react';
import {
  DyteProvider,
  useDyteClient,
  useDyteMeeting,
} from '@dytesdk/react-web-core';
import {
  DyteCameraToggle,
  DyteDialogManager,
  DyteGrid,
  DyteLeaveButton,
  DyteMicToggle,
  DyteChat,
  DytePlugins,
} from '@dytesdk/react-ui-kit';
import './App.css';

function BreakoutApp() {
  const [meeting, initMeeting] = useDyteClient();
  const [showChat, setShowChat] = useState(false);
  const url = new URL(window.location.href);
  const queryToken = url.searchParams.get('authToken');

  if (!queryToken) {
    alert('Please add authToken to url query params');
  }

  const handleDyteState = useCallback(() => {
    setShowChat(!showChat);
  }, [showChat]);

  useEffect(() => {
    const init = async () => {
      if (!queryToken) return;

      await initMeeting({
        authToken: queryToken,
        defaults: {
          video: false,
          audio: false,
        },
      }).then(async (meet) => {
        if (!meet) return;
        Object.assign(window, { meeting: meet });
        meet.connectedMeetings.addListener('meetingChanged', (newMeet) => {
          Object.assign(window, { meeting: newMeet });
        });

        await meet.join();
      });
    };
    init();
  }, []);

  if (!meeting) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '50vw' }}>
        <h2>Room: {meeting.meta.meetingTitle}</h2>
        <h2>Participant: {meeting.self.name}</h2>
        <DyteDialogManager meeting={meeting} />

        <DyteProvider value={meeting}>
          <ParticipantWrapper />
        </DyteProvider>
        <div
          style={{
            display: 'flex',
            gap: '4px',
            margin: '4px',
            flexWrap: 'wrap',
          }}
        >
          <DyteCameraToggle meeting={meeting} />
          <DyteMicToggle meeting={meeting} />

          <button onClick={handleDyteState}>Chat</button>
          <DyteLeaveButton />
        </div>
      </div>
      <div
        style={{
          height: '600px',
          width: '20vw',
          background: 'black',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <DytePlugins meeting={meeting} />
      </div>
      {showChat && (
        <div
          style={{
            height: '600px',
            width: '20vw',
            background: 'black',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {meeting.self.presetName.includes('group_call_host') ? (
            <DyteChat meeting={meeting} />
          ) : (
            <DyteChat
              meeting={meeting}
              privatePresetFilter={['group_call_host']}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default BreakoutApp;

function ParticipantWrapper() {
  const { meeting } = useDyteMeeting();

  if (!meeting) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: '4px',
        margin: '8px',
        flexWrap: 'wrap',
        height: '400px',
      }}
    >
      <DyteGrid meeting={meeting} />
    </div>
  );
}
