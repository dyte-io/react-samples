/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { DyteProvider, useDyteClient } from '@dytesdk/react-web-core';
import { LoadingScreen } from './pages';
import { Meeting, SetupScreen } from './pages';

function App() {
  const [meeting, initMeeting] = useDyteClient();
  const [roomJoined, setRoomJoined] = useState<boolean>(false);

  useEffect(() => {
    const searchParams = new URL(window.location.href).searchParams;
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
    });
  }, []);

  useEffect(() => {
    if (!meeting) return;

    const roomJoinedListener = () => {
      setRoomJoined(true);
    };
    const roomLeftListener = () => {
      setRoomJoined(false);
    };
    meeting.self.on('roomJoined', roomJoinedListener);
    meeting.self.on('roomLeft', roomLeftListener);

    return () => {
      meeting.self.removeListener('roomJoined', roomJoinedListener);
      meeting.self.removeListener('roomLeft', roomLeftListener);
    }

  }, [meeting])

  return (
    <DyteProvider value={meeting} fallback={<LoadingScreen />}>
      {
        !roomJoined ? <SetupScreen /> : <Meeting />
      }
    </DyteProvider>
  )
}

export default App
// TODO: work on the blog
